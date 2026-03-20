import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function SectionMeta({ pageNum }) {
  return (
    <div style={{
      padding: '0.6rem clamp(1.2rem, 4vw, 3rem)',
      display: 'grid', gridTemplateColumns: '1fr auto auto auto',
      gap: '2rem', alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Chihiro Nitasaka</span>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}>2026</span>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}>chihironitasaka@gmail.com</span>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)' }}>{pageNum}</span>
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-word',
        { y: '110%' },
        { y: '0%', stagger: 0.07, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: '#contact-headline', start: 'top 82%' } });

      gsap.fromTo('.contact-body > *',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-body', start: 'top 80%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} style={{ background: 'linear-gradient(to bottom, #1e1a50 0%, #0f0d2a 35%, #0a0a0a 100%)' }}>
      <SectionMeta pageNum="05" />

      {/* Big headline */}
      <div id="contact-headline" style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}>
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', marginBottom: '1.5rem' }}>Contact</p>

        {["Let's work", 'together'].map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <span className="contact-word" style={{
              display: 'block',
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.95,
              color: '#fff',
              paddingBottom: '0.05em',
            }}>
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="contact-body" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }} id="contact-grid">
        <div style={{
          padding: 'clamp(3rem, 5vw, 5rem) clamp(1.2rem, 4vw, 3rem)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          gap: '3rem',
        }}>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: '40ch' }}>
            Open to new opportunities — full-time, contract, or freelance.
            Whether you need a designer, a developer, or both.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href="mailto:chihironitasaka@gmail.com" style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)', color: 'rgba(255,255,255,0.75)',
              borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'color 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              chihironitasaka@gmail.com
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/chihironitasaka" target="_blank" rel="noreferrer" style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.25rem)', color: 'rgba(255,255,255,0.75)',
              borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'color 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              linkedin.com/in/chihironitasaka
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right: CTA */}
        <div style={{
          padding: 'clamp(3rem, 5vw, 5rem) clamp(1.2rem, 4vw, 3rem)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '1.5rem',
        }}>
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase' }}>Available for work</p>
          <a href="mailto:chihironitasaka@gmail.com" style={{
            display: 'block', padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            background: '#fff', color: '#0a0a0a',
            textAlign: 'center',
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { e.target.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.target.style.opacity = '1'; }}>
            Say Hello →
          </a>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', letterSpacing: '0.06em' }}>
            778.241.1886 · Vancouver, BC
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.2rem, 4vw, 3rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
          © {new Date().getFullYear()} Chihiro Nitasaka
        </p>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
          Built with React · Three.js · GSAP
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #contact-grid { grid-template-columns: 1fr !important; }
          #contact-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
        }
      `}</style>
    </section>
  );
}
