"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ResetPasswordSchema } from "@/schemas/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/ip";

export async function resetPassword(
  values: z.infer<typeof ResetPasswordSchema>,
  token: string | null
): Promise<{ success?: string; error?: string }> {
  if (!token) {
    return { error: "Missing password reset token." };
  }

  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid password fields." };
  }

  const { password } = validatedFields.data;

  try {
    // 1. Check rate limit
    const ip = await getClientIp();
    const limitResult = await rateLimit(ip, "reset-password");
    if (!limitResult.success) {
      return { error: "Too many attempts. Please try again in 10 minutes." };
    }

    // 2. Find the reset token
    const existingToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Invalid or expired password reset token." };
    }

    // 2. Check token expiration (1 hour limit)
    const hasExpired = new Date() > new Date(existingToken.expires);

    if (hasExpired) {
      // Clean up the expired token
      await db.passwordResetToken.delete({
        where: { token },
      });
      return { error: "Reset token has expired. Please request a new one." };
    }

    // 3. Find the user
    const existingUser = await db.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return { error: "User associated with this token no longer exists." };
    }

    // 4. Hash the new password (12 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 14);

    // 5. Update user password in transaction or database update
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
      },
    });

    // 6. Delete reset token to prevent reuse
    await db.passwordResetToken.delete({
      where: { token },
    });

    return { success: "Password reset successful! You can now log in with your new password." };
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR] Details:", error);
    return { error: "An unexpected error occurred while resetting your password." };
  }
}
