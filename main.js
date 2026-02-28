import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import * as CANNON from 'cannon-es';

// ==========================================
// 00. UI & ENTRANCE LOGIC (Highest Priority)
// ==========================================

let audioCtx;
function initAudio() {
    if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } 
        catch (e) { console.warn("Audio blocked"); }
    }
    if (audioCtx && audioCtx.state === 'suspended') { audioCtx.resume(); }
}

function playUIChirp() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

function playBassDrop() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 2);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 2);
}

// BIND THE ENTER BUTTON IMMEDIATELY
const enterBtn = document.getElementById('enter-btn');
const loader = document.getElementById('loader');

if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        playUIChirp();
        
        // Button flashes green on click
        enterBtn.innerText = "ACCESS GRANTED";
        enterBtn.style.background = "rgba(15, 157, 88, 0.2)";
        enterBtn.style.color = "#0f9d58";
        enterBtn.style.borderColor = "#0f9d58";
        enterBtn.style.boxShadow = "0 0 25px rgba(15, 157, 88, 0.5)";
        
        // Cinematic entrance
        setTimeout(() => {
            playBassDrop();
            const tl = gsap.timeline();
            tl.to(loader, { y: '-100%', duration: 1.5, ease: 'power4.inOut' })
              .to('.hero .word-wrapper', { y: '0%', duration: 1.2, ease: 'power4.out', stagger: 0.05 }, "-=0.5")
              .to('.hero .fade-up', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, "-=1")
              .fromTo('.main-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }, "-=1.2")
              .fromTo('.hud-panel', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }, "-=1.2");
        }, 400); 
    });
}

// KINETIC TYPOGRAPHY SETUP
document.querySelectorAll('.reveal-text').forEach(el => {
    if(el.querySelector('.text-outline')) return; 
    const text = el.innerText;
    el.innerHTML = '';
    const words = text.split('\n').join(' <br> ').split(' '); 
    words.forEach(word => {
        if(word === '<br>') { el.innerHTML += '<br>'; return; }
        el.innerHTML += `<span class="line-wrapper"><span class="word-wrapper">${word}</span></span> `;
    });
});

// ==========================================
// 01. TERMINAL & MODALS
// ==========================================
function playTypewriter() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400 + Math.random()*200, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

let keyBuffer = [];
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalText = document.getElementById('terminal-text');
const closeTerminal = document.getElementById('close-terminal');

const resumeData = `
> INITIALIZING OVERRIDE...
> ACCESS GRANTED.

[ IDENTITY ] : PRASHANT RAY
[ LOCATION ] : AHMEDABAD, IN
[ DESIGNATION ] : IMCA SCHOLAR // GLS UNIVERSITY
[ SEMESTER ] : 06

>> CORE ARSENAL FETCHED:
- FLUTTER & DART (HIGH-FIDELITY APPS)
- ANGULAR (ENTERPRISE UI)
- THREE.JS (WEBGL SPATIAL RENDERING)
- FIREBASE (REAL-TIME DB & AUTH)
- DAVINCI RESOLVE (MOTION EDITS)

>> LOG: DEMOTRADER APP // PAPER TRADING ARCHITECTURE
>> LOG: JEWELSMART // E-COMMERCE BACKEND
>> LOG: UNDOLIGHT // CONTENT CREATION // MOTION EDITS

> SYSTEM STABLE. WAITING FOR DIRECTIVE... <span class="typed-cursor"></span>
`;

window.addEventListener('keydown', (e) => {
    keyBuffer.push(e.key.toLowerCase());
    if(keyBuffer.length > 4) keyBuffer.shift();
    if(keyBuffer.join('') === 'void') { keyBuffer = []; triggerTerminal(); }
});

