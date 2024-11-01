import * as THREE from './node_modules/three/build/three.module.min.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';
import {positions, positions2, positionsQ, positionsGold, positionsBaseStone, positionsAstroidCluster,positionsRocks2, positionsQ2,positionsStones2} from './modelLocations.js';
import {showDeathMessage} from './levelMenus.js'
import { createSun } from './background.js';
import { setupRaycasting } from './raycasting.js';
import { clearInventory, items } from './inventory.js';
import { PointerLockControls } from './node_modules/three/examples/jsm/controls/PointerLockControls.js';
import { AudioManager } from './AudioManager.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const modal = document.getElementById('myModal');
const responses = document.getElementById('responses');
const closeModalBtn = document.getElementById('closeModal');
const helpButton = document.getElementById('helpButton');
const dontHelpButton = document.getElementById('dontHelpButton');
const catConversation = document.getElementById('catConversation')
const cat_model = 'public/models/TheCatGalaxyMeow4.glb';
let catObject; 
const meow = new Audio('public/sound/meow.wav');
let conversationText;
let astronaut;
const clock = new THREE.Clock();

let health = 80;
let healthElement = document.getElementById('healthBar');
let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');
let healthInterval; // To control the health timer


// Initialize AudioManager
const audioManager = new AudioManager();

// Initialize sounds with file paths
audioManager.loadSound('ambiance', 'public/sound/ambiance-sound.mp3', true, 0.5);
audioManager.loadSound('gameOver', 'public/sound/game-over.mp3', false, 0.5);
audioManager.loadSound('timerWarning', 'public/sound/beep-warning-6387.mp3', false, 0.5);
export let objectsToRaycast = [];

//for loading screen
let assetsToLoad = 164; 
let assetsLoaded = 0;  // Counter for loaded assets

//loading screen!!!
const loadingScreen = document.getElementById('loadingScreen');

function onAssetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === assetsToLoad) {
        loadingScreen.style.display = 'none'; // Hide loading screen 
        decreaseHealth();
    }
}


// ---------------Create the scene--------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);  // Set a background color for visibility
// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // Soft white light
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xb900ff, 80); // Red light with intensity 80
spotLight.position.set(0, 0,0); // Positioning the light above the ground

// Set the spotlight to shine directly downwards
spotLight.angle = Math.PI / 2; // Angle of the spotlight's cone (adjust if needed)
spotLight.penumbra = 0.1; // Soft edges of the spotlight
spotLight.decay = 2; // How quickly the light diminishes
spotLight.distance = 50; // The distance the light reaches

// Enable shadows if needed
spotLight.castShadow = true;

// Point the light directly downwards
spotLight.target.position.set(50, 0, 8); // Set the target to the ground (where the torch is pointing)
spotLight.target.updateMatrixWorld(); // Update the target matrix

// Add the spotlight to the scene
scene.add(spotLight);
scene.add(spotLight.target); // Add the target to the scene

const spaceTexture = new THREE.TextureLoader().load('public/textures/stars.jpg');
const spaceGeometry = new THREE.SphereGeometry(2000, 64, 64);
const spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });
const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(space);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(50, -10, 5);   // Set an initial camera position

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);  // Attach renderer's canvas to body


const controlsFirstPerson = new PointerLockControls(camera, renderer.domElement);
let isFirstPerson = false; // Starts in third-person view


// -------Orbit controls----------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;        // Enable damping (inertia)
controls.dampingFactor = 0.05;        // Damping inertia
controls.enableZoom = true;          // Disable zoom if desired
controls.enablePan = true;           // Disable pan if desired
controls.mouseButtons = {
    LEFT: null,
    MIDDLE: null,
    RIGHT: THREE.MOUSE.ROTATE
};


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
            lore();
            checkOxygen();
        } else {
            clearInterval(healthInterval); // Stop the timer when health reaches 0
            showDeathMessage();
            audioManager.stopSound('ambiance');
            audioManager.playSound('gameOver');
        }
    }, 4000); // Decrease health every 5 seconds
}

//cat warns you of the oxygen
function checkOxygen(){
    if(health == 30){
        meow.play();
        modal.style.display = 'flex';
        catConversation.textContent = `You are almost home. Don't dawdle.`;
        //timerWarningSound.play();
        // Keep the buttons hidden
        responses.style.display = 'none'; 
    }
}

