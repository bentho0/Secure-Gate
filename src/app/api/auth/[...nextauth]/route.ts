import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("[BUILD DEBUG] DATABASE_URL is defined:", !!process.env.DATABASE_URL);
console.log("[BUILD DEBUG] NEXTAUTH_SECRET is defined:", !!process.env.NEXTAUTH_SECRET);
console.log("[BUILD DEBUG] NEXTAUTH_URL is defined:", !!process.env.NEXTAUTH_URL);

export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

