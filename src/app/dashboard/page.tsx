import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { ShieldCheck, User, Calendar, Key } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Fallback protection if middleware was bypassed
  if (!session) {
    redirect("/auth?mode=login");
  }

  const u = session.user as { name?: string | null; email?: string | null; emailVerified?: string | Date | null };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between">
      {/* Top Navbar */}
      <nav className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold">
              S
            </span>
            <span className="text-lg font-bold tracking-tight">SecureGate</span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-success/15 text-success border border-success/20 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-2.5 w-2.5" />
              Verified
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs text-ink-muted hidden sm:inline">
              Signed in as <span className="font-semibold text-ink">{u.email}</span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-1">
        <div className="space-y-4 mb-40">
          <h1 className="text-3xl font-bold tracking-tight">Secure Console</h1>
          <p className="text-sm text-ink-muted">
            Manage your credentials, sessions, and active security keys.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* User Profile Info Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm md:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
              <User className="h-4 w-4 text-brand" />
              Account Information
            </h2>
            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-ink-muted">Full Name</span>
                <span className="font-medium">{u.name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-ink-muted">Email Address</span>
                <span className="font-medium">{u.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-ink-muted">Verification Date</span>
                <span className="font-medium text-success">
                  {u.emailVerified ? new Date(u.emailVerified).toLocaleDateString() : "Just now"}
                </span>
              </div>
            </div>
          </div>

          {/* Security Status Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Key className="h-4 w-4 text-brand" />
                Security Status
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-success font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Session Active & Secure</span>
                </div>
                <p className="text-ink-muted leading-relaxed">
                  Your session is authenticated via NextAuth JWT and validated against the database.
                </p>
              </div>
            </div>
            
            <div className="text-[10px] text-ink-subtle pt-4 border-t border-border flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Session expires in 24 hours</span>
            </div>
          </div>
        </div>

        {/* Integration Details / Info Panel */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-semibold">Integrations</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            SecureGate handles identity token distribution via Postgres-backed cryptographic verify models.
            To integrate your API, configure your clients to accept signed JSON Web Tokens (JWT) dispatched by this platform.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-ink-subtle border-t border-border px-6 py-6 mt-12">
        <span>© 2026 SecureGate authentication systems.</span>
        <span>Secure connection established</span>
      </footer>
    </div>
  );
}
