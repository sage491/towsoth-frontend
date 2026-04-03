import type { HTMLAttributes } from "react";
import { cn } from "./utils";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {}

export function PageContainer({ className, ...props }: PageContainerProps) {
  return <div className={cn("min-h-screen", className)} {...props} />;
}
