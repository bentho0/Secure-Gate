"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, KeyRound, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const queryError = searchParams.get("error");

  let errorMessage = error;
  if (!errorMessage && queryError) {
    if (queryError === "RateLimitExceeded") {
      errorMessage = "Too many login attempts. Please try again in 10 minutes.";
    } else if (queryError === "CredentialsSignin") {
      errorMessage = "Invalid email or password.";
    } else {
      errorMessage = "Invalid credentials.";
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (response?.error) {
          if (response.error.includes("RateLimitExceeded")) {
            setError("Too many attempts. Please try again in 10 minutes.");
          } else {
            setError("Invalid email or password.");
          }
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <>
      {errorMessage && (
        <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl font-medium mb-4">
          {errorMessage}
        </div>
      )}

      <form className="" onSubmit={onSubmit}>
        <div className="mb-20">
          <label htmlFor="email" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-subtle">
              <Mail className="h-5 w-5" />
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

        <div className="mb-24">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-brand hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-subtle">
              <KeyRound className="h-5 w-5" />
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
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover focus:outline-none disabled:opacity-50 transition duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="text-center pt-6 border-t border-border mt-6">
        <p className="text-xs text-ink-muted">
          Don&apos;t have an account?{" "}
          <Link href="/auth?mode=signup" className="font-semibold text-brand hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </>
  );
}
