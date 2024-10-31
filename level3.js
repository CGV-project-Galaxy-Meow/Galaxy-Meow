import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';
import {positions, positions2, positionsQ, positionsGold, positionsBaseStone, positionsAstroidCluster,positionsRocks2, positionsQ2,positionsStones2} from './modelLocations.js';

import { setupRaycasting } from './raycasting.js';


import {showDeathMessage} from './levelMenus.js'

const clock = new THREE.Clock();
let health = 100;
let healthElement = document.getElementById('healthBar');
let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');
let healthInterval; // To control the health timer
export const objectsToRaycast = [];

//for loading screen
let assetsToLoad = 124; 
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





//----important functions-----
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

//Load the texture

//Function to load and apply texture to the moon model
// const numAsteroids = 100; // Number of asteroids to load
// const objectsToRaycast = [];

// for (let i = 0; i < numAsteroids; i++) {
//     loadModel('models/asteroids.glb', scene, controls, camera, (astroObject) => {
//         // Randomize position
//         const randomX = Math.random() * 100 - 50; // Random value between -50 and 50
//         const randomY = Math.random() * 20;       // Random value between 0 and 20
//         const randomZ = Math.random() * 100 - 500; // Random value between -50 and 50

//         // Randomize rotation
//         const randomRotationX = Math.random() * Math.PI * 2; // Random rotation between 0 and 2π
//         const randomRotationY = Math.random() * Math.PI * 2;
//         const randomRotationZ = Math.random() * Math.PI * 2;

//         // Randomize scale
//         const randomScale = 0.05 + Math.random() * 0.1; // Random scale between 0.05 and 0.15

//         astroObject.scale.set(randomScale, randomScale, randomScale);
//         astroObject.position.set(randomX, randomY, randomZ);
//         astroObject.rotation.set(randomRotationX, randomRotationY, randomRotationZ);
//         astroObject.name = 'asteroids_' + i;

//         scene.add(astroObject);
//         objectsToRaycast.push(astroObject);
//     });
// }

// loadModel('models/Moon.glb', scene, controls, camera, (astroObject) => {
//     astroObject.scale.set(50, 50, 50);
//     astroObject.position.set(-300, 100, 4);
//     astroObject.name = 'asteroids';
//     scene.add(astroObject);
//     objectsToRaycast.push(astroObject);



//     //setupRaycasting(camera, objectsToRaycast);
// });




//loading screen!!!
const loadingScreen = document.getElementById('loadingScreen');

function onAssetLoaded() {
    assetsLoaded++;
    console.log(assetsLoaded);
    //if (assetsLoaded === assetsToLoad) {
        loadingScreen.style.display = 'none'; // Hide loading screen 
        decreaseHealth();
    //}
}



