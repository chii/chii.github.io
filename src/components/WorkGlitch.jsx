import { useEffect, useRef, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import { GlitchMesh } from './GlitchImage';

gsap.registerPlugin(ScrollTrigger);

// ── Glitch canvas panel ──────────────────────────────────────

function GlitchPanel({ imageUrl, hovered, bgColor }) {
  return (
    <div style={{ width: '100%', height: '100%', background: bgColor, minHeight: '400px' }}>
      <Canvas
        camera={{ position: [0, 0, 1.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Suspense fallback={null}>
          <GlitchMesh imageUrl={imageUrl} hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ── Project row ──────────────────────────────────────────────

function ProjectRow({ project, index }) {
  const rowRef  = useRef();
  const numRef  = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);

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

      gsap.fromTo(rowRef.current.querySelector('.glitch-panel'),
        { opacity: 0, x: isEven ? 40 : -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 78%' } });
    }, rowRef);
    return () => ctx.revert();
  }, [index, isEven]);

  return (
    <div
      ref={rowRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '85vh',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}
      className="project-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Text side */}
      <div
        ref={textRef}
        style={{
          padding: 'clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 5rem)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          order: isEven ? 0 : 1,
          position: 'relative',
          borderRight: isEven ? '1px solid var(--border)' : 'none',
          borderLeft: isEven ? 'none' : '1px solid var(--border)',
        }}
      >
        {/* Ghost number */}
        <span ref={numRef} style={{
          fontSize: 'clamp(5rem, 12vw, 10rem)',
          fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.1)',
          position: 'absolute',
          top: 'clamp(1.5rem, 3vw, 3rem)',
          right: isEven ? 'clamp(1.5rem, 3vw, 3rem)' : 'auto',
          left:  isEven ? 'auto' : 'clamp(1.5rem, 3vw, 3rem)',
          userSelect: 'none', pointerEvents: 'none',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <p style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: 'var(--accent)',
          textTransform: 'uppercase', marginBottom: '1.2rem' }}>
          {project.category}
        </p>

        <h3 style={{
          fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 700,
          letterSpacing: '-0.04em', lineHeight: 1.0, color: '#fff',
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
              padding: '0.3rem 0.7rem',
              border: '1px solid var(--border)',
              fontSize: '0.72rem', color: 'var(--muted)',
              letterSpacing: '0.04em',
            }}>{tag}</span>
          ))}
        </div>

        <Link to={`/work/${project.id}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#fff',
            borderBottom: '1px solid var(--accent)', paddingBottom: '0.3rem',
            width: 'fit-content',
            transition: 'color 0.2s, gap 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.gap = '1.1rem'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.gap = '0.75rem'; }}
        >
          View Case Study
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <p style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 3vw, 3rem)',
          right: isEven ? 'clamp(2rem, 5vw, 5rem)' : 'auto',
          left:  isEven ? 'auto' : 'clamp(2rem, 5vw, 5rem)',
          fontSize: '0.7rem', color: 'var(--muted2)',
        }}>
          {project.year}
        </p>
      </div>

      {/* Glitch image side */}
      <div
        className="glitch-panel"
        style={{ order: isEven ? 1 : 0, overflow: 'hidden', minHeight: '400px' }}
      >
        <GlitchPanel
          imageUrl={project.cover}
          hovered={hovered}
          bgColor={project.color}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .project-row { grid-template-columns: 1fr !important; min-height: unset !important; }
          .project-row > div { order: unset !important; border: none !important; border-bottom: 1px solid var(--border) !important; }
          .glitch-panel { min-height: 55vw !important; aspect-ratio: 16/9; }
        }
      `}</style>
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────

export default function Work() {
  const headRef = useRef();

  useEffect(() => {
    gsap.fromTo(headRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' } });
  }, []);

  return (
    <section id="work">
      <div ref={headRef} style={{
        padding: 'clamp(5rem, 10vw, 9rem) clamp(2rem, 5vw, 5rem) clamp(2rem, 4vw, 3rem)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--accent)',
            textTransform: 'uppercase', marginBottom: '1rem' }}>Selected Work</p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700,
            letterSpacing: '-0.04em', lineHeight: 1, color: '#fff',
          }}>Case Studies</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: '32ch', lineHeight: 1.7 }}>
          A selection of UI/UX and front-end projects across hospitality, real estate, and F&amp;B.
        </p>
      </div>

      {projects.map((p, i) => <ProjectRow key={p.id} project={p} index={i} />)}
    </section>
  );
}
