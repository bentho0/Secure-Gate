"use server";

import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/ip";

const EmailSchema = z.string().email();

export async function resendVerificationEmail(email: string): Promise<{ success?: string; error?: string }> {
  const validatedEmail = EmailSchema.safeParse(email);
  if (!validatedEmail.success) {
    return { error: "Invalid email address." };
  }

  try {
    // 1. Check rate limit
    const ip = await getClientIp();
    const limitResult = await rateLimit(ip, "resend-verification");
    if (!limitResult.success) {
      return { error: "Too many attempts. Please try again in 10 minutes." };
    }

    // 2. Find user
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      // Security: Do not reveal if the email is not registered
      return { success: "If the account exists, a new verification link has been sent." };
    }

    if (existingUser.emailVerified) {
      // Security: Return generic message to prevent revealing verification status
      return { success: "If the account exists, a new verification link has been sent." };
    }

    // 2. Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes TTL

    // 3. Clear existing tokens
    await db.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // 4. Save new token
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // 5. Send email
    await sendVerificationEmail(email, token);

    return { success: "If the account exists, a new verification link has been sent." };
  } catch (error) {
    console.error("[RESEND_VERIFICATION_ERROR] Details:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