export function startGame() {


//Load the sun model
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


loadModel('models/ground.glb', scene, controls, camera, (asteroid_groundObject) => {
    asteroid_groundObject.scale.set(30, 1, 30);  // Scale it large enough to simulate an infinite ground
    asteroid_groundObject.position.set(0, -1.5, 0);  // Place the plane below the astronaut
    //moonObject.rotation.x = -Math.PI / 2;  // Rotate the plane to make it horizontal
    scene.add(asteroid_groundObject);


    //paper objects for this level
    loadModel('public/models/paper/Paper.glb', scene, controls, camera, (PaperObject) => {
    PaperObject.scale.set(0.05, 0.05, 0.05);  
    PaperObject.position.set(9, -0.5,149);  //0, 1.5, 150
    PaperObject.name = 'Paper';        
    scene.add(PaperObject);               
    objectsToRaycast.push(PaperObject);   

   setupRaycasting(camera, objectsToRaycast);  
   //onAssetLoaded();
}, function (error) {
    console.error('Error loading skull model:', error);
});


loadModel('public/models/paper/Debris_Papers.glb', scene, controls, camera, (DebrisObject) => {
    DebrisObject.scale.set(15, 15, 15);  
    DebrisObject.position.set(-210, 0.1,-40);  
    DebrisObject.name = 'Debris paper';        
    scene.add(DebrisObject);               
    objectsToRaycast.push(DebrisObject);   

   setupRaycasting(camera, objectsToRaycast);  
   //onAssetLoaded();
}, function (error) {
    console.error('Error loading skull model:', error);
});

loadModel('public/models/paper/Manila_Envelope.glb', scene, controls, camera, (ManilaObject) => {
    ManilaObject.scale.set(1.5, 1.5, 1.5);  
    ManilaObject.position.set(215, 0.1,317);  //200, -4, 300
    ManilaObject.name = 'Manila envelope';        
    scene.add(ManilaObject);               
    objectsToRaycast.push(ManilaObject);   

   setupRaycasting(camera, objectsToRaycast);  
   //onAssetLoaded();
}, function (error) {
    console.error('Error loading skull model:', error);
});




loadModel('public/models/paper/Toilet_paper.glb', scene, controls, camera, (ToiletPaperObject) => {
    ToiletPaperObject.scale.set(1.3, 1.3, 1.3);  
    ToiletPaperObject.position.set(-40, 0.7,-200);  
    ToiletPaperObject.name = 'Toilet paper';        
    scene.add(ToiletPaperObject);               
    objectsToRaycast.push(ToiletPaperObject);   

   setupRaycasting(camera, objectsToRaycast);  
   //onAssetLoaded();
}, function (error) {
    console.error('Error loading toilet paper model:', error);
});



loadModel('public/models/paper/Small_Stack_of_Paper.glb', scene, controls, camera, (StackPaperObject) => {
    StackPaperObject.scale.set(20, 20, 20);  
    StackPaperObject.position.set(230, 0.1,0);  
    StackPaperObject.name = 'Stack of paper';        
    scene.add(StackPaperObject);               
    objectsToRaycast.push(StackPaperObject);   

   setupRaycasting(camera, objectsToRaycast);  
   //onAssetLoaded();
}, function (error) {
    console.error('Error loading skull model:', error);
});

loadModel('public/models/Magic_Carpet.glb', scene, controls, camera, (CarpetObject) => {
        CarpetObject.scale.set(1.5, 1.5, 1.5);  
        CarpetObject.position.set(0, 0.1,0);  //200, -4, 300
        CarpetObject.name = 'Magic Carpet';        
        scene.add(CarpetObject);               
        objectsToRaycast.push(CarpetObject);   
    
       setupRaycasting(camera, objectsToRaycast);  
       //onAssetLoaded();
    }, function (error) {
        console.error('Error loading carpet model:', error);
    });




// Load the model for each position in the array
positionsStones2.forEach((position) => {
    loadModel('public/models/rocks/Rocks.glb', scene, controls, camera, (RocksObject) => {
        const scaleFactor = Math.random() * 30 + 5; // Random size between 5 and 15
        RocksObject.scale.set(scaleFactor, scaleFactor, scaleFactor); // Set the model size // Scale the model
        RocksObject.position.copy(position); // Set the position from the array
        //console.log(position)
        RocksObject.name = 'Rocks'; // Set a name for reference

        // Add the object to the scene and collision arrays
        scene.add(RocksObject);
        //objectsToRaycast.push(RocksObject);
        characterControls.objectsToCollide.push(RocksObject); // Add to collision detection array
        //setupRaycasting(camera, objectsToRaycast);
        onAssetLoaded();
    });
});

positionsGold.forEach((position) => {
loadModel('public/models/rocks/Rock_Forms_3.glb', scene, controls, camera, (RocksObject) => {
    const scaleFactor = Math.random() * 30 + 5; // Random size between 5 and 15
    RocksObject.scale.set(scaleFactor, scaleFactor, scaleFactor); // Set the model size // Scale the model
    RocksObject.position.copy(position); // Set the position from the array
    //console.log(position)
    RocksObject.name = 'Rocks'; // Set a name for reference

    // Add the object to the scene and collision arrays
    scene.add(RocksObject);
    //objectsToRaycast.push(RocksObject);
    characterControls.objectsToCollide.push(RocksObject); // Add to collision detection array
    //setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});
});


positionsQ2.forEach((position) => {
loadModel('public/models/rocks/RockQ.glb', scene, controls, camera, (RockQObject) => {
    const scaleFactor = Math.random() * 15 + 5; // Random size 
    RockQObject.scale.set(scaleFactor, scaleFactor, scaleFactor); // Set the model size
    //RockQObject.scale.set(10.8, 10.8, 10.8);
    //RockQObject.position.set(30, 0, 50);
    RockQObject.position.copy(position);
    RockQObject.rotation.y = Math.random() * Math.PI * 2;
    RockQObject.name = 'Rock 1'
    scene.add(RockQObject);
    
    //objectsToRaycast.push(RockQObject);
    characterControls.objectsToCollide.push(RockQObject);
    //setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});
});


positionsBaseStone.forEach((position) => {
loadModel('public/models/rocks/basic_stone_3.glb', scene, controls, camera, (BasicRockObject) => {
    BasicRockObject.scale.set(30.8, 30.8, 30.8);
    //BasicRockObject.position.set(-80, 0, -190);
    BasicRockObject.position.copy(position);
    BasicRockObject.rotation.y = Math.random() * Math.PI * 2;
    BasicRockObject.name = 'Basic Rock'
    scene.add(BasicRockObject);
   // objectsToRaycast.push(BasicRockObject);
    // 
    characterControls.objectsToCollide.push(BasicRockObject);
    //setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});
});


positionsRocks2.forEach((position) => {
loadModel('public/models/rocks/Rock.glb', scene, controls, camera, (RockObject) => {
    const scaleFactor = Math.random() * 20 + 5; // Random size 
    RockObject.scale.set(scaleFactor, scaleFactor, scaleFactor); // Set the model size
    //RockObject.scale.set(20.8, 20.8, 20.8);
    //RockObject.position.set(56, 0, -12);
    RockObject.position.copy(position);
    RockObject.rotation.y = Math.random() * Math.PI * 2;

    RockObject.name = 'Rock 2'

    scene.add(RockObject);
    //objectsToRaycast.push(RockObject);

    characterControls.objectsToCollide.push(RockObject);
   // setupRaycasting(camera, objectsToRaycast);
   onAssetLoaded();
});
});


const positionRubble = [
    new THREE.Vector3(280, -4, -78),
    new THREE.Vector3(302, -4, -309),
    new THREE.Vector3(-292, -4, -10),
    new THREE.Vector3(200, -4, 300),
    new THREE.Vector3(0, -4, 320),
    new THREE.Vector3(-1, -6, 152)
];

positionRubble.forEach((position) => {
loadModel('public/models/rocks/Rubble_Rocks.glb', scene, controls, camera, (RubbleObject) => {
    RubbleObject.scale.set(15, 15, 15);
    //RubbleObject.position.set(-185, 0, 60);
    RubbleObject.position.copy(position);
    RubbleObject.name = 'Rubble Rock'
    scene.add(RubbleObject);
    //objectsToRaycast.push(RubbleObject);

    // 
    characterControls.objectsToCollide.push(RubbleObject);
    onAssetLoaded();
    //setupRaycasting(camera, objectsToRaycast);
});
});

const positionComet = [
        new THREE.Vector3(280, -0.7, -78),
        new THREE.Vector3(302, -0.7, -309),
        new THREE.Vector3(-292, -0.7, -10),
        new THREE.Vector3(200, -0.7, 300),
        new THREE.Vector3(0, -0.7, 320)
        ];
positionComet.forEach((position) => {
loadModel('public/models/rocks/Comet.glb', scene, controls, camera, (AstroidObject) => {
    AstroidObject.scale.set(1, 1, 1);
    // AstroidObject.position.set(200, -0.7, 300);
    AstroidObject.position.copy(position);
    AstroidObject.name = 'Comet'
    scene.add(AstroidObject);
   /// objectsToRaycast.push(AstroidObject);

    // 
    characterControls.objectsToCollide.push(AstroidObject);
   // setupRaycasting(camera, objectsToRaycast);
   onAssetLoaded();
});
});

loadModel('public/models/japanese_maple_tree.glb', scene, controls, camera, (treeObject) => {
    treeObject.scale.set(30, 30, 30);
    treeObject.position.set(0, 1.5, 150);
    treeObject.name = 'Great tree'
    scene.add(treeObject);
    //objectsToRaycast.push(RocketshipObject);
    characterControls.objectsToCollide.push(treeObject);
    //setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});
loadModel('public/models/rocks/Stalactites_&_gems.glb', scene, controls, camera, (StalactitesObject) => {
    StalactitesObject.scale.set(30, 30, 30);
    StalactitesObject.position.set(230, 10, 0);
    StalactitesObject.name = 'Great tree'
    scene.add(StalactitesObject);
    //objectsToRaycast.push(RocketshipObject);
    characterControls.objectsToCollide.push(StalactitesObject);
    //setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});

});








let astronaut;
let characterControls;
loadModel('public/models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
    astronaut = object;
    astronaut.scale.set(1.7, 1.7, 1.7);
    astronaut.position.set(0, 0, 5);
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

};

