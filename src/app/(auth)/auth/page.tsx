"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "signup";

  return (
    <div className="w-full max-w-md bg-surface px-16 py-8 rounded-2xl border border-border shadow-sm">
      {mode === "login" && (
        <>
          <div className="text-center mb-20">
            <h2 className="text-2xl font-bold text-ink">Sign In</h2>
            <p className="text-sm text-ink-muted mt-4">Sign in to access your secure dashboard.</p>
          </div>
          <LoginForm />
        </>
      )}
      {mode === "signup" && (
        <>
          <div className="text-center mb-20">
            <h2 className="text-2xl font-bold text-ink">Create Account</h2>
            <p className="text-sm text-ink-muted mt-4">Register to access your secure developer workspace.</p>
          </div>
          <SignupForm />
        </>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand mb-4" />
        <p className="text-sm text-ink-muted">Loading SecureGate portal...</p>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
