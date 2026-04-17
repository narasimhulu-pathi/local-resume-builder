import React, { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { EMPTY_EXPERIENCE, EMPTY_EDUCATION, EMPTY_PROJECT, EMPTY_CERTIFICATION } from '../../context/ResumeContext'

// ─── Shared ──────────────────────────────────────────────────────────────────

function Field({ label, children, half }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-forge"
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="input-forge resize-none"
    />
  )
}

function CollapsibleItem({ title, subtitle, onDelete, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-[var(--surface-raised)]/60 cursor-pointer hover:bg-[var(--surface-raised)] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[var(--text-primary)] truncate">{title || 'Untitled'}</p>
          {subtitle && <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
          </button>
          {open ? <ChevronUp size={15} className="text-[var(--text-muted)]" /> : <ChevronDown size={15} className="text-[var(--text-muted)]" />}
        </div>
      </div>
      {open && (
        <div className="p-4 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-3">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Personal Section ─────────────────────────────────────────────────────────

export function PersonalSection({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Full Name"><Input value={data.name} onChange={set('name')} placeholder="Jane Smith" /></Field>
      <Field label="Professional Title" half><Input value={data.title} onChange={set('title')} placeholder="Software Engineer" /></Field>
      <Field label="Email" half><Input type="email" value={data.email} onChange={set('email')} placeholder="jane@example.com" /></Field>
      <Field label="Phone" half><Input value={data.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" /></Field>
      <Field label="Location" half><Input value={data.location} onChange={set('location')} placeholder="San Francisco, CA" /></Field>
      <Field label="Website" half><Input value={data.website} onChange={set('website')} placeholder="https://yoursite.com" /></Field>
      <Field label="LinkedIn" half><Input value={data.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/yourname" /></Field>
      <Field label="Professional Summary">
        <Textarea value={data.summary} onChange={set('summary')} placeholder="Brief professional summary highlighting your key skills and experience..." rows={4} />
      </Field>
    </div>
  )
}

// ─── Experience Section ───────────────────────────────────────────────────────

export function ExperienceSection({ data = [], onChange }) {
  const add = () => onChange([...data, EMPTY_EXPERIENCE()])
  const remove = (id) => onChange(data.filter(e => e.id !== id))
  const update = (id, changes) => onChange(data.map(e => e.id === id ? { ...e, ...changes } : e))
  const addBullet = (id) => update(id, { bullets: [...(data.find(e => e.id === id)?.bullets || []), ''] })
  const updateBullet = (id, idx, val) => {
    const exp = data.find(e => e.id === id)
    const bullets = [...(exp?.bullets || [])]
    bullets[idx] = val
    update(id, { bullets })
  }
  const removeBullet = (id, idx) => {
    const exp = data.find(e => e.id === id)
    update(id, { bullets: (exp?.bullets || []).filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-3">
      {data.map((exp, idx) => (
        <CollapsibleItem
          key={exp.id}
          title={exp.position || 'New Position'}
          subtitle={exp.company}
          onDelete={() => remove(exp.id)}
          defaultOpen={idx === 0 && !exp.company}
        >
          <Field label="Job Title" half><Input value={exp.position} onChange={v => update(exp.id, { position: v })} placeholder="Software Engineer" /></Field>
          <Field label="Company" half><Input value={exp.company} onChange={v => update(exp.id, { company: v })} placeholder="Acme Corp" /></Field>
          <Field label="Location" half><Input value={exp.location} onChange={v => update(exp.id, { location: v })} placeholder="San Francisco, CA" /></Field>
          <Field label="Start Date" half><Input value={exp.startDate} onChange={v => update(exp.id, { startDate: v })} placeholder="Jan 2022" /></Field>
          <Field label="End Date" half>
            <Input value={exp.endDate} onChange={v => update(exp.id, { endDate: v })} placeholder="Present" disabled={exp.current} />
          </Field>
          <Field label="" half>
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input type="checkbox" checked={exp.current || false} onChange={e => update(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })} className="w-4 h-4 accent-teal-500" />
              <span className="text-sm text-[var(--text-secondary)]">Currently working here</span>
            </label>
          </Field>
          <Field label="Description">
            <Textarea value={exp.description} onChange={v => update(exp.id, { description: v })} placeholder="Brief description of your role..." rows={2} />
          </Field>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Bullet Points</label>
            <div className="space-y-2">
              {(exp.bullets || []).map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={b}
                    onChange={e => updateBullet(exp.id, i, e.target.value)}
                    placeholder={`Achievement or responsibility ${i + 1}...`}
                    className="input-forge flex-1"
                  />
                  <button onClick={() => removeBullet(exp.id, i)} className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                    <X size={13} />
                  </button>
                </div>
              ))}
              <button onClick={() => addBullet(exp.id)} className="flex items-center gap-1.5 text-xs text-forge-400 hover:text-forge-300 font-medium transition-colors">
                <Plus size={12} /> Add bullet point
              </button>
            </div>
          </div>
        </CollapsibleItem>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[var(--border)] hover:border-forge-600/60 rounded-xl text-sm text-[var(--text-muted)] hover:text-forge-400 transition-colors">
        <Plus size={15} /> Add Experience
      </button>
    </div>
  )
}

// ─── Education Section ────────────────────────────────────────────────────────

export function EducationSection({ data = [], onChange }) {
  const add = () => onChange([...data, EMPTY_EDUCATION()])
  const remove = (id) => onChange(data.filter(e => e.id !== id))
  const update = (id, changes) => onChange(data.map(e => e.id === id ? { ...e, ...changes } : e))

  return (
    <div className="space-y-3">
      {data.map((edu, idx) => (
        <CollapsibleItem
          key={edu.id}
          title={edu.school || 'New School'}
          subtitle={edu.degree}
          onDelete={() => remove(edu.id)}
          defaultOpen={idx === 0 && !edu.school}
        >
          <Field label="School / University"><Input value={edu.school} onChange={v => update(edu.id, { school: v })} placeholder="MIT" /></Field>
          <Field label="Degree" half><Input value={edu.degree} onChange={v => update(edu.id, { degree: v })} placeholder="Bachelor of Science" /></Field>
          <Field label="Field of Study" half><Input value={edu.field} onChange={v => update(edu.id, { field: v })} placeholder="Computer Science" /></Field>
          <Field label="Start Date" half><Input value={edu.startDate} onChange={v => update(edu.id, { startDate: v })} placeholder="Sep 2018" /></Field>
          <Field label="End Date" half><Input value={edu.endDate} onChange={v => update(edu.id, { endDate: v })} placeholder="May 2022" /></Field>
          <Field label="GPA" half><Input value={edu.gpa} onChange={v => update(edu.id, { gpa: v })} placeholder="3.8" /></Field>
          <Field label="Description" half>
            <Textarea value={edu.description} onChange={v => update(edu.id, { description: v })} placeholder="Honors, activities..." rows={2} />
          </Field>
        </CollapsibleItem>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[var(--border)] hover:border-forge-600/60 rounded-xl text-sm text-[var(--text-muted)] hover:text-forge-400 transition-colors">
        <Plus size={15} /> Add Education
      </button>
    </div>
  )
}

// ─── Skills Section ───────────────────────────────────────────────────────────

export function SkillsSection({ data = [], onChange }) {
  const [input, setInput] = useState('')
  const addSkill = (name) => {
    if (!name.trim()) return
    const names = name.split(',').map(s => s.trim()).filter(Boolean)
    const newSkills = names.map(n => ({ id: crypto.randomUUID(), name: n }))
    onChange([...data, ...newSkills])
    setInput('')
  }
  const remove = (id) => onChange(data.filter(s => s.id !== id))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Add Skills</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(input) } }}
            placeholder="React, TypeScript, Node.js... (comma separated)"
            className="input-forge flex-1"
          />
          <button onClick={() => addSkill(input)} className="btn-primary shrink-0">
            <Plus size={14} /> Add
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">Press Enter or click Add. Separate multiple skills with commas.</p>
      </div>
      {data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map(s => (
            <div key={s.id} className="skill-tag flex items-center gap-1.5 group">
              {s.name}
              <button onClick={() => remove(s.id)} className="text-[var(--text-muted)] hover:text-red-400 transition-colors">
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
      {data.length === 0 && (
        <p className="text-[var(--text-muted)] text-sm text-center py-4">No skills added yet.</p>
      )}
    </div>
  )
}

// ─── Projects Section ─────────────────────────────────────────────────────────

export function ProjectsSection({ data = [], onChange }) {
  const add = () => onChange([...data, EMPTY_PROJECT()])
  const remove = (id) => onChange(data.filter(p => p.id !== id))
  const update = (id, changes) => onChange(data.map(p => p.id === id ? { ...p, ...changes } : p))

  return (
    <div className="space-y-3">
      {data.map((proj, idx) => (
        <CollapsibleItem
          key={proj.id}
          title={proj.name || 'New Project'}
          subtitle={proj.technologies}
          onDelete={() => remove(proj.id)}
          defaultOpen={idx === 0 && !proj.name}
        >
          <Field label="Project Name"><Input value={proj.name} onChange={v => update(proj.id, { name: v })} placeholder="My Awesome App" /></Field>
          <Field label="Technologies" half><Input value={proj.technologies} onChange={v => update(proj.id, { technologies: v })} placeholder="React, Node.js, PostgreSQL" /></Field>
          <Field label="URL" half><Input value={proj.url} onChange={v => update(proj.id, { url: v })} placeholder="https://github.com/..." /></Field>
          <Field label="Start Date" half><Input value={proj.startDate} onChange={v => update(proj.id, { startDate: v })} placeholder="Jan 2023" /></Field>
          <Field label="End Date" half><Input value={proj.endDate} onChange={v => update(proj.id, { endDate: v })} placeholder="Mar 2023" /></Field>
          <Field label="Description">
            <Textarea value={proj.description} onChange={v => update(proj.id, { description: v })} placeholder="What did you build and what impact did it have?" rows={3} />
          </Field>
        </CollapsibleItem>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[var(--border)] hover:border-forge-600/60 rounded-xl text-sm text-[var(--text-muted)] hover:text-forge-400 transition-colors">
        <Plus size={15} /> Add Project
      </button>
    </div>
  )
}

// ─── Certifications Section ───────────────────────────────────────────────────

export function CertificationsSection({ data = [], onChange }) {
  const add = () => onChange([...data, EMPTY_CERTIFICATION()])
  const remove = (id) => onChange(data.filter(c => c.id !== id))
  const update = (id, changes) => onChange(data.map(c => c.id === id ? { ...c, ...changes } : c))

  return (
    <div className="space-y-3">
      {data.map((cert, idx) => (
        <CollapsibleItem
          key={cert.id}
          title={cert.name || 'New Certification'}
          subtitle={cert.issuer}
          onDelete={() => remove(cert.id)}
          defaultOpen={idx === 0 && !cert.name}
        >
          <Field label="Certification Name"><Input value={cert.name} onChange={v => update(cert.id, { name: v })} placeholder="AWS Solutions Architect" /></Field>
          <Field label="Issuing Organization" half><Input value={cert.issuer} onChange={v => update(cert.id, { issuer: v })} placeholder="Amazon Web Services" /></Field>
          <Field label="Date" half><Input value={cert.date} onChange={v => update(cert.id, { date: v })} placeholder="Jun 2023" /></Field>
          <Field label="Certificate URL">
            <Input value={cert.url} onChange={v => update(cert.id, { url: v })} placeholder="https://..." />
          </Field>
        </CollapsibleItem>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[var(--border)] hover:border-forge-600/60 rounded-xl text-sm text-[var(--text-muted)] hover:text-forge-400 transition-colors">
        <Plus size={15} /> Add Certification
      </button>
    </div>
  )
}