function lore(){
    if(health == 99){
        meow.play();
        modal.style.display = 'flex';
        catConversation.textContent = `Luckily for you, Ms Fitzgerald has left her successors clues on how to return to Earth.`;

        setTimeout(() => { 
            conversationText = '';
            document.getElementById('catConversation').innerHTML = conversationText; 
            
            conversationText = 'Use this chance wisely so that no more lives will be forsaken.';
            document.getElementById('catConversation').innerHTML = conversationText; 

        }, 3000); 
    
        // Keep the buttons hidden
        responses.style.display = 'none'; 
    }
}

function toggleView() {
    isFirstPerson = !isFirstPerson;
  
    if (isFirstPerson) {
        // Ensure astronaut is loaded before trying to hide it
        if (astronaut) astronaut.visible = false;

        controls.enabled = false; // Disable OrbitControls
        controlsFirstPerson.enabled = true;
        controlsFirstPerson.lock(); // Lock pointer for first-person controls
  
        // Position the camera at the astronaut's head position
        if (astronaut) {
            camera.position.copy(astronaut.position);
            camera.position.y += 6; // Adjust for astronaut's eye height
        }
    } else {
        // Switch to third-person view
        controlsFirstPerson.unlock();
        controlsFirstPerson.enabled = false;
        controls.enabled = true;

        // Show the astronaut model again
        if (astronaut) astronaut.visible = true;

        // Position the camera behind the astronaut
        const offset = new THREE.Vector3(0, 10, -20); // Adjust as needed
        if (astronaut) {
            camera.position.copy(astronaut.position).add(offset);
        }

        // Update controls target
        if (astronaut) controls.target.copy(astronaut.position);
    }
}
document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyV') { // Press 'V' to toggle views
      toggleView();
    }
  });
  
  


export function startGame() {

   
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (exitMenu.style.display === 'none') {
                exitMenu.style.display = 'block'; // Show menu
            } else {
                exitMenu.style.display = 'none'; // Hide menu
            }
        }
    });
    
    const volumeControl = document.getElementById('volumeControl');
    volumeControl.addEventListener('input', function () {
        const volume = parseFloat(volumeControl.value);
        audioManager.setVolume('ambiance', volume);
        audioManager.setVolume('gameOver', volume);
        audioManager.setVolume('timerWarning', volume);
    });

    audioManager.playSound('ambiance');


//Function to load and apply texture to the moon model
loadModel('public/models/Moon.glb', scene, controls, camera, (astroObject) => {
    astroObject.scale.set(10, 10, 10);
    astroObject.position.set(-850, 100, 4);
    astroObject.name = 'asteroids';
    scene.add(astroObject);
    objectsToRaycast.push(astroObject);



    //setupRaycasting(camera, objectsToRaycast);
});
  
    
//Load the sun model
loadModel('public/models/sun1.glb', scene, controls, camera, (astroObject) => {
    // Scale and position the sun
    astroObject.scale.set(50, 50, 50);
    astroObject.position.set(1000, 100, 4);
    astroObject.name = 'sun';
    scene.add(astroObject);
    objectsToRaycast.push(astroObject);

    // Create a directional light to simulate sunlight
    const sunlight = new THREE.DirectionalLight(0x999793, 25); // White light, intensity 1
    sunlight.position.set(300, 100, 4); // Same position as the sun
    sunlight.target.position.set(0, 0, 0); // Target to illuminate towards the origin or another object
    scene.add(sunlight);
    scene.add(sunlight.target); // Ensure target is part of the scene to get directional lighting working

    // Optionally, you can add a slight light effect on the sun itself (not required for realism)
    const sunLightGlow = new THREE.PointLight(0xffcc33, 2, 500); // Orange-ish glow, intensity 2, range 500
    sunLightGlow.position.set(300, 100, 4); // Same position as the sun
    scene.add(sunLightGlow);
});


loadModel('public/models/earth1.glb', scene, controls, camera, (astroObject) => {
    astroObject.scale.set(25, 25, 25);
    astroObject.position.set(-950, 10, 4);
    astroObject.name = 'asteroids';
    scene.add(astroObject);
    objectsToRaycast.push(astroObject);



    //setupRaycasting(camera, objectsToRaycast);
});



