import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useResumes } from '../context/ResumeContext'
import { getTemplate } from '../templates'
import {
  PersonalSection, ExperienceSection, EducationSection,
  SkillsSection, ProjectsSection, CertificationsSection
} from '../components/editor/Sections'
import DownloadModal from '../components/DownloadModal'
import SampleDataModal from '../components/SampleDataModal'
import {
  User, Briefcase, GraduationCap, Wrench, FolderOpen, Award,
  Download, Eye, EyeOff, Palette, Check, ChevronLeft, ListOrdered, FlaskConical
} from 'lucide-react'
import SectionOrderPanel from '../components/editor/SectionOrderPanel'

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'order', label: 'Section Order', icon: ListOrdered },
]

const TEMPLATE_OPTIONS = [
  { id: 'modern', label: 'Modern', color: '#14b8a6' },
  { id: 'classic', label: 'Classic', color: '#3b82f6' },
  { id: 'minimal', label: 'Minimal', color: '#a855f7' },
  { id: 'creative', label: 'Creative', color: '#f97316' },
]

function useDebounce(fn, delay) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { resumes, updateResume } = useResumes()
  const [resume, setResume] = useState(null)
  const [activeSection, setActiveSection] = useState('personal')
  const [showPreview, setShowPreview] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [showSample, setShowSample] = useState(false)
  const [saved, setSaved] = useState(false)
  const [title, setTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)

  useEffect(() => {
    const r = resumes.find(r => r.id === id)
    if (!r) { navigate('/dashboard'); return }

    // If routed from Dashboard quick-start with sample data, apply it immediately
    const sampleData = location.state?.sampleData
    if (sampleData && sampleData.id === id && !r.personal?.name) {
      setResume(sampleData)
      setTitle(sampleData.title || 'Untitled Resume')
      updateResume(id, sampleData)
    } else {
      setResume(r)
      setTitle(r.title || 'Untitled Resume')
    }
  }, [id, resumes])

  const debouncedSave = useDebounce((changes) => {
    updateResume(id, changes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, 600)

  const handleChange = (section, value) => {
    const updated = { ...resume, [section]: value }
    setResume(updated)
    debouncedSave({ [section]: value })
  }

  const handleTemplateChange = (templateId) => {
    const updated = { ...resume, template: templateId }
    setResume(updated)
    updateResume(id, { template: templateId })
    setShowTemplates(false)
  }

  const handleTitleSave = () => {
    setEditingTitle(false)
    updateResume(id, { title })
  }

  const handleSampleLoad = (merged) => {
    setResume(merged)
    setTitle(merged.title || 'Untitled Resume')
    updateResume(id, merged)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleOrderChange = (newOrder) => {
    const updated = { ...resume, sectionOrder: newOrder }
    setResume(updated)
    debouncedSave({ sectionOrder: newOrder })
  }

  const handleHiddenChange = (newHidden) => {
    const updated = { ...resume, hiddenSections: newHidden }
    setResume(updated)
    debouncedSave({ hiddenSections: newHidden })
  }

  if (!resume) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-forge-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const TemplateComponent = getTemplate(resume.template)

  return (
    <div className="min-h-screen pt-16 flex flex-col bg-[var(--bg)]">
      {/* Editor toolbar */}
      <div className="bg-[var(--surface)] border-b border-[var(--border-subtle)] px-4 py-2.5 flex items-center gap-3 no-print">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors">
          <ChevronLeft size={16} /> Dashboard
        </button>
        <div className="w-px h-5 bg-[var(--surface-high)]" />

        {/* Editable title */}
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={e => e.key === 'Enter' && handleTitleSave()}
            className="bg-[var(--surface-raised)] border border-forge-600 rounded-lg px-3 py-1 text-[var(--text-primary)] text-sm focus:outline-none w-48"
          />
        ) : (
          <button onClick={() => setEditingTitle(true)} className="text-[var(--text-primary)] text-sm font-medium hover:text-forge-400 transition-colors max-w-48 truncate">
            {title}
          </button>
        )}

        {saved && (
          <span className="flex items-center gap-1 text-forge-400 text-xs ml-1">
            <Check size={12} /> Saved
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Sample data button */}
          <button
            onClick={() => setShowSample(true)}
            className="btn-secondary gap-1.5 hidden sm:flex"
            title="Load sample resume data for testing"
          >
            <FlaskConical size={14} className="text-forge-400" /> Sample Data
          </button>
          <div className="relative">
            <button onClick={() => setShowTemplates(!showTemplates)} className="btn-secondary gap-1.5">
              <Palette size={14} /> Template
            </button>
            {showTemplates && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)} />
                <div className="absolute right-0 top-10 z-20 bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl shadow-2xl p-3 min-w-[200px]">
                  <p className="text-xs text-[var(--text-muted)] font-medium mb-2 px-1">Choose Template</p>
                  {TEMPLATE_OPTIONS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleTemplateChange(t.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${resume.template === t.id ? 'bg-[var(--surface-high)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-high)] hover:text-[var(--text-primary)]'}`}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                      {t.label}
                      {resume.template === t.id && <Check size={12} className="ml-auto text-forge-400" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Toggle preview on mobile */}
          <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary gap-1.5 lg:hidden">
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPreview ? 'Hide' : 'Preview'}
          </button>

          <button onClick={() => setShowDownload(true)} className="btn-primary gap-1.5">
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Editor */}
        <div className={`${showPreview ? 'hidden lg:flex' : 'flex'} w-full lg:w-[420px] xl:w-[460px] flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)] shrink-0`}>
          {/* Section tabs */}
          <div className="flex overflow-x-auto border-b border-[var(--border-subtle)] px-2 py-1 gap-0.5 scrollbar-none">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                  ${s.id === 'order'
                    ? activeSection === 'order'
                      ? 'bg-forge-700/40 text-forge-300 ring-1 ring-forge-600/50'
                      : 'text-forge-500 hover:text-forge-300 hover:bg-forge-900/30 border border-dashed border-forge-700/40'
                    : activeSection === s.id
                      ? 'bg-[var(--surface-raised)] text-forge-400'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                  }`}
              >
                <s.icon size={13} />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Section content */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="font-display font-semibold text-[var(--text-primary)] text-base mb-4">
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </h2>

            {activeSection === 'personal' && (
              <PersonalSection data={resume.personal} onChange={v => handleChange('personal', v)} />
            )}
            {activeSection === 'experience' && (
              <ExperienceSection data={resume.experience} onChange={v => handleChange('experience', v)} />
            )}
            {activeSection === 'education' && (
              <EducationSection data={resume.education} onChange={v => handleChange('education', v)} />
            )}
            {activeSection === 'skills' && (
              <SkillsSection data={resume.skills} onChange={v => handleChange('skills', v)} />
            )}
            {activeSection === 'projects' && (
              <ProjectsSection data={resume.projects} onChange={v => handleChange('projects', v)} />
            )}
            {activeSection === 'certifications' && (
              <CertificationsSection data={resume.certifications} onChange={v => handleChange('certifications', v)} />
            )}
            {activeSection === 'order' && (
              <SectionOrderPanel
                order={resume.sectionOrder}
                hiddenSections={resume.hiddenSections || []}
                onChange={handleOrderChange}
                onToggleHidden={handleHiddenChange}
              />
            )}
          </div>
        </div>

        {/* Right panel - Preview */}
        <div className={`${showPreview || !showPreview ? 'flex' : 'hidden'} ${!showPreview ? 'lg:flex' : 'flex'} flex-1 flex-col overflow-auto`} style={{ background: 'var(--preview-bg, var(--surface-high))' }}>
          <div className="sticky top-0 z-10 bg-[var(--surface-raised)]/80 backdrop-blur-sm border-b border-[var(--border-subtle)] px-4 py-2 flex items-center justify-between no-print">
            <span className="text-[var(--text-secondary)] text-xs font-medium flex items-center gap-1.5">
              <Eye size={12} /> Live Preview
            </span>
            <span className="text-[var(--text-muted)] text-xs">{resume.template} template</span>
          </div>
          <div className="flex-1 overflow-auto p-4 sm:p-8">
            <div className="mx-auto shadow-2xl" style={{ maxWidth: '210mm', overflow: 'hidden' }}>
              <TemplateComponent resume={resume} />
            </div>
          </div>
        </div>
      </div>

      {showSample && (
        <SampleDataModal
          resume={resume}
          onLoad={handleSampleLoad}
          onClose={() => setShowSample(false)}
        />
      )}

      {showDownload && (
        <DownloadModal
          resume={resume}
          previewId="resume-preview"
          onClose={() => setShowDownload(false)}
        />
      )}
    </div>
  )
}
