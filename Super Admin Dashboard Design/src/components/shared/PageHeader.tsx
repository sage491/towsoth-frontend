import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="p-6 border-b border-[#e8eaed] bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[#1f2937] mb-1">{title}</h1>
            {description && <p className="text-[13px] text-[#6b7280]">{description}</p>}
          </div>
          {actions}
        </div>
      </div>
    </div>
  );
}
