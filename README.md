# 🌟 Prashant Ray | 3D Interactive Portfolio

Welcome to the source code of my personal portfolio. This project isn't just a static webpage; it is a fully immersive, physics-driven digital experience built to showcase the intersection of solid software architecture and creative web rendering.

As a Creative Engineer, I wanted a space that proves that backend logic and frontend aesthetics can coexist beautifully.

## ✨ Key Features

* **Cinematic Entrance Sequence:** A stylized, delayed loader utilizing Lottie animations and Web Audio API for interactive sound design.
* **WebGL & 3D Rendering:** Powered by Three.js, featuring a dynamic 3D Straw Hat that elegantly animates and scales through the scene based on scroll position.
* **Custom GLSL Shaders:** An interactive background fluid shader that creates liquid ripples based on mouse/touch velocity.
* **Interactive Physics Sandbox:** Integrated `cannon-es` to render 3D wireframe cubes that react to gravity and user input (try swiping or throwing them!).
* **High-Performance Scrolling:** Complex, buttery-smooth scroll sequences and kinetic typography powered by GSAP and ScrollTrigger.
* **Dynamic Orbital Footer:** A custom-engineered, transparent footer that gracefully orbits the 3D model when the user reaches the end of the journey.
* **Hidden Easter Egg:** Type `V O I D` anywhere on the screen to initialize a hidden cyberpunk terminal. 

## 🛠️ The Tech Stack

This project relies on a lightweight, dependency-free core (no React, Vue, or build steps required), enhanced by industry-standard rendering libraries:

* **Core:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
* **3D Engine:** [Three.js](https://threejs.org/)
* **Physics Engine:** [Cannon-es](https://pmndrs.github.io/cannon-es/)
* **Animation & Scroll:** [GSAP (GreenSock)](https://gsap.com/) & ScrollTrigger
* **Vector Graphics:** Lottie-player

## 🚀 How to Run Locally

Because this project utilizes ES6 Modules (`type="module"`) and loads local 3D assets (`.gltf` files), **you cannot simply double-click the `index.html` file to view it.** Your browser's strict CORS policy will block the 3D models from loading. 

You must run the project through a local development server.

### The Easiest Way (VS Code)
1. Clone this repository to your local machine.
2. Open the project folder in **Visual Studio Code**.
3. Install the **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** extension.
4. Right-click on `index.html` and select **"Open with Live Server"**.
5. The site will automatically launch in your default browser.

### The Terminal Way (Python)
If you have Python installed, open your terminal, navigate to the project directory, and run:
```bash
python -m http.server 8000
Then, open your browser and navigate to http://localhost:8000.

📂 Project Structure
Plaintext
├── index.html                   # The main structural layout
├── index.css                    # Core styling and responsive orbital layouts
├── main.js                      # 3D initialization, shaders, physics, and GSAP timelines
├── luffy_hat/                   # 3D GLTF asset folder (Model & Textures)
├── *.json                       # Assorted Lottie animation files
└── portal.mp4                   # Background video asset for the navigation bar
🌐 Deployment
This is a static website and is heavily optimized for fast delivery. It can be easily deployed via drag-and-drop or Git integration on platforms like:

Netlify * Vercel

GitHub Pages

(Note: Ensure the luffy_hat folder and all .json files are kept exactly adjacent to the index.html file when deploying).

🤝 Let's Connect
I'm currently an Integrated MCA Scholar at GLS University, Ahmedabad. Whether you want to talk about cross-platform app architecture (Flutter/Firebase), WebGL, or just nerd out over anime and video editing, feel free to reach out.

LinkedIn: Prashant Ray

GitHub: @UniQguy

YouTube: undolight

Designed and engineered by Prashant Ray. © 2026 All Rights Reserved.
