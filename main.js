import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';  // Import character controls
import './intro.js';
import { playerName } from './intro.js';
import { createSun } from './background.js';
import { setupRaycasting } from './raycasting.js';
import { clearInventory } from './inventory.js';

let health = 100;
let healthElement = document.getElementById('healthBar');
let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');
let healthInterval; // To control the health timer

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const modal = document.getElementById('myModal');
const responses = document.getElementById('responses');
const closeModalBtn = document.getElementById('closeModal');
const helpButton = document.getElementById('helpButton');
const dontHelpButton = document.getElementById('dontHelpButton');
const catConversation = document.getElementById('catConversation')
const cat_model = 'models/TheCatGalaxyMeow4.glb';
let catObject; 
let moonObject;
// Move astronaut and initial position declarations here, outside of startGame()
let astronaut;
let initialAstronautPosition = new THREE.Vector3(3, 0, 0);  // Default initial position
const MAX_RADIUS = 900; 

function restrictMovementWithinBarrier() {
    if (astronaut) {
        const distanceFromCenter = astronaut.position.length(); // Distance from (0,0,0)
        if (distanceFromCenter > MAX_RADIUS) {
            astronaut.position.normalize().multiplyScalar(MAX_RADIUS);
        }
    }
}

function checkGroundCollision() {
    if (astronaut && moonObject) {
        // Direction vector pointing downward
        const downVector = new THREE.Vector3(0, -1, 0);
        // Starting point of the ray (from the astronaut's position)
        const rayOrigin = astronaut.position.clone();
        rayOrigin.y += 1; // Offset ray origin upwards if needed (adjust based on your model)

        // Create a raycaster from the astronaut's position downward
        const raycaster = new THREE.Raycaster(rayOrigin, downVector, 0, 5); // Adjust max distance as needed

        // Perform raycasting to detect intersection with the moonObject
        const intersects = raycaster.intersectObject(moonObject, true);

        if (intersects.length > 0) {
            // Ground detected beneath the astronaut
            const groundY = intersects[0].point.y;
            if (astronaut.position.y <= groundY + 0.1) {
                // Adjust the astronaut's position to be just above the ground
                astronaut.position.y = groundY + 0.1;
            }
        } else {
            // No ground detected within range
            // Optionally apply gravity or prevent further downward movement
        }
    }
}


//Function to decrease health over time
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
        }
    }, 5000); // Decrease health every 3 seconds
}

function checkOxygen(){
    if(health == 30){
        modal.style.display = 'flex';
        catConversation.style.animation = 'none';
        catConversation.textContent = `Be careful, ${playerName}! Your oxygen is running low.`;
    
        void catConversation.offsetWidth; 
        catConversation.style.animation = 'typing 3.5s steps(40, end)';
    
        // Keep the buttons hidden
        responses.style.display = 'none'; 
    }
}

document.getElementById('bagIcon').style.display = 'none';
export function startGame() {
    decreaseHealth();
    
    document.getElementById('bagIcon').style.display = 'grid';

     document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (exitMenu.style.display === 'none') {
                exitMenu.style.display = 'block'; // Show menu
            } else {
                exitMenu.style.display = 'none'; // Hide menu
            }
        }
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameCanvas').appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
//create background audio
const listener = new THREE.AudioListener();
camera.add(listener);

// Create a global audio source
const sound = new THREE.Audio(listener);

// Load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/sound/welcome-music.mp3', function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});



    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffcc99, 50);
    directionalLight.position.set(0, 50, -50).normalize();
    //directionalLight.castShadow = true;  // Enable shadows if needed
    scene.add(directionalLight);
    

    createSun(scene);

    const spaceTexture = new THREE.TextureLoader().load('textures/stars.jpg');
    const spaceGeometry = new THREE.SphereGeometry(500, 64, 64);
    const spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });
    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    scene.add(space);

    const earthTexture = new THREE.TextureLoader().load('textures/earth.jpg');
    const earthGeometry = new THREE.SphereGeometry(100, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, -400);
    earth.castShadow = true;  // Enable shadow casting
    scene.add(earth);

    // For celestial bodies
    const celestialBodies = [];
    function createCelestialBody(textureUrl, size, position) {
        const texture = new THREE.TextureLoader().load(textureUrl);
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: texture }); 
        const body = new THREE.Mesh(geometry, material);
        body.position.set(position.x, position.y, position.z);
        body.castShadow = true;  // Enable shadow casting
        scene.add(body);
        celestialBodies.push(body);
    }
   // createCelestialBody('textures/jupiter.jpg', 5, { x: -200, y: 2, z: -15 });
   // createCelestialBody('textures/planet.jpg', 1.5, { x: 100, y: -30, z: -40 });
   // createCelestialBody('textures/planet.jpg', 90, { x: 500, y: 0, z: -500 });
    //createCelestialBody('textures/neptune.jpg', 100, { x: -300, y: 50, z: -500 });

    const shootingStars = [];

