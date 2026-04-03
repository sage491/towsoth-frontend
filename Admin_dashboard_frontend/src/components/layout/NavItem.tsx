import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { PageKey } from '../../types/navigation';

interface NavChild {
  id: PageKey;
  label: string;
}

interface NavItemProps {
  id: string;
  label: string;
  icon: ReactNode;
  activePage: PageKey;
  expanded: boolean;
  collapsed: boolean;
  children?: NavChild[];
  onToggle: (id: string) => void;
  onNavigate: (page: PageKey) => void;
}

export function NavItem({
  id,
  label,
  icon,
  activePage,
  expanded,
  collapsed,
  children,
  onToggle,
  onNavigate,
}: NavItemProps) {
  const isParentActive = activePage === id;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (children?.length) {
            onToggle(id);
            return;
          }
          onNavigate(id as PageKey);
        }}
        className={`w-full px-6 py-2.5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} transition-all relative group ${
          isParentActive ? 'bg-[#f9fafb]' : 'hover:bg-[#f9fafb]'
        }`}
      >
        {isParentActive && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: 'var(--brand-primary)' }} />
        )}

        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <span
            className={`transition-colors ${
              isParentActive
                ? 'text-[var(--brand-primary)]'
                : 'text-[#6b7280] group-hover:text-[var(--brand-primary)]'
            }`}
          >
            {icon}
          </span>
          {!collapsed && (
            <span
              className={`text-[13px] transition-all ${
                isParentActive
                  ? 'text-[var(--brand-primary)] font-semibold'
                  : 'text-[#374151] font-normal group-hover:text-[var(--brand-primary)] group-hover:font-semibold'
              }`}
            >
              {label}
            </span>
          )}
        </div>

        {!collapsed && children?.length ? (
          <ChevronRight className={`w-4 h-4 text-[#6b7280] transition-transform ${expanded ? 'rotate-90' : ''}`} />
        ) : null}
      </button>

      {!collapsed && children?.length && expanded ? (
        <div className="bg-[#fafafa]">
          {children.map((child) => {
            const isChildActive = activePage === child.id;

            return (
              <button
                key={child.id}
                type="button"
                onClick={() => onNavigate(child.id)}
                className={`w-full px-6 pl-14 py-2 text-left transition-all relative group ${
                  isChildActive ? 'bg-[#f9fafb]' : 'hover:bg-[#f3f4f6]'
                }`}
              >
                {isChildActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  />
                )}
                <span
                  className={`text-[13px] transition-all ${
                    isChildActive
                      ? 'text-[var(--brand-primary)] font-semibold'
                      : 'text-[#6b7280] font-normal group-hover:text-[var(--brand-primary)] group-hover:font-semibold'
                  }`}
                >
                  {child.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
