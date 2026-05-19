"use server";

import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/ip";

export async function verifyEmailToken(token: string): Promise<{ success?: string; error?: string }> {
  if (!token) {
    return { error: "Missing token." };
  }

  try {
    // 1. Check rate limit
    const ip = await getClientIp();
    const limitResult = await rateLimit(ip, "verify-email");
    if (!limitResult.success) {
      return { error: "Too many attempts. Please try again in 10 minutes." };
    }

    // 2. Find the token in the database
    const existingToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Verification token does not exist or has expired." };
    }

    // 2. Check token expiration (15 minutes limit)
    const hasExpired = new Date() > new Date(existingToken.expires);

    if (hasExpired) {
      // Clean up the expired token
      await db.verificationToken.delete({
        where: { token },
      });
      return { error: "Verification token has expired. Please request a new one." };
    }

    // 3. Find the user
    const existingUser = await db.user.findUnique({
      where: { email: existingToken.identifier },
    });

    if (!existingUser) {
      return { error: "User associated with this token does not exist." };
    }

    // 4. Mark user verified and update database
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
      },
    });

    // 5. Delete token so it cannot be used again
    await db.verificationToken.delete({
      where: { token },
    });

    return { success: "Email verified successfully! You can now log in." };
  } catch (error) {
    console.error("[EMAIL_VERIFICATION_ERROR] Details:", error);
    return { error: "An unexpected error occurred during email verification." };
  }
}
