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
import {positions, positions2, positionsQ, positionsGold, positionsBaseStone, positionsAstroidCluster} from './modelLocations.js'

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


    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x999793, 25);
    directionalLight.position.set(0, 50, -50).normalize();
    //directionalLight.castShadow = true;  // Enable shadows if needed
    scene.add(directionalLight);

    // Create a spotlight
const spotLight = new THREE.SpotLight(0xffa200, 80); // Red light with intensity 80
spotLight.position.set(50, 1, 8); // Positioning the light above the ground

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
    loadModel('public/models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
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
            barrelObject.scale.set(3.3, 3.3, 3.3);
            barrelObject.position.set(-28, 0, 53);
            barrelObject.name = 'barrel'
            scene.add(barrelObject);
            objectsToRaycast.push(barrelObject);

            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/skull.glb', scene, controls, camera, (skullObject) => {
            skullObject.scale.set(0.6, 0.6, 0.6);
            skullObject.position.set(45, 0.3, 4);
            skullObject.name = 'skeleton';
            scene.add(skullObject);
            objectsToRaycast.push(skullObject);



            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/blueprint.glb', scene, controls, camera, (blueprintObject) => {
            blueprintObject.scale.set(5, 5, 5);
            blueprintObject.position.set(50, 1, 6);
            blueprintObject.name = 'blueprint';
            scene.add(blueprintObject);
            objectsToRaycast.push(blueprintObject);

            //console.log(objectsToRaycast)
            setupRaycasting(camera, objectsToRaycast);
        });



        // loadModel('models/Crystal1.glb', scene, controls, camera, (CrystalObject) => {
        //     CrystalObject.scale.set(0.5, 0.5, 0.5);
        //     CrystalObject.position.set(290, 0.6, -80);
        //     //280, 0, -78 by the ruins
        //     CrystalObject.traverse((child) => {
        //         if (child.isMesh) {
        //             // Assign custom name or userData here to ensure we're modifying the correct mesh
        //             child.name = 'CrystalMesh';  // Set a specific name for this child object
        //             child.customId = 'power-crystal';  // Assign a custom property if you want
                    
        //             // Alternatively, store in child.userData if needed:
        //             child.userData = { customId: 'power-crystal' };  // Set custom user data for the mesh
        //         }
        //     });
            
        //     scene.add(CrystalObject);
        //     objectsToRaycast.push(CrystalObject);



        //     setupRaycasting(camera, objectsToRaycast);
        // });
        
        loadModel('models/batteries.glb', scene, controls, camera, (BatteryObject) => {
            BatteryObject.scale.set(0.5, 0.5, 0.5);
            BatteryObject.position.set(-181, 0, 70);

            BatteryObject.name = 'Battery'

            scene.add(BatteryObject);
            objectsToRaycast.push(BatteryObject);

            setupRaycasting(camera, objectsToRaycast);
        });
        loadModel('models/CircuitBoard.glb', scene, controls, camera, (CirctuitIObject) => {
            CirctuitIObject.scale.set(0.2, 0.2, 0.2);
            CirctuitIObject.position.set(-210, 0.4, -310);
            CirctuitIObject.name = 'Circuit Board'
            scene.add(CirctuitIObject);
            objectsToRaycast.push(CirctuitIObject);

            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('models/Button.glb', scene, controls, camera, (ButtonObject) => {
            ButtonObject.scale.set(0.8, 0.8, 0.8);
            ButtonObject.position.set(210, 0, 294);
            ButtonObject.name = 'Button'
            scene.add(ButtonObject);
            objectsToRaycast.push(ButtonObject);

            setupRaycasting(camera, objectsToRaycast);
        });


        loadModel('models/CircuitBoard.glb', scene, controls, camera, (CirctuitIObject) => {
            CirctuitIObject.scale.set(0.2, 0.2, 0.2);
            CirctuitIObject.position.set(-210, 0.4, -310);
            CirctuitIObject.name = 'Circuit Board'
            scene.add(CirctuitIObject);
            objectsToRaycast.push(CirctuitIObject);

            setupRaycasting(camera, objectsToRaycast);
        });

        loadModel('public/models/antenna1.glb', scene, controls, camera, (antennaObject) => {
            antennaObject.scale.set(5, 5, 5);
            antennaObject.position.set(0, 0, -300);
            antennaObject.name = 'Antenna'
            scene.add(antennaObject);
            objectsToRaycast.push(antennaObject);

            setupRaycasting(camera, objectsToRaycast);
        });
        loadModel('public/models/console.glb', scene, controls, camera, (consoleObject) => {
            consoleObject.scale.set(0.7, 0.7, 0.7);
            consoleObject.position.set(295, 0.1, -80);
            // by ruin 280, 0, -78
            consoleObject.name = 'Console'
            scene.add(consoleObject);
            objectsToRaycast.push(consoleObject);

            setupRaycasting(camera, objectsToRaycast);
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
            });
        });


        positionsQ.forEach((position) => {
        loadModel('public/models/rocks/RockQ.glb', scene, controls, camera, (RockQObject) => {
            const scaleFactor = Math.random() * 20 + 5; // Random size 
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
        });
    });



        positionsBaseStone.forEach((position) => {
        loadModel('public/models/rocks/basic_stone_3.glb', scene, controls, camera, (BasicRockObject) => {
            BasicRockObject.scale.set(50.8, 50.8, 50.8);
            //BasicRockObject.position.set(-80, 0, -190);
            BasicRockObject.position.copy(position);
            BasicRockObject.name = 'Basic Rock'
            scene.add(BasicRockObject);
            objectsToRaycast.push(BasicRockObject);
            // 
            characterControls.objectsToCollide.push(BasicRockObject);
            setupRaycasting(camera, objectsToRaycast);
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
        });

        loadModel('public/models/Ruin.glb', scene, controls, camera, (RuinObject) => {
            RuinObject.scale.set(8, 8, 8);
            RuinObject.position.set(280, 0, -78);
            RuinObject.name = 'Rubble Rock2'
            scene.add(RuinObject);
            objectsToRaycast.push(RuinObject);

           
            characterControls.objectsToCollide.push(RuinObject);
            setupRaycasting(camera, objectsToRaycast);
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