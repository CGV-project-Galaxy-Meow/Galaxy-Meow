import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';  // Import character controls
import './intro.js';
import { playerName } from './intro.js';
import { createSun } from './background.js';
import { setupRaycasting,setupPickupRaycasting} from './raycasting.js';
import { clearInventory, items } from './inventory.js';
import {positions, positions2, positionsQ, positionsGold, positionsBaseStone, positionsAstroidCluster} from './modelLocations.js'
import { AudioManager } from './AudioManager.js';
import { HealthManager } from './HealthManager.js';
import LightSetup from './LightSetup.js';


let exitMenu = document.getElementById('exitMenu');
let deathMessage = document.getElementById('deathMessage');
let characterControls;

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
const cat_model = 'public/models/TheCatGalaxyMeow4.glb';
const meow = new Audio('sound/meow.wav');


// Initialize AudioManager
const audioManager = new AudioManager();

// Initialize sounds with file paths
audioManager.loadSound('ambiance', 'public/sound/ambiance-sound.mp3', true, 0.5);
audioManager.loadSound('gameOver', 'public/sound/game-over.mp3', false, 0.5);
audioManager.loadSound('timerWarning', 'public/sound/beep-warning-6387.mp3', false, 0.5);

const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
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


let assetsToLoad = 202;
let assetsLoaded = 0;  // Counter for loaded assets

const loadingScreen = document.getElementById('loadingScreen');





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
// Add audio listener to the camera
audioManager.addListenerTo(camera);


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



//----functions----
// Initialize HealthManager with initial health and audio manager
const healthManager = new HealthManager(100, audioManager);



document.getElementById('bagIcon').style.display = 'none';
document.getElementById('startPiP').style.display = 'none';



function onAssetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === assetsToLoad) {
        loadingScreen.style.display = 'none'; // Hide loading screen 
       healthManager.startHealthDecrease();

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
    //decreaseHealth();
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


audioManager.playSound('ambiance');

  
const ambientConfig = { color: 0xffffff, intensity: 1.3};
const directionalConfig = { color: 0x999793, intensity: 25, position: { x: 0, y: 50, z: -50 } };
const spotlightConfig = [{
  color: 0xffa200,
  intensity: 70,
  position: { x: 50, y: 1, z: 8 },
  target: { x: 50, y: 0, z: 8 },
  angle: Math.PI / 3,
  penumbra: 0.2,
  decay: 2,
  distance: 60
}
]

new LightSetup(scene, ambientConfig, directionalConfig, spotlightConfig);

    createSun(scene);

    const spaceTexture = new THREE.TextureLoader().load('textures/stars.jpg');
    const spaceGeometry = new THREE.SphereGeometry(2000, 64, 64);
    const spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });
    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    scene.add(space);

    const earthTexture = new THREE.TextureLoader().load('textures/earth.jpg');
    const earthGeometry = new THREE.SphereGeometry(100, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, -1000);
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
    loadModel('public/models/Walking_astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
        astronaut = object;
        astronaut.scale.set(1.7, 1.7, 1.7);
        initialAstronautPosition.copy(astronaut.position);
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
    

    // Load the Moon Plane Model
    loadModel('models/moonground.glb', scene, controls, camera, (moonObject) => {
        moonObject.scale.set(1000, 1, 500);  // Scale it large enough to simulate an infinite ground
        moonObject.position.set(100, 0, 0);  // Place the plane below the astronaut
       // moonObject.rotation.x = -Math.PI / 2;  // Rotate the plane to make it horizontal
        scene.add(moonObject);



  // Load the American Flag Model
  loadModel('public/models/american_flag.glb', scene, controls, camera, (flagObject) => {
    flagObject.scale.set(1.7, 1.7, 1.7);
    flagObject.position.set(100, 5,100);
    flagObject.name = 'american_flag';
    scene.add(flagObject);
    objectsToRaycast.push(flagObject);
    setupRaycasting(camera, objectsToRaycast);
    onAssetLoaded();
});


        loadModel('public/models/oil_barrel.glb', scene, controls, camera, (barrelObject) => {
            barrelObject.scale.set(3.3, 3.3, 3.3);
            barrelObject.position.set(-28, 0, 53);
            barrelObject.name = 'barrel'
            scene.add(barrelObject);
            objectsToRaycast.push(barrelObject);

            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });

        loadModel('public/models/skull.glb', scene, controls, camera, (skullObject) => {
            skullObject.scale.set(0.6, 0.6, 0.6);
            skullObject.position.set(45, 0.3, 4);
            skullObject.name = 'skeleton';
            scene.add(skullObject);
            objectsToRaycast.push(skullObject);



            setupRaycasting(camera, objectsToRaycast);
            setupPickupRaycasting(camera, objectsToRaycast)
            onAssetLoaded();
        });

        loadModel('public/models/blueprint.glb', scene, controls, camera, (blueprintObject) => {
            blueprintObject.scale.set(5, 5, 5);
            blueprintObject.position.set(50, 1, 6);
            blueprintObject.name = 'blueprint';
            scene.add(blueprintObject);
            objectsToRaycast.push(blueprintObject);

            //console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });

        
        loadModel('public/models/batteries.glb', scene, controls, camera, (BatteryObject) => {
            BatteryObject.scale.set(0.5, 0.5, 0.5);
            BatteryObject.position.set(-179, 0, 58);

            BatteryObject.name = 'Battery'

            scene.add(BatteryObject);
            objectsToRaycast.push(BatteryObject);

            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });


        loadModel('public/models/Button.glb', scene, controls, camera, (ButtonObject) => {
            ButtonObject.scale.set(0.8, 0.8, 0.8);
            ButtonObject.position.set(210, 0, 294);
            ButtonObject.name = 'Button'
            scene.add(ButtonObject);
            objectsToRaycast.push(ButtonObject);

            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });


        loadModel('public/models/CircuitBoard.glb', scene, controls, camera, (CirctuitIObject) => {
            CirctuitIObject.scale.set(0.2, 0.2, 0.2);
            CirctuitIObject.position.set(-214, 0.4, -310);
            CirctuitIObject.name = 'Circuit Board'
            scene.add(CirctuitIObject);
            objectsToRaycast.push(CirctuitIObject);

            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });


        loadModel('public/models/antenna1.glb', scene, controls, camera, (antennaObject) => {
                 antennaObject.scale.set(12, 12, 12);
                antennaObject.position.set(0, 0, -300);
                antennaObject.traverse((child) => {
                    if (child.isMesh) {
                        // Assign custom name or userData here to ensure we're modifying the correct mesh
                        child.name = 'antenna';  // Set a specific name for this child object
                        child.customId = 'antenna'
                        
                         // Alternatively, store in child.userData if needed:
                         child.userData = { customId: 'antenna' };  // Set custom user data for the mesh
                    }
                    
                 });
                
                 scene.add(antennaObject);
                 objectsToRaycast.push(antennaObject);
    
    
    
                setupRaycasting(camera, objectsToRaycast);
                onAssetLoaded();
            });

        loadModel('public/models/console.glb', scene, controls, camera, (consoleObject) => {
            consoleObject.scale.set(0.7, 0.7, 0.7);
           consoleObject.position.set(305, 0.1, -80);
           //280, 0, -78 by the ruins
           consoleObject.traverse((child) => {
               if (child.isMesh) {
                  
                   child.name = 'console';  
                   child.customId = 'console'
                   
                    // Alternatively, store in child.userData if needed:
                    child.userData = { customId: 'console' };  // Set custom user data for the mesh
               }
            });
           
            scene.add(consoleObject);
            objectsToRaycast.push(consoleObject);

           setupRaycasting(camera, objectsToRaycast);
           onAssetLoaded();
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
                objectsToRaycast.push(RocksObject);
                characterControls.objectsToCollide.push(RocksObject); // Add to collision detection array
                setupRaycasting(camera, objectsToRaycast);
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
            
            objectsToRaycast.push(RockQObject);
            characterControls.objectsToCollide.push(RockQObject);
            setupRaycasting(camera, objectsToRaycast);
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
            objectsToRaycast.push(GoldRockObject);

            //  
            characterControls.objectsToCollide.push(GoldRockObject);
            setupRaycasting(camera, objectsToRaycast);
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
            objectsToRaycast.push(BasicRockObject);
            // 
            characterControls.objectsToCollide.push(BasicRockObject);
            setupRaycasting(camera, objectsToRaycast);
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
            objectsToRaycast.push(RockObject);

            characterControls.objectsToCollide.push(RockObject);
            setupRaycasting(camera, objectsToRaycast);
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
        objectsToRaycast.push(spaceRockObject);

        characterControls.objectsToCollide.push(spaceRockObject);
        setupRaycasting(camera, objectsToRaycast);
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
            objectsToRaycast.push(RubbleObject);

            // 
            characterControls.objectsToCollide.push(RubbleObject);
            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });
    });


        loadModel('public/models/rocks/Comet.glb', scene, controls, camera, (AstroidObject) => {
            AstroidObject.scale.set(1, 1, 1);
            AstroidObject.position.set(-200, -0.7, -300);
            AstroidObject.name = 'Comet'
            scene.add(AstroidObject);
            objectsToRaycast.push(AstroidObject);

            // 
            characterControls.objectsToCollide.push(AstroidObject);
            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });


        loadModel('public/models/Rocketship.glb', scene, controls, camera, (RocketshipObject) => {
            RocketshipObject.scale.set(3, 3, 3);
            RocketshipObject.position.set(-180, 12, 60);
            RocketshipObject.rotation.x += Math.PI / 3;
            RocketshipObject.rotation.z += 3*Math.PI / 4;
            RocketshipObject.name = 'Basic Rock'
            scene.add(RocketshipObject);
            objectsToRaycast.push(RocketshipObject);

            characterControls.objectsToCollide.push(RocketshipObject);
            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });

        loadModel('public/models/Ruin.glb', scene, controls, camera, (RuinObject) => {
            RuinObject.scale.set(8, 8, 8);
            RuinObject.position.set(280, 0, -78);
            RuinObject.name = 'Rubble Rock2'
            scene.add(RuinObject);
            objectsToRaycast.push(RuinObject);

           
            characterControls.objectsToCollide.push(RuinObject);
            setupRaycasting(camera, objectsToRaycast);
            onAssetLoaded();
        });


    });
   
    
    // Load the static model
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
    catConversation.textContent = `As you wish.`;

    // Keep the buttons hidden
    responses.style.display = 'none'; 
});

