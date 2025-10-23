import React, { Component } from "react";
import * as THREE from "three";
import indexImage from '../../assets/images/mockup/resortcom/index-1.png';
import pageImage from '../../assets/images/mockup/resortcom/page-1.png';

class MockupViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentImageIndex: 0
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        this.plane = null;
        this.animationId = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseUV = new THREE.Vector2(-10, -10); // Start off-screen
        this.scrollY = 0;
        this.maxScroll = 0;

        // Define available mockup images
        this.images = [
            {
                name: "Resortcom - Index",
                path: indexImage
            },
            {
                name: "Resortcom - Page",
                path: pageImage
            }
        ];
    }

    componentDidMount() {
        this.initThree();
        this.loadTexture(this.state.currentImageIndex);
    }

    componentWillUnmount() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('mousemove', this.handleMouseMove);
        if (this.container) {
            this.container.removeEventListener('wheel', this.handleWheel);
        }
        if (this.renderer && this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
    }

    initThree = () => {
        // Get container
        this.container = document.getElementById('threejs-mockup');

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null;

        // Camera - use orthographic for full screen display
        const aspect = this.container.offsetWidth / this.container.clientHeight;
        this.camera = new THREE.OrthographicCamera(
            -aspect, aspect,
            1, -1,
            0.1, 1000
        );
        this.camera.position.z = 1;

        // Light - brighter for better image display
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.offsetWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // Resize handler
        window.addEventListener('resize', this.handleResize);

        // Mouse move handler
        window.addEventListener('mousemove', this.handleMouseMove);

        // Wheel handler for scrolling
        console.log('Adding wheel event listener to container');
        this.container.addEventListener('wheel', this.handleWheel, { passive: false });

        // Start animation
        this.animate();
    }

    loadTexture = (index) => {
        // Remove old plane if exists
        if (this.plane) {
            this.scene.remove(this.plane);
            if (this.plane.geometry) {
                this.plane.geometry.dispose();
            }
            if (this.plane.material) {
                if (this.plane.material.uniforms && this.plane.material.uniforms.uTexture) {
                    this.plane.material.uniforms.uTexture.value.dispose();
                }
                if (this.plane.material.map) {
                    this.plane.material.map.dispose();
                }
                this.plane.material.dispose();
            }
            this.plane = null;
        }

        console.log('Loading texture:', this.images[index].name, this.images[index].path);

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            this.images[index].path,
            (texture) => {
                console.log('Texture loaded successfully:', texture);
                console.log('Image dimensions:', texture.image.width, 'x', texture.image.height);
                console.log('Container dimensions:', this.container.offsetWidth, 'x', this.container.offsetHeight);

                // Calculate aspect ratio
                const imageAspect = texture.image.width / texture.image.height;
                const containerAspect = this.container.offsetWidth / this.container.offsetHeight;

                // Calculate plane size - always fit to width, let height extend
                // Orthographic camera has range from -aspect to +aspect horizontally and -1 to +1 vertically
                const planeWidth = containerAspect * 2 * 0.9; // 90% to add some padding
                const planeHeight = planeWidth / imageAspect;

                // Viewport height in orthographic coordinates
                const viewportHeight = 2;

                // Calculate scroll range
                if (planeHeight > viewportHeight) {
                    this.maxScroll = (planeHeight - viewportHeight) / 2;
                } else {
                    this.maxScroll = 0;
                }

                this.scrollY = this.maxScroll; // Start from top (camera looks down)

                console.log('Container aspect:', containerAspect);
                console.log('Image aspect:', imageAspect);
                console.log('Plane size:', planeWidth, 'x', planeHeight);
                console.log('Viewport height:', viewportHeight);
                console.log('Max scroll:', this.maxScroll);

                // Create particle system based on image pixels
                const imgWidth = texture.image.width;
                const imgHeight = texture.image.height;
                const pixelStep = 3; // Sample every N pixels for performance
                const particleCount = Math.floor((imgWidth / pixelStep) * (imgHeight / pixelStep));

                console.log('Creating particle system:', particleCount, 'particles');

                // Create buffer geometry for particles
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(particleCount * 3);
                const uvs = new Float32Array(particleCount * 2);
                const colors = new Float32Array(particleCount * 3);

                // Sample image pixels
                const canvas = document.createElement('canvas');
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(texture.image, 0, 0);
                const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);

                let index = 0;
                for (let y = 0; y < imgHeight; y += pixelStep) {
                    for (let x = 0; x < imgWidth; x += pixelStep) {
                        // Calculate position in 3D space
                        const u = x / imgWidth;
                        const v = 1.0 - (y / imgHeight);

                        const posX = (u - 0.5) * planeWidth;
                        const posY = (v - 0.5) * planeHeight;

                        positions[index * 3] = posX;
                        positions[index * 3 + 1] = posY;
                        positions[index * 3 + 2] = 0;

                        uvs[index * 2] = u;
                        uvs[index * 2 + 1] = v;

                        // Get pixel color
                        const pixelIndex = (y * imgWidth + x) * 4;
                        colors[index * 3] = imageData.data[pixelIndex] / 255;
                        colors[index * 3 + 1] = imageData.data[pixelIndex + 1] / 255;
                        colors[index * 3 + 2] = imageData.data[pixelIndex + 2] / 255;

                        index++;
                    }
                }

                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                console.log('Particle system created with', index, 'particles');

                // Custom shader material for point particles
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        uMouse: { value: this.mouseUV },
                        uRadius: { value: 0.1 },
                        uDisplacement: { value: 1.2 },
                        uPointSize: { value: 2.5 }
                    },
                    vertexShader: `
                        uniform vec2 uMouse;
                        uniform float uRadius;
                        uniform float uDisplacement;
                        uniform float uPointSize;

                        attribute vec3 color;
                        varying vec3 vColor;
                        varying float vDisplace;

                        float random(vec2 st) {
                            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                        }

                        void main() {
                            vColor = color;
                            vec3 pos = position;

                            float dist = distance(uv, uMouse);

                            if (dist < uRadius) {
                                float influence = 1.0 - (dist / uRadius);
                                influence = pow(influence, 1.5);

                                float randX = random(uv) * 2.0 - 1.0;
                                float randY = random(uv + 100.0) * 2.0 - 1.0;
                                float randZ = random(uv + 200.0) * 2.0 - 1.0;

                                float angle = random(uv + 300.0) * 6.28318;
                                vec2 randomDir = vec2(cos(angle), sin(angle));

                                pos.xy += randomDir * influence * uDisplacement;
                                pos.z += influence * uDisplacement * randZ * 2.0;

                                vDisplace = influence;
                            } else {
                                vDisplace = 0.0;
                            }

                            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                            gl_PointSize = uPointSize * (1.0 + vDisplace * 2.0);
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `,
                    fragmentShader: `
                        varying vec3 vColor;
                        varying float vDisplace;

                        void main() {
                            // Create circular point
                            vec2 center = gl_PointCoord - vec2(0.5);
                            float dist = length(center);
                            if (dist > 0.5) discard;

                            float alpha = 1.0 - vDisplace * 0.6;
                            vec3 color = vColor * (1.0 + vDisplace * 0.3);

                            gl_FragColor = vec4(color, alpha);
                        }
                    `,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });

                this.plane = new THREE.Points(geometry, material);
                this.plane.position.set(0, 0, 0); // Keep plane centered
                this.scene.add(this.plane);

                // Move camera to initial scroll position
                this.camera.position.y = this.scrollY;

                console.log('Plane added to scene:', this.plane);
                console.log('Camera position Y:', this.camera.position.y);
                console.log('Total objects in scene:', this.scene.children.length);
            },
            undefined,
            (error) => {
                console.error('Error loading texture:', error);
            }
        );
    }

    handleResize = () => {
        if (!this.camera || !this.renderer || !this.container) return;

        const aspect = this.container.offsetWidth / this.container.clientHeight;
        this.camera.left = -aspect;
        this.camera.right = aspect;
        this.camera.top = 1;
        this.camera.bottom = -1;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.clientHeight);
    }

    handleWheel = (event) => {
        console.log('Wheel event triggered! deltaY:', event.deltaY, 'plane exists:', !!this.plane, 'maxScroll:', this.maxScroll);

        if (!this.plane) {
            console.log('No plane - exiting');
            return;
        }

        if (this.maxScroll === 0) {
            console.log('maxScroll is 0 - image fits in viewport, no scrolling needed');
            return;
        }

        // Prevent page scroll only when we're handling the scroll
        if (event.cancelable) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Update scroll position (positive deltaY = scroll down = move view down)
        const scrollSpeed = 0.002;
        const oldScrollY = this.scrollY;
        this.scrollY += event.deltaY * scrollSpeed;

        // Clamp scroll to valid range (from -maxScroll at bottom to +maxScroll at top)
        this.scrollY = Math.max(-this.maxScroll, Math.min(this.maxScroll, this.scrollY));

        // Update camera position instead of plane
        this.camera.position.y = this.scrollY;

        console.log('Scroll updated! Old Y:', oldScrollY.toFixed(3), 'New Y:', this.scrollY.toFixed(3), 'Range:', -this.maxScroll.toFixed(3), 'to', this.maxScroll.toFixed(3));
    }

    handleMouseMove = (event) => {
        if (!this.container || !this.plane) return;

        // Get mouse position in normalized device coordinates (-1 to +1)
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // For Points, calculate UV directly from screen position
        // Convert normalized device coords to UV space (0-1)
        const uv = new THREE.Vector2(
            (this.mouse.x + 1) / 2,
            (this.mouse.y + 1) / 2
        );

        this.mouseUV.copy(uv);

        // Update shader uniform
        if (this.plane.material.uniforms) {
            this.plane.material.uniforms.uMouse.value.copy(uv);
        }
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);

        // Optional: Add subtle rotation or animation
        if (this.plane) {
            // this.plane.rotation.y += 0.001;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    handleNext = () => {
        const nextIndex = (this.state.currentImageIndex + 1) % this.images.length;
        this.setState({ currentImageIndex: nextIndex });
        this.loadTexture(nextIndex);
    }

    handlePrev = () => {
        const prevIndex = this.state.currentImageIndex === 0
            ? this.images.length - 1
            : this.state.currentImageIndex - 1;
        this.setState({ currentImageIndex: prevIndex });
        this.loadTexture(prevIndex);
    }

    render() {
        const { currentImageIndex } = this.state;
        const currentImage = this.images[currentImageIndex];

        return (
            <div
                style={{
                    position: 'fixed',
                    top: '70px',
                    left: '70px',
                    right: '70px',
                    bottom: '70px',
                    width: 'calc(100% - 140px)',
                    height: 'calc(100vh - 140px)',
                    zIndex: 1,
                    pointerEvents: 'auto'
                }}
                onWheel={this.handleWheel}
            >
                <div id="threejs-mockup" style={{ width: '100%', height: '100%' }} />

                {/* Navigation Controls */}
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '15px 25px',
                    borderRadius: '30px',
                    backdropFilter: 'blur(10px)',
                    zIndex: 10,
                    pointerEvents: 'auto'
                }}>
                    <button
                        onClick={this.handlePrev}
                        style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s',
                        }}
                        onMouseOver={(e) => e.target.style.background = 'white'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
                    >
                        ←
                    </button>

                    <div style={{
                        color: 'white',
                        fontSize: '14px',
                        minWidth: '200px',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        {currentImage.name}
                        <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.7 }}>
                            {currentImageIndex + 1} / {this.images.length}
                        </div>
                    </div>

                    <button
                        onClick={this.handleNext}
                        style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s',
                        }}
                        onMouseOver={(e) => e.target.style.background = 'white'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
                    >
                        →
                    </button>
                </div>
            </div>
        );
    }
}

export default MockupViewer;
