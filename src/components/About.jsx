import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const skillGroups = [
  { label: 'Code', items: skills.code },
  { label: 'Frameworks', items: skills.frameworks },
  { label: 'Design', items: skills.design },
  { label: 'Exploring', items: skills.exploring },
];

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

export default function About() {
  const sectionRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-word',
        { y: '110%' },
        { y: '0%', stagger: 0.06, duration: 1, ease: 'power4.out',
          scrollTrigger: { trigger: '#about-headline', start: 'top 82%' } });

      gsap.fromTo('.about-body > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-body', start: 'top 80%' } });

      gsap.fromTo('.stat-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.stats-row', start: 'top 85%' } });

      gsap.fromTo('.skill-group',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionMeta pageNum="02" />

      {/* Big headline */}
      <div id="about-headline" style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3rem) 0',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: '1.5rem' }}>About</p>

        {[['Design', 'meets'], ['Engineering']].map((line, li) => (
          <div key={li} style={{ overflow: 'hidden', display: 'block' }}>
            <div style={{ display: 'flex', gap: '0.35em' }}>
              {line.map((word, wi) => (
                <span key={wi} className="about-word" style={{
                  display: 'inline-block',
                  fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                  fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 1.0,
                  color: li === 1 ? 'transparent' : 'var(--text)',
                  WebkitTextStroke: li === 1 ? '1.5px rgba(10,10,10,0.28)' : 'none',
                  paddingBottom: '0.05em',
                }}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Two-col bio + skills */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid var(--border)',
      }} className="about-grid">

        {/* Bio */}
        <div className="about-body" style={{
          padding: 'clamp(3rem, 5vw, 5rem) clamp(1.2rem, 4vw, 3rem)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: '1.3rem',
        }}>
          <p style={{ color: 'var(--text)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            I'm a UI/UX Designer and Front-End Developer based in Vancouver, BC —
            over 10 years working across both disciplines. I care about the full
            spectrum: from the first wireframe sketch to the final pixel in the browser.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
            Currently at Enjoitech Solutions Inc., building web systems in C#, Blazor,
            and .NET while owning front-end architecture and design quality. Freelance
            work spans brand identities, websites, and print for clients in Canada and Japan.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
            Native Japanese speaker. Professional working English.
            Comfortable in cross-cultural, cross-functional teams.
          </p>
        </div>

        {/* Skills */}
        <div className="skills-grid" style={{
          padding: 'clamp(3rem, 5vw, 5rem) clamp(1.2rem, 4vw, 3rem)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
          alignContent: 'start',
        }}>
          {skillGroups.map(group => (
            <div key={group.label} className="skill-group">
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--muted)',
                textTransform: 'uppercase', marginBottom: '0.8rem',
                borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem',
              }}>{group.label}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {group.items.map(item => (
                  <span key={item} style={{
                    padding: '0.25rem 0.6rem',
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem', color: 'var(--text)',
                    letterSpacing: '0.01em',
                  }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="stats-row" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {[
          { n: '10+', l: 'Years of experience' },
          { n: 'CA / JP', l: 'Markets served' },
          { n: '2', l: 'Languages spoken' },
        ].map((s, i) => (
          <div key={s.n} className="stat-item" style={{
            padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.2rem, 4vw, 3rem)',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700,
              letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1,
              marginBottom: '0.5rem',
            }}>{s.n}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.04em' }}>{s.l}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-grid > div { border-right: none !important; border-bottom: 1px solid var(--border); }
          .skills-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .stats-row > div:nth-child(2) { border-right: none !important; }
          .stats-row > div:nth-child(3) { border-top: 1px solid var(--border); }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr !important; }
          .stats-row > div { border-right: none !important; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </section>
  );
}
