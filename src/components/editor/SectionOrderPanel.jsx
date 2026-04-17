import React, { useState, useRef } from 'react'
import { GripVertical, Eye, EyeOff, RotateCcw, ListOrdered } from 'lucide-react'
import { DEFAULT_SECTION_ORDER } from '../../context/ResumeContext'

const SECTION_META = {
  summary:        { label: 'Professional Summary', color: '#14b8a6' },
  experience:     { label: 'Work Experience',       color: '#3b82f6' },
  education:      { label: 'Education',             color: '#a855f7' },
  skills:         { label: 'Skills',                color: '#f97316' },
  projects:       { label: 'Projects',              color: '#ec4899' },
  certifications: { label: 'Certifications',        color: '#eab308' },
}

export default function SectionOrderPanel({ order, hiddenSections = [], onChange, onToggleHidden }) {
  const safeOrder = order?.length ? order : [...DEFAULT_SECTION_ORDER]

  const dragItem = useRef(null)
  const dragOver = useRef(null)
  const [dragging, setDragging] = useState(null)

  const handleDragStart = (e, index) => {
    dragItem.current = index
    setDragging(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnter = (e, index) => {
    dragOver.current = index
    if (dragItem.current === index) return

    const updated = [...safeOrder]
    const dragged = updated.splice(dragItem.current, 1)[0]
    updated.splice(index, 0, dragged)
    dragItem.current = index
    onChange(updated)
  }

  const handleDragEnd = () => {
    setDragging(null)
    dragItem.current = null
    dragOver.current = null
  }

  const handleReset = () => {
    onChange([...DEFAULT_SECTION_ORDER])
    // also un-hide all
    onToggleHidden([])
  }

  const isHidden = (id) => hiddenSections.includes(id)

  const toggleHide = (id) => {
    const next = isHidden(id)
      ? hiddenSections.filter(h => h !== id)
      : [...hiddenSections, id]
    onToggleHidden(next)
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
          <ListOrdered size={13} />
          <span>Drag to reorder · toggle eye to hide/show</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-forge-400 transition-colors"
          title="Reset to default order"
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Drag list */}
      <div className="space-y-2">
        {safeOrder.map((id, index) => {
          const meta = SECTION_META[id]
          if (!meta) return null
          const hidden = isHidden(id)
          const isDraggingThis = dragging === index

          return (
            <div
              key={id}
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragEnter={e => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl border
                transition-all duration-150 select-none cursor-grab active:cursor-grabbing
                ${isDraggingThis
                  ? 'opacity-40 scale-95 border-forge-600/60 bg-[var(--surface-raised)]'
                  : hidden
                    ? 'border-[var(--border-subtle)]/50 bg-[var(--surface)]/40 opacity-50'
                    : 'border-[var(--border-subtle)] bg-[var(--surface-raised)]/60 hover:border-[var(--border)] hover:bg-[var(--surface-raised)]'
                }
              `}
            >
              {/* Drag handle */}
              <GripVertical size={14} className="text-[var(--text-muted)] shrink-0" />

              {/* Color dot + label */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: hidden ? '#334155' : meta.color }}
                />
                <span className={`text-sm font-medium truncate ${hidden ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
                  {meta.label}
                </span>
              </div>

              {/* Position badge */}
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${hidden ? 'bg-[var(--surface-raised)] text-slate-600' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Hide/show toggle */}
              <button
                onClick={() => toggleHide(id)}
                className={`p-1 rounded-lg transition-colors shrink-0 ${
                  hidden
                    ? 'text-slate-600 hover:text-[var(--text-muted)] hover:bg-[var(--surface-high)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-high)]'
                }`}
                title={hidden ? `Show ${meta.label}` : `Hide ${meta.label}`}
              >
                {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          )
        })}
      </div>

      {/* Preview order hint */}
      <div className="bg-[var(--bg)]/50 border border-[var(--border-subtle)]/50 rounded-xl p-3">
        <p className="text-xs text-[var(--text-muted)] mb-1.5 font-medium">Current order in resume:</p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {safeOrder
            .filter(id => !isHidden(id))
            .map(id => SECTION_META[id]?.label)
            .filter(Boolean)
            .join(' → ')}
        </p>
        {safeOrder.some(id => isHidden(id)) && (
          <p className="text-xs text-slate-600 mt-1">
            Hidden: {safeOrder.filter(id => isHidden(id)).map(id => SECTION_META[id]?.label).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
