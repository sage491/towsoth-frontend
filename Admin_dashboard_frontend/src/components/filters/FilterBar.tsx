import { useState, useEffect } from 'react';
import { Search, X, ChevronDown, Calendar, Filter } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'dropdown' | 'multiselect' | 'toggle' | 'daterange' | 'search';
  options?: FilterOption[];
  placeholder?: string;
}

export interface ActiveFilter {
  filterId: string;
  label: string;
  value: string | string[];
  displayText: string;
}

interface FilterBarProps {
  filters: FilterConfig[];
  onFiltersChange: (activeFilters: Record<string, any>) => void;
  resultCount?: number;
  totalCount?: number;
  storageKey?: string;
}

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  resultCount, 
  totalCount,
  storageKey 
}: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // Load saved filters from localStorage
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setActiveFilters(parsed);
          onFiltersChange(parsed);
        } catch (e) {
          console.error('Failed to load saved filters', e);
        }
      }
    }
  }, [storageKey]);

  // Save filters to localStorage
  useEffect(() => {
    if (storageKey && Object.keys(activeFilters).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(activeFilters));
    }
  }, [activeFilters, storageKey]);

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    const updated = { ...activeFilters };
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete updated[filterId];
    } else {
      updated[filterId] = value;
    }
    
    setActiveFilters(updated);
    onFiltersChange(updated);
    setOpenDropdown(null);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchValue('');
    onFiltersChange({});
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  // Generate active filter pills
  const getActiveFilterPills = (): ActiveFilter[] => {
    const pills: ActiveFilter[] = [];
    
    Object.entries(activeFilters).forEach(([filterId, value]) => {
      const filterConfig = filters.find(f => f.id === filterId);
      if (!filterConfig) return;

      if (filterConfig.type === 'multiselect' && Array.isArray(value)) {
        value.forEach(v => {
          const option = filterConfig.options?.find(o => o.value === v);
          if (option) {
            pills.push({
              filterId,
              label: filterConfig.label,
              value: v,
              displayText: option.label
            });
          }
        });
      } else if (filterConfig.type === 'dropdown') {
        const option = filterConfig.options?.find(o => o.value === value);
        if (option) {
          pills.push({
            filterId,
            label: filterConfig.label,
            value,
            displayText: option.label
          });
        }
      } else if (filterConfig.type === 'toggle') {
        pills.push({
          filterId,
          label: filterConfig.label,
          value,
          displayText: value
        });
      } else if (filterConfig.type === 'daterange') {
        pills.push({
          filterId,
          label: filterConfig.label,
          value,
          displayText: value
        });
      } else if (filterConfig.type === 'search' && value) {
        pills.push({
          filterId,
          label: 'Search',
          value,
          displayText: `"${value}"`
        });
      }
    });

    return pills;
  };

  // Remove individual filter pill
  const removePill = (pill: ActiveFilter) => {
    const updated = { ...activeFilters };
    
    if (Array.isArray(updated[pill.filterId])) {
      updated[pill.filterId] = updated[pill.filterId].filter((v: string) => v !== pill.value);
      if (updated[pill.filterId].length === 0) {
        delete updated[pill.filterId];
      }
    } else {
      delete updated[pill.filterId];
      if (pill.filterId.includes('search')) {
        setSearchValue('');
      }
    }
    
    setActiveFilters(updated);
    onFiltersChange(updated);
  };

  const activePills = getActiveFilterPills();
  const hasActiveFilters = activePills.length > 0;

  return (
    <div className="bg-white border border-[#e5e7eb] mb-4">
      {/* Filter Controls */}
      <div className="p-3 border-b border-[#f3f4f6]">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-[#9ca3af]" />
          
          {filters.map((filter) => {
            if (filter.type === 'search') {
              return (
                <div key={filter.id} className="flex-1 min-w-[200px] max-w-sm relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    placeholder={filter.placeholder || 'Search...'}
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      handleFilterChange(filter.id, e.target.value);
                    }}
                    className="w-full pl-9 pr-3 py-1.5 text-[12px] border border-[#e5e7eb] focus:outline-none focus:border-[#d1d5db] transition-colors"
                  />
                </div>
              );
            }

            if (filter.type === 'dropdown') {
              return (
                <div key={filter.id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === filter.id ? null : filter.id)}
                    className={`px-3 py-1.5 text-[12px] border transition-all flex items-center gap-1.5 ${
                      activeFilters[filter.id]
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 text-[var(--brand-primary)]'
                        : 'border-[#e5e7eb] text-[#6b7280] hover:border-[#d1d5db]'
                    }`}
                  >
                    {filter.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === filter.id ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === filter.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#e5e7eb] shadow-lg z-20 max-h-64 overflow-auto">
                        <button
                          onClick={() => handleFilterChange(filter.id, null)}
                          className="w-full px-3 py-2 text-left text-[12px] text-[#6b7280] hover:bg-[#f9fafb] transition-colors"
                        >
                          All
                        </button>
                        {filter.options?.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange(filter.id, option.value)}
                            className={`w-full px-3 py-2 text-left text-[12px] hover:bg-[#f9fafb] transition-colors ${
                              activeFilters[filter.id] === option.value
                                ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
                                : 'text-[#374151]'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            }

            if (filter.type === 'multiselect') {
              const selected = activeFilters[filter.id] || [];
              return (
                <div key={filter.id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === filter.id ? null : filter.id)}
                    className={`px-3 py-1.5 text-[12px] border transition-all flex items-center gap-1.5 ${
                      selected.length > 0
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 text-[var(--brand-primary)]'
                        : 'border-[#e5e7eb] text-[#6b7280] hover:border-[#d1d5db]'
                    }`}
                  >
                    {filter.label}
                    {selected.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-[var(--brand-primary)] text-white text-[10px] font-medium">
                        {selected.length}
                      </span>
                    )}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === filter.id ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === filter.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#e5e7eb] shadow-lg z-20 max-h-64 overflow-auto">
                        {filter.options?.map((option) => {
                          const isSelected = selected.includes(option.value);
                          return (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-[#f9fafb] cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const newSelected = e.target.checked
                                    ? [...selected, option.value]
                                    : selected.filter((v: string) => v !== option.value);
                                  handleFilterChange(filter.id, newSelected);
                                }}
                                className="w-3.5 h-3.5"
                              />
                              <span className={isSelected ? 'text-[#111827]' : 'text-[#6b7280]'}>
                                {option.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            }

            if (filter.type === 'toggle') {
              return (
                <div key={filter.id} className="flex items-center gap-1">
                  {filter.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const newValue = activeFilters[filter.id] === option.value ? null : option.value;
                        handleFilterChange(filter.id, newValue);
                      }}
                      className={`px-3 py-1.5 text-[12px] border transition-all ${
                        activeFilters[filter.id] === option.value
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                          : 'border-[#e5e7eb] text-[#6b7280] hover:border-[#d1d5db]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              );
            }

            if (filter.type === 'daterange') {
              return (
                <div key={filter.id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === filter.id ? null : filter.id)}
                    className={`px-3 py-1.5 text-[12px] border transition-all flex items-center gap-1.5 ${
                      activeFilters[filter.id]
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 text-[var(--brand-primary)]'
                        : 'border-[#e5e7eb] text-[#6b7280] hover:border-[#d1d5db]'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    {filter.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === filter.id ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === filter.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-[#e5e7eb] shadow-lg z-20">
                        <button
                          onClick={() => handleFilterChange(filter.id, null)}
                          className="w-full px-3 py-2 text-left text-[12px] text-[#6b7280] hover:bg-[#f9fafb] transition-colors"
                        >
                          All Time
                        </button>
                        {filter.options?.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange(filter.id, option.value)}
                            className={`w-full px-3 py-2 text-left text-[12px] hover:bg-[#f9fafb] transition-colors ${
                              activeFilters[filter.id] === option.value
                                ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/5'
                                : 'text-[#374151]'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            }

            return null;
          })}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-auto px-3 py-1.5 text-[12px] text-[#dc2626] hover:bg-[#fee2e2] transition-colors flex items-center gap-1.5"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="px-3 py-2 bg-[#f9fafb] flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#6b7280]">Active filters:</span>
          {activePills.map((pill, idx) => (
            <button
              key={`${pill.filterId}-${pill.value}-${idx}`}
              onClick={() => removePill(pill)}
              className="px-2 py-1 bg-white border border-[#e5e7eb] text-[11px] text-[#374151] hover:border-[#dc2626] hover:text-[#dc2626] transition-colors flex items-center gap-1.5 group"
            >
              <span className="text-[#9ca3af] group-hover:text-[#dc2626]">{pill.label}:</span>
              {pill.displayText}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Result Count */}
      {resultCount !== undefined && totalCount !== undefined && (
        <div className="px-3 py-2 border-t border-[#f3f4f6] bg-white">
          <p className="text-[11px] text-[#6b7280]">
            Showing <span className="font-medium text-[#111827]">{resultCount}</span> of <span className="font-medium text-[#111827]">{totalCount}</span> items
          </p>
        </div>
      )}
    </div>
  );
}
