import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';
//import { setupRaycasting } from './raycasting.js';


import {showDeathMessage} from './levelMenus.js'

const clock = new THREE.Clock();
let health = 100;
let healthElement = document.getElementById('healthBar');
let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');
let healthInterval; // To control the health timer

//for loading screen
let assetsToLoad = 14; 
let assetsLoaded = 0;  // Counter for loaded assets


// ---------------Create the scene--------------
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





// ----important functions
function decreaseHealth() {
    if (healthInterval) {
        clearInterval(healthInterval); // Clear any previous interval
    }
    healthInterval = setInterval(() => {
        if (health > 0) {
            health -= 1;
            healthElement.innerHTML = `Oxygen: ${health}/100`;
            checkOxygen();
        } else {
            clearInterval(healthInterval); // Stop the timer when health reaches 0
            showDeathMessage();

            // Stop the ambiance music
            if (ambianceSound.isPlaying) {
                ambianceSound.stop();
            }

            // Play the game over sound
            gameOverSound.play();
        }
    }, 4000); // Decrease health every 5 seconds
}

//cat warns you of the oxygen
function checkOxygen(){
    if(health == 30){
        modal.style.display = 'flex';
        catConversation.style.animation = 'none';
        catConversation.textContent = `Be careful! Your oxygen is running low.`;
    
        void catConversation.offsetWidth; 
        catConversation.style.animation = 'typing 3.5s steps(40, end)';
    
        // Keep the buttons hidden
        responses.style.display = 'none'; 
    }
}




//use this to start the game
// export function startGame() {}

// Load the texture

// Function to load and apply texture to the moon model
const numAsteroids = 100; // Number of asteroids to load
const objectsToRaycast = [];

