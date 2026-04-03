import type { ReactNode } from "react";

type BadgeTone = "success" | "warning" | "neutral";

interface StatusBadgeProps {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-gray-100 text-[#6b7280]",
};

export function StatusBadge({ tone, children, className = "" }: StatusBadgeProps) {
  return <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${TONE_CLASSES[tone]} ${className}`}>{children}</span>;
}
