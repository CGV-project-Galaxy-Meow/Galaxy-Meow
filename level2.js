import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import {positions, positions2, positionsQ, positionsGold, positionsBaseStone, positionsAstroidCluster} from './modelLocations.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';

import { setupRaycasting } from './raycasting.js';


import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


const clock = new THREE.Clock();
let isFirstPerson = false;
let astronautHeight = 0;


let objectsToRaycast = []

// Check if WebGL is supported
// if (isWebGLAvailable()) {
//     console.log('WebGL is supported');
// } else {
//     document.body.appendChild(getWebGLErrorMessage());
// }



// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);  // Set a background color for visibility
// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  // Bright white light
directionalLight.position.set(0, 10, 10).normalize();  // Position the light
scene.add(directionalLight);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(50, 10, 2);   // Set an initial camera position
const pointerControls = new PointerLockControls(camera, document.body);
pointerControls.enabled = false; // Start with pointer controls disabled

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);  // Attach renderer's canvas to body

// Orbit controls

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;        // Enable damping (inertia)
controls.dampingFactor = 0.05;        // Damping inertia
controls.enableZoom = true;           // Enable zoom
controls.enablePan = true;            // Enable pan
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

// Load the texture
const textureLoader = new THREE.TextureLoader();
const marsTexture = textureLoader.load('textures/mars.jpeg', function (texture) {
    console.log('Texture loaded successfully');
}, undefined, function (err) {
    console.error('Error loading texture:', err);
});

