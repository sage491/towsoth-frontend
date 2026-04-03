import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <section className={`border border-[#e5e7eb] bg-white p-8 text-center ${className ?? ''}`}>
      {icon ? <div className="mb-3 flex justify-center text-[#9ca3af]">{icon}</div> : null}
      <h3 className="text-[15px] text-[#111827]">{title}</h3>
      {description ? <p className="mt-1 text-[12px] text-[#6b7280]">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
