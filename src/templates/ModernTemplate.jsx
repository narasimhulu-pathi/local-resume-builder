import React from 'react'
import { DEFAULT_SECTION_ORDER } from '../context/ResumeContext'

export default function ModernTemplate({ resume }) {
  const { personal, experience, education, skills, projects, certifications } = resume
  const order = resume.sectionOrder?.length ? resume.sectionOrder : [...DEFAULT_SECTION_ORDER]
  const hidden = resume.hiddenSections || []
  const visible = order.filter(id => !hidden.includes(id))

  const SECTIONS = {
    summary: personal.summary ? (
      <Section key="summary" title="Professional Summary" color="#0f766e">
        <p style={{ margin: 0, color: '#374151', lineHeight: 1.6 }}>{personal.summary}</p>
      </Section>
    ) : null,
    experience: experience?.length > 0 ? (
      <Section key="experience" title="Work Experience" color="#0f766e">
        {experience.map(exp => (
          <div key={exp.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '14.7px' }}>{exp.position}</span>
                <span style={{ color: '#0f766e', fontWeight: 600 }}> — {exp.company}</span>
                {exp.location && <span style={{ color: '#6b7280', fontSize: '12px' }}> · {exp.location}</span>}
              </div>
              <span style={{ color: '#6b7280', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: 8 }}>
                {exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}
              </span>
            </div>
            {exp.description && <p style={{ margin: '4px 0 0', color: '#4b5563', fontSize: '12.7px' }}>{exp.description}</p>}
            {exp.bullets?.filter(Boolean).length > 0 && (
              <ul style={{ margin: '6px 0 0', paddingLeft: '18px', color: '#4b5563', fontSize: '12.7px' }}>
                {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </Section>
    ) : null,
    education: education?.length > 0 ? (
      <Section key="education" title="Education" color="#0f766e">
        {education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 700 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                <span style={{ color: '#0f766e' }}> — {edu.school}</span>
              </div>
              <span style={{ color: '#6b7280', fontSize: '12px' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
            </div>
            {edu.gpa && <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '12px' }}>GPA: {edu.gpa}</p>}
            {edu.description && <p style={{ margin: '3px 0 0', color: '#4b5563', fontSize: '12.7px' }}>{edu.description}</p>}
          </div>
        ))}
      </Section>
    ) : null,
    skills: skills?.length > 0 ? (
      <Section key="skills" title="Skills" color="#0f766e">
        <div data-skills-container="true">
          {skills.map((s, i) => (
            <span data-skill="true" key={i} style={{ display: 'inline-block', verticalAlign: 'baseline', whiteSpace: 'nowrap', background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0d7870', borderRadius: '5px', padding: '3px 9px', fontSize: '11px', lineHeight: '11px', fontWeight: 500, marginRight: '5px', marginBottom: '5px' }}>
              {s.name || s}
            </span>
          ))}
        </div>
      </Section>
    ) : null,
    projects: projects?.length > 0 ? (
      <Section key="projects" title="Projects" color="#0f766e">
        {projects.map(p => (
          <div key={p.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              {p.url && <a href={p.url} style={{ color: '#0f766e', fontSize: '12px' }}>{p.url}</a>}
            </div>
            {p.technologies && <p style={{ margin: '2px 0', color: '#0f766e', fontSize: '12px', fontStyle: 'italic' }}>{p.technologies}</p>}
            {p.description && <p style={{ margin: '3px 0 0', color: '#4b5563', fontSize: '12.7px' }}>{p.description}</p>}
          </div>
        ))}
      </Section>
    ) : null,
    certifications: certifications?.length > 0 ? (
      <Section key="certifications" title="Certifications" color="#0f766e">
        {certifications.map(c => (
          <div key={c.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>{c.name}</strong>{c.issuer ? ` — ${c.issuer}` : ''}</span>
            {c.date && <span style={{ color: '#6b7280', fontSize: '12px' }}>{c.date}</span>}
          </div>
        ))}
      </Section>
    ) : null,
  }

  return (
    <div id="resume-preview" style={{ fontFamily: "'Calibri','Segoe UI',sans-serif", background: '#fff', color: '#1e293b', minHeight: '1123px', width: '794px', margin: '0 auto', fontSize: '13.3px', lineHeight: '1.5' }}>
      <div style={{ background: '#0f766e', color: '#fff', padding: '28px 32px 22px' }}>
        <h1 style={{ fontSize: '34.7px', fontWeight: '700', margin: 0 }}>{personal.name || 'Your Name'}</h1>
        {personal.title && <p style={{ fontSize: '16px', margin: '4px 0 0', opacity: 0.85 }}>{personal.title}</p>}
        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', opacity: 0.9 }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>📞 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.website && <span>🔗 {personal.website}</span>}
          {personal.linkedin && <span>in {personal.linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: '24px 32px' }}>
        {visible.map(id => SECTIONS[id] || null)}
      </div>
    </div>
  )
}

function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <tbody>
          <tr>
            <td style={{ whiteSpace: 'nowrap', paddingRight: '8px', verticalAlign: 'middle', width: '1px' }}>
              <h2 style={{ margin: 0, fontSize: '14.7px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1 }}>{title}</h2>
            </td>
            <td style={{ verticalAlign: 'middle' }}>
              <div style={{ height: '1px', background: color, opacity: 0.35 }} />
            </td>
          </tr>
        </tbody>
      </table>
      {children}
    </div>
  )
}
