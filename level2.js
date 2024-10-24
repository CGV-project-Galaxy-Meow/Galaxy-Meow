
//import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from './node_modules/three/build/three.module.min.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';

const clock = new THREE.Clock();


// Check if WebGL is supported
// if (isWebGLAvailable()) {
//     console.log('WebGL is supported');
// } else {
//     document.body.appendChild(getWebGLErrorMessage());
// }

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);  // Set a background color for visibility
// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  // Bright white light
directionalLight.position.set(0, 10, 10).normalize();  // Position the light
scene.add(directionalLight);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(50, 10, 2);   // Set an initial camera position

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);  // Attach renderer's canvas to body

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Handle window resize events
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load the texture
const textureLoader = new THREE.TextureLoader();
const marsTexture = textureLoader.load('textures/mars.jpeg', function (texture) {
    console.log('Texture loaded successfully');
}, undefined, function (err) {
    console.error('Error loading texture:', err);
});

// Function to load and apply texture to the moon model
loadModel('models/moonground.glb', scene, controls, camera, (marsObject) => {
    marsObject.traverse((child) => {
        if (child.isMesh) {
            // Apply the texture to the mesh material
            child.material.map = marsTexture;
            child.material.needsUpdate = true;  // Ensure the material updates with the new texture
        }
    });

    marsObject.scale.set(1000, 1, 500);  // Scale it large enough to simulate an infinite ground
    marsObject.position.set(100, 0, 0);  // Place the plane below the astronaut
    scene.add(marsObject);
    console.log('Model loaded and added to the scene');
}, function (error) {
    console.error('Error loading model:', error);
});

let astronaut;
let characterControls;
loadModel('public/models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
    astronaut = object;
    astronaut.scale.set(1.7, 1.7, 1.7);
    astronaut.position.set(50, 0, 5);
    astronaut.rotation.x = 0;


    astronaut.geometry?.computeBoundingBox();
    astronaut.boundingBox = new THREE.Box3().setFromObject(astronaut);


    characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');

    // Set camera initial position relative to astronaut
    const initialOffset = new THREE.Vector3(0, 10, -20); // Adjust as needed
    camera.position.copy(astronaut.position).add(initialOffset);

    // Set initial controls target
    controls.target.copy(astronaut.position);
});


const keysPressed = {};
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
    }
    keysPressed[event.key.toLowerCase()] = true;
}, false);

document.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false;
}, false);

// Render loop
function animate() {
    let delta = clock.getDelta();
    if (characterControls) {
        characterControls.update(delta, keysPressed);
    }





    if (astronaut) {
        // Compute the offset between camera and controls.target
        const cameraOffset = camera.position.clone().sub(controls.target);

        // Update controls target to astronaut's position
        controls.target.copy(astronaut.position);

        // Update camera's position to maintain the offset
        camera.position.copy(astronaut.position).add(cameraOffset);
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();  // Start the animation loop
