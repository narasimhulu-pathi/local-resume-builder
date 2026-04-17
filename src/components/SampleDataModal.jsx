import React, { useState } from 'react'
import { X, FlaskConical, ChevronRight, Check, AlertTriangle } from 'lucide-react'
import { SAMPLE_RESUMES } from '../utils/sampleData'
import { DEFAULT_SECTION_ORDER } from '../context/ResumeContext'

export default function SampleDataModal({ resume, onLoad, onClose }) {
  const [selected, setSelected] = useState(null)
  const [confirm, setConfirm] = useState(false)

  const handleLoad = () => {
    if (!selected) return
    const sample = SAMPLE_RESUMES.find(s => s.key === selected)
    if (!sample) return

    // Merge sample data onto the existing resume shell (keep id, timestamps, sectionOrder)
    const merged = {
      ...resume,
      ...sample.data,
      id: resume.id,
      createdAt: resume.createdAt,
      updatedAt: new Date().toISOString(),
      sectionOrder: resume.sectionOrder?.length ? resume.sectionOrder : [...DEFAULT_SECTION_ORDER],
      hiddenSections: resume.hiddenSections || [],
    }
    onLoad(merged)
    onClose()
  }

  const hasContent =
    resume?.personal?.name ||
    resume?.experience?.length > 0 ||
    resume?.education?.length > 0 ||
    resume?.skills?.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-forge-900/40 border border-forge-700/30 flex items-center justify-center shrink-0 mt-0.5">
              <FlaskConical size={17} className="text-forge-400" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-[var(--text-primary)] text-lg leading-tight">Load Sample Data</h2>
              <p className="text-[var(--text-muted)] text-sm mt-0.5">
                Fill every section instantly with realistic content to test templates and layouts.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] rounded-lg transition-colors ml-2 shrink-0">
            <X size={17} />
          </button>
        </div>

        {/* Persona cards */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {SAMPLE_RESUMES.map(s => (
            <button
              key={s.key}
              onClick={() => { setSelected(s.key); setConfirm(false) }}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-150 group
                ${selected === s.key
                  ? 'border-forge-600/70 bg-forge-900/20 ring-1 ring-forge-600/30'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-raised)]/40 hover:border-[var(--border)] hover:bg-[var(--surface-raised)]/70'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text-primary)] text-sm">{s.label}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: s.color + '22', color: s.color, border: `1px solid ${s.color}44` }}
                    >
                      {s.data.template}
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5 truncate">{s.subtitle}</p>
                </div>
                {selected === s.key
                  ? <Check size={16} className="text-forge-400 shrink-0" />
                  : <ChevronRight size={15} className="text-slate-600 shrink-0 group-hover:text-[var(--text-muted)] transition-colors" />
                }
              </div>

              {/* Section breakdown */}
              {selected === s.key && (
                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2">
                  {[
                    ['Experience', s.data.experience.length, 'roles'],
                    ['Education', s.data.education.length, 'entries'],
                    ['Skills', s.data.skills.length, 'skills'],
                    ['Projects', s.data.projects.length, 'projects'],
                    ['Certifications', s.data.certifications.length, 'certs'],
                    ['Bullet points', s.data.experience.reduce((a, e) => a + (e.bullets?.length || 0), 0), 'total'],
                  ].map(([label, count, unit]) => (
                    <div key={label} className="bg-[var(--surface)]/60 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-[var(--text-primary)]">{count}</div>
                      <div className="text-xs text-[var(--text-muted)] leading-tight">{label}</div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--border-subtle)] shrink-0 space-y-3">
          {/* Overwrite warning */}
          {hasContent && selected && !confirm && (
            <div className="flex items-start gap-2.5 bg-amber-900/20 border border-amber-700/40 rounded-xl px-4 py-3">
              <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-200 text-xs leading-relaxed">
                This resume already has content. Loading sample data will <strong>replace all fields</strong>.
                Click "Load anyway" to continue.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button
              disabled={!selected}
              onClick={() => {
                if (hasContent && !confirm) { setConfirm(true); return }
                handleLoad()
              }}
              className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {hasContent && !confirm ? (
                <><AlertTriangle size={14} /> Load anyway</>
              ) : (
                <><FlaskConical size={14} /> Load sample data</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
