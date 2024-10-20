import * as THREE from 'three';

import { showCrudeOilModal, showSkeletonModal , showBatteryModal} from './modal.js';

export function setupRaycasting(camera, objectsToRaycast) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();


    window.addEventListener('click', (event) => {
        // Normalize mouse position
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Set raycaster from the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check intersections only with the specific objects passed in
        const intersects = raycaster.intersectObjects(objectsToRaycast, true);
        console.log('Intersections:', intersects);

        // If an intersection is found, process it
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log("the clicked object :", clickedObject)
            // Check if the clicked object is the barrel
            if (clickedObject.name === 'Oil_Barrel_0001') {
                showCrudeOilModal();
                
            }
            else if (clickedObject.name === 'Object_2') {
                showSkeletonModal();
                
            }else if (clickedObject.name === 'Cylinder004') {
                
                
            }
        }
    });
    console.log(objectsToRaycast)
}
