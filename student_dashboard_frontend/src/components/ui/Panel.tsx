import type { HTMLAttributes } from "react";
import { cn } from "./utils";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {}

export function Panel({ className, ...props }: PanelProps) {
  return <div className={cn("p-6 border", className)} {...props} />;
}
