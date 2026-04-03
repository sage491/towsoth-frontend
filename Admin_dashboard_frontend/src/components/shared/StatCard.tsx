import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function StatCard({ label, value, icon: Icon, onClick }: StatCardProps) {
  const Container = onClick ? 'button' : 'div';

  return (
    <Container
      {...(onClick ? { type: 'button', onClick } : {})}
      className="bg-white p-4 text-left transition-all hover:border-[var(--brand-primary)] hover:shadow-sm sm:p-5 border border-[#e5e7eb]"
    >
      <div className="mb-2 flex items-center justify-between">
        <Icon className="h-5 w-5 text-[#6b7280]" />
      </div>
      <p className="mb-1 text-[20px] font-light text-[#111827] sm:text-[24px]">{value}</p>
      <p className="text-[11px] text-[#6b7280] sm:text-[12px]">{label}</p>
    </Container>
  );
}
