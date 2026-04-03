import { MoreHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from './utils';

export interface ActionDropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
}

interface ActionDropdownProps {
  items: ActionDropdownItem[];
  onSelect: (key: string) => void;
  buttonLabel?: string;
  className?: string;
}

export function ActionDropdown({
  items,
  onSelect,
  buttonLabel = 'More actions',
  className,
}: ActionDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-8 w-8 items-center justify-center border border-[#e5e7eb] bg-white text-[#6b7280] transition-colors hover:text-[#374151]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={buttonLabel}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 z-30 mt-1 min-w-[140px] border border-[#e5e7eb] bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  onSelect(item.key);
                  setOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-[12px] text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
