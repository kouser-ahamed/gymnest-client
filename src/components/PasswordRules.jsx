"use client";

import React from "react";
import { CircleCheck, CircleXmark } from "@gravity-ui/icons";

export default function PasswordRules({ password }) {
  const rules = [
    { label: "Minimum 6 characters", valid: password.length >= 6 },
    { label: "At least one uppercase letter (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter (a-z)", valid: /[a-z]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5 rounded-2xl bg-slate-50 p-3.5 dark:bg-white/5 border border-slate-100 dark:border-white/5">
      <p className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mb-1">
        Password Requirements:
      </p>
      {rules.map((rule, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          {rule.valid ? (
            <CircleCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : (
            <CircleXmark className="h-4 w-4 text-red-400 shrink-0" />
          )}
          <span className={rule.valid ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-neutral-400"}>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
}