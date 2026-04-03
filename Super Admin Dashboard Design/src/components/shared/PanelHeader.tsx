import type { ReactNode } from "react";

interface PanelHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
}

export function PanelHeader({ title, description, actions, className = "" }: PanelHeaderProps) {
  return (
    <div className={`p-6 border-b border-[#e8eaed] bg-white ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1f2937] mb-1">{title}</h1>
          <p className="text-[13px] text-[#6b7280]">{description}</p>
        </div>
        {actions}
      </div>
    </div>
  );
}
