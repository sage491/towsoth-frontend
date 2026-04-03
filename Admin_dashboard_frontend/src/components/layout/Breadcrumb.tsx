import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`px-6 py-3 border-b border-[#e5e7eb] bg-white ${className}`.trim()}>
      <ol className="flex items-center gap-2 text-[12px] text-[#6b7280] overflow-x-auto whitespace-nowrap">
        <li>
          <span className="inline-flex items-center">
            <Home className="w-3.5 h-3.5" />
          </span>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.id} className="inline-flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />
              {item.onClick && !isLast ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-[#374151] transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className={isLast ? 'text-[#111827] font-medium' : ''}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
