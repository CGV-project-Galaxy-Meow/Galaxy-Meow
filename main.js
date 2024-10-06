import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './model_loader.js';  // Import model loader
import { CharacterControls } from './characterControls.js';  // Import character controls
//check if compatible with webGL




//set up scene, camera and renderer
const scene = new THREE.Scene();
//so the fields are: field of view, aspect ratio, then near and far clipping planes
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1 , 1000);
// can set where it is and where it is looking
camera.position.set(0,0,10);
camera.lookAt(0,0,0);

const renderer =  new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

//set the size in which we want to render our app
//to render at lower resolution -> setSize(window.innerWidth/2, window.innerHeight/2, false)
renderer.setSize(window.innerWidth,window.innerHeight);


//add renderer element to document 
document.body.appendChild(renderer.domElement);


if(WebGL.isWebGL2Available()){
    //do animations
}
else{

    const warning_message = WebGL.getWebGl2ErrorMessage();
    //print to screen if we want
    //document.getElementById( 'container' ).appendChild( warning );
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // White color with moderate intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White color with higher intensity
directionalLight.position.set(5, 10, 7.5).normalize(); // Position the light and normalize
scene.add(directionalLight);

// Optional: Add a point light for better visibility
const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White point light with high intensity and distance
pointLight.position.set(0, 5, 0); // Position the light above the model
scene.add(pointLight);


// Load the model and apply controls
let characterControls;
loadModel('models/Walking Astronaut.glb', scene, controls, camera, (object, mixer, animationsMap) => {
    characterControls = new CharacterControls(object, mixer, animationsMap, controls, camera, 'idle');
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

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});