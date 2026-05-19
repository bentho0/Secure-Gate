"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { resetPassword } from "@/actions/reset-password";
import { PasswordStrength } from "@/components/auth/password-strength";
import { KeyRound, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

interface ResetPasswordProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordPage({ params }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      // Validate schema client-side first
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        setError("Password is not strong enough. Ensure it meets all strength criteria below.");
        return;
      }

      const response = await resetPassword({ password, confirmPassword }, params.token);
      if (response.error) {
        setError(response.error);
      } else if (response.success) {
        setSuccess(response.success);
        setPassword("");
        setConfirmPassword("");
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
          <h2 className="text-2xl font-bold text-ink">Reset password</h2>
          <p className="text-sm text-ink-muted">
            Create a new password that contains numbers, letters, and special characters.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-success/10 border border-success/20 text-success text-sm rounded-xl font-medium space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success shrink-0" />
              <span>{success}</span>
            </div>
            <Link
              href="/auth?mode=login"
              className="w-full block text-center py-2 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-brand hover:bg-brand-hover focus:outline-none transition duration-200"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {!success && (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-subtle">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  disabled={isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-bg border border-border rounded-xl text-sm text-ink placeholder-ink-subtle focus:outline-none focus:border-brand disabled:opacity-50 transition duration-200"
                />
              </div>
              <PasswordStrength password={password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-subtle">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  disabled={isPending}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
                  Updating password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}

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
