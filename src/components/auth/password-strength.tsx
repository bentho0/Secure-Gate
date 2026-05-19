"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  // Define password strength criteria
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // Compute how many criteria are met
  const criteriaCount = [
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  let strength: "weak" | "fair" | "strong" = "weak";
  let label = "Weak";

  if (password.length > 0) {
    if (hasMinLength && criteriaCount === 4) {
      strength = "strong";
      label = "Strong";
    } else if (password.length >= 6 && criteriaCount >= 2) {
      strength = "fair";
      label = "Fair";
    }
  }

  const getBarColor = (index: number) => {
    if (!password) return "bg-border";
    if (strength === "weak" && index === 0) return "bg-danger";
    if (strength === "fair" && index <= 1) return "bg-warning";
    if (strength === "strong" && index <= 2) return "bg-success";
    return "bg-border";
  };

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-muted">Password Strength</span>
        <span
          className={cn(
            "font-semibold",
            strength === "weak" && "text-danger",
            strength === "fair" && "text-warning",
            strength === "strong" && "text-success"
          )}
        >
          {password ? label : "Enter Password"}
        </span>
      </div>
      
      {/* Visual bars */}
      <div className="flex gap-1 h-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn("flex-1 rounded-full transition-colors duration-300", getBarColor(i))}
          />
        ))}
      </div>
      
      {/* Criteria details */}
      <div className="pt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-ink-subtle">
        <div className="flex items-center gap-1">
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", hasMinLength ? "bg-success" : "bg-border")} />
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", hasUpperCase ? "bg-success" : "bg-border")} />
          <span>Uppercase letter</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", hasLowerCase ? "bg-success" : "bg-border")} />
          <span>Lowercase letter</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", hasNumber ? "bg-success" : "bg-border")} />
          <span>Number (0-9)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", hasSpecial ? "bg-success" : "bg-border")} />
          <span>Special character</span>
        </div>
      </div>
    </div>
  );
}
