import React, { useState } from 'react'
import { X, FileText, FileJson, File, Download, Loader } from 'lucide-react'
import { downloadPDF, downloadDOCX, downloadTXT, downloadJSON } from '../utils/downloads'

const FORMATS = [
  { id: 'pdf', label: 'PDF', desc: 'Best for sharing & printing', icon: FileText, color: 'text-red-400', bg: 'bg-red-900/20 border-red-700/30' },
  { id: 'docx', label: 'Word (.docx)', desc: 'Editable in Microsoft Word', icon: File, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700/30' },
  { id: 'txt', label: 'Plain Text (.txt)', desc: 'Simple text format', icon: FileText, color: 'text-[var(--text-muted)]', bg: 'bg-slate-700/20 border-slate-600/30' },
  { id: 'json', label: 'JSON', desc: 'Structured data export', icon: FileJson, color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/30' },
]

export default function DownloadModal({ resume, previewId, onClose }) {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const sanitizeFileName = (name) => (name || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()

  const handleDownload = async (format) => {
    setLoading(format)
    setError('')
    try {
      const fileName = sanitizeFileName(resume.personal?.name || resume.title)
      if (format === 'pdf') await downloadPDF(previewId || 'resume-preview', fileName)
      else if (format === 'docx') await downloadDOCX(resume, fileName)
      else if (format === 'txt') downloadTXT(resume, fileName)
      else if (format === 'json') downloadJSON(resume, fileName)
      onClose()
    } catch (e) {
      console.error(e)
      setError(`Failed to download as ${format.toUpperCase()}. Please try again.`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="font-display font-semibold text-[var(--text-primary)] text-lg">Download Resume</h2>
            <p className="text-[var(--text-muted)] text-sm mt-0.5">Choose your preferred format</p>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => handleDownload(f.id)}
              disabled={!!loading}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left
                ${f.bg} hover:scale-[1.01] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className={`p-2.5 rounded-lg bg-[var(--surface-raised)]/60 ${f.color}`}>
                {loading === f.id ? <Loader size={18} className="animate-spin" /> : <f.icon size={18} />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[var(--text-primary)] text-sm">{f.label}</div>
                <div className="text-[var(--text-muted)] text-xs mt-0.5">{f.desc}</div>
              </div>
              {loading !== f.id && <Download size={15} className="text-[var(--text-muted)]" />}
            </button>
          ))}

          {error && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-lg px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
