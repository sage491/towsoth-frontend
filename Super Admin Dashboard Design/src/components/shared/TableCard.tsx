import type { ReactNode } from "react";

interface TableCardProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function TableCard({ title, actions, children }: TableCardProps) {
  return (
    <div className="bg-white border border-[#e8eaed] rounded overflow-hidden">
      <div className="p-5 border-b border-[#e8eaed]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#1f2937]">{title}</h2>
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
}
