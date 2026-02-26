import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 1. SNAPPY CURSOR
window.addEventListener('mousemove', (e) => {
    gsap.to('.cursor', { x: e.clientX - 6, y: e.clientY - 6, duration: 0.05 });
});

// 2. LOADER LOGIC
const loadManager = new THREE.LoadingManager();
loadManager.onProgress = (url, loaded, total) => { document.querySelector('.progress-fill').style.width = (loaded/total*100)+'%'; };
loadManager.onLoad = () => { 
    gsap.to('.progress-bar', { opacity: 0 }); 
    document.querySelector('#enter-btn').style.display = 'block'; 
};
document.querySelector('#enter-btn').addEventListener('click', () => {
    gsap.to('#loader', { y: '-100%', duration: 1.5, ease: 'expo.inOut' });
});

// 3. 3D ASSET & SCROLL ORCHESTRATION
const loader = new GLTFLoader(loadManager);
let model;
loader.load('luffy_hat/scene.gltf', (gltf) => {
    model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);
    
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 }});

    // CHAPTER 1: Spin & Move Left for 'About'
    tl.to(model.position, { x: -1.8, y: 0.5, z: -1, duration: 1 })
      .to(model.rotation, { y: Math.PI, duration: 1 }, "<")
    
    // CHAPTER 2: Zoom in & Move Right for 'Archive'
      .to(model.position, { x: 1.8, y: -0.5, z: 1, duration: 1 })
      .to(model.rotation, { y: Math.PI * 2, x: 0.5, duration: 1 }, "<")
    
    // CHAPTER 3: Center & Scale up for 'Status'
      .to(model.position, { x: 0, y: 0, z: 2, duration: 1 })
      .to(model.scale, { x: 2, y: 2, z: 2, duration: 1 }, "<");
});

// 4. ENVIRONMENT
scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const pLight = new THREE.PointLight(0xff6600, 50);
pLight.position.set(5, 5, 5);
scene.add(pLight);

function animate() {
    requestAnimationFrame(animate);
    if(model) {
        model.rotation.y += 0.002;
        model.position.y += Math.sin(Date.now()*0.001)*0.0005;
    }
    renderer.render(scene, camera);
}
camera.position.z = 6;
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});