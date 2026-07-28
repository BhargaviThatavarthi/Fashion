import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { SITE_NAME } from '../../constants'

export const Route = createFileRoute('/admin/login')({
  head: () => ({
    meta: [{ title: `Admin Login — ${SITE_NAME}` }],
  }),
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      // Demo mode — allow any login if Supabase not configured
      if (!import.meta.env.VITE_SUPABASE_URL) {
        if (email && password) {
          navigate({ to: '/admin' })
          return
        }
        setErrorMsg('Please enter email and password')
        setStatus('error')
        return
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setErrorMsg(error.message)
        setStatus('error')
      } else {
        navigate({ to: '/admin' })
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0d040f, #1f0b24, #0d040f)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(192,125,196,0.08), transparent 60%)',
        }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <span className="font-heading text-white text-2xl font-700">{SITE_NAME}</span>
            <span className="font-nav text-xs tracking-[0.25em] uppercase mt-0.5" style={{ color: 'var(--color-gold)' }}>
              Admin Panel
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h1 className="font-heading text-white text-xl font-600 mb-1">Welcome Back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to your admin dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-nav text-xs font-700 uppercase tracking-wide text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pl-10 pr-10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && errorMsg && (
              <motion.p
                className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errorMsg}
              </motion.p>
            )}

            {/* Demo mode notice */}
            {!import.meta.env.VITE_SUPABASE_URL && (
              <p className="text-xs text-gray-500 bg-white/5 rounded-xl p-3">
                🔧 Demo mode: Enter any email + password to continue.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-pink w-full py-3.5 text-base disabled:opacity-60"
            >
              {status === 'loading' ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
