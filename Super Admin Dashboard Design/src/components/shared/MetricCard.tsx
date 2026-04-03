interface MetricCardProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export function MetricCard({ label, value, valueClassName = "text-[#1f2937]" }: MetricCardProps) {
  return (
    <div className="bg-white border border-[#e8eaed] rounded p-4">
      <div className="text-[12px] text-[#6b7280] mb-1">{label}</div>
      <div className={`text-[24px] font-semibold ${valueClassName}`}>{value}</div>
    </div>
  );
}
