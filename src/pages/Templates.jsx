import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumes } from '../context/ResumeContext'
import { Check, Sparkles } from 'lucide-react'

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Clean, contemporary layout with teal accents and strong typography. Perfect for tech & creative roles.',
    color: '#14b8a6',
    accent: 'forge',
    preview: {
      headerBg: '#0f766e',
      sections: ['Experience', 'Education', 'Skills'],
      style: 'sidebar',
    },
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Timeless single-column format trusted by recruiters everywhere. Great for corporate & finance.',
    color: '#3b82f6',
    accent: 'blue',
    preview: { headerBg: '#1d4ed8', sections: ['Summary', 'Experience', 'Education'], style: 'stacked' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Ultra-clean whitespace-driven design. Lets your content speak. Ideal for design & consulting.',
    color: '#a855f7',
    accent: 'purple',
    preview: { headerBg: '#7e22ce', sections: ['Work', 'Education', 'Skills'], style: 'minimal' },
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold, two-column layout with striking visual hierarchy. Stand out in creative industries.',
    color: '#f97316',
    accent: 'orange',
    preview: { headerBg: '#c2410c', sections: ['Projects', 'Experience', 'Skills'], style: 'two-col' },
  },
]

function TemplatePreview({ template }) {
  const colors = {
    forge: '#14b8a6',
    blue: '#3b82f6',
    purple: '#a855f7',
    orange: '#f97316',
  }
  const c = colors[template.accent]

  return (
    <div className="bg-white rounded-lg overflow-hidden h-48 relative shadow-lg" style={{ fontFamily: 'sans-serif' }}>
      {/* Simulated header */}
      <div style={{ background: template.preview.headerBg, padding: '12px 14px' }}>
        <div className="bg-white/30 rounded h-3 w-28 mb-1.5" />
        <div className="bg-white/20 rounded h-2 w-20" />
      </div>
      {/* Body */}
      <div className="p-3 space-y-2">
        {template.preview.sections.map((s, i) => (
          <div key={s}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="h-0.5 flex-1 rounded" style={{ background: c }} />
              <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: c }}>{s}</div>
              <div className="h-0.5 flex-1 rounded" style={{ background: c }} />
            </div>
            <div className="space-y-0.5">
              <div className="bg-gray-200 rounded h-1.5 w-full" />
              {i === 0 && <div className="bg-gray-100 rounded h-1.5 w-4/5" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Templates() {
  const navigate = useNavigate()
  const { createResume } = useResumes()

  const handleUse = (templateId) => {
    const r = createResume(templateId)
    navigate(`/editor/${r.id}`)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mesh-bg" />

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-forge-50 dark:bg-forge-900/30 border border-forge-700/40 rounded-full px-4 py-1.5 text-forge-400 text-sm font-medium mb-5">
          <Sparkles size={14} /> Professionally designed
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">Choose your template</h1>
        <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">Each template is ATS-friendly and optimized for modern hiring systems.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEMPLATES.map(t => (
          <div key={t.id} className="section-card flex flex-col gap-4 group hover:border-[var(--border)] transition-all duration-300 hover:-translate-y-1">
            <TemplatePreview template={t} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-display font-semibold text-[var(--text-primary)]">{t.name}</h3>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
              </div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{t.desc}</p>
            </div>
            <div className="space-y-2">
              <ul className="space-y-1">
                {['ATS-optimized', 'Clean typography', 'Easy to edit'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Check size={11} className="text-forge-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUse(t.id)}
                className="btn-primary w-full justify-center mt-2"
                style={{ background: t.color + '22', borderColor: t.color + '44', color: t.color }}
              >
                Use {t.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[var(--text-muted)] text-sm mt-10">
        All templates are free • You can switch templates anytime in the editor
      </p>
    </div>
  )
}
