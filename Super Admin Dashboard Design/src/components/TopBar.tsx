import { Bell, User, AlertTriangle, Search, ChevronDown, LogOut, Shield, Eye, KeyRound, Activity } from "lucide-react";
import { OwlLogo } from "./OwlLogo";
import { useApp } from "../contexts/AppContext";
import { useState } from "react";

interface TopBarProps {
  systemStatus: "operational" | "warning" | "critical";
}

export function TopBar({ systemStatus }: TopBarProps) {
  const { currentUser, environment, addToast } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const statusColors = {
    operational: "bg-emerald-600",
    warning: "bg-amber-600",
    critical: "bg-red-600",
  };

  const statusText = {
    operational: "All Systems Operational",
    warning: "System Warning",
    critical: "Critical Alert",
  };

  const handleLogout = () => {
    addToast({
      type: "info",
      title: "Logged Out",
      message: "You have been logged out successfully.",
    });
    setShowProfileMenu(false);
    // In a real app, this would redirect to login
  };

  const handleProfileAction = (action: string) => {
    addToast({
      type: "info",
      title: "Action Triggered",
      message: `${action} functionality will be implemented.`,
    });
    setShowProfileMenu(false);
  };

  const notifications = [
    { id: 1, type: "warning", message: "Institution Stanford University approaching storage limit", time: "5 min ago" },
    { id: 2, type: "info", message: "New institution Harvard Medical School created", time: "1 hour ago" },
    { id: 3, type: "error", message: "Failed payment for UC Berkeley", time: "2 hours ago" },
  ];

  return (
    <div className="h-14 bg-white border-b border-[#d8dce2] flex items-center justify-between px-6 relative z-50">
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 pr-6 border-r border-[#e8eaed]">
          <OwlLogo className="w-6 h-6 text-[#1f2937]" />
          <div className="flex flex-col">
            <span className="text-[13px] text-[#1f2937] font-semibold leading-tight">Towsoth Edu</span>
            <span className="text-[11px] text-[#6b7280] leading-tight">Super Admin</span>
          </div>
        </div>

        {/* Environment Badge */}
        <div className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
          environment === "production" 
            ? "bg-emerald-100 text-emerald-700" 
            : "bg-amber-100 text-amber-700"
        }`}>
          {environment}
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${statusColors[systemStatus]}`} />
          <span className="text-[12px] text-[#6b7280]">{statusText[systemStatus]}</span>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search institutions, users, or resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f5f6f8] border border-transparent rounded pl-9 pr-3 py-1.5 text-[12px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] transition-colors"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 hover:bg-[#f5f6f8] rounded transition-colors"
          >
            <Bell className="w-4 h-4 text-[#6b7280]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#d8dce2] rounded shadow-lg">
              <div className="p-3 border-b border-[#e8eaed]">
                <div className="text-[13px] text-[#1f2937] font-medium">Notifications</div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 border-b border-[#e8eaed] hover:bg-[#fafbfc] cursor-pointer transition-colors">
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                        notif.type === "error" ? "bg-red-600" :
                        notif.type === "warning" ? "bg-amber-600" :
                        "bg-blue-600"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-[#1f2937] mb-1">{notif.message}</div>
                        <div className="text-[11px] text-[#6b7280]">{notif.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#e8eaed]">
                <button className="w-full text-[12px] text-[#1e40af] hover:bg-[#f5f6f8] py-1.5 rounded transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Alert Icon */}
        <button className="p-2 hover:bg-[#f5f6f8] rounded transition-colors">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-3 ml-2 border-l border-[#e8eaed] hover:bg-[#f5f6f8] pr-2 py-1 rounded transition-colors"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[12px] text-[#1f2937] font-medium leading-tight">{currentUser.split('@')[0]}</span>
              <span className="text-[11px] text-[#6b7280] leading-tight">Super Admin</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6b7280]" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#d8dce2] rounded shadow-lg">
              <div className="p-3 border-b border-[#e8eaed]">
                <div className="text-[12px] text-[#1f2937] font-medium mb-0.5">{currentUser}</div>
                <div className="text-[11px] text-[#6b7280]">Platform Administrator</div>
              </div>
              
              <div className="py-1">
                <button 
                  onClick={() => handleProfileAction("View Profile")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-[#6b7280]" />
                  View Profile
                </button>
                
                <button 
                  onClick={() => handleProfileAction("Change Password")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors text-left"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#6b7280]" />
                  Change Password
                </button>

                <button 
                  onClick={() => handleProfileAction("View Audit Activity")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors text-left"
                >
                  <Activity className="w-3.5 h-3.5 text-[#6b7280]" />
                  Audit Activity
                </button>

                <button 
                  onClick={() => handleProfileAction("Security Settings")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-[#6b7280]" />
                  Security Settings
                </button>
              </div>

              <div className="border-t border-[#e8eaed] py-1">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-700 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click Outside to Close Dropdowns */}
      {(showProfileMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
}
