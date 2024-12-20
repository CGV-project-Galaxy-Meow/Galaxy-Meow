import * as THREE from 'three';
//import { playerName } from './intro.js';
import {positions, positions2, positionsQ, positionsGold, positionsBaseStone, positionsAstroidCluster} from './modelLocations.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createSun } from './background.js';
import { AudioManager } from './AudioManager.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';
import { setupRaycasting,setupPickupRaycasting } from './raycasting.js';
import { clearInventory, items } from './inventory.js';
import LightSetup from './LightSetup.js';
import { HealthManager } from './HealthManager.js';

let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const modal = document.getElementById('myModal');
const responses = document.getElementById('responses');
const closeModalBtn = document.getElementById('closeModal');
const helpButton = document.getElementById('helpButton');
const dontHelpButton = document.getElementById('dontHelpButton');
const catConversation = document.getElementById('catConversation')
const cat_model = 'public/models/TheCatGalaxyMeow4.glb';
let astronaut;
let catObject;
const meow = new Audio('sound/meow.wav');
let conversationText;



// Initialize AudioManager
const audioManager = new AudioManager();

// Initialize sounds with file paths
audioManager.loadSound('ambiance', 'public/sound/ambiance-sound.mp3', true, 0.5);
audioManager.loadSound('gameOver', 'public/sound/game-over.mp3', false, 0.5);
audioManager.loadSound('timerWarning', 'public/sound/beep-warning-6387.mp3', false, 0.5);

const healthManager = new HealthManager(90, audioManager);



const clock = new THREE.Clock();
let objectsToRaycast = []

let assetsToLoad = 207;
let assetsLoaded = 0;  // Counter for loaded assets

const loadingScreen = document.getElementById('loadingScreen');

function onAssetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === assetsToLoad) {
        loadingScreen.style.display = 'none'; // Hide loading screen 
        healthManager.startHealthDecrease();
    }
}

// ---------Create the scene--------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);  // Set a background color for visibility


const ambientConfig = { color: 0xffffff, intensity: 0.5};
const directionalConfig = { color: 0x999793, intensity: 25, position: { x: 0, y: 50, z: -50 } };

new LightSetup(scene, ambientConfig, directionalConfig);
createSun(scene);


const spaceTexture = new THREE.TextureLoader().load('public/textures/test2.webp');
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


//----functions----



function lore(){
    if(health >= 69 && health <= 79){
        meow.play();
        modal.style.display = 'flex';
        catConversation.textContent = `SPO's first agent, Ms M.S Fitgerald was also the first to learn of their corruption.`;

        setTimeout(() => { 
            conversationText = '';
            document.getElementById('catConversation').innerHTML = conversationText; 
            
            conversationText = 'And look at how she ended up.';
            document.getElementById('catConversation').innerHTML = conversationText; 

        }, 3000); 
    
        // Keep the buttons hidden
        responses.style.display = 'none'; 
    }
}


// Reference to the view mode message element
const viewModeMessage = document.getElementById('viewModeMessage');

// Function to update the view mode message
function updateViewModeMessage() {
    const modeText = isFirstPerson ? "First Person View" : "Third Person View";
    viewModeMessage.textContent = `${modeText} - Press V to switch`;
    
    // Briefly animate the opacity for emphasis
    viewModeMessage.style.opacity = '0';
    setTimeout(() => {
        viewModeMessage.style.opacity = '1';
    }, 100);
}

// Update view mode when toggling views
function toggleView() {
    isFirstPerson = !isFirstPerson;
  
    if (isFirstPerson) {
        if (astronaut) astronaut.visible = false;
        controls.enabled = false;
        controlsFirstPerson.enabled = true;
        controlsFirstPerson.lock();

        if (astronaut) {
            camera.position.copy(astronaut.position);
            camera.position.y += 6;
        }
    } else {
        controlsFirstPerson.unlock();
        controlsFirstPerson.enabled = false;
        controls.enabled = true;

        if (astronaut) astronaut.visible = true;
        const offset = new THREE.Vector3(0, 10, -20);
        if (astronaut) {
            camera.position.copy(astronaut.position).add(offset);
        }

        if (astronaut) controls.target.copy(astronaut.position);
    }
    
    // Update the message whenever the view is toggled
    updateViewModeMessage();
}

