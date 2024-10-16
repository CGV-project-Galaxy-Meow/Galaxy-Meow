import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';  // Import character controls

let health = 100;
let healthElement = document.getElementById('healthBar');
let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');
let healthInterval; // To control the health timer
let cameraAngle;

// Move astronaut and initial position declarations here, outside of startGame()
let astronaut;
let initialAstronautPosition = new THREE.Vector3(3, 0, 0);  // Default initial position

document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('introScreen');
    const dialogueText = document.getElementById('dialogueText');
    const nameInput = document.getElementById('nameInput');
    const nextButton = document.getElementById('nextButton');
    let step = 0;
    let playerName = '';

    // Show the intro screen when the game starts
    introScreen.style.display = 'flex';

    // Handle dialogue progression
    nextButton.addEventListener('click', () => {
        if (step === 0) {
            // Ask for the player's name
            nameInput.style.display = 'block';
            nameInput.focus();
            nextButton.textContent = 'Submit';
            step++;
        } else if (step === 1) {
            // Store the player's name and proceed with dialogue
            playerName = nameInput.value.trim();
            if (playerName === '') {
                alert('Please enter your name.');
            } else {
                nameInput.style.display = 'none';
                dialogueText.textContent = `I see, ${playerName}, you are a long way from home.`;
                nextButton.textContent = 'Next';
                step++;
            }
        } else if (step === 2) {
            dialogueText.textContent = 'Let us help you get back.';
            nextButton.textContent = 'Start Game';
            step++;
        } else if (step === 3) {
            // Hide intro and start the game
            introScreen.style.display = 'none';
            startGame(); // Function to start the game
        }
    });
});

// Function to decrease health over time
function decreaseHealth() {
    if (healthInterval) {
        clearInterval(healthInterval); // Clear any previous interval
    }
    healthInterval = setInterval(() => {
        if (health > 0) {
            health -= 1;
            healthElement.innerHTML = `Oxygen: ${health}/100`;
        } else {
            clearInterval(healthInterval); // Stop the timer when health reaches 0
            showDeathMessage();
        }
    }, 3000); // Decrease health every 3 seconds
}

// Function to transition to the game
function startGame() {
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

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25; // controls the damping when moving
    controls.screenSpacePanning = false; // Prevents panning on screen
    controls.maxPolarAngle = Math.PI / 2; // Limits vertical rotation (up and down)
    controls.minDistance = 5; // Minimum distance from the target (astronaut)
    controls.maxDistance = 20; // Maximum distance from the target (astronaut)

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    if (WebGL.isWebGL2Available()) {
        // Do animations
    } else {
        const warning_message = WebGL.getWebGl2ErrorMessage();
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5).normalize();
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Load the astronaut model and apply controls
    let characterControls;
    loadModel('public/models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
        astronaut = object;  // Assign astronaut model to globally scoped variable
        astronaut.scale.set(1.7, 1.7, 1.7);  
        initialAstronautPosition.copy(astronaut.position);  // Store initial position
        characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');
    });

    // Load the static model
    loadModel('models/TheCatGalaxyMeow4.glb', scene, controls, camera, (object, mixer, animationsMap) => {
        console.log('Static model loaded:', object);
        object.scale.set(0.5, 0.5, 0.5);
        object.position.set(4, 0, 0);
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

        // requestAnimationFrame(animate);
        // controls.update();
        
        // Create two vectors
        if(astronaut){
        // cameraAngle= THREE.MathUtils.lerp(cameraAngle,90,0.01);
        // camera.position.setFrom(15,1,cameraAngle);
        const cameraOffset = new THREE.Vector3(0, 0, 10);
        const desiredCameraPosition = astronaut.position.clone().add(cameraOffset);
        camera.position.lerp(desiredCameraPosition, 0.1);
        camera.lookAt(astronaut.position);
        // let vector1 = astronaut.position;
        // const vector2 = new THREE.Vector3(0, 0, 1.5);

        // // Add vector2 to vector1
        // let newPos=vector1.add(vector2);
        // camera.lookAt(astronaut.position);

        // camera.position.set(newPos);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        controls.update();
        
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Show "You Died" message
function showDeathMessage() {
    deathMessage.style.display = 'block';
}

// Restart Level
function restartLevel() {
    // Reset health
    health = 100;
    healthElement.innerHTML = `Oxygen: ${health}/100`;

    // Hide death and exit menus
    deathMessage.style.display = 'none';
    exitMenu.style.display = 'none';

    // Reset astronaut position and controls
    if (astronaut) {
        astronaut.position.copy(initialAstronautPosition);
        astronaut.rotation.set(0, 0, 0); 
    }

 

    // Restart health decrease
    decreaseHealth();
}

// Event Listeners for buttons
document.getElementById('restartButton').addEventListener('click', restartLevel);
document.getElementById('restartButtonDeath').addEventListener('click', restartLevel);

// Event Listener for Main Menu Button 
document.getElementById('mainMenuButton').addEventListener('click', () => {
    window.location.href = 'index.html'; // Replace with the actual main menu URL
});
document.getElementById('mainMenuButtonDeath').addEventListener('click', () => {
    window.location.href = 'index.html'; // Replace with the actual main menu URL
});
