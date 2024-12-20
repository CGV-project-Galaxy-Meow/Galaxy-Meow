//Credits for astronaut model
//"Animated Floating Astronaut in Space Suit Loop" (https://skfb.ly/o9pPT) by LasquetiSpice is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).


// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// export function loadModel(path, scene, controls, camera, onLoadCallback) {
//     const loader = new GLTFLoader();

//     loader.load(
//         path,
//         function (gltf) {
//             const object = gltf.scene;
//             object.scale.set(0.5, 0.5, 0.5);
//             scene.add(object);

//             const animations = gltf.animations;
//             console.log('Available animations:', animations);

//             const mixer = new THREE.AnimationMixer(object);
//             const animationsMap = new Map();

//             animations.forEach((animation) => {
//                 console.log('Animation name:', animation.name);
//                 animationsMap.set(animation.name, mixer.clipAction(animation));
//             });

//             onLoadCallback(object, mixer, animationsMap);
//         },
//         function (xhr) {
//             console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//         },
//         function (error) {
//             console.error('An error occurred while loading the model:', error);
//         }
//     );
// }


// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// export function loadModel(path, scene, controls, camera, onLoadCallback) {
//     const loader = new GLTFLoader();

//     loader.load(
//         path,
//         function (gltf) {
//             const object = gltf.scene;
//             object.scale.set(0.5, 0.5, 0.5); // Scale down the model (adjust as needed)
//             scene.add(object);

//             // Check if the model has animations
//             const animations = gltf.animations;
//             console.log('Available animations:', animations);

//             if (animations && animations.length) {
//                 const mixer = new THREE.AnimationMixer(object);
//                 const animationsMap = new Map();

//                 animations.forEach((animation) => {
//                     console.log('Animation name:', animation.name);
//                     animationsMap.set(animation.name, mixer.clipAction(animation));
//                 });

//                 // Call the onLoadCallback with the object, mixer, and animationsMap
//                 onLoadCallback(object, mixer, animationsMap);
//             } else {
//                 // If there are no animations, just call the onLoadCallback with the object only
//                 onLoadCallback(object, null, null);
//             }
//         },
//         function (xhr) {
//            // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//         },
//         function (error) {
//             console.error('An error occurred while loading the model:', error);
//         }
//     );
// }

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { CharacterControls } from './characterControls';

export function loadModel(path, scene, controls, camera, onLoadCallback) {
    const loader = new GLTFLoader();

    loader.load(
        path,
        function (gltf) {
            const object = gltf.scene;
            object.scale.set(0.5, 0.5, 0.5); // Scale down the model (adjust as needed)
            scene.add(object);

            // Check if the model has animations
            const animations = gltf.animations;
            //console.log('Available animations:', animations);

            if (animations && animations.length) {
                const mixer = new THREE.AnimationMixer(object);
                const animationsMap = new Map();

                animations.forEach((animation) => {
                    console.log('Animation name:', animation.name);
                    animationsMap.set(animation.name, mixer.clipAction(animation));
                });

                // Call the onLoadCallback with the object, mixer, and animationsMap
                onLoadCallback(object, mixer, animationsMap);
            } else {
                // If there are no animations, pass null for mixer and animationsMap
                onLoadCallback(object, null, null);
            }
        },
        function (xhr) {
           // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error occurred while loading the model:', error);
        }
    );
}
