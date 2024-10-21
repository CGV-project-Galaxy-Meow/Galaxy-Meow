import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';  // Import character controls
import './intro.js';
import { playerName } from './intro.js';
import { createSun } from './background.js';
import { setupRaycasting } from './raycasting.js';
import {showDeathMessage} from './levelMenus.js'
import { clearInventory } from './inventory.js';


let health = 100;
let healthElement = document.getElementById('healthBar');
let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');
let characterControls;
let healthInterval; // To control the health timer

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
const modal = document.getElementById('myModal');
const responses = document.getElementById('responses');
const closeModalBtn = document.getElementById('closeModal');
const helpButton = document.getElementById('helpButton');
const dontHelpButton = document.getElementById('dontHelpButton');
const catConversation = document.getElementById('catConversation')
const cat_model = 'models/TheCatGalaxyMeow4.glb';

const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const objectsToRaycast = [];


let catObject; 

// Move astronaut and initial position declarations here, outside of startGame()
let astronaut;
let initialAstronautPosition = new THREE.Vector3(3, 0, 0);  // Default initial position


//set things up
camera.position.set(50, 10, 2); 

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('gameCanvas').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;        // Enable damping (inertia)
controls.dampingFactor = 0.05;        // Damping inertia
controls.enableZoom = false;          // Disable zoom if desired
controls.enablePan = false;           // Disable pan if desired
controls.mouseButtons = {
    LEFT: null,
    MIDDLE: null,
    RIGHT: THREE.MOUSE.ROTATE
};


// Audio listener
const listener = new THREE.AudioListener();
camera.add(listener);

// Audio loader
const audioLoader = new THREE.AudioLoader();

// separate audio sources for during game and game over
const ambianceSound = new THREE.Audio(listener);
const gameOverSound = new THREE.Audio(listener);

// Load ambiance sound
audioLoader.load('/sound/ambiance-sound.mp3', function(buffer) {
    ambianceSound.setBuffer(buffer);
    ambianceSound.setLoop(true);
    ambianceSound.setVolume(0.5);
    ambianceSound.play();
});

// Load game over sound
audioLoader.load('/sound/game-over.mp3', function(buffer) {
    gameOverSound.setBuffer(buffer);
    gameOverSound.setLoop(false);
    gameOverSound.setVolume(0.5);
    //we'll play it when health reaches zero
});



//----functions----

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
    }, 5000); // Decrease health every 5 seconds
}

//cat warns you of the oxygen
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


// Prevent context menu from appearing on right-click
renderer.domElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
}, false);

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


    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
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
    


    // Load the astronaut model and apply controls
    //let characterControls;
    loadModel('public/models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
        astronaut = object;
        astronaut.scale.set(1.7, 1.7, 1.7);
        initialAstronautPosition.copy(astronaut.position);
        astronaut.position.set(50, 0, 5);
        astronaut.rotation.x = 0;
        characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');
    
        // Set camera initial position relative to astronaut
        const initialOffset = new THREE.Vector3(0, 10, -20); // Adjust as needed
        camera.position.copy(astronaut.position).add(initialOffset);
    
        // Set initial controls target
        controls.target.copy(astronaut.position);
    });
    

    // Load the Moon Plane Model
    loadModel('models/moonground.glb', scene, controls, camera, (moonObject) => {
        moonObject.scale.set(1000, 1, 500);  // Scale it large enough to simulate an infinite ground
        moonObject.position.set(100, 0, 0);  // Place the plane below the astronaut
       // moonObject.rotation.x = -Math.PI / 2;  // Rotate the plane to make it horizontal
        scene.add(moonObject);


  // Load the American Flag Model
  loadModel('models/american_flag.glb', scene, controls, camera, (flagObject) => {
    flagObject.scale.set(1.7, 1.7, 1.7);
    flagObject.position.set(100, 5,100);
    flagObject.name = 'american_flag';
    scene.add(flagObject);
    objectsToRaycast.push(flagObject);
    setupRaycasting(camera, objectsToRaycast);
});


        loadModel('models/oil_barrel.glb', scene, controls, camera, (barrelObject) => {
            barrelObject.scale.set(1.7, 1.7, 1.7);
            barrelObject.position.set(40, 0, 4);
            barrelObject.name = 'barrel'
            scene.add(barrelObject);
            objectsToRaycast.push(barrelObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/skull.glb', scene, controls, camera, (skullObject) => {
            skullObject.scale.set(0.2, 0.2, 0.2);
            skullObject.position.set(45, 0.3, 4);
            skullObject.name = 'skeleton'
            scene.add(skullObject);
            objectsToRaycast.push(skullObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/Crystal1.glb', scene, controls, camera, (CrystalObject) => {
            CrystalObject.scale.set(0.1, 0.1, 0.1);
            CrystalObject.position.set(50, 0.1, 4);
            CrystalObject.traverse((child) => {
                if (child.isMesh) {
                    // Assign custom name or userData here to ensure we're modifying the correct mesh
                    child.name = 'CrystalMesh';  // Set a specific name for this child object
                    child.customId = 'power-crystal';  // Assign a custom property if you want
                    
                    // Alternatively, store in child.userData if needed:
                    child.userData = { customId: 'power-crystal' };  // Set custom user data for the mesh
                }
            });
            
            scene.add(CrystalObject);
            objectsToRaycast.push(CrystalObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/batteries.glb', scene, controls, camera, (BatteryObject) => {
            BatteryObject.scale.set(0.4, 0.4, 0.4);
            BatteryObject.position.set(60, 0, 4);
            BatteryObject.name = 'Battery'
            scene.add(BatteryObject);
            objectsToRaycast.push(BatteryObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });
        loadModel('models/CircuitBoard.glb', scene, controls, camera, (CirctuitIObject) => {
            CirctuitIObject.scale.set(0.4, 0.4, 0.4);
            CirctuitIObject.position.set(70, 0, 4);
            CirctuitIObject.name = 'Crystal'
            scene.add(CirctuitIObject);
            objectsToRaycast.push(CirctuitIObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/Button.glb', scene, controls, camera, (ButtonObject) => {
            ButtonObject.scale.set(0.8, 0.8, 0.8);
            ButtonObject.position.set(60, 0, 6);
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

    //const clock = new THREE.Clock();
    function animate() {
        let delta = clock.getDelta();
        if (characterControls) {
            characterControls.update(delta, keysPressed);
        }
    
        // Background animations
        earth.rotation.y += 0.001;
        celestialBodies.forEach(body => {
            body.rotation.y += 0.001;
        });
    
        updateShootingStars();
    
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
    

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
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
        astronaut.position.copy(initialAstronautPosition);
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