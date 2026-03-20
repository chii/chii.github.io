import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';

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

function ProjectRow({ project, index }) {
  const rowRef  = useRef();
  const imgRef  = useRef();
  const numRef  = useRef();
  const textRef = useRef();

  const isEven = index % 2 === 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(numRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 80%' } });

      gsap.fromTo(textRef.current.children,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.09, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 75%' } });

      gsap.fromTo(imgRef.current,
        { yPercent: 8, scale: 1.08 },
        { yPercent: -8, scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rowRef.current, start: 'top bottom', end: 'bottom top', scrub: true,
          } });

      gsap.fromTo(imgRef.current.parentElement,
        { opacity: 0, x: isEven ? 40 : -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 78%' } });
    }, rowRef);
    return () => ctx.revert();
  }, [index, isEven]);

  return (
    <div ref={rowRef} style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '85vh',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
    }} className="project-row">

      {/* Text side */}
      <div ref={textRef} style={{
        padding: 'clamp(3rem, 6vw, 6rem) clamp(1.2rem, 4vw, 3rem)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        order: isEven ? 0 : 1,
        position: 'relative',
        borderRight: isEven ? '1px solid var(--border)' : 'none',
        borderLeft: isEven ? 'none' : '1px solid var(--border)',
        background: 'var(--bg)',
      }}>
        {/* Big number */}
        <span ref={numRef} style={{
          fontSize: 'clamp(5rem, 12vw, 10rem)',
          fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(10,10,10,0.08)',
          position: 'absolute',
          top: 'clamp(1.5rem, 3vw, 3rem)',
          right: isEven ? 'clamp(1.5rem, 3vw, 3rem)' : 'auto',
          left: isEven ? 'auto' : 'clamp(1.5rem, 3vw, 3rem)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: '1.2rem' }}>
          {project.category}
        </p>

        <h3 style={{
          fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 700,
          letterSpacing: '-0.04em', lineHeight: 1.0, color: 'var(--text)',
          marginBottom: '1.2rem',
        }}>
          {project.title}
        </h3>

        <p style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', color: 'var(--muted)',
          maxWidth: '38ch', lineHeight: 1.75, marginBottom: '2.5rem' }}>
          {project.overview.slice(0, 180)}…
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2.5rem' }}>
          {project.tags.slice(0, 4).map(tag => (
            <span key={tag} style={{
              padding: '0.25rem 0.6rem',
              border: '1px solid var(--border)',
              fontSize: '0.72rem', color: 'var(--muted)',
              letterSpacing: '0.04em',
            }}>{tag}</span>
          ))}
        </div>

        <Link to={`/work/${project.id}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--text)',
            borderBottom: '1px solid var(--text)', paddingBottom: '0.3rem',
            width: 'fit-content',
            transition: 'opacity 0.2s, gap 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.gap = '1.1rem'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.gap = '0.75rem'; }}>
          View Case Study
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <p style={{ position: 'absolute', bottom: 'clamp(1.5rem, 3vw, 3rem)',
          right: isEven ? 'clamp(1.2rem, 4vw, 3rem)' : 'auto',
          left: isEven ? 'auto' : 'clamp(1.2rem, 4vw, 3rem)',
          fontSize: '0.65rem', color: 'var(--muted2)', letterSpacing: '0.08em' }}>
          {project.year}
        </p>
      </div>

      {/* Image side */}
      <div style={{
        overflow: 'hidden', order: isEven ? 1 : 0,
        background: '#1a1a1a', minHeight: '400px',
      }}>
        <img ref={imgRef} src={project.cover} alt={project.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
            display: 'block', willChange: 'transform',
            filter: 'grayscale(20%)',
          }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .project-row { grid-template-columns: 1fr !important; min-height: unset !important; }
          .project-row > div { order: unset !important; border: none !important; border-bottom: 1px solid var(--border) !important; }
          .project-row > div:last-child { min-height: 55vw !important; }
        }
      `}</style>
    </div>
  );
}

export default function Work() {
  const headRef = useRef();

  useEffect(() => {
    gsap.fromTo(headRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' } });
  }, []);

  return (
    <section id="work" style={{ background: 'var(--bg)' }}>
      <SectionMeta pageNum="03" />

      {/* Section header */}
      <div ref={headRef} style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--muted)',
            textTransform: 'uppercase', marginBottom: '1rem' }}>Selected Work</p>
          <h2 style={{
            fontSize: 'clamp(3.5rem, 10vw, 9rem)', fontWeight: 700,
            letterSpacing: '-0.045em', lineHeight: 0.95, color: 'var(--text)',
          }}>Case Studies</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: '32ch', lineHeight: 1.7 }}>
          A selection of UI/UX and front-end projects across hospitality, real estate, and F&amp;B.
        </p>
      </div>

      {/* Project rows */}
      {projects.map((p, i) => <ProjectRow key={p.id} project={p} index={i} />)}
    </section>
  );
}
