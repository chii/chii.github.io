import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

/* ── bubble sprite texture (ring with soft glow) ────────────── */
function createBubbleTexture() {
  const S = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d');
  const c = S / 2;

  // soft outer glow
  const glow = ctx.createRadialGradient(c, c, S * 0.30, c, c, S * 0.50);
  glow.addColorStop(0, 'rgba(255,255,255,0.12)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, S, S);

  // thin crisp ring — tighter radius, narrower stroke
  ctx.beginPath();
  ctx.arc(c, c, S * 0.38, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = S * 0.04;
  ctx.stroke();

  // tiny highlight dot (top-left of bubble)
  ctx.beginPath();
  ctx.arc(c - S * 0.15, c - S * 0.15, S * 0.04, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.70)';
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

/* ── constants ──────────────────────────────────────────────── */
const COUNT          = 900;
const REPULSE_FORCE  = 0.18;

/* ── particle colour — edit to repaint bubbles ──────────────── */
// bg colour of the section (#1e1a50 → [0.118, 0.102, 0.314])
const BG  = [0.118, 0.102, 0.314];
// bubble colour at full brightness (bottom / mid rise)
const FG  = [0.95,  0.88,  1.00];

/* ── Particle field ─────────────────────────────────────────── */
function ParticleField({ mouseRef, mouseActiveRef }) {
  const pointsRef = useRef();
  const { size, camera } = useThree();

  /* Per-particle data (typed arrays — no GC pressure) */
  const data = useMemo(() => {
    const aspect = window.innerWidth / window.innerHeight;
    const halfH  = Math.tan((60 * Math.PI) / 360) * 6;
    const halfW  = halfH * aspect;

    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);   // per-bubble size
    const xBase     = new Float32Array(COUNT);   // centre-x each bubble drifts around
    const speed     = new Float32Array(COUNT);   // rise speed
    const phase     = new Float32Array(COUNT);   // wobble phase offset
    const wobble    = new Float32Array(COUNT);   // wobble amplitude
    const mvx       = new Float32Array(COUNT);   // mouse-repulsion residual vx
    const wasNear   = new Uint8Array(COUNT);     // 1 if bubble was in influence zone last frame

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 2 * halfW;
      const y = (Math.random() - 0.5) * 2 * halfH;

      positions[i * 3]     = xBase[i] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // larger bubbles rise faster (like real carbonation)
      const r   = Math.random();
      sizes[i]  = 0.03 + r * 0.18;   // wider range: tiny → large
      speed[i]  = 0.0005 + r * 0.003 + Math.random() * 0.001;
      phase[i]  = Math.random() * Math.PI * 2;
      wobble[i] = 0.01 + Math.random() * 0.05;
    }

    return { positions, colors, sizes, xBase, speed, phase, wobble, mvx, wasNear };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.elapsedTime;

    const aspect = size.width / size.height;
    const halfH  = Math.tan(((camera.fov * Math.PI) / 180) / 2) * camera.position.z;
    const halfW  = halfH * aspect;

    const mx = mouseRef.current.x * halfW;
    const my = mouseRef.current.y * halfH;

    const geo    = pointsRef.current.geometry;
    const posArr = geo.attributes.position.array;
    const colArr = geo.attributes.color.array;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      /* Current position */
      let px = posArr[i3];
      let py = posArr[i3 + 1];

      /* Rise upward */
      py += data.speed[i];

      /* Gentle horizontal sway like a real bubble */
      const sway = Math.sin(t * (0.8 + data.speed[i] * 20) + data.phase[i]) * data.wobble[i];
      px = data.xBase[i] + sway + data.mvx[i];

      /* Mouse repulsion — push with mvx while near; freeze xBase once on exit */
      const dx   = px - mx;
      const dy   = py - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const INFLUENCE = 1.6;
      if (dist < INFLUENCE && dist > 0.001) {
        const force = REPULSE_FORCE * Math.exp(-dist * dist * 1.2);
        data.mvx[i] += (dx / dist) * force;
        data.wasNear[i] = 1;
      } else if (data.wasNear[i]) {
        // just left zone → freeze xBase at current position, bubble keeps rising from here
        const sway = Math.sin(t * (0.8 + data.speed[i] * 20) + data.phase[i]) * data.wobble[i];
        data.xBase[i] = px - sway;
        data.mvx[i]   = 0;
        data.wasNear[i] = 0;
      }
      data.mvx[i] *= 0.82;

      /* Respawn: 50 % chance to rise from near cursor if mouse is active */
      if (py > halfH + 0.3) {
        py = -halfH - Math.random() * 0.5;
        if (mouseActiveRef.current && Math.random() < 0.5) {
          data.xBase[i] = mx + (Math.random() - 0.5) * 1.5;
        } else {
          data.xBase[i] = (Math.random() - 0.5) * 2 * halfW;
        }
        data.mvx[i] = 0;
        px = data.xBase[i];
      }

      posArr[i3]     = px;
      posArr[i3 + 1] = py;

      /* Colour: bright at bottom → fades to bg colour near top          *
       * yNorm: 0 = bottom of screen, 1 = top                            *
       * fadeZone: opacity ramps down from 0.65 → 1.0 (top 35% of rise) */
      const yNorm   = (py + halfH) / (2 * halfH);                    // 0 (bottom) → 1 (top)
      // fade starts from 10% height, reaches near-invisible by ~75% up
      const fadeAmt = Math.pow(Math.max(0, (yNorm - 0.10) / 0.90), 1.1);
      const bright  = 1 - fadeAmt;

      colArr[i3]     = BG[0] + (FG[0] - BG[0]) * bright;
      colArr[i3 + 1] = BG[1] + (FG[1] - BG[1]) * bright;
      colArr[i3 + 2] = BG[2] + (FG[2] - BG[2]) * bright;
    }

    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate    = true;
    material.uniforms.uTime.value       = t;
  });

  const texture = useMemo(() => createBubbleTexture(), []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTexture: { value: texture }, uTime: { value: 0 } },
    vertexShader: /* glsl */`
      attribute float size;
      attribute vec3  color;
      attribute float phase;
      varying vec3  vColor;
      varying float vAlpha;
      varying float vPhase;
      void main() {
        vColor = color;
        vAlpha = (color.r + color.g + color.b) / 3.0;
        vPhase = phase;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (900.0 / -mvPos.z);
        gl_Position  = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: /* glsl */`
      uniform sampler2D uTexture;
      uniform float     uTime;
      varying vec3  vColor;
      varying float vAlpha;
      varying float vPhase;
      void main() {
        // Distort gl_PointCoord slightly to morph the bubble shape
        vec2 uv = gl_PointCoord - 0.5;          // centre at origin
        float angle = atan(uv.y, uv.x);
        float r     = length(uv);
        // subtle 3-lobe wobble, unique per bubble via vPhase
        float wobble = 1.0 + 0.025 * sin(angle * 2.0 + uTime * 1.2 + vPhase);
        uv = (uv / max(r, 0.001)) * r * wobble + 0.5;  // back to 0-1

        vec4 tex = texture2D(uTexture, uv);
        if (tex.a < 0.01) discard;
        gl_FragColor = vec4(vColor, tex.a * vAlpha * 1.1);
      }
    `,
    transparent: true,
    depthWrite: false,
  }), [texture]);

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={COUNT} array={data.colors}    itemSize={3} />
        <bufferAttribute attach="attributes-size"     count={COUNT} array={data.sizes}     itemSize={1} />
        <bufferAttribute attach="attributes-phase"    count={COUNT} array={data.phase}     itemSize={1} />
      </bufferGeometry>
    </points>
  );
}

/* ── Hero component ─────────────────────────────────────────── */
export default function Hero() {
  const mouseRef       = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(false);
  const roleRef   = useRef();
  const labelRef  = useRef();
  const h1Ref     = useRef();
  const descRef   = useRef();
  const ctaRef    = useRef();
  const scrollRef = useRef();
  const lineRef   = useRef();
  const bgTextRef = useRef();

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x       =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y       = -(e.clientY / window.innerHeight - 0.5) * 2;
      mouseActiveRef.current   = true;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 1, ease: 'power4.inOut' })
      .fromTo(roleRef.current.querySelectorAll('.role-line'),
        { y: '100%' },
        { y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.1 }, '-=0.4')
      .fromTo(bgTextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=0.7')
      .fromTo(labelRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=1.0')
      .fromTo(h1Ref.current.querySelectorAll('.word'),
        { y: '110%' },
        { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.08 }, '-=0.4')
      .fromTo(descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo(ctaRef.current.children,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 }, '-=0.4')
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }, '-=0.1');

    gsap.to(scrollRef.current, {
      y: 10, repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut', delay: 1.8,
    });
  }, []);

  return (
    <section style={{
      position: 'relative', width: '100%', height: '100svh',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
      background: 'linear-gradient(145deg, #3b3070 0%, #2e2460 40%, #25205a 70%, #1e1a50 100%)',
    }}>

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 65% 40%, rgba(120,100,200,0.20) 0%, transparent 70%)',
      }} />

      {/* Three.js particle canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ParticleField mouseRef={mouseRef} mouseActiveRef={mouseActiveRef} />
        </Canvas>
      </div>

      {/* Top accent line */}
      <div ref={lineRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '1px', background: 'rgba(255,255,255,0.18)',
      }} />

      {/* Role — upper left, large */}
      <div
        ref={roleRef}
        style={{
          position: 'absolute',
          top: 'clamp(2.8rem, 8vh, 5rem)',
          left: 'clamp(1.5rem, 4vw, 4rem)',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {['UX Strategy', 'UI Architecture', 'Design Systems', 'Interaction Design', 'Visual Design'].map(line => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <span className="role-line" style={{
              display: 'block',
              fontSize: 'clamp(1.4rem, 2.3vw, 4.8rem)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1,
            }}>
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* Right meta — small, upper right */}
      <div style={{
        position: 'absolute',
        top: 'clamp(2.8rem, 5.5vh, 5rem)',
        right: 'clamp(1.5rem, 4vw, 4rem)',
        display: 'flex', gap: '2rem', alignItems: 'flex-start',
        pointerEvents: 'none',
      }}>
        {['+++++','01', 'Vancouver, BC', 'ntsk.design', '+++++'].map(t => (
          <span key={t} style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>
            {t}
          </span>
        ))}
      </div>

      {/* Large background name */}
      <div ref={bgTextRef} style={{
        position: 'absolute',
        bottom: 'clamp(4rem, 1vw, 8rem)',
        left: 0, right: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: 0,
        userSelect: 'none',
      }}>
        {['UI/UX', 'Designer', 'Front-End', 'Developer'].map(line => (
          <p key={line} style={{
            fontSize: 'clamp(4rem, 29vw, 16rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.98,
            whiteSpace: 'nowrap',
            color: 'rgba(255,255,255,0.06)',
            paddingLeft: 'clamp(1.5rem, 1vw, 4rem)',
          }}>
            {line}
          </p>
        ))}
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '40%', pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(24,20,64,0.96) 0%, transparent 100%)',
      }} />

      {/* Foreground content */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(1.5rem, 4vw, 4rem)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
      }}>
        <p ref={labelRef} style={{
          fontSize: '0.68rem', letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
          marginBottom: '1rem', opacity: 0,
        }}>
          UI/UX Designer | Front-end Developer
        </p>

        <h1 ref={h1Ref} style={{
          fontSize: 'clamp(4.5rem, 14.5vw, 13rem)',
          fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.9,
          color: '#fff',
        }}>
          {['Chihiro', 'Nitasaka'].map(word => (
            <span key={word} style={{ display: 'block', overflow: 'hidden' }}>
              <span className="word" style={{ display: 'block' }}>{word}</span>
            </span>
          ))}
        </h1>

        <div style={{
          display: 'flex', gap: '3rem', alignItems: 'flex-end',
          marginTop: 'clamp(1.5rem, 3vw, 2.5rem)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: 'clamp(1.2rem, 2vw, 2rem)',
          flexWrap: 'wrap',
        }}>
          <p ref={descRef} style={{
            fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
            color: 'rgba(255,255,255,0.45)', maxWidth: '42ch', lineHeight: 1.75, opacity: 0,
          }}>
            Bridging design and engineering — 10+ years crafting
            user-centred interfaces with pixel-perfect implementation.
          </p>

          <div ref={ctaRef} style={{ display: 'flex', gap: '0.85rem', flexShrink: 0, marginLeft: 'auto' }}>
            <a href="#work" style={{
              padding: '0.75rem 1.8rem',
              background: '#fff', color: '#1e1a50',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => { e.target.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.target.style.opacity = '1'; }}>
              View Work
            </a>
            <a href="#contact" style={{
              padding: '0.75rem 1.8rem',
              border: '1px solid rgba(255,255,255,0.28)', color: 'rgba(255,255,255,0.7)',
              fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em',
              textTransform: 'uppercase', transition: 'border-color 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{
        position: 'absolute', right: 'clamp(1.5rem, 4vw, 4rem)', //bottom: 'clamp(2rem, 5vw, 3.5rem)',
        top: '50%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', opacity: 0,
      }}>
        <div style={{ width: '1px', height: '50px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.35))' }} />
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
      </div>
    </section>
  );
}
