import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  TrendingUp, 
  User, 
  Settings, 
  Calendar,
  FileText,
  Trophy,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import OwlLogo from '@/components/OwlLogo'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeContext } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme } = useContext(ThemeContext)

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    { 
      icon: OwlLogo, 
      label: 'Learning', 
      path: '/subjects',
      active: location.pathname.includes('/subject')
    },
    { 
      icon: TrendingUp, 
      label: 'Progress', 
      path: '/progress',
      active: location.pathname === '/progress'
    },
    { 
      icon: Calendar, 
      label: 'Calendar', 
      path: '/calendar',
      active: location.pathname === '/calendar'
    },
    { 
      icon: Trophy, 
      label: 'Leaderboard', 
      path: '/leaderboard',
      active: location.pathname === '/leaderboard'
    },
    { 
      icon: FileText, 
      label: 'Resources', 
      path: '/resources',
      active: location.pathname === '/resources'
    }
  ]

  const bottomItems = [
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/notifications',
      active: location.pathname === '/notifications'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      active: location.pathname === '/settings'
    }
  ]
  
  // Theme toggle is handled separately

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    } min-h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <OwlLogo className="h-5 w-5" color="white" />
              </div>
              <span className="font-bold text-lg">TOWSOTH</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-slate-800 p-1"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'student@towsoth.com'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-700">
          <div className="space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Theme Toggle and Logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between mb-4">
          {collapsed ? (
            <ThemeToggle />
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <ThemeToggle />
                <span className="ml-3 text-sm font-medium text-slate-300">Theme</span>
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className={`w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white ${
            collapsed ? 'px-2' : 'px-3'
          }`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
