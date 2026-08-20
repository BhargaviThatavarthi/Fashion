import { createFileRoute, redirect, Outlet, Link, useNavigate, useLocation } from '@tanstack/react-router'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package,
  Inbox, Settings, LogOut, Menu, ChevronRight,
  ShoppingBag, Users, Image, Sparkles, ExternalLink,
  ChevronLeft, Sun, Moon, Grid, MessageCircle, Calendar, Activity, DollarSign
} from 'lucide-react'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/admin/login') {
      return
    }

    if (typeof window !== 'undefined' && localStorage.getItem('admin_logged_in') === 'true') {
      return
    }

    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw redirect({ to: '/admin/login' })
        }
      } catch (err) {
        if (err && typeof err === 'object' && 'to' in err) throw err
      }
    }
  },
  component: AdminLayout,
})

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string | number
}

const OVERVIEW_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Messages', href: '/admin/enquiries', icon: Inbox, badge: 2 },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Calendar', href: '/admin/reports', icon: Calendar },
  { label: 'Activity', href: '/admin/reports', icon: Activity },
  { label: 'Media', href: '/admin/media', icon: Image },
]

const STORE_MANAGEMENT_ITEMS: NavItem[] = [
  { label: 'Customer Leads', href: '/admin/enquiries', icon: Users },
  { label: 'Revenue', href: '/admin/reports', icon: DollarSign },
  { label: 'Inventory', href: '/admin/products', icon: Package },
]

