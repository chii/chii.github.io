import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const links = [
  { label: 'About', href: '/#about' },
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
];

export default function Nav() {
  const ref = useRef();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(ref.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const onHero = !scrolled;

  return (
    <nav ref={ref} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 clamp(1.2rem, 4vw, 3rem)',
      height: '48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: onHero ? 'rgba(10,10,10,0.0)' : 'var(--bg)',
      borderBottom: onHero ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)',
      transition: 'background 0.4s, border-color 0.4s',
    }}>
      <Link to="/" style={{
        fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: onHero ? '#fff' : 'var(--text)',
        transition: 'color 0.4s',
      }}>
        ntsk.design
      </Link>

      {/* Desktop links */}
      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }}
        className="nav-links-desktop">
        {links.map(l => (
          <li key={l.label}>
            <a href={l.href} style={{
              fontSize: '0.72rem', letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: onHero ? 'rgba(255,255,255,0.55)' : 'var(--muted)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = onHero ? '#fff' : 'var(--text)'}
              onMouseLeave={e => e.target.style.color = onHero ? 'rgba(255,255,255,0.55)' : 'var(--muted)'}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(o => !o)} aria-label="menu"
        style={{ display: 'none', flexDirection: 'column', gap: '5px', padding: '4px' }}
        className="hamburger">
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            display: 'block', width: '22px', height: '1px',
            background: onHero ? '#fff' : 'var(--text)',
            transformOrigin: 'center',
            transform: menuOpen
              ? i === 0 ? 'translateY(6px) rotate(45deg)' : i === 2 ? 'translateY(-6px) rotate(-45deg)' : 'scaleX(0)'
              : 'none',
            transition: 'transform 0.3s, opacity 0.3s',
          }} />
        ))}
      </button>

      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: '48px',
          background: 'var(--bg)', borderTop: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '2.5rem',
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em',
              color: 'var(--text)', textTransform: 'uppercase',
            }}
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-links-desktop { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
