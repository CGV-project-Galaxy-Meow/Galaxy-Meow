import * as THREE from 'three';

import { showCrudeOilModal, showSkeletonModal , showBatteryModal, showGemsModal, showFlagModal, showCircuitModal, showButtonModal} from './modal.js';

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
            if (clickedObject.name === 'Oil_Barrel_0001') {
                showCrudeOilModal();
                
            }
            else if (clickedObject.name === 'Object_2') {
                showSkeletonModal();
                
            }else if (clickedObject.userData.customId === 'power-crystal') {
                   showGemsModal();
            }
            else if (clickedObject.name === 'Object_4' ||clickedObject.name === 'Object_3' ||clickedObject.name === 'Object_5' ) {
                showFlagModal();
            }
            else if (clickedObject.name === 'Cylinder004' || clickedObject.name === 'Cylinder002') {
                showBatteryModal();
            }else if (clickedObject.name === 'Cube' || clickedObject.name === 'Plane') {
                showCircuitModal();
            }else if(clickedObject.name === 'Cylinder'){
                showButtonModal();
            }
            else if(clickedObject.name ==='blueprint'){
                const blueprintOverlay = document.getElementById('blueprint-overlay');
                blueprintOverlay.style.display = 'block';
                
                // Add event listener to close the overlay when "X" is clicked
                const closeButton = document.getElementById('close-blueprint');
                closeButton.addEventListener('click', function() {
                    blueprintOverlay.style.display = 'none';
                });
            }
            
        }
    });
    console.log(objectsToRaycast)
}
