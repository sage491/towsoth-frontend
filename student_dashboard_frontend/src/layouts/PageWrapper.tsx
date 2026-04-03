import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/utils";

interface PageWrapperProps extends HTMLAttributes<HTMLDivElement> {}

export function PageWrapper({ className, ...props }: PageWrapperProps) {
  return <div className={cn("max-w-[1600px] mx-auto px-6 pb-12 w-full", className)} {...props} />;
}
