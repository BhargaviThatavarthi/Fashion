import { createFileRoute, redirect, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { supabase } from '../../lib/supabase'
import { useState } from 'react'
import {
  LayoutDashboard, Package, Tag, Home, MessageSquare,
  Share2, Youtube, Inbox, Settings, LogOut, Menu, X, ChevronRight,
  ShoppingBag, Users, Image, BarChart3,
} from 'lucide-react'

// Protect all /admin/* routes
export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: async () => {
    // Only check auth if Supabase is configured
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw redirect({ to: '/admin/login' })
      }
    }
  },
  component: AdminLayout,
})

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Media Library', href: '/admin/media', icon: Image },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Homepage', href: '/admin/homepage', icon: Home },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Social Media', href: '/admin/social', icon: Share2 },
  { label: 'YouTube', href: '/admin/youtube', icon: Youtube },
  { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate({ to: '/admin/login' })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col">
          <span className="font-heading text-white text-base font-700">Sri Subhakari</span>
          <span className="font-nav text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--color-gold)' }}>
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            to={href as any}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-nav font-500 text-gray-300 hover:text-white hover:bg-white/8 transition-all duration-200 group"
            activeProps={{
              style: {
                background: 'rgba(216,92,138,0.15)',
                color: 'white',
                borderLeft: '3px solid var(--color-pink)',
              },
            }}
            activeOptions={{ exact: href === '/admin' }}
          >
            <Icon size={17} className="shrink-0 text-gray-400 group-hover:text-white transition-colors" />
            {label}
            <ChevronRight size={13} className="ml-auto text-gray-600 group-hover:text-gray-400 transition-colors" />
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-nav font-500 text-gray-400 hover:text-red-400 hover:bg-red-500/8 w-full transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0"
        style={{ background: '#111111' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden flex flex-col"
            style={{ background: '#111111' }}
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 p-1">
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="h-16 flex items-center justify-between px-6 border-b bg-white shadow-sm shrink-0"
          style={{ borderColor: '#f0e0e8' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 p-1"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-700"
              style={{ background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))' }}
            >
              A
            </div>
            <span className="font-nav text-sm font-600 text-gray-600 hidden sm:block">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
