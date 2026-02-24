import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. SCENE SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('#webgl-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. LIGHTING (Cinematic Setup)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 2);
topLight.position.set(0, 10, 10);
scene.add(topLight);

// 3. LOAD MODEL & INITIALIZE ANIMATION
const loader = new GLTFLoader();
let model;

loader.load('luffy_hat/scene.gltf', (gltf) => {
    model = gltf.scene;
    model.scale.set(4, 4, 4);
    model.position.set(0, -1, 0);
    model.rotation.y = Math.PI / 4;
    scene.add(model);

    // After loading, trigger the scroll magic
    initScrollLogic();
});

// 4. THE WINNING MOVE: GSAP SCROLL TRIGGER
function initScrollLogic() {
    gsap.registerPlugin(ScrollTrigger);

    // Scene 1 to Scene 2: Rotation and Zoom
    gsap.to(model.rotation, {
        y: Math.PI * 2,
        scrollTrigger: {
            trigger: ".side-content",
            start: "top bottom",
            end: "top center",
            scrub: 1,
        }
    });

    // Scene 2 to Scene 3: Move model to the side for text
    gsap.to(model.position, {
        x: 2,
        z: -2,
        scrollTrigger: {
            trigger: ".side-content",
            start: "top center",
            end: "bottom center",
            scrub: 1,
        }
    });
}

// 5. ANIMATION LOOP & RESIZE
function animate() {
    requestAnimationFrame(animate);
    if (model) {
        // Idle floating movement
        model.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.1;
    }
    renderer.render(scene, camera);
}

camera.position.z = 5;
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});