// Initial message update on page load
updateViewModeMessage();

// Keydown event listener to toggle view mode on 'V' key press
document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyV') {
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

    
// Load the texture
const textureLoader = new THREE.TextureLoader();
const marsTexture = textureLoader.load('textures/mars.jpeg', function (texture) {
    console.log('Texture loaded successfully');
}, undefined, function (err) {
    console.error('Error loading texture:', err);
});

// Function to load and apply texture to the moon model
loadModel('public/models/moonground.glb', scene, controls, camera, (marsObject) => {
    marsObject.traverse((child) => {
        if (child.isMesh) {
            // Apply the texture to the mesh material
            child.material.map = marsTexture;
            child.material.needsUpdate = true;  // Ensure the material updates with the new texture
            onAssetLoaded();
        }
    });
    
    marsObject.scale.set(1000, 1, 500);  // Scale it large enough to simulate an infinite ground
    marsObject.position.set(100, 0, 0);  // Place the ground in the scene
    scene.add(marsObject);
    //console.log('Ground model loaded and added to the scene');

    
    loadModel('public/models/Crystal1.glb', scene, controls, camera, (crystalObject) => {
        crystalObject.scale.set(0.3, 0.3, 0.3); // Set size of crystal
        crystalObject.position.set(258.8549386672509, 0.3, -81.84023356777789); // Position it relative to ground
        
        // Traverse the object to set custom properties
        crystalObject.traverse((child) => {
            if (child.isMesh) {
                // Assign custom name or userData to ensure we're modifying the correct mesh
                child.name = 'power-crystal'; // Set a specific name for this child object
                child.customId = 'power-crystal'; // Alternatively, assign a custom ID
                
                // Store additional custom data if needed
                child.userData = { customId: 'power-crystal' }; // Set custom user data for the mesh
            }
            onAssetLoaded();
        });
    
        scene.add(crystalObject); // Add crystal object to the scene
        objectsToRaycast.push(crystalObject); // Add crystal object to raycasting array
    
        setupRaycasting(camera, objectsToRaycast); 
        setupPickupRaycasting(camera, objectsToRaycast)
    }, function (error) {
        console.error('Error loading crystal model:', error);
    });
    

    loadModel('public/models/space_crytal.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.2, 0.2, 0.2);  // Set size 
        skullObject.position.set(-211.47354442104583,0, -330.745265951462);  
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);               
        objectsToRaycast.push(skullObject);    // Add  to raycasting array

       setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
       onAssetLoaded();
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('public/models/red_crystal.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.1, 0.1, 0.1);  // Set size of skull
        skullObject.position.set(-203.48028357285114, -3,52.6573197913732);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
       onAssetLoaded();
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('public/models/GLB.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(80, 80, 80);  // Set size of skull
        skullObject.position.set(-5.927182022763221, 0, -136.58502827742493);
        const textureLoader = new THREE.TextureLoader();
        const skullTexture = textureLoader.load('textures/blue.jpg')
    
        // Traverse the object and apply the texture
        skullObject.traverse((child) => {
            if (child.isMesh) {
                // Apply texture to the material
                if (child.material) {
                    child.material.map = skullTexture; // Set the texture map
                    child.material.needsUpdate = true; // Flag material for update
                    onAssetLoaded();
                }
            }
        });
    
        scene.add(skullObject);                // Add skull to the scene
        objectsToRaycast.push(skullObject);    // Add skull to raycasting array
    
        setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('public/models/chest.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.4, 0.4, 0.4);  // Set size of skull
        skullObject.position.set(65, 0, 7);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
       onAssetLoaded();
    }, function (error) {
        console.error('Error loading skull model:', error);

    });


loadModel('public/models/model.glb', scene, controls, camera, (skullObject) => {
    skullObject.scale.set(1, 1, 1);  // Set size of skull
    skullObject.position.set(-17.359087005804316, -4,240.28950987634434);    // Position it relative to ground

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('textures/red.png', (texture) => {
        skullObject.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texture;  // Apply texture to the material
                child.material.needsUpdate = true;
            }
            onAssetLoaded();
        });
    }, undefined, function (error) {
        console.error('Error loading texture:', error);
    });

    // Add skull to the scene
    scene.add(skullObject);
    objectsToRaycast.push(skullObject);  // Uncomment to add to raycasting array
    setupRaycasting(camera, objectsToRaycast);  // Uncomment if needed
}, function (error) {
    console.error('Error loading skull model:', error);
});
// Load the model for each position in the array
positions.forEach((position) => {
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


positionsQ.forEach((position) => {
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

positionsGold.forEach((position) => {
loadModel('public/models/rocks/Gold_Rocks.glb', scene, controls, camera, (GoldRockObject) => {

    const scaleFactor = Math.random() * 40 + 5; // Random size 
    GoldRockObject.scale.set(scaleFactor, scaleFactor, scaleFactor); // Set the model size
    //GoldRockObject.scale.set(40.8, 40.8, 40.8);
    //GoldRockObject.position.set(-76, 0, 34);
    GoldRockObject.position.copy(position);
    GoldRockObject.rotation.y = Math.random() * Math.PI * 2;

    GoldRockObject.name = 'Gold Rocks'
    scene.add(GoldRockObject);
    //objectsToRaycast.push(GoldRockObject);

    //  
    characterControls.objectsToCollide.push(GoldRockObject);
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


positions2.forEach((position) => {
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


positionsAstroidCluster.forEach((position) => {
loadModel('public/models/rocks/space_rock.glb', scene, controls, camera, (spaceRockObject) => {
//spaceRockObject.scale.set(10.5, 10.5, 10.5);
const scaleFactor = Math.random() * 5 + 5; // Random size 
spaceRockObject.scale.set(scaleFactor, scaleFactor, scaleFactor); // Set the model size
spaceRockObject.position.copy(position);
spaceRockObject.rotation.y = Math.random() * Math.PI * 2;

spaceRockObject.position.copy(position);
spaceRockObject.name = 'Round Space Rock'
scene.add(spaceRockObject);
//objectsToRaycast.push(spaceRockObject);

characterControls.objectsToCollide.push(spaceRockObject);
//setupRaycasting(camera, objectsToRaycast);
onAssetLoaded();
});
});

const positionRubble = [
new THREE.Vector3(-185, 0, 60),
new THREE.Vector3(-192, -3, -300)
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


loadModel('public/models/rocks/Comet.glb', scene, controls, camera, (AstroidObject) => {
    AstroidObject.scale.set(1, 1, 1);
    AstroidObject.position.set(-200, -0.7, -300);
    AstroidObject.name = 'Comet'
    scene.add(AstroidObject);
   /// objectsToRaycast.push(AstroidObject);

    // 
    characterControls.objectsToCollide.push(AstroidObject);
   // setupRaycasting(camera, objectsToRaycast);
   onAssetLoaded();
});


loadModel('public/models/Flying_saucer.glb', scene, controls, camera, (RocketshipObject) => {
    RocketshipObject.scale.set(0.1, 0.1, 0.1);
    RocketshipObject.position.set(-180, 12, 60);
    RocketshipObject.rotation.x += Math.PI / 3;
    RocketshipObject.rotation.z += 3*Math.PI / 4;
    RocketshipObject.name = 'UFO'
    scene.add(RocketshipObject);
    //objectsToRaycast.push(RocketshipObject);

    characterControls.objectsToCollide.push(RocketshipObject);
    //setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});

const positionRuin = [
    new THREE.Vector3(280, 0, -78),
    new THREE.Vector3(302, 0, -109),
    new THREE.Vector3(-292, 0, -10)
    ];
positionRuin.forEach((position) => {
loadModel('public/models/Ruin.glb', scene, controls, camera, (RuinObject) => {
    RuinObject.scale.set(8, 8, 8);
    //RuinObject.position.set(280, 0, -78);
    RuinObject.position.copy(position);
    RuinObject.name = 'Rubble Rock2'
    scene.add(RuinObject);
    //objectsToRaycast.push(RuinObject);

   
    characterControls.objectsToCollide.push(RuinObject);
    //setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});
});


}, function (error) {
    console.error('Error loading ground model:', error);
});




let characterControls;
loadModel('public/models/Walking_astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
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
    onAssetLoaded();
});


loadModel(cat_model, scene, controls, camera, (object, mixer, animationsMap) => {
    console.log('Static model loaded:', object);
    object.scale.set(1, 1, 1);
    object.position.set(-10, 0, -10);
    object.rotation.y =  Math.PI / 2;

    catObject = object;
    scene.add(object);
    objectsToRaycast.push(catObject)
    //characterControls.objectsToCollide.push(object);
    setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
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
                catConversation.textContent = `Ah, I see that you continue to require assisstance.`;

                setTimeout(() => {
                    meow.play(); 
                }, 1000);
            
                catConversation.style.animation = 'none'; 
                setTimeout(() => {
                    responses.style.display = 'flex'; 
                }, 3000);
            }
        }
    });

// Event listener for 'Don't Help' button
dontHelpButton.addEventListener('click', () => {
catConversation.style.animation = 'none';
catConversation.textContent = `Our lost astronaut has become so brave.`;

// Keep the buttons hidden
responses.style.display = 'none'; 
});

function isItemInInventory(itemName) {
return items[itemName] && items[itemName].count > 0;
}

// Event listener for 'Help' button
helpButton.addEventListener('click', () => {
    let conversationText;

    if(!isItemInInventory('redruby')){
        conversationText = `That spacecraft was defective as well... just like yours.`;             
        document.getElementById('catConversation').innerHTML = conversationText;
        catConversation.textContent = conversationText;

        setTimeout(() => {
            meow.play(); 
            conversationText = '';
            document.getElementById('catConversation').innerHTML = conversationText; 
            
            conversationText = `Why do they keep sending you here to die?`;
            document.getElementById('catConversation').innerHTML = conversationText; 

        }, 3000); 

    }

    else if (!isItemInInventory('jub')) {
        conversationText = `Hm? There's an asteroid on Mars as well?`;             
        document.getElementById('catConversation').innerHTML = conversationText;
        catConversation.textContent = conversationText;

        setTimeout(() => {
            meow.play(); 
            conversationText = '';
            document.getElementById('catConversation').innerHTML = conversationText; 
            
            conversationText = `You humans are so very lucky to have Earth's atmosphere.`;
            document.getElementById('catConversation').innerHTML = conversationText; 

        }, 3000); 
    }

    else if(!isItemInInventory('gems')){
        conversationText = `Mars is rumoured to hold its own civilizations.`;             
        document.getElementById('catConversation').innerHTML = conversationText;
        catConversation.textContent = conversationText;

        setTimeout(() => {
            meow.play(); 
            conversationText = '';
            document.getElementById('catConversation').innerHTML = conversationText; 
            
            conversationText = `The need for concrete structures... I'll never understand it.`;
            document.getElementById('catConversation').innerHTML = conversationText; 

        }, 3000); 
    }

    else if(!isItemInInventory('redgem')){
        meow.play(); 
        conversationText = `Drift rightward. My right, that is.. and you may find something worth looking for.`;             
        document.getElementById('catConversation').innerHTML = conversationText;
        catConversation.textContent = conversationText; 
    }

    else if(!isItemInInventory('diamant')){
        meow.play(); 
        conversationText = `What about searching to the left this time?`;             
        document.getElementById('catConversation').innerHTML = conversationText;
        catConversation.textContent = conversationText;
    }

    else{
        meow.play(); 
        conversationText = `Help? But you have everything you need to proceed`;             
        document.getElementById('catConversation').innerHTML = conversationText;
        catConversation.textContent = conversationText;
    }

    responses.style.display = 'none';

     // Use HealthManager to decrease health by 10 points for the cat interaction
 healthManager.decreaseHealthBy(10);
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
      // Use HealthManager's reset method
      healthManager.resetHealth(90);

    // Hide death and exit menus
    deathMessage.style.display = 'none';
    exitMenu.style.display = 'none';

    // Reset astronaut position and controls
    if (astronaut) {
        astronaut.position.set(50, 0, 5)
        astronaut.rotation.set(0, 0, 0); 
    }

    
    audioManager.playSound('ambiance');
    healthManager.startHealthDecrease(); // Restart health decrease
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
}
