import React from "react";
import Link from "next/link";
import { verifyEmailToken } from "@/actions/verify";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface VerifyEmailProps {
  params: {
    token: string;
  };
}

export default async function VerifyEmailPage({ params }: VerifyEmailProps) {
  const result = await verifyEmailToken(params.token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-2xl border border-border shadow-sm text-center">
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold">S</span>
            <span className="text-xl font-bold tracking-tight text-ink">SecureGate</span>
          </div>
        </div>

        {result.success ? (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-ink">Verification Successful</h2>
            <p className="text-sm text-ink-muted">
              {result.success}
            </p>
            <div className="pt-4">
              <Link
                href="/auth?mode=login"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition duration-200"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-ink">Verification Failed</h2>
            <p className="text-sm text-danger font-medium">
              {result.error}
            </p>
            <p className="text-xs text-ink-muted">
              The link might be expired, invalid, or already used. If you need a new link, please request one using the link below.
            </p>
            <div className="pt-4">
              <Link
                href="/verify-email"
                className="w-full flex justify-center py-2.5 px-4 border border-border rounded-xl text-sm font-semibold text-ink bg-bg hover:bg-surface focus:outline-none transition duration-200"
              >
                Request New Link
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
