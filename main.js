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
let initialAstronautPosition = new THREE.Vector3(15, 0, -38);  // Default initial position
let playerName = '';

document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('introScreen');
    const dialogueText = document.getElementById('dialogueText');
    const nameInput = document.getElementById('nameInput');
    const nextButton = document.getElementById('nextButton');
    let step = 0;
    //let playerName = '';

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

function startGame() {
    decreaseHealth();
    
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


    // Add lighting

    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

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

    // Background Setup (from background.js)
    const spaceTexture = new THREE.TextureLoader().load('textures/stars.jpg');
    const spaceGeometry = new THREE.SphereGeometry(500, 64, 64); // Large enough to cover the background
    const spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });
    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    scene.add(space);

    const earthTexture = new THREE.TextureLoader().load('textures/earth.jpg');
    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, -20);
    scene.add(earth);

    const celestialBodies = [];
    function createCelestialBody(textureUrl, size, position) {
        const texture = new THREE.TextureLoader().load(textureUrl);
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const body = new THREE.Mesh(geometry, material);
        body.position.set(position.x, position.y, position.z);
        scene.add(body);
        celestialBodies.push(body);
    }
    createCelestialBody('textures/jupiter.jpg', 0.5, { x: -50, y: 2, z: -15 });
    createCelestialBody('textures/planet.jpg', 1.5, { x: 100, y: -2, z: -40 });
    createCelestialBody('textures/planet.jpg', 1.5, { x: 0, y: 30, z: -200 });
    createCelestialBody('textures/saturn.jpg', 0.2, { x: -5, y: -3, z: -8 });

    const shootingStars = [];

function createShootingStar() {
    const starGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const starMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: Math.random() 
    });
    const shootingStar = new THREE.Mesh(starGeometry, starMaterial);

   
    const startX = Math.random() * 20 - 10;  
    const startY = Math.random() * 10 - 5;  
    const startZ = Math.random() * 5 - 50
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
    let characterControls;
    loadModel('public/models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
        astronaut = object;
        astronaut.scale.set(1.7, 1.7, 1.7);
        //initialAstronautPosition.copy(astronaut.position);
        astronaut.position.set(15,0,-38)
        characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');
    });

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
    
    // Load the static model
    loadModel(cat_model, scene, controls, camera, (object, mixer, animationsMap) => {
        console.log('Static model loaded:', object);
        object.scale.set(0.5, 0.5, -0.5);
        object.position.set(4, 0, 0);
    
        catObject = object;
        scene.add(object);
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
    modal.style.display = 'none'; 
    responses.style.display = 'none'; 
    catConversation.textContent = ''; 
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

        // Background animations
        earth.rotation.y += 0.001;
        celestialBodies.forEach(body => {
            body.rotation.y += 0.001;
        });

        if (Math.random() < 0.01) {
            createShootingStar();
        }
        updateShootingStars();

        // requestAnimationFrame(animate);
        // controls.update();
        

        if(astronaut){

        const cameraOffset = new THREE.Vector3(0, 3, -5);
        const desiredCameraPosition = astronaut.position.clone().add(cameraOffset);
        camera.position.lerp(desiredCameraPosition, 0.1);
        camera.lookAt(astronaut.position);
        // const angleAdjustment = -0.2; // Adjust this value to change the downward angle
        // camera.rotation.x = Math.max(camera.rotation.x + angleAdjustment, Math.PI / 6); // Limit rotation to prevent flipping
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        controls.update();
        // console.log('astro pos:');
        // console.log(astronaut.position);
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

function updateHealthUI() {
    if (healthElement) {
        healthElement.innerHTML = `Oxygen: ${health}/100`;
    } else {
        console.error('Health element not found!');
    }
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
