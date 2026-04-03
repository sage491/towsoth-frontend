export interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function FilterBar({
  options,
  value,
  onChange,
  label = 'Filter',
  className,
}: FilterBarProps) {
  return (
    <label className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <span className="text-[12px] text-[#6b7280]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-[#e5e7eb] bg-white px-3 py-2 text-[12px] text-[#374151] outline-none transition-colors focus:border-[#d1d5db]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
