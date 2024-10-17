import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';  // Import character controls
import './intro.js';
import { playerName } from './intro.js';
import { createSun } from './background.js';

let health = 100;
let healthElement = document.getElementById('healthBar');
let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');
let healthInterval; // To control the health timer

// Move astronaut and initial position declarations here, outside of startGame()
let astronaut;
let initialAstronautPosition = new THREE.Vector3(3, 0, 0);  // Default initial position

// Celestial bodies array for rotation and update
const celestialBodies = [];

// Shooting stars array
const shootingStars = [];

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

export function startGame() {
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 10, 50);  // Camera position

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameCanvas').appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;  // Limit vertical rotation to prevent looking under the plane

    // Load the Moon Plane Model
    loadModel('models/moonplane.glb', scene, controls, camera, (moonObject) => {
        moonObject.scale.set(1000, 1000, 500);  // Scale it large enough to simulate an infinite ground
        moonObject.position.set(0, -5, 0);  // Place the plane below the astronaut
        moonObject.rotation.x = -Math.PI / 2;  // Rotate the plane to make it horizontal
        scene.add(moonObject);
    });

    // Create the sky sphere as the background
    const spaceTexture = new THREE.TextureLoader().load('textures/stars.jpg');
    const spaceGeometry = new THREE.SphereGeometry(1000, 64, 64);  // Large enough to cover everything
    const spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });
    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    scene.add(space);

    // Create the sun and celestial bodies
    createSun(scene);
    createCelestialBody('textures/jupiter.jpg', 5, { x: -200, y: 2, z: -15 });
    createCelestialBody('textures/planet.jpg', 1.5, { x: 100, y: -15, z: -40 });
    createCelestialBody('textures/planet.jpg', 1.5, { x: 0, y: 30, z: -200 });
    createCelestialBody('textures/neptune.jpg', 7, { x: -100, y: -3, z: -100 });

    // Create Earth sphere
    const earthTexture = new THREE.TextureLoader().load('textures/earth.jpg');
    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, -20);
    earth.castShadow = true;
    scene.add(earth);

    // Add background audio
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('/sound/welcome-music.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });

    // Add lighting with custom color and intensity
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffcc99, 50);  // Custom color and intensity
    directionalLight.position.set(0, 50, -50).normalize();
    scene.add(directionalLight);

    // Load astronaut model and place it on the moon surface
    let characterControls;
    loadModel('/models/Walking astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
        astronaut = object;
        astronaut.scale.set(8, 8, 8);  // Adjust scale
        astronaut.position.set(0, 100, 0);  // Place the astronaut on the moon surface
        astronaut.rotation.x = 3 * Math.PI / 2;  // Rotate to face downward
        initialAstronautPosition.copy(astronaut.position);
        characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');
        scene.add(astronaut);
    });

    // Add the cat dialogue interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const modal = document.getElementById('myModal');
    const responses = document.getElementById('responses');
    const closeModalBtn = document.getElementById('closeModal');
    const helpButton = document.getElementById('helpButton');
    const dontHelpButton = document.getElementById('dontHelpButton');
    const catConversation = document.getElementById('catConversation');

    const cat_model = 'models/TheCatGalaxyMeow4.glb';
    let catObject;

    // Load cat model and set up interaction
    loadModel(cat_model, scene, controls, camera, (object, mixer, animationsMap) => {
        object.scale.set(10, 10, 10);
        object.position.set(20, 100, -50);
        object.rotation.x = 3 * Math.PI / 2;
        catObject = object;
        scene.add(object);
    });

    // Detect click on the cat and display dialogue
    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        if (catObject) {
            const intersects = raycaster.intersectObject(catObject, true);

            if (intersects.length > 0) {
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
        responses.style.display = 'none';  // Hide the buttons
    });

    // Event listener for 'Help' button
    helpButton.addEventListener('click', () => {
        catConversation.style.animation = 'none';
        catConversation.textContent = `Very well. You'll find the (part) here...`;
        health -= 5;  // Remove some health as a trade-off
        void catConversation.offsetWidth;
        catConversation.style.animation = 'typing 3.5s steps(40, end)';
        responses.style.display = 'none';  // Hide the buttons
    });

    // Close modal on button click
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';  // Hide the modal
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';  // Hide the modal when clicking outside
        }
    });

    // Create Shooting Stars
    function createShootingStar() {
        const starGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: Math.random() });
        const shootingStar = new THREE.Mesh(starGeometry, starMaterial);
        const startX = Math.random() * 20 - 10;
        const startY = Math.random() * 10 - 5;
        const startZ = Math.random() * 5 - 50;
        shootingStar.position.set(startX, startY, startZ);

        scene.add(shootingStar);

        const velocityX = Math.random() * 0.1 - 0.05;
        const velocityY = Math.random() * 0.1 - 0.05;
        const velocityZ = Math.random() * 0.2 - 0.1;

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
            velocity: new THREE.Vector3(velocityX, velocityY, velocityZ),
            fadeDirection: Math.random() < 0.5 ? 1 : -1,
            tail: tailPositions
        });
    }

    function updateShootingStars() {
        shootingStars.forEach((star, index) => {
            star.mesh.position.add(star.velocity);
            star.mesh.material.opacity += 0.05 * star.fadeDirection;
            if (star.mesh.material.opacity >= 1 || star.mesh.material.opacity <= 0) {
                star.fadeDirection *= -1;
            }
            star.tail.forEach((tailStar, tailIndex) => {
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

    // Animation loop
    const clock = new THREE.Clock();
    const keysPressed = {};
    function animate() {
        let delta = clock.getDelta();
        if (characterControls) {
            characterControls.update(delta, keysPressed);
        }

        // Update celestial body rotations
        earth.rotation.y += 0.001;
        celestialBodies.forEach(body => {
            body.rotation.y += 0.001;
        });

        updateShootingStars();

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

    // Add key listeners for character movement
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key.toLowerCase()] = true;
    }, false);

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key.toLowerCase()] = false;
    }, false);

    // Function to restart the game
    function restartLevel() {
        health = 100;
        healthElement.innerHTML = `Oxygen: ${health}/100`;
        deathMessage.style.display = 'none';
        exitMenu.style.display = 'none';
        if (astronaut) {
            astronaut.position.copy(initialAstronautPosition);
            astronaut.rotation.set(0, 0, 0);
        }
        decreaseHealth();
    }

    // Event listeners for buttons
    document.getElementById('restartButton').addEventListener('click', restartLevel);
    document.getElementById('restartButtonDeath').addEventListener('click', restartLevel);
    document.getElementById('mainMenuButton').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    document.getElementById('mainMenuButtonDeath').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Show "You Died" message
    function showDeathMessage() {
        deathMessage.style.display = 'block';
    }

    // Update health display
    function updateHealthUI() {
        if (healthElement) {
            healthElement.innerHTML = `Oxygen: ${health}/100`;
        } else {
            console.error('Health element not found!');
        }
    }
}

// Start the game when everything is ready
window.onload = function () {
    startGame();
};

// Helper function to create celestial bodies
function createCelestialBody(textureUrl, size, position) {
    const texture = new THREE.TextureLoader().load(textureUrl);
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const body = new THREE.Mesh(geometry, material);
    body.position.set(position.x, position.y, position.z);
    body.castShadow = true;
    celestialBodies.push(body);
    scene.add(body);
}
