import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  trend?: ReactNode;
}

export function MetricCard({ label, value, trend, className, ...props }: MetricCardProps) {
  return (
    <div
      className={cn("text-center px-3 md:px-5 py-2 md:py-3 border-2", className)}
      {...props}
    >
      <div className="text-[10px] md:text-xs font-bold uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-xl md:text-2xl font-bold">{value}</div>
      {trend ? <div className="flex items-center justify-center gap-1 mt-1">{trend}</div> : null}
    </div>
  );
}
