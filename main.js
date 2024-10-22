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
let initialAstronautPosition = new THREE.Vector3(3, 0, 0); 
const pipVideo = document.getElementById('pipVideo'); 
const pipCanvas = document.createElement('canvas'); 
const pipRenderer = new THREE.WebGLRenderer({ canvas: pipCanvas, alpha: true });
pipRenderer.setSize(pipCanvas.width, pipCanvas.height);

let pipActive = false;


async function activatePiP() {
    try {
        
        pipCanvas.width = window.innerWidth;
        pipCanvas.height = window.innerHeight;

        
        const pipRenderer = new THREE.WebGLRenderer({ canvas: pipCanvas, alpha: true });
        pipRenderer.setSize(pipCanvas.width, pipCanvas.height);

        
        const stream = pipCanvas.captureStream(30); 
        pipVideo.srcObject = stream;

        // Start playing the video to ensure the metadata is loaded
        pipVideo.play();

        // Start rendering the scene in PiP
        pipActive = true;
        requestAnimationFrame(renderInPiP);
        
        pipVideo.onloadedmetadata = async () => {
            try {
                await pipVideo.requestPictureInPicture();
            } catch (error) {
                console.error('Error activating Picture-in-Picture:', error);
            }
        };
    } catch (error) {
        console.error('Error in activatePiP:', error);
    }
}


function renderInPiP() {
    if (pipActive) {
        // Render the current scene to the pipCanvas
        pipRenderer.render(scene, camera); // Use your existing scene and camera

        requestAnimationFrame(renderInPiP); // Continue rendering
    }
}

pipVideo.addEventListener('leavepictureinpicture', () => {
    pipActive = false; // Stop the rendering loop
});


const startPiPButton = document.getElementById('startPiP');
startPiPButton.addEventListener('click', activatePiP);



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
document.getElementById('startPiP').style.display = 'none';

export function startGame() {
    decreaseHealth();
    document.getElementById('startPiP').style.display = 'block';
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


// Ambient light: Simulates the overall illumination on the moon
const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.5); // Softer ambient light
scene.add(ambientLight);

// Directional light: Simulates sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Adjust intensity for realism
directionalLight.position.set(10, 20, -10).normalize(); // Position it at a suitable angle
directionalLight.castShadow = true; // Enable shadows

// Optional: Configure shadow properties for better results
directionalLight.shadow.mapSize.width = 1024; // Shadow map resolution
directionalLight.shadow.mapSize.height = 1024; // Shadow map resolution
directionalLight.shadow.camera.near = 0.5; // Near clipping plane for shadow camera
directionalLight.shadow.camera.far = 50; // Far clipping plane for shadow camera
directionalLight.shadow.camera.left = -30; // Shadow camera left boundary
directionalLight.shadow.camera.right = 30; // Shadow camera right boundary
directionalLight.shadow.camera.top = 30; // Shadow camera top boundary
directionalLight.shadow.camera.bottom = -30; // Shadow camera bottom boundary

// Optionally, adjust the light helper for debugging
const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(helper);

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
        update();
    });
    

    // Load the Moon Plane Model
    loadModel('models/moonground.glb', scene, controls, camera, (moonObject) => {
        moonObject.scale.set(1000, 500, 500);  // Scale it large enough to simulate an infinite ground
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

        
        loadModel('models/antenna1.glb', scene, controls, camera, (antenna1Object) => {
            antenna1Object.scale.set(0.8, 0.8, 0.8);
            antenna1Object.position.set(60, 0, 6);
            antenna1Object.name = 'Crystal'
            scene.add(antenna1Object);
            objectsToRaycast.push(antenna1Object);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

        
        loadModel('models/console.glb', scene, controls, camera, (consoleObject) => {
            consoleObject.scale.set(0.8, 0.8, 0.8);
            consoleObject.position.set(60, 0, 6);
            consoleObject.name = 'Crystal'
            scene.add(consoleObject);
            objectsToRaycast.push(consoleObject);

            console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });

    });

    function update() {
        // Ensure the astronaut is positioned above the moon
        if (astronaut && moonObject) {
            // Set the raycaster to start from the astronaut's position and cast downwards
            raycaster.set(astronaut.position.clone(), new THREE.Vector3(0, -1, 0));
    
            // Check for intersections with the moon's surface
            const intersects = raycaster.intersectObject(moonObject, true); // true for recursive checking
    
            if (intersects.length > 0) {
                // Get the height from the intersection point
                const moonHeight = intersects[0].point.y; // Height at the intersection point
                astronaut.position.y = moonHeight + 1; // +1 to give some height above the moon's surface
            }
        }
    
        // Other update logic, such as character movement, etc.
        characterControls.update(); // Assuming characterControls handles astronaut movement
    
        // Render the scene
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
   
    
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