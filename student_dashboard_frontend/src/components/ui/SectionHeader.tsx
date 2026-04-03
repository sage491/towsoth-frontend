import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)} {...props}>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {description ? <p className="text-sm">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
