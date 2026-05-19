"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resendVerificationEmail } from "@/actions/resend-verification";
import { Mail, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

function VerifyEmailRequestForm() {
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(queryEmail);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email address is required.");
      return;
    }

    startTransition(async () => {
      const response = await resendVerificationEmail(email);
      if (response.error) {
        setError(response.error);
      } else if (response.success) {
        setSuccess(response.success);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-2xl border border-border shadow-sm">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold">S</span>
              <span className="text-xl font-bold tracking-tight text-ink">SecureGate</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-ink">Verify your email</h2>
          <p className="text-sm text-ink-muted">
            Please check your inbox for a verification link, or request a new one below.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-success/10 border border-success/20 text-success text-sm rounded-xl font-medium flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-subtle">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                disabled={isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-bg border border-border rounded-xl text-sm text-ink placeholder-ink-subtle focus:outline-none focus:border-brand disabled:opacity-50 transition duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover focus:outline-none disabled:opacity-50 transition duration-200"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send Verification Link"
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/auth?mode=login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailRequestPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
        <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand mb-4" />
          <p className="text-sm text-ink-muted">Loading verification services...</p>
        </div>
      </div>
    }>
      <VerifyEmailRequestForm />
    </Suspense>
  );
}
