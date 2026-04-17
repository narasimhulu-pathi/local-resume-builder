import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FileText, LogOut, LayoutDashboard, Menu, X, Sparkles, Sun, Moon } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (path) => location.pathname === path
            // <div className="w-8 h-8 rounded-lg bg-forge-700/50 border border-forge-600/50 flex items-center justify-center group-hover:bg-forge-600/60 transition-colors"> -->

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
           <div className="w-8 h-8 rounded-lg bg-forge-100 border border-forge-300 flex items-center justify-center group-hover:bg-forge-200 transition-colors dark:bg-forge-700/50 dark:border-forge-600/50 dark:group-hover:bg-forge-600/60">
              <FileText size={16} className="text-forge-400" />
            </div>
            <span className="font-display font-semibold text-[var(--text-primary)] text-lg tracking-tight">
              Local<span className="gradient-text">ResumeBuilder</span>
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/dashboard" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-[var(--surface-raised)] text-forge-400' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'}`}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/templates" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/templates') ? 'bg-[var(--surface-raised)] text-forge-400' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'}`}>
                <Sparkles size={15} /> Templates
              </Link>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                  <div className="w-6 h-6 rounded-full bg-forge-700 flex items-center justify-center">
                    <span className="text-forge-300 text-xs font-semibold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary gap-1.5">
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Log in</Link>
                <Link to="/" className="btn-primary">Get started</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 space-y-1">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--surface)]">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/templates" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--surface)]">
                <Sparkles size={15} /> Templates
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-[var(--surface)]">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--surface)]">Log in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-forge-400 hover:bg-[var(--surface)]">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
