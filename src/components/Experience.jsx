import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

function SectionMeta({ pageNum }) {
  return (
    <div style={{
      padding: '0.6rem clamp(1.2rem, 4vw, 3rem)',
      display: 'grid', gridTemplateColumns: '1fr auto auto auto',
      gap: '2rem', alignItems: 'center',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--muted2)', textTransform: 'uppercase' }}>Chihiro Nitasaka</span>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--muted2)' }}>2026</span>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--muted2)' }}>chihironitasaka@gmail.com</span>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--muted2)' }}>{pageNum}</span>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef();
  const headRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 85%' } });

      gsap.fromTo(sectionRef.current.querySelectorAll('.exp-item'),
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current.querySelector('.exp-list'), start: 'top 80%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} style={{
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionMeta pageNum="04" />

      {/* Heading */}
      <div ref={headRef} style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: '1rem' }}>Background</p>
        <h2 style={{
          fontSize: 'clamp(3.5rem, 10vw, 9rem)', fontWeight: 700,
          letterSpacing: '-0.045em', lineHeight: 0.95, color: 'var(--text)',
        }}>Experience</h2>
      </div>

      {/* Experience table */}
      <div className="exp-list" style={{
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.2rem, 4vw, 3rem)',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.8fr 2fr 1fr auto',
          gap: '0 2rem', paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '0.5rem',
        }}>
          {['Company', 'Role', 'Period', ''].map((h) => (
            <span key={h} style={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: 'var(--muted2)', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {experience.map((job, i) => (
          <div key={i} className="exp-item" style={{
            display: 'grid', gridTemplateColumns: '1.8fr 2fr 1fr auto',
            gap: '0 2rem', alignItems: 'start',
            padding: '1.1rem 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.4 }}>
                {job.company}
                {job.type && <span style={{ fontWeight: 400, color: 'var(--muted2)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>({job.type})</span>}
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.4 }}>{job.role}</p>
              {job.bullets.length > 0 && (
                <ul style={{ marginTop: '0.5rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {job.bullets.map((b, j) => (
                    <li key={j} style={{ fontSize: '0.8rem', color: 'var(--muted2)', lineHeight: 1.6,
                      paddingLeft: '0.9rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--border-bright)' }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--muted2)', lineHeight: 1.5 }}>{job.period}</p>
            <div />
          </div>
        ))}
      </div>

      {/* Education */}
      <div style={{
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.2rem, 4vw, 3rem)',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border)',
        }}>Education</p>

        {[
          { school: 'British Columbia Institute of Technology', degree: 'Senior Management Certificate in New Media Design', year: '2004 – 2005' },
          { school: 'Ryukoku University', degree: "Bachelor's Degree, Faculty of Intercultural Communication", year: '1999 – 2003' },
        ].map((e, i) => (
          <div key={e.school} style={{
            display: 'grid', gridTemplateColumns: '1.8fr 2fr 1fr auto',
            gap: '0 2rem', alignItems: 'center',
            padding: '1rem 0',
            borderBottom: i === 0 ? '1px solid var(--border)' : 'none',
          }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{e.school}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{e.degree}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted2)' }}>{e.year}</p>
            <div />
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .exp-list > div { grid-template-columns: 1fr !important; }
          .exp-list > div > * { padding: 0 !important; }
        }
      `}</style>
    </section>
  );
}
