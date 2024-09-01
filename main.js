import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

//check if compatible with webGL




//set up scene, camera and renderer
const scene = new THREE.Scene();
//so the fields are: field of view, aspect ratio, then near and far clipping planes
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1 , 1000);
// can set where it is and where it is looking
camera.position,set(0,0,100);
camera.lookAt(0,0,0);

const renderer =  new THREE.WebGLRenderer();

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
