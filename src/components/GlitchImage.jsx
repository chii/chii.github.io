import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Vector2 } from 'three';
import { easing } from 'maath';

// ── Shaders (ported from glitch-portfolio) ───────────────────

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uHover;
  uniform sampler2D uTexture;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // glitch strength — strong at rest, fades to 0 on hover
    float glitchStrength = (1.0 - uHover) * 0.035;

    // block-noise horizontal displacement
    float sliceY = floor(uv.y * 20.0);
    float noiseVal = random(vec2(sliceY, floor(uTime * 3.0)));
    float displacement = (noiseVal - 0.5) * glitchStrength * 2.0;
    vec2 distortedUv = uv + vec2(displacement, 0.0);

    // RGB chromatic aberration
    float rgbShift = glitchStrength * 0.3;
    float r = texture2D(uTexture, distortedUv + vec2(rgbShift,  0.0)).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, distortedUv - vec2(rgbShift,  0.0)).b;
    vec3 colorImage = vec3(r, g, b);

    // grayscale + compressed range so noise stays visible
    float brightness = dot(colorImage, vec3(0.299, 0.587, 0.114));
    float grayValue  = mix(0.12, 0.88, brightness);
    vec3  grayBase   = vec3(grayValue);

    // film-grain static noise
    float staticNoise = random(uv + mod(uTime, 10.0));
    vec3  noisyGray   = grayBase + (staticNoise - 0.5) * 0.18 * (1.0 - uHover);

    // blend: noisy-gray → full colour on hover
    vec3  finalColor  = mix(noisyGray, colorImage, uHover);
    float alpha       = texture2D(uTexture, distortedUv).a;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ── Mesh ─────────────────────────────────────────────────────

export function GlitchMesh({ imageUrl, hovered }) {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, imageUrl);

  // fit the plane to cover the viewport (object-fit: cover equivalent)
  const scale = useMemo(() => {
    if (!texture.image) return [1, 1, 1];
    // plane is 2×2 units; camera fov ~50, z=2 → visible height ≈ 2*tan(25°)*2 ≈ 1.86
    // we just keep aspect and let the canvas clip the rest
    const aspect = texture.image.width / texture.image.height;
    return [aspect, 1, 1];
  }, [texture]);

  const uniforms = useMemo(() => ({
    uTexture:    { value: texture },
    uTime:       { value: 0 },
    uHover:      { value: 0 },
    uResolution: { value: new Vector2(
      texture.image?.width  ?? 1,
      texture.image?.height ?? 1,
    )},
  }), [texture]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.material.uniforms.uTime.value += delta;
    easing.damp(
      meshRef.current.material.uniforms.uHover,
      'value',
      hovered ? 1.0 : 0.0,
      0.25,
      delta,
    );
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
