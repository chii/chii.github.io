import '../../App.css';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";

class ThreeCanvas extends Component {
    constructor(props) {
        super(props);
        this.isAnimating = true;
        this.animationId = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        this.boxes = null;
    }

    componentDidMount() {
        const self = this;

        // Get container
        this.container = document.getElementById('threejs');

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null;

        // Create boxes
        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshStandardMaterial({color:new THREE.Color('skyblue')});

        const box = new THREE.Mesh(geometry, material);
        this.scene.add(box);

        const box2 = new THREE.Mesh(geometry, material);
        box2.position.x = -1.5;
        this.scene.add(box2);

        const box3 = new THREE.Mesh(geometry, material);
        box3.position.x = 1.5;
        this.scene.add(box3);

        this.boxes = { box, box2, box3 };

        // Light
        const light = new THREE.DirectionalLight();
        light.position.set(0,1,2);
        this.scene.add(light);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.offsetWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 2;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(this.container.offsetWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // Resize handler
        window.addEventListener('resize', this.handleResize);

        // Start animation
        this.animate();
    }

    componentWillUnmount() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.handleResize);
        if (this.renderer && this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
    }

    handleResize = () => {
        if (!this.camera || !this.renderer || !this.container) return;

        this.camera.aspect = this.container.offsetWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.clientHeight);
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);

        if (this.isAnimating && this.boxes) {
            this.boxes.box.rotation.y += 0.01;
            this.boxes.box2.rotation.y -= 0.01;
            this.boxes.box3.rotation.y -= 0.01;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    start = () => {
        this.isAnimating = true;
        if (this.props.onAnimationChange) {
            this.props.onAnimationChange(true);
        }
    }

    stop = () => {
        this.isAnimating = false;
        if (this.props.onAnimationChange) {
            this.props.onAnimationChange(false);
        }
    }

    render() {
        return (
            <div id="threejs" />
        )
    }
}

export default ThreeCanvas;
