import { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);
  const heroRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!project) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'power3.out', delay: 0.1 });

      gsap.fromTo(contentRef.current.querySelectorAll('.reveal'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 80%' } });
    });
    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Project not found.</p>
        <Link to="/" style={{ color: 'var(--accent)' }}>← Back home</Link>
      </div>
    );
  }

  const currentIndex = projects.findIndex(p => p.id === id);
  const prevProject = projects[currentIndex - 1];
  const nextProject = projects[currentIndex + 1];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Back link */}
      <div style={{ padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 5vw, 5rem)',
        paddingTop: '5.5rem' }}>
        <Link to="/#work" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.04em',
          textTransform: 'uppercase', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All Work
        </Link>
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{
        padding: 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 5vw, 5rem)',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.18em', color: project.accent,
          textTransform: 'uppercase', marginBottom: '1.2rem', opacity: 0 }}>
          {project.category}
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 700, letterSpacing: '-0.04em',
          lineHeight: 1, color: '#fff', marginBottom: '1rem', opacity: 0 }}>
          {project.title}
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: 'var(--muted)', maxWidth: '60ch',
          lineHeight: 1.7, opacity: 0 }}>
          {project.subtitle}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '3rem', marginTop: '2.5rem', flexWrap: 'wrap', opacity: 0 }}>
          {[
            { l: 'Year', v: project.year },
            { l: 'Role', v: project.role },
          ].map(m => (
            <div key={m.l}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--muted)',
                textTransform: 'uppercase', marginBottom: '0.3rem' }}>{m.l}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{m.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cover image */}
      <div style={{
        margin: '0 clamp(1.5rem, 5vw, 5rem) 0',
        background: project.color,
        borderRadius: '4px',
        overflow: 'hidden',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <img src={project.cover} alt={project.title}
          style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', objectPosition: 'top' }} />
      </div>

      {/* Content */}
      <div ref={contentRef} style={{
        maxWidth: '780px', margin: '0 auto',
        padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 5vw, 5rem)',
        display: 'flex', flexDirection: 'column', gap: '3rem',
      }}>
        {/* Overview */}
        <div className="reveal">
          <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', color: project.accent,
            textTransform: 'uppercase', marginBottom: '1.2rem' }}>Overview</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8 }}>
            {project.overview}
          </p>
        </div>

        {/* Challenge */}
        <div className="reveal" style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', color: project.accent,
            textTransform: 'uppercase', marginBottom: '1.2rem' }}>Challenge</h2>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.8 }}>
            {project.challenge}
          </p>
        </div>

        {/* Process */}
        <div className="reveal" style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', color: project.accent,
            textTransform: 'uppercase', marginBottom: '1.5rem' }}>Process</h2>
          <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {project.process.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: '28px', height: '28px',
                  border: `1px solid ${project.accent}`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', color: project.accent, fontWeight: 600,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.75, paddingTop: '3px' }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Outcome */}
        <div className="reveal" style={{
          paddingTop: '2rem', paddingBottom: '2rem',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', color: project.accent,
            textTransform: 'uppercase', marginBottom: '1.2rem' }}>Outcome</h2>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.8 }}>
            {project.outcome}
          </p>
        </div>
      </div>

      {/* Image gallery */}
      {project.images.length > 1 && (
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 5rem) clamp(3rem, 6vw, 6rem)',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
        }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.18em', color: project.accent,
            textTransform: 'uppercase', marginBottom: '0.5rem' }}>Gallery</p>
          {project.images.map((img, i) => (
            <div key={i} style={{
              background: project.color, borderRadius: '4px', overflow: 'hidden',
              border: '1px solid var(--border)',
            }}>
              <img src={img.src} alt={img.caption}
                style={{ width: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              {img.caption && (
                <p style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prev / Next */}
      <div style={{
        borderTop: '1px solid var(--border)',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        {prevProject ? (
          <Link to={`/work/${prevProject.id}`} style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 5vw, 5rem)',
            borderRight: '1px solid var(--border)',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: '0.5rem' }}>← Previous</p>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{prevProject.title}</p>
          </Link>
        ) : <div />}

        {nextProject ? (
          <Link to={`/work/${nextProject.id}`} style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 5vw, 5rem)',
            textAlign: 'right',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: '0.5rem' }}>Next →</p>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{nextProject.title}</p>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
