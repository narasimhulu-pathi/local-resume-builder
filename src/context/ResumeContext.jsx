import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const ResumeContext = createContext(null)

const RESUMES_KEY = (userId) => `rf_resumes_${userId}`

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
]

export const EMPTY_RESUME = () => ({
  id: crypto.randomUUID(),
  title: 'Untitled Resume',
  template: 'modern',
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    summary: '',
    title: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
})

export const EMPTY_EXPERIENCE = () => ({
  id: crypto.randomUUID(),
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  bullets: [],
})

export const EMPTY_EDUCATION = () => ({
  id: crypto.randomUUID(),
  school: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: '',
  description: '',
})

export const EMPTY_PROJECT = () => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  url: '',
  technologies: '',
  startDate: '',
  endDate: '',
})

export const EMPTY_CERTIFICATION = () => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  date: '',
  url: '',
})

export function ResumeProvider({ children }) {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [activeResume, setActiveResume] = useState(null)

  const storageKey = user ? RESUMES_KEY(user.id) : null

  useEffect(() => {
    if (!storageKey) { setResumes([]); return }
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')
      setResumes(stored)
    } catch {
      setResumes([])
    }
  }, [storageKey])

  const persist = useCallback((updated) => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(updated))
    setResumes(updated)
  }, [storageKey])

  const createResume = (template = 'modern') => {
    const r = { ...EMPTY_RESUME(), template }
    const updated = [r, ...resumes]
    persist(updated)
    return r
  }

  const updateResume = useCallback((id, changes) => {
    const updated = resumes.map(r =>
      r.id === id ? { ...r, ...changes, updatedAt: new Date().toISOString() } : r
    )
    persist(updated)
    if (activeResume?.id === id) {
      setActiveResume(prev => ({ ...prev, ...changes, updatedAt: new Date().toISOString() }))
    }
  }, [resumes, activeResume, persist])

  const deleteResume = (id) => {
    const updated = resumes.filter(r => r.id !== id)
    persist(updated)
    if (activeResume?.id === id) setActiveResume(null)
  }

  const loadResume = (id) => {
    const found = resumes.find(r => r.id === id)
    setActiveResume(found || null)
    return found
  }

  const duplicateResume = (id) => {
    const found = resumes.find(r => r.id === id)
    if (!found) return
    const copy = { ...found, id: crypto.randomUUID(), title: `${found.title} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    persist([copy, ...resumes])
    return copy
  }

  return (
    <ResumeContext.Provider value={{ resumes, activeResume, setActiveResume, createResume, updateResume, deleteResume, loadResume, duplicateResume }}>
      {children}
    </ResumeContext.Provider>
  )
}

export const useResumes = () => {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResumes must be used within ResumeProvider')
  return ctx
}
