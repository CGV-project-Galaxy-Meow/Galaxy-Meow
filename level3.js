import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';
//import { setupRaycasting } from './raycasting.js';

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

const spaceTexture = new THREE.TextureLoader().load('textures/stars.jpg');
const spaceGeometry = new THREE.SphereGeometry(2000, 64, 64);
const spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });
const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(space);

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

// Function to load and apply texture to the moon model
const numAsteroids = 100; // Number of asteroids to load
const objectsToRaycast = [];

for (let i = 0; i < numAsteroids; i++) {
    loadModel('models/asteroids.glb', scene, controls, camera, (astroObject) => {
        // Randomize position
        const randomX = Math.random() * 100 - 50; // Random value between -50 and 50
        const randomY = Math.random() * 20;       // Random value between 0 and 20
        const randomZ = Math.random() * 100 - 50; // Random value between -50 and 50

        // Randomize rotation
        const randomRotationX = Math.random() * Math.PI * 2; // Random rotation between 0 and 2π
        const randomRotationY = Math.random() * Math.PI * 2;
        const randomRotationZ = Math.random() * Math.PI * 2;

        // Randomize scale
        const randomScale = 0.05 + Math.random() * 0.1; // Random scale between 0.05 and 0.15

        astroObject.scale.set(randomScale, randomScale, randomScale);
        astroObject.position.set(randomX, randomY, randomZ);
        astroObject.rotation.set(randomRotationX, randomRotationY, randomRotationZ);
        astroObject.name = 'asteroids_' + i;

        scene.add(astroObject);
        objectsToRaycast.push(astroObject);
    });
}

loadModel('models/Moon.glb', scene, controls, camera, (astroObject) => {
    astroObject.scale.set(50, 50, 50);
    astroObject.position.set(-300, 100, 4);
    astroObject.name = 'asteroids';
    scene.add(astroObject);
    objectsToRaycast.push(astroObject);



    //setupRaycasting(camera, objectsToRaycast);
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