function createShootingStar() {
    const starGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const starMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: Math.random() 
    });
    const shootingStar = new THREE.Mesh(starGeometry, starMaterial);

   
    const startX = 50;  
    const startY = 0;  
    const startZ = -50
    shootingStar.position.set(startX, startY, startZ);

    scene.add(shootingStar);
    
    
    const velocityX = Math.random() * 0.1 - 0.05;  // X velocity range
    const velocityY = Math.random() * 0.1 - 0.05;  // Y velocity range
    const velocityZ = Math.random() * 0.2 - 0.1;   // Z velocity towards the camera

    // Create an array for the tail positions
    const tailPositions = [];
    const tailLength = 5;
    const tailColor = 0x00ff00;

    for (let i = 0; i < tailLength; i++) {
        const tailStar = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8), // Smaller tail stars
            new THREE.MeshBasicMaterial({ color: tailColor, transparent: true, opacity: 0.5 })
        );
        tailStar.position.copy(shootingStar.position); // Initialize tail star position
        scene.add(tailStar);
        tailPositions.push(tailStar);
    }

    shootingStars.push({
        mesh: shootingStar,
        velocity: new THREE.Vector3(velocityX, velocityY, -velocityZ),
        fadeDirection: Math.random() < 0.5 ? 1 : -1,
        tail: tailPositions 
    });
}


function updateShootingStars() {
    shootingStars.forEach((star, index) => {
        star.mesh.position.add(star.velocity);
        
        // Update opacity for strobing effect
        star.mesh.material.opacity += 0.05 * star.fadeDirection;

        // Reverse fade direction when reaching limits
        if (star.mesh.material.opacity >= 1 || star.mesh.material.opacity <= 0) {
            star.fadeDirection *= -1; // Reverse the fade direction
        }

       
        star.tail.forEach((tailStar, tailIndex) => {
            // Shift tail stars back
            if (tailIndex === 0) {
                tailStar.position.copy(star.mesh.position); 
            } else {
                tailStar.position.copy(star.tail[tailIndex - 1].position);
            }
        });

       
        if (star.mesh.position.z > 5) {
          
            star.tail.forEach(tailStar => scene.remove(tailStar));
            scene.remove(star.mesh);
            shootingStars.splice(index, 1);
        }
    });
}


setInterval(createShootingStar, 300);
    