function isItemInInventory(itemName) {
    return items[itemName] && items[itemName].count > 0;
}

    // Event listener for 'Help' button
    helpButton.addEventListener('click', () => {
        let conversationText;
    
        if (!isItemInInventory('battery')) {
            conversationText = `Very well. The battery can be found near the vehicle you arrived here with.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
    
            setTimeout(() => {
                meow.play(); 
                conversationText = '';
                document.getElementById('catConversation').innerHTML = conversationText; 
                
                conversationText = 'I do wonder how such sound equipment managed to get destroyed.';
                document.getElementById('catConversation').innerHTML = conversationText; 

            }, 3000); 
        }

        else if(!isItemInInventory('button')){
            conversationText = `Perhaps you can ask Mr Neil Armstrong on the whereabouts of the button.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
    
            setTimeout(() => {
                meow.play();
                conversationText = '';
                document.getElementById('catConversation').innerHTML = conversationText; 
                
                conversationText = 'By the way, who was it that sent you here?';
                document.getElementById('catConversation').innerHTML = conversationText; 

            }, 3000); 
        }

        else if(!isItemInInventory('circuit')){
            conversationText = `You should venture near the fallen asteroid, ${playerName}.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
            meow.play();
        }

        else if(!isItemInInventory('console')){
            conversationText = `Ruins on the moon... How did they get here?`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText; 
            meow.play();
        }

        else if(!isItemInInventory('antenna')){
            conversationText = `Here comes the sun...`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
    
            setTimeout(() => {
                meow.play();
                conversationText = '';
                document.getElementById('catConversation').innerHTML = conversationText; 
                
                conversationText = 'Be careful, though. Humans are fragile.';
                document.getElementById('catConversation').innerHTML = conversationText; 

            }, 3000); 
        }

        else{
            conversationText = `Help? But you have everything you need to proceed, ${playerName}`;             
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

    //const clock = new THREE.Clock();
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
      

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}


function restartLevel() {
    clearInventory();
    healthManager.resetHealth(100);
    deathMessage.style.display = 'none';
    exitMenu.style.display = 'none';
    if (astronaut) astronaut.position.copy(initialAstronautPosition);
    
    audioManager.playSound('ambiance');
    
    healthManager.startHealthDecrease(); // Restart health decrease
}



document.addEventListener('DOMContentLoaded', () => {
    const volumeControl = document.getElementById('volumeControl');
    volumeControl.addEventListener('input', function () {
        const volume = parseFloat(volumeControl.value);
        audioManager.setVolume('ambiance', volume);
        audioManager.setVolume('gameOver', volume);
        audioManager.setVolume('timerWarning', volume);
    });
});
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