for (let i = 0; i < numAsteroids; i++) {
    loadModel('models/asteroids.glb', scene, controls, camera, (astroObject) => {
        // Randomize position
        const randomX = Math.random() * 100 - 50; // Random value between -50 and 50
        const randomY = Math.random() * 20;       // Random value between 0 and 20
        const randomZ = Math.random() * 100 - 500; // Random value between -50 and 50

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


//loading screen!!!
// const loadingScreen = document.getElementById('loadingScreen');

// function onAssetLoaded() {
//     assetsLoaded++;
//     console.log(assetsLoaded);
//     if (assetsLoaded === assetsToLoad) {
//         loadingScreen.style.display = 'none'; // Hide loading screen 
//         decreaseHealth();
//     }
// }




// Load the sun model
// loadModel('models/sun1.glb', scene, controls, camera, (astroObject) => {
//     // Scale and position the sun
//     astroObject.scale.set(50, 50, 50);
//     astroObject.position.set(300, 100, 4);
//     astroObject.name = 'sun';
//     scene.add(astroObject);
//     objectsToRaycast.push(astroObject);

//     // Create a directional light to simulate sunlight
//     const sunlight = new THREE.DirectionalLight(0xffffff, 1); // White light, intensity 1
//     sunlight.position.set(300, 100, 4); // Same position as the sun
//     sunlight.target.position.set(0, 0, 0); // Target to illuminate towards the origin or another object
//     scene.add(sunlight);
//     scene.add(sunlight.target); // Ensure target is part of the scene to get directional lighting working

//     // Optionally, you can add a slight light effect on the sun itself (not required for realism)
//     const sunLightGlow = new THREE.PointLight(0xffcc33, 2, 500); // Orange-ish glow, intensity 2, range 500
//     sunLightGlow.position.set(300, 100, 4); // Same position as the sun
//     scene.add(sunLightGlow);
// });


// loadModel('models/earth1.glb', scene, controls, camera, (astroObject) => {
//     astroObject.scale.set(50, 50, 50);
//     astroObject.position.set(4, 10, -300);
//     astroObject.name = 'asteroids';
//     scene.add(astroObject);
//     objectsToRaycast.push(astroObject);



//     //setupRaycasting(camera, objectsToRaycast);
// });


//paper objects for this level
// loadModel('public/models/Debris_Papers.glb', scene, controls, camera, (DebrisObject) => {
//     DebrisObject.scale.set(1, 1, 1);  
//     DebrisObject.position.set(0, 0.1,0);  
//     DebrisObject.name = 'Debris paper';        
//     scene.add(DebrisObject);               
//     objectsToRaycast.push(DebrisObject);   

//    setupRaycasting(camera, objectsToRaycast);  
//    //onAssetLoaded();
// }, function (error) {
//     console.error('Error loading skull model:', error);
// });

// loadModel('public/models/Manila_Envelope.glb', scene, controls, camera, (ManilaObject) => {
//     ManilaObject.scale.set(1, 1, 1);  
//     ManilaObject.position.set(0, 0.1,0);  
//     ManilaObject.name = 'Manila envelope';        
//     scene.add(ManilaObject);               
//     objectsToRaycast.push(ManilaObject);   

//    setupRaycasting(camera, objectsToRaycast);  
//    //onAssetLoaded();
// }, function (error) {
//     console.error('Error loading skull model:', error);
// });

// loadModel('public/models/Paper_airplane.glb', scene, controls, camera, (PaperAirplaneObject) => {
//     PaperAirplaneObject.scale.set(1, 1, 1);  
//     PaperAirplaneObject.position.set(0, 0.1,0);  
//     PaperAirplaneObject.name = 'Paper airplane';        
//     scene.add(PaperAirplaneObject);               
//     objectsToRaycast.push(PaperAirplaneObject);   

//    setupRaycasting(camera, objectsToRaycast);  
//    //onAssetLoaded();
// }, function (error) {
//     console.error('Error loading skull model:', error);
// });

// loadModel('public/models/Paper.glb', scene, controls, camera, (PaperObject) => {
//     PaperObject.scale.set(1, 1, 1);  
//     PaperObject.position.set(0, 0.1,0);  
//     PaperObject.name = 'Paper';        
//     scene.add(PaperObject);               
//     objectsToRaycast.push(PaperObject);   

//    setupRaycasting(camera, objectsToRaycast);  
//    //onAssetLoaded();
// }, function (error) {
//     console.error('Error loading skull model:', error);
// });


// loadModel('public/models/Small_Stack_of_Paper.glb', scene, controls, camera, (StackPaperObject) => {
//     StackPaperObject.scale.set(1, 1, 1);  
//     StackPaperObject.position.set(0, 0.1,0);  
//     StackPaperObject.name = 'Stack of paper';        
//     scene.add(StackPaperObject);               
//     objectsToRaycast.push(StackPaperObject);   

//    setupRaycasting(camera, objectsToRaycast);  
//    //onAssetLoaded();
// }, function (error) {
//     console.error('Error loading skull model:', error);
// });





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


function restartLevel() {
    clearInventory();
    // Reset health
    health = 100;
    healthElement.innerHTML = `Oxygen: ${health}/100`;

    // Hide death and exit menus
    deathMessage.style.display = 'none';
    exitMenu.style.display = 'none';

    // Reset astronaut position and controls
    if (astronaut) {
        astronaut.position.set(50, 0, 5)
        astronaut.rotation.set(0, 0, 0); 
    }

    // Stop the game over sound if it's playing
    if (gameOverSound.isPlaying) {
        gameOverSound.stop();
    }

    // Start the ambiance music if it's not playing
    if (!ambianceSound.isPlaying) {
        ambianceSound.play();
    }

    decreaseHealth();
}



// Event Listeners for buttons
document.getElementById('restartButton').addEventListener('click', restartLevel);
document.getElementById('restartButtonDeath').addEventListener('click', restartLevel);

// Event Listener for Main Menu Button 
document.getElementById('mainMenuButton').addEventListener('click', () => {
    window.location.href = 'index.html'; 
});
document.getElementById('mainMenuButtonDeath').addEventListener('click', () => {
    window.location.href = 'index.html'; 
});




animate();  // Start the animation loop
