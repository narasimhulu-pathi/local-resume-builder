import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download, Layers, Shield, ArrowRight, Check, Sparkles } from 'lucide-react'

const FEATURES = [
  { icon: Layers, title: 'Multiple Templates', desc: 'Choose from Modern, Classic, Minimal, and Creative layouts designed by professionals.' },
  { icon: Download, title: 'Multi-format Export', desc: 'Download as PDF, Word (.docx), plain text, or JSON for every use case.' },
  { icon: Shield, title: 'Privacy First', desc: 'All data stays in your browser. No servers, no tracking, no surprises.' },
  { icon: Sparkles, title: 'Smart Editor', desc: 'Section-by-section editor with real-time preview to build your perfect resume.' },
]

const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up for free, no credit card needed.' },
  { num: '02', title: 'Pick a Template', desc: 'Choose from our collection of professional designs.' },
  { num: '03', title: 'Fill Your Details', desc: 'Add experience, education, skills, and more.' },
  { num: '04', title: 'Download & Share', desc: 'Export in your preferred format and apply.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      <div className="mesh-bg" />

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 text-center relative">
        <div className="inline-flex items-center gap-2 bg-forge-50 dark:bg-forge-900/30 border border-forge-700/40 rounded-full px-4 py-1.5 text-forge-400 text-sm font-medium mb-8">
          <Sparkles size={14} />
          Free to use — no credit card required
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-[var(--text-primary)] leading-tight mb-6 max-w-4xl mx-auto">
          Build resumes that<br />
          <span className="gradient-text">get you hired</span>
        </h1>

        <p className="text-[var(--text-muted)] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Create stunning, professional resumes with our intuitive builder.
          Multiple templates, instant preview, and export to any format.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup" className="btn-primary text-base px-7 py-3.5 glow">
            Start building free
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-7 py-3.5">
            Sign in
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mt-12 text-sm text-[var(--text-muted)]">
          {['PDF export', 'DOCX export', '4 templates', 'Free forever'].map(item => (
            <span key={item} className="flex items-center gap-1.5">
              <Check size={13} className="text-forge-500" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">Everything you need</h2>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">All the tools to craft and export a resume that stands out.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="section-card group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-forge-50 dark:bg-forge-900/40 border border-forge-700/30 flex items-center justify-center mb-4 group-hover:bg-forge-800/50 transition-colors">
                <f.icon size={18} className="text-forge-400" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">How it works</h2>
          <p className="text-[var(--text-muted)] text-lg">From blank page to polished resume in minutes.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.num} className="relative text-center">
              <div className="font-mono text-4xl font-bold text-navy-600 mb-3">{s.num}</div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{s.title}</h3>
              <p className="text-[var(--text-muted)] text-sm">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight size={16} className="hidden lg:block absolute top-6 -right-3 text-navy-500" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center bg-[var(--surface)] border border-forge-700/30 rounded-3xl p-12">
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-4">Ready to forge your resume?</h2>
          <p className="text-[var(--text-muted)] mb-8">Join thousands of job seekers who landed their dream role.</p>
          <Link to="/signup" className="btn-primary text-base px-8 py-3.5 mx-auto inline-flex glow">
            Create your resume — it's free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border-subtle)] py-8 text-center text-[var(--text-muted)] text-sm">
        © {new Date().getFullYear()} LocalResumeBuilder. Built with React & Vite.
      </footer>
    </div>
  )
}
