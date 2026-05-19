"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { SignUpSchema } from "@/schemas/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/ip";

export async function registerUser(values: z.infer<typeof SignUpSchema>): Promise<{ success?: string; error?: string }> {
  // 1. Validate fields on the server
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 2. Check rate limit
    const ip = await getClientIp();
    const limitResult = await rateLimit(ip, "register");
    if (!limitResult.success) {
      return { error: "Too many attempts. Please try again in 10 minutes." };
    }

    // 3. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Security: Return generic success to prevent user enumeration.
      // A generic message avoids revealing whether the email is registered.
      // The user will be redirected to the verify-email page regardless.
      return { success: "If you are a new user, please check your email for a verification link." };
    }

    // 3. Hash the password with salt rounds = 12
    const hashedPassword = await bcrypt.hash(password, 14);

    // 4. Save the user (initially unverified)
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 5. Generate secure verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes TTL

    // Clean up existing tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Save token
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // 6. Send the verification email
    const emailResult = await sendVerificationEmail(email, token);

    if (!emailResult.success) {
      return { error: "Failed to send verification email. Please try again." };
    }

    return { success: "Registration successful! Please verify your email." };
  } catch (error) {
    console.error("[REGISTER_ERROR] Details:", error);
    // Never expose stack traces or internal DB errors to client
    return { error: "An unexpected error occurred during registration." };
  }
}
