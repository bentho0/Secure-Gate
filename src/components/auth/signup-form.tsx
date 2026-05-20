"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUser } from "@/actions/register";
import { PasswordStrength } from "@/components/auth/password-strength";
import { User, Mail, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        setError("Password is not strong enough. Ensure it meets all strength criteria below.");
        return;
      }

      try {
        const response = await registerUser({ name, email, password });

        if (response.error) {
          setError(response.error);
        } else if (response.success) {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <>
      {error && (
        <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl font-medium mb-4">
          {error}
        </div>
      )}

      <form className="" onSubmit={onSubmit}>
          <div className="mb-20">
            <label htmlFor="name" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-subtle">
                <User className="h-5 w-5" />
              </span>
              <input
                id="name"
                type="text"
                required
                autoFocus
                disabled={isPending}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setNameTouched(true)}
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2.5 bg-bg border border-border rounded-xl text-sm text-ink placeholder-ink-subtle focus:outline-none focus:border-brand disabled:opacity-50 transition duration-200"
              />
            </div>
            {nameTouched && !name && (
              <p className="text-xs text-danger mt-1.5">This field cannot be empty</p>
            )}
          </div>

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
                onBlur={() => setEmailTouched(true)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-bg border border-border rounded-xl text-sm text-ink placeholder-ink-subtle focus:outline-none focus:border-brand disabled:opacity-50 transition duration-200"
              />
            </div>
            {emailTouched && !email && (
              <p className="text-xs text-danger mt-1.5">This field cannot be empty</p>
            )}
            {email.length > 0 && !(email.includes("@") && email.includes(".", email.indexOf("@"))) && (
              <p className="text-xs text-danger mt-1.5">Enter a valid email address</p>
            )}
          </div>

          <div className="mb-24">
            <label htmlFor="password" className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-subtle">
                <KeyRound className="h-5 w-5" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-bg border border-border rounded-xl text-sm text-ink placeholder-ink-subtle focus:outline-none focus:border-brand disabled:opacity-50 transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPending}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-subtle hover:text-ink transition-colors disabled:opacity-50"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordTouched && !password && (
              <p className="text-xs text-danger mt-1.5">This field cannot be empty</p>
            )}
            {password.length > 0 && <PasswordStrength password={password} />}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover focus:outline-none disabled:opacity-50 transition duration-200"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

      <div className="text-center pt-6 border-t border-border mt-6">
        <p className="text-xs text-ink-muted">
          Already have an account?{" "}
          <Link href="/auth?mode=login" className="font-semibold text-brand hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