function triggerTerminal() {
    playBassDrop();
    terminalOverlay.style.display = 'flex';
    gsap.fromTo(terminalOverlay, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power4.out" });
    gsap.to('#webgl-canvas', { opacity: 0.1, duration: 0.2, yoyo: true, repeat: 5 }); 

    terminalText.innerHTML = '';
    let i = 0;
    function typeWriter() {
        if (i < resumeData.length) {
            terminalText.innerHTML = resumeData.substring(0, i + 1);
            if(resumeData.charAt(i) !== ' ' && resumeData.charAt(i) !== '\n') playTypewriter();
            i++; setTimeout(typeWriter, Math.random() * 30 + 10); 
        }
    }
    setTimeout(typeWriter, 1000);
}

if(closeTerminal) {
    closeTerminal.addEventListener('click', () => {
        playUIChirp();
        gsap.to(terminalOverlay, { opacity: 0, scale: 0.9, duration: 0.5, ease: "power2.in", onComplete: () => {
            terminalOverlay.style.display = 'none';
            terminalText.innerHTML = '';
            gsap.to('#webgl-canvas', { opacity: 1, duration: 0.5 }); 
        }});
    });
}

const catTrigger = document.getElementById('cat-trigger');
const summaryOverlay = document.getElementById('summary-overlay');
const closeSummary = document.getElementById('close-summary');

if(catTrigger) {
    catTrigger.addEventListener('click', () => {
        playUIChirp();
        summaryOverlay.style.display = 'flex';
        gsap.fromTo(summaryOverlay, { opacity: 0, backdropFilter: "blur(0px)" }, { opacity: 1, backdropFilter: "blur(20px)", duration: 0.4, ease: "power2.out" });
        gsap.fromTo('.summary-card', { y: 100, scale: 0.8, opacity: 0, rotationX: 10 }, { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 0.7, ease: "back.out(1.5)", delay: 0.1 });
    });
}

if(closeSummary) {
    closeSummary.addEventListener('click', () => {
        playUIChirp();
        gsap.to('.summary-card', { y: -50, scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in" });
        gsap.to(summaryOverlay, { opacity: 0, backdropFilter: "blur(0px)", duration: 0.4, delay: 0.1, onComplete: () => {
            summaryOverlay.style.display = 'none';
        }});
    });
}

// ==========================================
// 02. THREE.JS INIT & POST-PROCESSING 
// ==========================================
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030303, 0.04); 

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl-canvas'), alpha: true, antialias: false, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.1; 
bloomPass.strength = 1.6; 
bloomPass.radius = 0.8;

const FluidShader = {
    uniforms: { "tDiffuse": { value: null }, "uMouse": { value: new THREE.Vector2(0.5, 0.5) }, "uVelocity": { value: 0.0 }, "uTime": { value: 0.0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
        uniform sampler2D tDiffuse; uniform vec2 uMouse; uniform float uVelocity; uniform float uTime; varying vec2 vUv;
        void main() {
            vec2 uv = vUv; vec2 mouseUV = vec2((uMouse.x + 1.0) / 2.0, (uMouse.y + 1.0) / 2.0); float dist = distance(uv, mouseUV);
            if(dist < 0.3) { uv += sin(dist * 40.0 - uTime * 15.0) * 0.02 * uVelocity; }
            gl_FragColor = texture2D(tDiffuse, uv);
        }
    `
};
const ripplePass = new ShaderPass(FluidShader);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(ripplePass); 

// ==========================================
// 03. CUSTOM GLSL FLUID PARTICLES
// ==========================================
const particleShaderMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0.0 } },
    vertexShader: `
        uniform float uTime;
        void main() {
            vec3 pos = position;
            pos.y += sin(pos.x * 1.5 + uTime * 0.5) * 0.3; pos.z += cos(pos.y * 1.5 + uTime * 0.5) * 0.3;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); gl_PointSize = (15.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `void main() { float dist = distance(gl_PointCoord, vec2(0.5)); float strength = 0.05 / dist - 0.1; gl_FragColor = vec4(1.0, 0.4, 0.0, strength * 0.8); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
});

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 30; }
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMesh = new THREE.Points(particlesGeometry, particleShaderMaterial);
scene.add(particleMesh);

// ==========================================
// 04. CANNON.JS PHYSICS PLAYGROUND
// ==========================================
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
const physicsMeshes = []; const physicsBodies = [];

const groundBody = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane() });
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); groundBody.position.y = -1.5; 
world.addBody(groundBody);

const boxGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
const colors = [0xff6600, 0xffffff, 0xff0000, 0x00ff00];
for(let i=0; i<4; i++) {
    const mesh = new THREE.Mesh(boxGeo, new THREE.MeshBasicMaterial({ color: colors[i], wireframe: true }));
    scene.add(mesh); physicsMeshes.push(mesh);
    const body = new CANNON.Body({ mass: 1, shape: new CANNON.Box(new CANNON.Vec3(0.2, 0.2, 0.2)) });
    body.position.set((Math.random()-0.5)*2, 10 + i*2, -1.5); 
    world.addBody(body); physicsBodies.push(body);
}

// ==========================================
// 05. PERFORMANCE OPTIMIZED INTERACTIONS
// ==========================================
let mouse = { x: 0, y: 0 }; let lastMouse = { x: 0, y: 0 }; let mouseVelocity = 0;
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; 
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    const dx = mouse.x - lastMouse.x; const dy = mouse.y - lastMouse.y;
    mouseVelocity = Math.sqrt(dx*dx + dy*dy) * 5.0; 
    lastMouse.x = mouse.x; lastMouse.y = mouse.y;
    FluidShader.uniforms.uMouse.value.set(mouse.x, mouse.y);
});

document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect(); const centerX = rect.left + rect.width / 2; const centerY = rect.top + rect.height / 2;
        gsap.to(el, { x: (e.clientX - centerX) * 0.3, y: (e.clientY - centerY) * 0.3, duration: 0.4, ease: "power2.out" });
    });
    el.addEventListener('mouseenter', () => playUIChirp());
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" }));
});

gsap.ticker.add(() => {
    mouseVelocity = gsap.utils.interpolate(mouseVelocity, 0, 0.05); 
    FluidShader.uniforms.uVelocity.value = mouseVelocity;
});

// ==========================================
// 06. 3D ASSET, LIGHTING & SCROLL TIMELINES
// ==========================================
let model, wireframeModel;
const materialState = { wireframeMix: 0 }; 

const pLight = new THREE.PointLight(0xff6600, 100); 
pLight.position.set(5, 5, 5); 
scene.add(pLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.8)); 

function updateMaterials() {
    if(model && wireframeModel) {
        model.traverse(c => { if(c.isMesh) { c.material.opacity = 1 - materialState.wireframeMix; c.material.transparent = true; }});
        wireframeModel.traverse(c => { if(c.isMesh) c.material.opacity = materialState.wireframeMix; });
    }
}

try {
    const loaderAsset = new GLTFLoader(new THREE.LoadingManager());
    loaderAsset.load('luffy_hat/scene.gltf', (gltf) => {
        model = gltf.scene; 
        model.scale.set(1.1, 1.1, 1.1); 
        wireframeModel = model.clone();
        wireframeModel.traverse((child) => { if (child.isMesh) child.material = new THREE.MeshBasicMaterial({ color: 0xff6600, wireframe: true, transparent: true, opacity: 0 }); });
        scene.add(model); scene.add(wireframeModel);
        
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: "#about", start: "top 50%", 
            onEnter: () => { const hud = document.getElementById('dynamic-hud'); if(hud) hud.classList.add('scrolled'); },
            onLeaveBack: () => { const hud = document.getElementById('dynamic-hud'); if(hud) hud.classList.remove('scrolled'); }
        });

        const tl = gsap.timeline({ scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 }});

        tl.to(model.position, { x: -2.2, y: 0.2, z: -1, duration: 1.5 })
          .to(model.rotation, { y: Math.PI, z: 0.1, duration: 1.5 }, "<")
          .to(materialState, { wireframeMix: 1, duration: 1.5, onUpdate: updateMaterials }, "<")
          .to(model.position, { x: 0, y: 0.8, z: -1.5, duration: 1.5 })
          .to(model.rotation, { y: Math.PI * 1.5, x: 0.2, duration: 1.5 }, "<")
          .to(model.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1.5 }, "<")
          .call(() => { physicsBodies.forEach((b, i) => { b.position.set((Math.random()-0.5)*2, 5 + i*1.5, -1.5); b.velocity.set(0,0,0); }); })
          .to(model.position, { x: 2.2, y: 0.5, z: -1, duration: 1.5 })
          .to(model.rotation, { y: Math.PI * 2, x: -0.1, duration: 1.5 }, "<")
          .to(model.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1.5 }, "<")
          .to(materialState, { wireframeMix: 0, duration: 1.5, onUpdate: updateMaterials }, "<")
          .to(model.position, { x: 0, y: 0, z: -1.5, duration: 1.5 }) 
          .to(model.rotation, { x: 0.5, y: Math.PI * 2.5, duration: 1.5 }, "<") 
          .to(model.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 1.5 }, "<")
          .to(bloomPass, { strength: 0.35, duration: 1.5 }, "<") 
          .to(pLight, { intensity: 15, duration: 1.5 }, "<"); 

        document.querySelectorAll('.3d-card').forEach(card => {
            gsap.set(card, { rotationX: 60, y: 150, opacity: 0, transformOrigin: "center center" });
            const cardTl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 90%", end: "bottom 10%", scrub: 1 }});
            cardTl.to(card, { rotationX: 0, y: 0, opacity: 1, duration: 2, ease: "power1.out" }) 
                  .to(card, { rotationX: 0, y: 0, opacity: 1, duration: 4 }) 
                  .to(card, { rotationX: -60, y: -150, opacity: 0, duration: 2, ease: "power1.in" }); 
        });
        
        document.querySelectorAll('.section:not(.hero)').forEach(sec => {
            ScrollTrigger.create({
                trigger: sec, start: "top 70%",
                onEnter: () => {
                    gsap.to(sec.querySelectorAll('.word-wrapper'), { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.03 });
                    gsap.to(sec.querySelectorAll('.fade-up:not(.3d-card)'), { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.2 });
                }
            });
        });
    });
} catch(e) { console.error("3D Model load issue:", e); }

// ==========================================
// 07. CORE ANIMATION LOOP
// ==========================================
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const dt = clock.getDelta();
    
    particleShaderMaterial.uniforms.uTime.value = elapsedTime; 
    FluidShader.uniforms.uTime.value = elapsedTime;
    
    world.step(1/60, dt, 3);
    for(let i=0; i<physicsMeshes.length; i++) {
        physicsMeshes[i].position.copy(physicsBodies[i].position);
        physicsMeshes[i].quaternion.copy(physicsBodies[i].quaternion);
    }

    if (mouseVelocity > 0.5) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(physicsMeshes);
        if(intersects.length > 0) {
            const index = physicsMeshes.indexOf(intersects[0].object);
            if(index > -1) {
                physicsBodies[index].velocity.set(mouse.x * 5, 4, mouse.y * 5);
                physicsBodies[index].angularVelocity.set(Math.random()*5, Math.random()*5, 0);
            }
        }
    }

    if(model && wireframeModel) {
        model.rotation.y += 0.0015; model.position.y += Math.sin(elapsedTime * 1.5) * 0.0003; 
        wireframeModel.rotation.copy(model.rotation); wireframeModel.position.copy(model.position); wireframeModel.scale.copy(model.scale);
    }

    gsap.to('.bg-text', { x: -mouse.x * 25, y: -mouse.y * 25, duration: 1, ease: "power1.out" });

    composer.render();
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); composer.setSize(window.innerWidth, window.innerHeight); 
});