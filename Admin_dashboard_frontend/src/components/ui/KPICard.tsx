interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'normal' | 'warning' | 'critical';
}

export function KPICard({ label, value, change, trend, status = 'normal' }: KPICardProps) {
  const statusColors = {
    normal: 'border-[#d1d5db]',
    warning: 'border-[#f59e0b]',
    critical: 'border-[#dc2626]',
  };

  const trendColors = {
    up: 'text-[#059669]',
    down: 'text-[#dc2626]',
    neutral: 'text-[#6b7280]',
  };

  return (
    <div className={`bg-white border ${statusColors[status]} p-4`}>
      <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-[28px] text-[#111827] tracking-tight">{value}</p>
        {change && trend && (
          <span className={`text-[12px] ${trendColors[trend]}`}>{change}</span>
        )}
      </div>
    </div>
  );
}
