import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIpFromHeaders } from "@/lib/ip";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth?mode=login",
    error: "/auth?mode=login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Resolve client IP safely
        const ip = getClientIpFromHeaders(req?.headers || {});

        // 1. Check Rate Limiting
        const limitResult = await rateLimit(ip, "login");
        if (!limitResult.success) {
          throw new Error("RateLimitExceeded");
        }

        // 2. Validate input fields
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        // 3. Lookup user
        const user = await db.user.findUnique({
          where: { email },
        });

        // Safe failure: do not reveal if the user exists
        if (!user || !user.password) {
          return null;
        }

        // 4. Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return null;
        }

        // 5. Reject unverified users with same generic error (prevents user enumeration)
        if (!user.emailVerified) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as { id: string; emailVerified: Date | null };
        token.id = u.id;
        token.emailVerified = u.emailVerified;
      }
      
      if (trigger === "update" && session) {
        token.emailVerified = session.emailVerified;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const s = session.user as { id: string; emailVerified: Date | null; name?: string | null; email?: string | null; image?: string | null };
        s.id = token.id as string;
        s.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || (process.env.NEXT_PHASE === "phase-production-build" ? "build-placeholder-secret" : undefined),
};
