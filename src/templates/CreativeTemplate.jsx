import React from 'react'
import { DEFAULT_SECTION_ORDER } from '../context/ResumeContext'

// Creative template: sidebar has contact + skills + certifications
// Main area renders remaining sections in custom order
export default function CreativeTemplate({ resume }) {
  const { personal, experience, education, skills, projects, certifications } = resume
  const order = resume.sectionOrder?.length ? resume.sectionOrder : [...DEFAULT_SECTION_ORDER]
  const hidden = resume.hiddenSections || []
  const visible = order.filter(id => !hidden.includes(id))

  // Sidebar always shows skills & certifications if not hidden
  const sidebarSections = ['skills', 'certifications'].filter(id => !hidden.includes(id))
  // Main column: all others in order
  const mainSections = visible.filter(id => !['skills', 'certifications'].includes(id))

  const MAIN = {
    summary: personal.summary ? (
      <MainSection key="summary" title="Profile" color="#ea580c">
        <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.7 }}>{personal.summary}</p>
      </MainSection>
    ) : null,
    experience: experience?.length > 0 ? (
      <MainSection key="experience" title="Experience" color="#ea580c">
        {experience.map(exp => (
          <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '10px', borderLeft: '2px solid #fed7aa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: '13.3px' }}>{exp.position}</strong>
              <span style={{ fontSize: '10.7px', color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: 6 }}>
                {exp.startDate}{exp.current ? '–Now' : exp.endDate ? `–${exp.endDate}` : ''}
              </span>
            </div>
            <p style={{ margin: '1px 0 4px', color: '#ea580c', fontWeight: 600, fontSize: '12px' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
            {exp.description && <p style={{ margin: '3px 0', color: '#4b5563', fontSize: '12px' }}>{exp.description}</p>}
            {exp.bullets?.filter(Boolean).length > 0 && (
              <ul style={{ margin: '4px 0 0', paddingLeft: '15px', color: '#4b5563', fontSize: '12px' }}>
                {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </MainSection>
    ) : null,
    education: education?.length > 0 ? (
      <MainSection key="education" title="Education" color="#ea580c">
        {education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '2px solid #fed7aa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontSize: '13.3px' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
              <span style={{ fontSize: '10.7px', color: '#9ca3af' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</span>
            </div>
            <p style={{ margin: '1px 0', color: '#ea580c', fontWeight: 600, fontSize: '12px' }}>{edu.school}</p>
            {edu.gpa && <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '11.3px' }}>GPA: {edu.gpa}</p>}
          </div>
        ))}
      </MainSection>
    ) : null,
    projects: projects?.length > 0 ? (
      <MainSection key="projects" title="Projects" color="#ea580c">
        {projects.map(p => (
          <div key={p.id} style={{ marginBottom: '12px', paddingLeft: '10px', borderLeft: '2px solid #fed7aa' }}>
            <strong style={{ fontSize: '13.3px' }}>{p.name}</strong>
            {p.technologies && <span style={{ color: '#ea580c', fontSize: '11.3px', fontStyle: 'italic' }}> · {p.technologies}</span>}
            {p.description && <p style={{ margin: '3px 0 0', color: '#4b5563', fontSize: '12px' }}>{p.description}</p>}
          </div>
        ))}
      </MainSection>
    ) : null,
  }

  return (
    <div id="resume-preview" style={{ fontFamily: "'Arial','Helvetica',sans-serif", background: '#fff', minHeight: '1123px', width: '794px', margin: '0 auto', fontSize: '12.7px', lineHeight: '1.5', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '34%', background: '#1c1917', color: '#fff', padding: '28px 20px', flexShrink: 0 }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '32px', fontWeight: 700 }}>
          {personal.name ? personal.name[0].toUpperCase() : '?'}
        </div>
        <h1 style={{ fontSize: '21.3px', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.2 }}>{personal.name || 'Your Name'}</h1>
        {personal.title && <p style={{ fontSize: '12px', margin: '0 0 18px', color: '#ea580c', fontWeight: 600 }}>{personal.title}</p>}

        <SideSection title="Contact">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.3px' }}>
            {personal.email && <span style={{ color: '#d1d5db', wordBreak: 'break-all' }}>{personal.email}</span>}
            {personal.phone && <span style={{ color: '#d1d5db' }}>{personal.phone}</span>}
            {personal.location && <span style={{ color: '#d1d5db' }}>{personal.location}</span>}
            {personal.website && <span style={{ color: '#ea580c', wordBreak: 'break-all' }}>{personal.website}</span>}
            {personal.linkedin && <span style={{ color: '#ea580c', wordBreak: 'break-all' }}>{personal.linkedin}</span>}
          </div>
        </SideSection>

        {sidebarSections.includes('skills') && skills?.length > 0 && (
          <SideSection title="Skills">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {skills.map((s, i) => (
                <div key={i}>
                  <span style={{ fontSize: '11.3px', color: '#e5e7eb' }}>{s.name || s}</span>
                  <div style={{ height: '3px', background: '#374151', borderRadius: '2px', marginTop: '2px' }}>
                    <div style={{ height: '100%', width: '75%', background: '#ea580c', borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {sidebarSections.includes('certifications') && certifications?.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map(c => (
              <div key={c.id} style={{ marginBottom: '7px' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '11.3px', color: '#f3f4f6' }}>{c.name}</p>
                {c.issuer && <p style={{ margin: '1px 0 0', fontSize: '10.7px', color: '#9ca3af' }}>{c.issuer}</p>}
                {c.date && <p style={{ margin: '1px 0 0', fontSize: '10.7px', color: '#ea580c' }}>{c.date}</p>}
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '28px 24px' }}>
        {mainSections.map(id => MAIN[id] || null)}
      </div>
    </div>
  )
}

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <h3 style={{ margin: '0 0 8px', fontSize: '10.7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ea580c', borderBottom: '1px solid #374151', paddingBottom: '4px' }}>{title}</h3>
      {children}
    </div>
  )
}

function MainSection({ title, color, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ width: '4px', height: '18px', background: color, borderRadius: '2px' }} />
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}