const ACCOUNT_ITEMS: NavItem[] = [
  { label: 'Chat', href: '/admin/enquiries', icon: MessageCircle },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // If on login page, render full screen login without sidebar
  if (location.pathname === '/admin/login') {
    return <Outlet />
  }

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_logged_in')
    }
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignore if offline
    }
    navigate({ to: '/admin/login' })
  }

  const SidebarContent = ({ collapsed }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full select-none text-slate-300 font-sans bg-[#0d111c] rounded-r-2xl overflow-hidden border-r border-slate-800/60 shadow-xl">
      {/* Brand Header Tile: Sri Subhakari Fashions */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/60 shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#091523] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shrink-0">
              <Grid size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-sm font-800 text-white leading-tight truncate">Sri Subhakari</span>
              <span className="text-[10px] text-slate-400 font-500 tracking-wider truncate">Fashions</span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-[#091523] border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto" title="Sri Subhakari Fashions">
            <Grid size={20} />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ml-auto cursor-pointer"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Groups Container */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto custom-scrollbar">
        {/* OVERVIEW SECTION */}
        <div>
          {!collapsed && (
            <h3 className="text-[10px] font-nav font-700 uppercase tracking-widest text-slate-500 mb-2.5 px-1">
              OVERVIEW
            </h3>
          )}

          <div className="space-y-1">
            {OVERVIEW_ITEMS.map(({ label, href, icon: Icon, badge }) => (
              <Link
                key={`ov-${label}`}
                to={href as any}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center ${
                  collapsed ? 'justify-center py-3 px-0' : 'gap-3 px-2.5 py-2.5'
                } rounded-xl text-xs font-nav font-500 transition-all group text-slate-300 hover:text-white hover:bg-slate-800/60`}
                activeProps={{
                  style: {
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    fontWeight: 700,
                  },
                }}
                activeOptions={{ exact: href === '/admin' }}
                title={collapsed ? label : undefined}
              >
                {!collapsed && (
                  <ChevronRight size={14} className="text-slate-500 shrink-0 group-hover:text-cyan-400 transition-colors" />
                )}
                <Icon size={18} className="shrink-0 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 font-500">{label}</span>
                    {badge !== undefined && (
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-800 text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* STORE MANAGEMENT SECTION */}
        <div className="pt-2 border-t border-slate-800/60">
          {!collapsed && (
            <h3 className="text-[10px] font-nav font-700 uppercase tracking-widest text-slate-500 mb-2.5 px-1">
              STORE MANAGEMENT
            </h3>
          )}

          <div className="space-y-1">
            {STORE_MANAGEMENT_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={`sm-${label}`}
                to={href as any}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center ${
                  collapsed ? 'justify-center py-3 px-0' : 'gap-3 px-2.5 py-2.5'
                } rounded-xl text-xs font-nav font-500 transition-all group text-slate-300 hover:text-white hover:bg-slate-800/60`}
                activeProps={{
                  style: {
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    fontWeight: 700,
                  },
                }}
                title={collapsed ? label : undefined}
              >
                {!collapsed && (
                  <ChevronRight size={14} className="text-slate-500 shrink-0 group-hover:text-cyan-400 transition-colors" />
                )}
                <Icon size={18} className="shrink-0 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                {!collapsed && <span className="truncate flex-1 font-500">{label}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <div className="pt-2 border-t border-slate-800/60">
          {!collapsed && (
            <h3 className="text-[10px] font-nav font-700 uppercase tracking-widest text-slate-500 mb-2.5 px-1">
              ACCOUNT
            </h3>
          )}

          <div className="space-y-1">
            {ACCOUNT_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={`acc-${label}`}
                to={href as any}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center ${
                  collapsed ? 'justify-center py-3 px-0' : 'gap-3 px-2.5 py-2.5'
                } rounded-xl text-xs font-nav font-500 transition-all group text-slate-300 hover:text-white hover:bg-slate-800/60`}
                activeProps={{
                  style: {
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    fontWeight: 700,
                  },
                }}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                {!collapsed && <span className="truncate flex-1 font-500">{label}</span>}
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center py-3 px-0' : 'gap-3 px-2.5 py-2.5'
              } rounded-xl text-xs font-nav font-500 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-all group text-left cursor-pointer`}
              title={collapsed ? "Log out" : undefined}
            >
              <LogOut size={18} className="shrink-0 text-slate-400 group-hover:text-rose-400 transition-colors" />
              {!collapsed && <span>Log out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Theme Mode Switcher */}
      <div className="p-4 border-t border-slate-800/60 flex items-center justify-center bg-[#090d17] shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between w-full max-w-[140px] px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <Sun size={15} className={!isDarkMode ? 'text-amber-400' : 'text-slate-400'} />
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-8 h-4 rounded-full bg-slate-700 p-0.5 transition-colors relative cursor-pointer"
            >
              <div
                className={`w-3 h-3 rounded-full bg-cyan-400 transition-transform ${
                  isDarkMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <Moon size={15} className={isDarkMode ? 'text-cyan-400' : 'text-slate-400'} />
          </div>
        ) : (
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-400 hover:text-cyan-400 cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* Desktop Permanent Collapsible Sidebar (Fixed 260px left column) */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out z-20 h-screen py-2 pl-2 ${
          isCollapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-[260px] z-50 md:hidden flex flex-col p-2"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <SidebarContent collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area (Constrained to remaining width after sidebar) */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar Header */}
        <header
          className="h-16 flex items-center justify-between px-4 sm:px-6 border-b bg-white shadow-2xs shrink-0 z-10"
          style={{ borderColor: '#e2e8f0' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-700 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu size={22} />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs font-nav font-700 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
            >
              <Menu size={16} />
              <span>{isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-nav text-xs font-700 text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-3.5 py-2 rounded-xl transition-colors border border-cyan-200 shadow-2xs"
            >
              <Sparkles size={14} />
              <span>Live Storefront</span>
              <ExternalLink size={12} />
            </a>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Profile & Top Logout Button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/admin-avatar.png"
                  onError={(e) => {
                    // Fallback to high res Indian saree portrait if public image is loading
                    (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80')
                  }}
                  alt="Sri Subhakari Store Manager"
                  className="w-9 h-9 rounded-full object-cover border-2 border-cyan-500/40 shadow-sm"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="font-nav text-xs font-700 text-slate-800 leading-tight">Sri Subhakari</span>
                  <span className="text-[10px] text-cyan-600 font-600">Store Manager</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-nav font-700 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 transition-all cursor-pointer shadow-2xs active:scale-98"
                title="Sign Out of Admin"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Route View Component Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/80 min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
