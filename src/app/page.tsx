import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-between h-screen w-full bg-bg px-6 py-8 md:px-12 text-ink">
      {/* Header / Brand */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold">
            S
          </span>
          <span className="text-lg font-bold tracking-tight">SecureGate</span>
        </div>
        <Link
          href="/auth?mode=login"
          className="text-sm font-medium text-ink-muted hover:text-ink transition-colors duration-200"
        >
          Sign In
        </Link>
      </header>

      {/* Main Hero Content */}
      <main className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full text-xs font-semibold text-brand">
          <Shield className="h-3.5 w-3.5" />
          <span>Production-grade Security Infrastructure</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          Secure identity & access management.
        </h1>

        <p className="text-base text-ink-muted max-w-lg leading-relaxed">
          A standalone authentication platform built defensively using Next.js 14,
          TypeScript, PostgreSQL, and token-based email verification.
        </p>

        <div className="pt-4">
          <Link
            href="/auth?mode=signup"
            className="inline-flex items-center justify-center bg-brand hover:bg-brand-hover text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-ink-subtle border-t border-border pt-4">
        <span>© 2026 SecureGate. All rights reserved.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <span>PostgreSQL</span>
          <span>•</span>
          <span>NextAuth.js</span>
          <span>•</span>
          <span>Rate Limited</span>
        </div>
      </footer>
    </div>
  );
}
