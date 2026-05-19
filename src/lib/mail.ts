import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify-email/${token}`;
  
  if (!resend) {
    console.log(`[MAILER] [MOCK] No RESEND_API_KEY configured. Mocked email sent successfully.`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: "SecureGate <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px; background-color: #F7F7F5;">
          <h2 style="color: #0F1115; margin-bottom: 16px;">Verify your SecureGate Account</h2>
          <p style="color: #5A6270; font-size: 16px; line-height: 24px;">Thank you for registering. Please click the button below to verify your email address. This link will expire in 15 minutes.</p>
          <div style="margin: 24px 0;">
            <a href="${confirmLink}" style="background-color: #1A7F3C; color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #9AA1AD; font-size: 12px;">If you did not request this registration, you can safely ignore this email.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error(`[MAILER] Error sending verification email:`, error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password/${token}`;

  if (!resend) {
    console.log(`[MAILER] [MOCK] No RESEND_API_KEY configured. Mocked email sent successfully.`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: "SecureGate <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px; background-color: #F7F7F5;">
          <h2 style="color: #0F1115; margin-bottom: 16px;">Reset your SecureGate Password</h2>
          <p style="color: #5A6270; font-size: 16px; line-height: 24px;">You requested a password reset. Please click the button below to create a new password. This link will expire in 1 hour.</p>
          <div style="margin: 24px 0;">
            <a href="${resetLink}" style="background-color: #1A7F3C; color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #9AA1AD; font-size: 12px;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error(`[MAILER] Error sending password reset email:`, error);
    return { success: false, error };
  }
}