// Function to load and apply texture to the moon model
loadModel('models/moonground.glb', scene, controls, camera, (marsObject) => {
    marsObject.traverse((child) => {
        if (child.isMesh) {
            // Apply the texture to the mesh material
            child.material.map = marsTexture;
            child.material.needsUpdate = true;  // Ensure the material updates with the new texture
        }
    });
    
    marsObject.scale.set(1000, 1, 500);  // Scale it large enough to simulate an infinite ground
    marsObject.position.set(100, 0, 0);  // Place the ground in the scene
    scene.add(marsObject);
    console.log('Ground model loaded and added to the scene');

    
    loadModel('models/Crystal1.glb', scene, controls, camera, (crystalObject) => {
        crystalObject.scale.set(0.2, 0.2, 0.2); // Set size of crystal
        crystalObject.position.set(288.8549386672509, 0.3, -81.84023356777789); // Position it relative to ground
        
        // Traverse the object to set custom properties
        crystalObject.traverse((child) => {
            if (child.isMesh) {
                // Assign custom name or userData to ensure we're modifying the correct mesh
                child.name = 'power-crystal'; // Set a specific name for this child object
                child.customId = 'power-crystal'; // Alternatively, assign a custom ID
                
                // Store additional custom data if needed
                child.userData = { customId: 'power-crystal' }; // Set custom user data for the mesh
            }
        });
    
        scene.add(crystalObject); // Add crystal object to the scene
        objectsToRaycast.push(crystalObject); // Add crystal object to raycasting array
    
        setupRaycasting(camera, objectsToRaycast); // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading crystal model:', error);
    });
    

    loadModel('models/space_crytal.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.2, 0.2, 0.2);  // Set size of skull
        skullObject.position.set(-211.47354442104583,0, -330.745265951462);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('models/red_crystal.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.1, 0.1, 0.1);  // Set size of skull
        skullObject.position.set(-203.48028357285114, -3,52.6573197913732);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('models/GLB.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(26, 26, 26);  // Set size of skull
        skullObject.position.set(-5.927182022763221, 0 ,-136.58502827742493);
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

    loadModel('models/chest.glb', scene, controls, camera, (skullObject) => {
        skullObject.scale.set(0.4, 0.4, 0.4);  // Set size of skull
        skullObject.position.set(65, 0, 7);  // Position it relative to ground
        skullObject.name = 'skeleton';         // Set a name for identification
        scene.add(skullObject);                // Add skull to the scene
        objectsToRaycast.push(skullObject);    // Add skull to raycasting array

       setupRaycasting(camera, objectsToRaycast);  // Initialize raycasting with new objects
    }, function (error) {
        console.error('Error loading skull model:', error);
    });

loadModel('models/model.glb', scene, controls, camera, (skullObject) => {
    skullObject.scale.set(1, 1, 1);  // Set size of skull
    skullObject.position.set(-17.359087005804316, -4,240.28950987634434);    // Position it relative to ground
    skullObject.name = 'skeleton';         

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('textures/red.png', (texture) => {
        skullObject.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texture;  // Apply texture to the material
                child.material.needsUpdate = true;
            }
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
});


loadModel('public/models/Rocketship.glb', scene, controls, camera, (RocketshipObject) => {
    RocketshipObject.scale.set(3, 3, 3);
    RocketshipObject.position.set(-180, 12, 60);
    RocketshipObject.rotation.x += Math.PI / 3;
    RocketshipObject.rotation.z += 3*Math.PI / 4;
    RocketshipObject.name = 'Basic Rock'
    scene.add(RocketshipObject);
    //objectsToRaycast.push(RocketshipObject);

    characterControls.objectsToCollide.push(RocketshipObject);
    //setupRaycasting(camera, objectsToRaycast);
});

loadModel('public/models/Ruin.glb', scene, controls, camera, (RuinObject) => {
    RuinObject.scale.set(8, 8, 8);
    RuinObject.position.set(280, 0, -78);
    RuinObject.name = 'Rubble Rock2'
    scene.add(RuinObject);
    //objectsToRaycast.push(RuinObject);

   
    characterControls.objectsToCollide.push(RuinObject);
    //setupRaycasting(camera, objectsToRaycast);
});


}, function (error) {
    console.error('Error loading ground model:', error);
});



let astronaut;
let characterControls;


loadModel('public/models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
    astronaut = object;
    astronaut.scale.set(1.7, 1.7, 1.7);
    astronaut.position.set(50, 0, 5);
    astronaut.rotation.x = 0;

    // Compute bounding box after scaling
    astronaut.boundingBox = new THREE.Box3().setFromObject(astronaut);
    astronautHeight = astronaut.boundingBox.max.y - astronaut.boundingBox.min.y;
    console.log("Astronaut height:", astronautHeight);

    characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');

    // Set camera initial position relative to astronaut for third-person view
    const initialOffset = new THREE.Vector3(0, 10, -20); // Adjust as needed
    camera.position.copy(astronaut.position).add(initialOffset);

    // Set initial controls target
    controls.target.copy(astronaut.position);

    controls.update();

});




const keysPressed = {};
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
    }
    keysPressed[event.key.toLowerCase()] = true;

    if (event.key.toLowerCase() === 'f') {
        isFirstPerson = !isFirstPerson; // Toggle first-person mode

        if (isFirstPerson) {
            controls.enabled = false;           // Disable OrbitControls
            pointerControls.enabled = true;     // Enable PointerLockControls
            pointerControls.lock();             // Lock pointer to the screen

            // Hide the astronaut model
            if (astronaut) astronaut.visible = false;

            // Set camera position and rotation to match astronaut
            if (astronaut) {
                const headPosition = new THREE.Vector3();
                headPosition.copy(astronaut.position);
                headPosition.y += astronautHeight * 0.9; // Adjust to the astronaut's eye level
                camera.position.copy(headPosition);

                // Set camera rotation to match astronaut's rotation
                camera.rotation.set(0, astronaut.rotation.y, 0);
            }
        } else {
            pointerControls.unlock();           // Unlock pointer
            pointerControls.enabled = false;    // Disable PointerLockControls
            controls.enabled = true;            // Enable OrbitControls

            // Show the astronaut model
            if (astronaut) astronaut.visible = true;

            // No need to set the camera position here since it's handled in animate()
        }
    }
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
            // First-person view adjustments
            const headPosition = new THREE.Vector3();
            headPosition.copy(astronaut.position);
            headPosition.y += astronautHeight * 0.9; // Adjust to the astronaut's eye level

            camera.position.copy(headPosition);

            // Sync the astronaut's rotation with the camera
            astronaut.rotation.y = camera.rotation.y;
        } else {
            // Third-person view adjustments

            // Compute the offset between the camera and the astronaut
            const cameraOffset = new THREE.Vector3();
            cameraOffset.copy(camera.position).sub(controls.target);


    if (astronaut) {
        // Compute the offset between camera and controls.target
        console.log("Astronaut position - X:", astronaut.position.x, "Y:", astronaut.position.y, "Z:", astronaut.position.z);
        const cameraOffset = camera.position.clone().sub(controls.target);

            // Update the controls target to the astronaut's position
            controls.target.copy(astronaut.position);


            // Update the camera position to maintain the offset
            camera.position.copy(astronaut.position).add(cameraOffset);
        }
    }

    // Update controls
    if (isFirstPerson) {
        // PointerLockControls handle camera rotation in first-person
        pointerControls.update();
    } else {
        // OrbitControls handle camera rotation in third-person
        controls.update();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


animate(); // Start the animation loop

animate();  // Start the animation loop
