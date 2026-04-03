import { cn } from './utils';

export type StatusBadgeTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
  className?: string;
}

const toneClasses: Record<StatusBadgeTone, string> = {
  default: 'text-[#6b7280] bg-[#f3f4f6] border-[#d1d5db]',
  info: 'text-[#2563eb] bg-[#dbeafe] border-[#93c5fd]',
  success: 'text-[#059669] bg-[#d1fae5] border-[#6ee7b7]',
  warning: 'text-[#b45309] bg-[#fef3c7] border-[#fcd34d]',
  danger: 'text-[#dc2626] bg-[#fee2e2] border-[#fca5a5]',
};

export function StatusBadge({ label, tone = 'default', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-1 text-[11px] font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
