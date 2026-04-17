import React from 'react'
import { DEFAULT_SECTION_ORDER } from '../context/ResumeContext'

export default function MinimalTemplate({ resume }) {
  const { personal, experience, education, skills, projects, certifications } = resume
  const order = resume.sectionOrder?.length ? resume.sectionOrder : [...DEFAULT_SECTION_ORDER]
  const hidden = resume.hiddenSections || []
  const visible = order.filter(id => !hidden.includes(id))

  const SECTIONS = {
    summary: personal.summary ? (
      <MinSection key="summary" title="About">
        <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.7 }}>{personal.summary}</p>
      </MinSection>
    ) : null,
    experience: experience?.length > 0 ? (
      <MinSection key="experience" title="Experience">
        {experience.map(exp => (
          <div key={exp.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '13.3px' }}>{exp.position}</span>
                <span style={{ color: '#7c3aed', fontWeight: 500 }}>, {exp.company}</span>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '11.3px' }}>
                {exp.startDate}{exp.current ? '–Present' : exp.endDate ? `–${exp.endDate}` : ''}
              </span>
            </div>
            {exp.location && <p style={{ margin: '1px 0 0', color: '#9ca3af', fontSize: '11.3px' }}>{exp.location}</p>}
            {exp.description && <p style={{ margin: '5px 0 0', color: '#4b5563' }}>{exp.description}</p>}
            {exp.bullets?.filter(Boolean).length > 0 && (
              <ul style={{ margin: '5px 0 0', paddingLeft: '16px', color: '#4b5563' }}>
                {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </MinSection>
    ) : null,
    education: education?.length > 0 ? (
      <MinSection key="education" title="Education">
        {education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontWeight: 600 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
              <span style={{ color: '#7c3aed' }}>, {edu.school}</span>
              {edu.gpa && <span style={{ color: '#9ca3af', fontSize: '11.3px' }}> · GPA {edu.gpa}</span>}
            </div>
            <span style={{ color: '#9ca3af', fontSize: '11.3px' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</span>
          </div>
        ))}
      </MinSection>
    ) : null,
    skills: skills?.length > 0 ? (
      <MinSection key="skills" title="Skills">
        <div data-skills-container="true">
          {skills.map((s, i) => (
            <span data-skill="true" key={i} style={{ display: 'inline-block', verticalAlign: 'baseline', whiteSpace: 'nowrap', background: '#f5f3ff', color: '#5b21b6', border: '1px solid #ddd6fe', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', lineHeight: '11px', marginRight: '5px', marginBottom: '5px' }}>
              {s.name || s}
            </span>
          ))}
        </div>
      </MinSection>
    ) : null,
    projects: projects?.length > 0 ? (
      <MinSection key="projects" title="Projects">
        {projects.map(p => (
          <div key={p.id} style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 600 }}>{p.name}</span>
            {p.technologies && <span style={{ color: '#7c3aed', fontSize: '11.3px' }}> · {p.technologies}</span>}
            {p.description && <p style={{ margin: '3px 0 0', color: '#4b5563' }}>{p.description}</p>}
          </div>
        ))}
      </MinSection>
    ) : null,
    certifications: certifications?.length > 0 ? (
      <MinSection key="certifications" title="Certifications">
        {certifications.map(c => (
          <div key={c.id} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{c.name}{c.issuer ? ` · ${c.issuer}` : ''}</span>
            {c.date && <span style={{ color: '#9ca3af', fontSize: '11.3px' }}>{c.date}</span>}
          </div>
        ))}
      </MinSection>
    ) : null,
  }

  return (
    <div id="resume-preview" style={{ fontFamily: "'Helvetica Neue','Arial',sans-serif", background: '#fff', color: '#111827', minHeight: '1123px', width: '794px', margin: '0 auto', fontSize: '12.7px', lineHeight: '1.6', padding: '40px 44px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '37.3px', fontWeight: '300', margin: 0, letterSpacing: '-1px' }}>{personal.name || 'Your Name'}</h1>
        {personal.title && <p style={{ fontSize: '16px', margin: '4px 0 0', color: '#7c3aed', fontWeight: 500 }}>{personal.title}</p>}
        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11.3px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
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

function MinSection({ title, children }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={{ margin: '0 0 10px', fontSize: '10.7px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{title}</h2>
      {children}
      <div style={{ height: '1px', background: '#f3f4f6', marginTop: '14px' }} />
    </div>
  )
}
