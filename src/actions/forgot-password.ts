"use server";

import { z } from "zod";
import crypto from "crypto";
import { db } from "@/lib/db";
import { ForgotPasswordSchema } from "@/schemas/auth";
import { sendPasswordResetEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/ip";

export async function forgotPassword(values: z.infer<typeof ForgotPasswordSchema>): Promise<{ success?: string; error?: string }> {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email address." };
  }

  const { email } = validatedFields.data;

  try {
    // Resolve client IP
    const ip = await getClientIp();

    // Check rate limit
    const limitResult = await rateLimit(ip, "forgot-password");
    if (!limitResult.success) {
      return { error: "Too many attempts. Please try again in 10 minutes." };
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    // Security: Always return success even if user does not exist
    const successResponse = {
      success: "If an account exists with that email, a password reset link has been sent.",
    };

    if (!user) {
      return successResponse;
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour TTL

    // Clear old reset tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { email },
    });

    // Save token
    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Send email
    const emailResult = await sendPasswordResetEmail(email, token);

    if (!emailResult.success) {
      console.error("[FORGOT_PASSWORD] Failed to send email, but returning success to prevent enumeration.");
    }

    return successResponse;
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR] Details:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