const objectsToRaycast = [];

    // Load the astronaut model and apply controls
    let characterControls;
    loadModel('public/models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
        astronaut = object;
        astronaut.scale.set(1.7, 1.7, 1.7);
        initialAstronautPosition.copy(astronaut.position);
        astronaut.position.set(50,0,5);
        astronaut.rotation.x= 0;
        characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');
    });


    // Load the Moon Plane Model
    loadModel('models/moonground.glb', scene, controls, camera, (loadedMoonObject) => {
        moonObject = loadedMoonObject; // Assign to the outer scope variable
        moonObject.scale.set(1000, 1000, 500);
        moonObject.position.set(100, 10, 0);
        scene.add(moonObject);

        loadModel('models/oil_barrel.glb', scene, controls, camera, (barrelObject) => {
            barrelObject.scale.set(1.7, 1.7, 1.7);
            barrelObject.position.set(40, 0, 4);
            barrelObject.name = 'barrel'
            scene.add(barrelObject);
            objectsToRaycast.push(barrelObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/Crystal1.glb', scene, controls, camera, (CrystalObject) => {
            CrystalObject.scale.set(1.7, 1.7, 1.7);
            CrystalObject.position.set(50, 0, 4);
            CrystalObject.name = 'Crystal'
            scene.add(CrystalObject);
            objectsToRaycast.push(CrystalObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/batteries.glb', scene, controls, camera, (BatteryObject) => {
            BatteryObject.scale.set(1.7, 1.7, 1.7);
            BatteryObject.position.set(60, 0, 4);
            BatteryObject.name = 'Crystal'
            scene.add(BatteryObject);
            objectsToRaycast.push(BatteryObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });
        loadModel('models/CircuitBoard.glb', scene, controls, camera, (CirctuitIObject) => {
            CirctuitIObject.scale.set(1.7, 1.7, 1.7);
            CirctuitIObject.position.set(60, 0, 4);
            CirctuitIObject.name = 'Crystal'
            scene.add(CirctuitIObject);
            objectsToRaycast.push(CirctuitIObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/Button.glb', scene, controls, camera, (ButtonObject) => {
            ButtonObject.scale.set(1.7, 1.7, 1.7);
            ButtonObject.position.set(60, 0, 4);
            ButtonObject.name = 'Crystal'
            scene.add(ButtonObject);
            objectsToRaycast.push(ButtonObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

    });
   
    
    // Load the static model
    loadModel(cat_model, scene, controls, camera, (object, mixer, animationsMap) => {
        console.log('Static model loaded:', object);
        object.scale.set(7, 7, 7);
        object.position.set(-10, 0, -10);
    
        catObject = object;
        scene.add(object);
        objectsToRaycast.push(catObject)
        setupRaycasting(camera, objectsToRaycast);
    });
    
        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
            raycaster.setFromCamera(mouse, camera);
    
            // Check if the object is intersected by the ray
            if (catObject) { 
                const intersects = raycaster.intersectObject(catObject, true); 
    
                if (intersects.length > 0) {
                    console.log('Model clicked:', catObject);

                    modal.style.display = 'flex';
                    responses.style.display = 'none'; 
                    catConversation.textContent = `Do you need help, ${playerName}? I hope you are willing to trade some oxygen for a clue.`;
                
                    catConversation.style.animation = 'none'; 
                    void catConversation.offsetWidth; 
                    catConversation.style.animation = 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite';
                
                    catConversation.addEventListener('animationend', function onAnimationEnd() {
                        responses.style.display = 'flex'; 
                        catConversation.removeEventListener('animationend', onAnimationEnd); 
                    });
                }
            }
        });


// Remove these lines
const astronautBox = new THREE.Box3(); // Astronaut bounding box
const moonBox = new THREE.Box3();      // Moon bounding box

function updateBoundingBoxes() {
    if (astronaut && moonObject) {
        astronautBox.setFromObject(astronaut);
        moonBox.setFromObject(moonObject);
        return true; // Bounding boxes updated successfully
    } else {
        return false; // Cannot update bounding boxes
    }
}


// Check collision during animation
// Remove or comment out this function
function checkCollision() {
    if (astronaut && moonObject) {
        // Adjust 'offset' based on the astronaut's model height if necessary
        const offset = 1; // Adjust this value as needed
        const moonY = moonObject.position.y;
        const astronautY = astronaut.position.y;

        if (astronautY < moonY + offset) {
            astronaut.position.y = moonY + offset;
        }
    }
}


// Event listener for 'Don't Help' button
dontHelpButton.addEventListener('click', () => {
    catConversation.style.animation = 'none';
    catConversation.textContent = `As you wish.`;

    void catConversation.offsetWidth; 
    catConversation.style.animation = 'typing 3.5s steps(40, end)';

    // Keep the buttons hidden
    responses.style.display = 'none'; 
});

// Event listener for 'Help' button
helpButton.addEventListener('click', () => {
    catConversation.style.animation = 'none';
    catConversation.textContent = `Very well. You'll find the (part) here...`;

    health -= 5 //remove some health;

    void catConversation.offsetWidth; 
    catConversation.style.animation = 'typing 3.5s steps(40, end)';

    // Keep the buttons hidden
    responses.style.display = 'none'; 
});

        // Close modal on button click
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none'; // Hide the modal
        });
    
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none'; // Hide the modal when clicking outside
            }
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

    const clock = new THREE.Clock();
    function animate() {
        let delta = clock.getDelta();
    if (characterControls) {
        characterControls.update(delta, keysPressed);
    }

   // New code to add
if (astronaut && moonObject) {
    checkGroundCollision(); // Prevent astronaut from going below the moon surface
    restrictMovementWithinBarrier();
}

        // Background animations and camera controls
        earth.rotation.y += 0.001;
        celestialBodies.forEach(body => body.rotation.y += 0.001);
        updateShootingStars();
    
        // Astronaut camera following logic
        if (astronaut) {
            const cameraOffset = new THREE.Vector3(0, 0, 7);
            const desiredCameraPosition = astronaut.position.clone().add(cameraOffset);
            camera.position.lerp(desiredCameraPosition, 0.1);
            camera.lookAt(astronaut.position);
        }
    
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        controls.update();
    }
    

    animate();

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
    clearInventory()

    // Hide death and exit menus
    deathMessage.style.display = 'none';
    exitMenu.style.display = 'none';

    // Reset astronaut position and controls
    // if (astronaut) {
    //     astronaut.position.copy(initialAstronautPosition);
    //     astronaut.rotation.set(0, 0, 0); 
    // }

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