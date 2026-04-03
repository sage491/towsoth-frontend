import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { AppSectionId } from "../types/navigation";
import { NAVIGATION_ITEMS } from "../navigation/sections";

interface SidebarProps {
  activeSection: AppSectionId;
  onSectionChange: (section: AppSectionId) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${collapsed ? "w-14" : "w-56"} bg-[#1f2937] border-r border-[#374151] flex flex-col transition-all duration-300`}>
      {/* Collapse Toggle */}
      <div className="h-14 flex items-center justify-end px-3 border-b border-[#374151]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-[#374151] rounded transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#9ca3af]" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-1">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isEmergency = item.id === "emergency";

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors ${
                isActive
                  ? "bg-[#374151] text-[#e5e7eb] border-l-2 border-[#1e40af]"
                  : isEmergency
                  ? "text-[#f87171] hover:bg-[#374151]"
                  : "text-[#9ca3af] hover:bg-[#374151] hover:text-[#d1d5db]"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-[13px]">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}