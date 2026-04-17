import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, Loader, FileText } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="mesh-bg" />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
           <div className="w-8 h-8 rounded-lg bg-forge-100 border border-forge-300 flex items-center justify-center group-hover:bg-forge-200 transition-colors dark:bg-forge-700/50 dark:border-forge-600/50 dark:group-hover:bg-forge-600/60">
              <FileText size={18} className="text-forge-400" />
            </div>
            <span className="font-display font-semibold text-[var(--text-primary)] text-xl">Local<span className="gradient-text">ResumeBuilder</span></span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="glass rounded-2xl p-7">
          {error && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-lg px-4 py-3 text-red-300 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-forge" style={{ paddingLeft: '2.25rem' }} placeholder="you@example.com"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-forge" style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-60">
              {loading ? <><Loader size={16} className="animate-spin" /> Signing in…</> : 'Sign in'}
            </button>
          </form>

     

          <p className="text-center text-[var(--text-muted)] text-sm mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-forge-400 hover:text-forge-300 font-medium">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
