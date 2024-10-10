import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';  // Import character controls


// Variables for health and timer
let health = 100;
let healthElement = document.getElementById('healthBar');
let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');

// Variables for astronaut model
let astronaut;
let initialAstronautPosition = new THREE.Vector3(3, 0, 0);  // Default initial position

// Function to decrease health over time
function decreaseHealth() {
    const healthInterval = setInterval(() => {
      if (health > 0) {
        health -= 1;
        healthElement.innerHTML = `Oxygen: ${health}/100`;
      } else {
        clearInterval(healthInterval);
        showDeathMessage();
      }
    }, 3000); // Decrease health every 3 seconds
  }
  
// Start health timer
decreaseHealth();

// Show Exit Menu on Escape Key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (exitMenu.style.display === 'none') {
        exitMenu.style.display = 'block'; // Show menu
      } else {
        exitMenu.style.display = 'none'; // Hide menu
      }
    }
});

// Show "You Died" message
function showDeathMessage() {
    deathMessage.style.display = 'block';
}

// Restart Level
function restartLevel() {
    health = 100; // Reset health
    healthElement.innerHTML = `Oxygen: ${health}/100`;
    deathMessage.style.display = 'none';
    exitMenu.style.display = 'none';
    decreaseHealth(); // Restart health decrease
    
    // Reset astronaut position
    if (astronaut) {
        astronaut.position.copy(initialAstronautPosition);
    }
}

// Event Listeners for buttons
document.getElementById('restartButton').addEventListener('click', restartLevel);
document.getElementById('restartButtonDeath').addEventListener('click', restartLevel);

// Event Listener for Main Menu Button (Placeholder)
document.getElementById('mainMenuButton').addEventListener('click', () => {
    window.location.href = 'index.html'; // Replace with the actual main menu URL
});
document.getElementById('mainMenuButtonDeath').addEventListener('click', () => {
    window.location.href = 'index.html'; // Replace with the actual main menu URL
});

//set up scene, camera and renderer
const scene = new THREE.Scene();
//so the fields are: field of view, aspect ratio, then near and far clipping planes
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1 , 1000);
// can set where it is and where it is looking
camera.position.set(0,0,10);
camera.lookAt(0,0,0);

const renderer =  new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

//set the size in which we want to render our app
renderer.setSize(window.innerWidth, window.innerHeight);

//add renderer element to document 
document.body.appendChild(renderer.domElement);

if(WebGL.isWebGL2Available()){
    //do animations
} else {
    const warning_message = WebGL.getWebGl2ErrorMessage();
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // White color with moderate intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White color with higher intensity
directionalLight.position.set(5, 10, 7.5).normalize(); // Position the light and normalize
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White point light with high intensity and distance
pointLight.position.set(0, 5, 0); // Position the light above the model
scene.add(pointLight);

// Load the model and apply controls
let characterControls;
// Load the astronaut model and apply controls
loadModel('models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
    astronaut = object;  // Assign astronaut model to variable
    
    // Adjust astronaut size 
    astronaut.scale.set(1.7, 1.7, 1.7);  
    
    initialAstronautPosition.copy(astronaut.position);  // Store initial position
    characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');
});

// Load the static model (adjust scale as needed)
loadModel('models/TheCatGalaxyMeow4.glb', scene, controls, camera, (object, mixer, animationsMap) => {
    console.log('Static model loaded:', object);
    
    // Adjust static model cat size 
    object.scale.set(0.5, 0.5, 0.5); 
    
    object.position.set(4, 0, 0); // Positioning 
});

const keysPressed = {};
document.addEventListener('keydown', (event) => {
    keysPressed[event.key.toLowerCase()] = true;
}, false);

document.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false;
}, false);

const clock = new THREE.Clock();
function animate() {
    let delta = clock.getDelta();
    if (characterControls) {
        characterControls.update(delta, keysPressed);
    }

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
