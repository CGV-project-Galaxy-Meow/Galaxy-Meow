import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
    marsObject.position.set(100, 0, 0);  // Place the ground in the scene
    scene.add(marsObject);
    console.log('Ground model loaded and added to the scene');

    // Load the skull model after the ground
    loadModel('models/Crystal1.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.2, 0.2, 0.2);  // Set size of skull
        skullObject.position.set(45, 0.3, 4);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        //objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       // setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('models/space_crytal.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.2, 0.2, 0.2);  // Set size of skull
        skullObject.position.set(55, 0.4, 4);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        //objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       // setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('models/red_crystal.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.1, 0.1, 0.1);  // Set size of skull
        skullObject.position.set(40, -3, 4);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        //objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       // setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('models/GLB.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(26, 26, 26);  // Set size of skull
        skullObject.position.set(65, 0.3, 4);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        //objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       // setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('models/chest.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.4, 0.4, 0.4);  // Set size of skull
        skullObject.position.set(65, 1, 7);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        //objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       // setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

loadModel('models/model.glb', scene, controls, camera, (skullObject) => {
    skullObject.scale.set(1, 1, 1);  // Set size of skull
    skullObject.position.set(70, -4, 7);    // Position it relative to ground
    skullObject.name = 'skeleton';         // Set a name for identification

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('textures/red.png', (texture) => {
        skullObject.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texture;  // Apply texture to the material
                child.material.needsUpdate = true;
            }
        });
    }, undefined, function (error) {
        console.error('Error loading texture:', error);
    });

    // Add skull to the scene
    scene.add(skullObject);
    // objectsToRaycast.push(skullObject);  // Uncomment to add to raycasting array
    // setupRaycasting(camera, objectsToRaycast);  // Uncomment if needed
}, function (error) {
    console.error('Error loading skull model:', error);
});

}, function (error) {
    console.error('Error loading ground model:', error);
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
