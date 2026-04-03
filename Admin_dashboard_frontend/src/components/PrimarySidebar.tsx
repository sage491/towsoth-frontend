import { 
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAdminModeEngine } from '../contexts/AdminModeEngine';
import { getVisibleSidebarSections } from '../services/navigation/sidebarSections';
import { PAGE_KEYS, type PageKey, type SidebarProps } from '../types/navigation';

export function PrimarySidebar({ activePage, onNavigate }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const { isModuleVisible } = useAdminModeEngine();

  const isPageKey = (value: string): value is PageKey => {
    return PAGE_KEYS.includes(value as PageKey);
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredSections = getVisibleSidebarSections(isModuleVisible);

  return (
    <aside className="w-[260px] bg-white border-r border-[#d1d5db] overflow-auto shrink-0 sidebar-scroll">
      <nav className="py-4">
        {filteredSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <div className="px-6 mb-2">
              <h3 className="text-[11px] text-[#6b7280] uppercase tracking-wider">{section.title}</h3>
            </div>
            {section.items.map((item) => {
              const isActive = activePage === item.id;
              
              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.children) {
                        toggleSection(item.id);
                      } else if (isPageKey(item.id)) {
                        onNavigate(item.id);
                      }
                    }}
                    className={`w-full px-6 py-2.5 flex items-center justify-between transition-all relative group ${
                      isActive
                        ? 'bg-[#f9fafb]'
                        : 'hover:bg-[#f9fafb]'
                    }`}
                  >
                    {/* Minimal brand accent - thin left indicator only when active */}
                    {isActive && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-0.5"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                      />
                    )}
                    
                    <div className="flex items-center gap-3">
                      <span className={`transition-colors ${isActive ? 'text-[var(--brand-primary)]' : 'text-[#6b7280] group-hover:text-[var(--brand-primary)]'}`}>
                        {item.icon}
                      </span>
                      <span 
                        className={`text-[13px] transition-all ${
                          isActive 
                            ? 'text-[var(--brand-primary)] font-semibold' 
                            : 'text-[#374151] font-normal group-hover:text-[var(--brand-primary)] group-hover:font-semibold'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {item.children && (
                      <ChevronRight 
                        className={`w-4 h-4 text-[#6b7280] transition-transform ${
                          expandedSections.includes(item.id) ? 'rotate-90' : ''
                        }`} 
                      />
                    )}
                  </button>
                  {item.children && expandedSections.includes(item.id) && (
                    <div className="bg-[#fafafa]">
                      {item.children.map((child) => {
                        const isChildActive = activePage === child.id;
                        
                        return (
                          <button
                            key={child.id}
                            onClick={() => onNavigate(child.id)}
                            className={`w-full px-6 pl-14 py-2 text-left transition-all relative group ${
                              isChildActive
                                ? 'bg-[#f9fafb]'
                                : 'hover:bg-[#f3f4f6]'
                            }`}
                          >
                            {/* Minimal brand accent for child items */}
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
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}