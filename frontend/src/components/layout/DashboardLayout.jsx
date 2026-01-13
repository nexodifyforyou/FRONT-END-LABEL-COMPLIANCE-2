import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn, formatCredits } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  ShieldCheck,
  LayoutDashboard,
  FileSearch,
  History,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Coins,
  User,
  Plus,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Audit', href: '/audit/new', icon: Plus },
  { name: 'Run History', href: '/runs', icon: History },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout({ children }) {
  const { user, credits, logout, isAdmin, activeEmail } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800">
            <ShieldCheck className="h-8 w-8 text-indigo-400" />
            <span className="text-lg font-semibold text-white font-heading">Nexodify</span>
            <button
              className="ml-auto lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Credits Card */}
          <div className="mx-4 mt-4 rounded-sm bg-slate-800/50 border border-slate-700 p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Coins className="h-4 w-4" />
              <span>Credit Balance</span>
            </div>
            <div className="text-2xl font-semibold text-white font-heading">
              {formatCredits(credits)}
            </div>
            <Link to="/billing">
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Add Credits
              </Button>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className="pt-4 pb-2 px-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Admin
                  </div>
                </div>
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors',
                    location.pathname.startsWith('/admin')
                      ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <FileSearch className="h-5 w-5" />
                  Admin Panel
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user?.name || user?.email}
                </div>
                <div className="text-xs text-slate-400 truncate">{activeEmail}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8">
          <button
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1" />

          {/* Quick Credits */}
          <div className="hidden sm:flex items-center gap-2 mr-4 px-3 py-1.5 bg-slate-100 rounded-sm">
            <Coins className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-slate-700">{formatCredits(credits)}</span>
          </div>

          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-xs text-slate-400">Signed in as</span>
            <span className="text-sm text-slate-700">{activeEmail || 'Unknown account'}</span>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-slate-100 transition-colors">
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium">{user?.name || 'User'}</div>
                <div className="text-xs text-muted-foreground">{activeEmail}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/billing" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Switch account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-rose-600 focus:text-rose-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