loadModel('public/models/ground.glb', scene, controls, camera, (asteroid_groundObject) => {
    asteroid_groundObject.scale.set(50, 1, 50);  
    asteroid_groundObject.position.set(0, -1.5, 0);  
    scene.add(asteroid_groundObject);


    //paper objects for this level
    loadModel('public/models/paper/Paper.glb', scene, controls, camera, (PaperObject) => {
    PaperObject.scale.set(0.05, 0.05, 0.05);  
    PaperObject.position.set(-1, -0.5,187);  
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
   onAssetLoaded();
}, function (error) {
    console.error('Error loading envelope model:', error);
});




loadModel('public/models/paper/Toilet_paper.glb', scene, controls, camera, (ToiletPaperObject) => {
    ToiletPaperObject.scale.set(1.3, 1.3, 1.3);  
    ToiletPaperObject.position.set(-40, 0.7,-200);  
    ToiletPaperObject.name = 'Toilet paper';        
    scene.add(ToiletPaperObject);               
    objectsToRaycast.push(ToiletPaperObject);   

   setupRaycasting(camera, objectsToRaycast);  
   onAssetLoaded();
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
   onAssetLoaded();
}, function (error) {
    console.error('Error loading skull model:', error);
});

let carpet;

loadModel('public/models/Magic_Carpet.glb', scene, controls, camera, (CarpetObject) => {
    CarpetObject.scale.set(1.5, 1.5, 1.5);  
    CarpetObject.position.set(0, 0.1,0);
    CarpetObject.traverse((child) => {
        if (child.isMesh) {
            // Assign custom name or userData to ensure we're modifying the correct mesh
            child.name = 'magic-carpet'; // Set a specific name for this child object
            child.customId = 'magic-carpet'; // Alternatively, assign a custom ID
            
            // Store additional custom data if needed
            child.userData = { customId: 'magic-carpet' }; // Set custom user data for the mesh
        }
        onAssetLoaded();
    });
    
    carpet = CarpetObject;
    scene.add(CarpetObject);               
    objectsToRaycast.push(CarpetObject);   

   setupRaycasting(camera, objectsToRaycast);  
   onAssetLoaded();
}, function (error) {
    console.error('Error loading carpet model:',error);
});

    window.addEventListener('click', (event) => {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        if(carpet){
        const intersects = raycaster.intersectObjects(carpet.children, true);

        if (intersects.length > 0) {
                handleMagicCarpetClick();
            }
        }
 })

 const container = document.getElementById("codeInputContainer");

 function handleMagicCarpetClick() {
    // Show the input container when the carpet is clicked
    container.style.display = 'flex'; 

    // Focus on the input field
    const inputField = document.getElementById("codeInput");
    inputField.focus();

    const correctCode = "19402";
    const button = document.getElementById("winCheck");

    // Button click event handler
    button.onclick = function() {
        const userCode = inputField.value; // Get the user's input when the button is clicked
        console.log(userCode); // Log user input for debugging

        if (userCode === correctCode) {
            window.location.href = 'epilogue.html'
            container.style.display = 'none'; // Optionally hide the input container after winning
        } else {
            modal.style.display = 'flex';
            meow.play();
            conversationText = `That's not right. Try again, little astronaut.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
        }
    };
}

const close = document.getElementById('close');
close.addEventListener('click', () =>{
    container.style.display = 'none';
})

// To ensure focus when clicking on the input
const inputField = document.getElementById("codeInput");
inputField.addEventListener('click', () => {
    inputField.focus();
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
    setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});
loadModel('public/models/rocks/Stalactites_&_gems.glb', scene, controls, camera, (StalactitesObject) => {
    StalactitesObject.scale.set(30, 30, 30);
    StalactitesObject.position.set(230, 10, 0);
    StalactitesObject.name = 'Great tree'
    scene.add(StalactitesObject);
    //objectsToRaycast.push(RocketshipObject);
    characterControls.objectsToCollide.push(StalactitesObject);
    setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});

});




let characterControls;
loadModel('public/models/Walking_astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
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

   
    
    // Load the static model
    loadModel(cat_model, scene, controls, camera, (object, mixer, animationsMap) => {
        // console.log('Static model loaded:', object);
        object.scale.set(1, 1, 1);
        object.position.set(-10, 0, 10);
        object.rotation.y =  Math.PI / 2;

        catObject = object;
        scene.add(object);
        objectsToRaycast.push(catObject)
        //characterControls.objectsToCollide.push(object);
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
                    // console.log('Model clicked:', catObject);

                    modal.style.display = 'flex';
                    responses.style.display = 'none'; 
                    catConversation.textContent = `Can you still afford to ask me for help?`;
                    setTimeout(() => {
                        meow.play(); 
                    }, 1000);
                
                    catConversation.style.animation = 'none'; 
                    setTimeout(() => {
                        responses.style.display = 'flex'; 
                    }, 4000);
                }
            }
        });

// Event listener for 'Don't Help' button
dontHelpButton.addEventListener('click', () => {
    catConversation.style.animation = 'none';
    catConversation.textContent = `Why, of course.`;

    // Keep the buttons hidden
    responses.style.display = 'none'; 
});

function isItemInInventory(itemName) {
    return items[itemName] && items[itemName].count > 0;
}

    // Event listener for 'Help' button
    helpButton.addEventListener('click', () => {
        let conversationText;
    
        if (!isItemInInventory('Clue1')) {
            conversationText = `Have you thoroughly searched the comets?`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
    
            setTimeout(() => {
                meow.play(); 
                conversationText = '';
                document.getElementById('catConversation').innerHTML = conversationText; 
                
                conversationText = 'How sweet of Madam Fitzgerald to leave you these clues.';
                document.getElementById('catConversation').innerHTML = conversationText; 

            }, 3000); 
        }

        else if(!isItemInInventory('Clue2')){
            conversationText = `On my left.. once again. You might need this soon.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
    
            setTimeout(() => {
                meow.play();
                conversationText = '';
                document.getElementById('catConversation').innerHTML = conversationText; 
                
                conversationText = 'Have you figured out why you were sent here, memoryless?';
                document.getElementById('catConversation').innerHTML = conversationText; 

            }, 3000); 
        }

        else if(!isItemInInventory('Clue3')){
            conversationText = `Don't be afraid to search behind me as well.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
            meow.play();

            setTimeout(() => {
                meow.play();
                conversationText = '';
                document.getElementById('catConversation').innerHTML = conversationText; 
                
                conversationText = 'When you go back, make sure SPO is never allowed to send out another astronaut.';
                document.getElementById('catConversation').innerHTML = conversationText; 

            }, 3000); 
        }

        else if(!isItemInInventory('Clue4')){
            conversationText = `This asteroid does look extraterrestrial, doesn't it? That's not a human arch.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText; 
            meow.play();
        }

        else if(!isItemInInventory('Clue5')){
            conversationText = `Do you think flora is unique to Earth?`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
        }

        else{
            conversationText = `Help? But you have everything you need to proceed.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
        }

        responses.style.display = 'none';

        health -= 10;
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


// Render loop
function animate() {
    let delta = clock.getDelta();
    if (characterControls) {
      characterControls.update(delta, keysPressed, isFirstPerson);
    }
  
    if (astronaut) {
      if (isFirstPerson) {
        // In first-person view, camera follows astronaut's position
        camera.position.copy(astronaut.position);
        camera.position.y += 1.7; // Adjust for astronaut's eye height
      } else {
        // Third-person view
        const cameraOffset = camera.position.clone().sub(controls.target);
  
        // Update controls target to astronaut's position
        controls.target.copy(astronaut.position);
  
        // Update camera's position to maintain the offset
        camera.position.copy(astronaut.position).add(cameraOffset);
      }
    }
  
    if (isFirstPerson) {
  
      controlsFirstPerson.update();
    } else {
      controls.update();
    }
  
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

function restartLevel() {
    clearInventory();
    // Reset health
    health = 79;
    healthElement.innerHTML = `Oxygen: ${health}/100`;

    // Hide death and exit menus
    deathMessage.style.display = 'none';
    exitMenu.style.display = 'none';

    // Reset astronaut position and controls
    if (astronaut) {
        astronaut.position.set(50, 0, 5)
        astronaut.rotation.set(0, 0, 0); 
    }

    audioManager.playSound('ambiance');

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

