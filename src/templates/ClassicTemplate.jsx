import React from 'react'
import { DEFAULT_SECTION_ORDER } from '../context/ResumeContext'

export default function ClassicTemplate({ resume }) {
  const { personal, experience, education, skills, projects, certifications } = resume
  const order = resume.sectionOrder?.length ? resume.sectionOrder : [...DEFAULT_SECTION_ORDER]
  const hidden = resume.hiddenSections || []
  const visible = order.filter(id => !hidden.includes(id))

  const SECTIONS = {
    summary: personal.summary ? (
      <ClassicSection key="summary" title="PROFESSIONAL SUMMARY">
        <p style={{ margin: 0, textAlign: 'justify', color: '#374151' }}>{personal.summary}</p>
      </ClassicSection>
    ) : null,
    experience: experience?.length > 0 ? (
      <ClassicSection key="experience" title="PROFESSIONAL EXPERIENCE">
        {experience.map(exp => (
          <div key={exp.id} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #d1d5db', paddingBottom: '3px', marginBottom: '5px' }}>
              <div>
                <strong style={{ fontSize: '14px' }}>{exp.position}</strong>
                <span style={{ color: '#1d4ed8' }}> | {exp.company}</span>
                {exp.location && <span style={{ color: '#6b7280', fontSize: '12px' }}> | {exp.location}</span>}
              </div>
              <em style={{ color: '#6b7280', fontSize: '12px' }}>{exp.startDate}{exp.current ? '–Present' : exp.endDate ? `–${exp.endDate}` : ''}</em>
            </div>
            {exp.description && <p style={{ margin: '3px 0', color: '#4b5563', fontSize: '12.7px' }}>{exp.description}</p>}
            {exp.bullets?.filter(Boolean).length > 0 && (
              <ul style={{ margin: '4px 0 0', paddingLeft: '18px', color: '#4b5563', fontSize: '12.7px' }}>
                {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </ClassicSection>
    ) : null,
    education: education?.length > 0 ? (
      <ClassicSection key="education" title="EDUCATION">
        {education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
              <span style={{ color: '#1d4ed8' }}> | {edu.school}</span>
              {edu.gpa && <span style={{ color: '#6b7280', fontSize: '12px' }}> | GPA: {edu.gpa}</span>}
              {edu.description && <p style={{ margin: '3px 0 0', fontSize: '12.7px', color: '#4b5563' }}>{edu.description}</p>}
            </div>
            <em style={{ color: '#6b7280', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: 8 }}>
              {edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}
            </em>
          </div>
        ))}
      </ClassicSection>
    ) : null,
    skills: skills?.length > 0 ? (
      <ClassicSection key="skills" title="SKILLS">
        <div data-skills-container="true">
          {skills.map((s, i) => (
            <span data-skill="true" key={i} style={{ display: 'inline-block', verticalAlign: 'baseline', whiteSpace: 'nowrap', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '3px 9px', fontSize: '11px', lineHeight: '11px', fontWeight: 500, marginRight: '5px', marginBottom: '5px' }}>
              {s.name || s}
            </span>
          ))}
        </div>
      </ClassicSection>
    ) : null,
    projects: projects?.length > 0 ? (
      <ClassicSection key="projects" title="PROJECTS">
        {projects.map(p => (
          <div key={p.id} style={{ marginBottom: '10px' }}>
            <strong>{p.name}</strong>
            {p.technologies && <span style={{ color: '#1d4ed8', fontSize: '12px', fontStyle: 'italic' }}> | {p.technologies}</span>}
            {p.url && <span style={{ color: '#6b7280', fontSize: '12px' }}> | {p.url}</span>}
            {p.description && <p style={{ margin: '3px 0 0', fontSize: '12.7px', color: '#4b5563' }}>{p.description}</p>}
          </div>
        ))}
      </ClassicSection>
    ) : null,
    certifications: certifications?.length > 0 ? (
      <ClassicSection key="certifications" title="CERTIFICATIONS">
        {certifications.map(c => (
          <div key={c.id} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>{c.name}</strong>{c.issuer ? ` | ${c.issuer}` : ''}</span>
            {c.date && <em style={{ color: '#6b7280', fontSize: '12px' }}>{c.date}</em>}
          </div>
        ))}
      </ClassicSection>
    ) : null,
  }

  return (
    <div id="resume-preview" style={{ fontFamily: "'Georgia','Times New Roman',serif", background: '#fff', color: '#1a1a1a', minHeight: '1123px', width: '794px', margin: '0 auto', fontSize: '13.3px', lineHeight: '1.55', padding: '32px 36px' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1d4ed8', paddingBottom: '16px', marginBottom: '18px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: '#1e3a8a', letterSpacing: '1px', textTransform: 'uppercase' }}>{personal.name || 'Your Name'}</h1>
        {personal.title && <p style={{ fontSize: '14.7px', margin: '5px 0 0', color: '#3b82f6', fontStyle: 'italic' }}>{personal.title}</p>}
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#4b5563' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>
      {visible.map(id => SECTIONS[id] || null)}
    </div>
  )
}

function ClassicSection({ title, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '13.3px', fontWeight: '700', color: '#1e3a8a', letterSpacing: '0.12em', borderBottom: '1px solid #93c5fd', paddingBottom: '4px' }}>{title}</h2>
      {children}
    </div>
  )
}
