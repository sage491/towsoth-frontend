import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export type StatusTone = "success" | "warning" | "error" | "info";

interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
}

const toneMap: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-slate-500",
};

export function StatusIndicator({ tone = "info", className, ...props }: StatusIndicatorProps) {
  return <span className={cn("inline-block w-2 h-2 rounded-full", toneMap[tone], className)} {...props} />;
}
