import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useResumes } from '../context/ResumeContext'
import { useAuth } from '../context/AuthContext'
import { Plus, FileText, Copy, Trash2, Edit3, Download, Calendar, MoreVertical, FlaskConical } from 'lucide-react'
import DownloadModal from '../components/DownloadModal'
import { SAMPLE_RESUMES } from '../utils/sampleData'
import { DEFAULT_SECTION_ORDER } from '../context/ResumeContext'
import { formatDistanceToNow } from 'date-fns'

const TEMPLATE_COLORS = {
  modern:  'bg-teal-50 text-teal-700 border-teal-200 dark:bg-forge-50 dark:bg-forge-900/40 dark:text-forge-400 dark:border-forge-700/40',
  classic: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-700/40',
  minimal: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-700/40',
  creative:'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-700/40',
}

function ResumeCard({ resume, onDelete, onDuplicate, onDownload }) {
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="section-card group relative flex flex-col gap-3">
      {/* Template badge */}
      <div className="flex items-start justify-between">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${TEMPLATE_COLORS[resume.template] || TEMPLATE_COLORS.modern}`}>
          {resume.template}
        </span>
        <div className="relative">
          <button onClick={() => setMenu(!menu)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-high)] rounded-lg transition-colors">
            <MoreVertical size={15} />
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 top-8 z-20 bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl shadow-2xl py-1 min-w-[160px]">
                <button onClick={() => { navigate(`/editor/${resume.id}`); setMenu(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-high)] hover:text-[var(--text-primary)]">
                  <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => { onDownload(resume); setMenu(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-high)] hover:text-[var(--text-primary)]">
                  <Download size={14} /> Download
                </button>
                <button onClick={() => { onDuplicate(resume.id); setMenu(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-high)] hover:text-[var(--text-primary)]">
                  <Copy size={14} /> Duplicate
                </button>
                <hr className="border-[var(--border)] my-1" />
                <button onClick={() => { onDelete(resume.id); setMenu(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview area */}
      <div
        onClick={() => navigate(`/editor/${resume.id}`)}
        className="h-36 bg-[var(--bg)]/50 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center cursor-pointer hover:border-forge-600/50 transition-colors overflow-hidden group"
      >
        <div className="text-center p-4">
          <FileText size={28} className="text-navy-500 mx-auto mb-2 group-hover:text-forge-600 transition-colors" />
          <p className="text-xs text-slate-600 group-hover:text-[var(--text-muted)] transition-colors">Click to edit</p>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">{resume.title}</h3>
        {resume.personal?.name && (
          <p className="text-[var(--text-muted)] text-xs mt-0.5 truncate">{resume.personal.name}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border-subtle)]">
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Calendar size={11} />
          {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
        </span>
        <button onClick={() => navigate(`/editor/${resume.id}`)} className="text-xs text-forge-400 hover:text-forge-300 font-medium flex items-center gap-1">
          <Edit3 size={11} /> Edit
        </button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { resumes, createResume, deleteResume, duplicateResume } = useResumes()
  const navigate = useNavigate()
  const [downloadTarget, setDownloadTarget] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleCreate = () => {
    const r = createResume('modern')
    navigate(`/editor/${r.id}`)
  }

  const handleCreateFromSample = (sampleKey) => {
    const sample = SAMPLE_RESUMES.find(s => s.key === sampleKey)
    if (!sample) return
    const r = createResume(sample.data.template || 'modern')
    // update with full sample data right away
    const merged = {
      ...r,
      ...sample.data,
      id: r.id,
      createdAt: r.createdAt,
      updatedAt: new Date().toISOString(),
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      hiddenSections: [],
    }
    // We persist via updateResume after creation
    setTimeout(() => {
      navigate(`/editor/${r.id}`, { state: { sampleData: merged } })
    }, 50)
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteResume(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mesh-bg" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            {resumes.length === 0 ? "You haven't created any resumes yet." : `You have ${resumes.length} resume${resumes.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/templates" className="btn-secondary hidden sm:flex">Browse Templates</Link>
          <button onClick={handleCreate} className="btn-primary">
            <Plus size={16} /> New Resume
          </button>
        </div>
      </div>

      {/* Empty state */}
      {resumes.length === 0 ? (
      <div className="text-center py-16 glass rounded-2xl px-6">
          <div className="w-16 h-16 rounded-2xl bg-forge-50 dark:bg-forge-900/40 border border-forge-700/30 flex items-center justify-center mx-auto mb-5">
            <FileText size={28} className="text-forge-500" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">No resumes yet</h2>
          <p className="text-[var(--text-muted)] mb-7 max-w-sm mx-auto text-sm">Start from scratch or jump in with a sample resume to see how everything works.</p>
          <div className="flex gap-3 justify-center flex-wrap mb-8">
            <Link to="/templates" className="btn-secondary">Browse Templates</Link>
            <button onClick={handleCreate} className="btn-primary">
              <Plus size={16} /> Create blank resume
            </button>
          </div>
          {/* Sample persona quick-starts */}
          <div className="border-t border-[var(--border-subtle)] pt-7">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium mb-4 flex items-center justify-center gap-1.5">
              <FlaskConical size={12} className="text-forge-500" /> Or start with sample data
            </p>
            <div className="grid sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              {SAMPLE_RESUMES.map(s => (
                <button
                  key={s.key}
                  onClick={() => handleCreateFromSample(s.key)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border)] bg-[var(--surface)]/50 hover:bg-[var(--surface-raised)]/60 transition-all group"
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{s.label}</span>
                  <span className="text-xs text-[var(--text-muted)]">{s.data.personal.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Create new card */}
          <button
            onClick={handleCreate}
            className="h-full min-h-[280px] border-2 border-dashed border-[var(--border)] hover:border-forge-600/60 rounded-xl flex flex-col items-center justify-center gap-3 text-[var(--text-muted)] hover:text-forge-400 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={22} />
            </div>
            <span className="text-sm font-medium">New Resume</span>
          </button>

          {resumes.map(r => (
            <ResumeCard
              key={r.id}
              resume={r}
              onDelete={handleDelete}
              onDuplicate={duplicateResume}
              onDownload={setDownloadTarget}
            />
          ))}
        </div>
      )}

      {/* Delete confirm toast */}
      {deleteConfirm && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-700/60 rounded-xl px-5 py-3 text-sm text-red-200 flex items-center gap-3 shadow-2xl z-50">
          Click delete again to confirm
          <button onClick={() => setDeleteConfirm(null)} className="text-red-400 hover:text-red-200 text-xs underline">Cancel</button>
        </div>
      )}

      {downloadTarget && (
        <DownloadModal
          resume={downloadTarget}
          previewId={`preview-${downloadTarget.id}`}
          onClose={() => setDownloadTarget(null)}
        />
      )}
    </div>
  )
}
