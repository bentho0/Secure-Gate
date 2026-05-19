import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-bg">
      <div className="absolute top-0 left-0 p-6 sm:p-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold">S</span>
          <span className="text-xl font-bold tracking-tight text-ink">SecureGate</span>
        </Link>
      </div>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
