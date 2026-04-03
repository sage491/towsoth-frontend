import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminModeEngine } from '../../contexts/AdminModeEngine';
import { getVisibleSidebarSections } from '../../services/navigation/sidebarSections';
import { PAGE_KEYS, type PageKey } from '../../types/navigation';
import { NavItem } from './NavItem';

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const { isModuleVisible } = useAdminModeEngine();

  const sections = useMemo(() => getVisibleSidebarSections(isModuleVisible), [isModuleVisible]);

  const isPageKey = (value: string): value is PageKey => PAGE_KEYS.includes(value as PageKey);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <>
      {mobileOpen ? <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onCloseMobile} /> : null}

      <aside
        className={`fixed lg:relative z-40 lg:z-auto inset-y-0 left-0 bg-white border-r border-[#d1d5db] overflow-auto shrink-0 sidebar-scroll transition-all duration-200 ${
          collapsed ? 'w-[88px]' : 'w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 px-4 border-b border-[#e5e7eb] flex items-center justify-end">
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="p-2 hover:bg-[#f9fafb] transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4 text-[#6b7280]" /> : <PanelLeftClose className="w-4 h-4 text-[#6b7280]" />}
          </button>
        </div>

        <nav className="py-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-6">
              {!collapsed ? (
                <div className="px-6 mb-2">
                  <h3 className="text-[11px] text-[#6b7280] uppercase tracking-wider">{section.title}</h3>
                </div>
              ) : null}

              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  activePage={activePage}
                  expanded={expandedSections.includes(item.id)}
                  collapsed={collapsed}
                  children={item.children}
                  onToggle={toggleSection}
                  onNavigate={(id) => {
                    if (isPageKey(id)) {
                      onNavigate(id);
                      onCloseMobile();
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
