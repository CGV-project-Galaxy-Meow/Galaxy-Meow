import * as THREE from 'three';

import {showItemModal} from './modal.js';
import {items} from "./inventory";

const itemDataMapping = {
    'Object_2': {
        title: 'M.S Fitzgerald',
        description: '12/09/67 - ??/??/2022, Margie Sandy Fitzgerald was SPO\'s first assigned agent.',
        additionalInfo: 'What is her story ?',
        imgSrc: 'images/skull.png',
        itemName: 'skull'
    },
    'power-crystal': {
        title: 'Power Crystal',
        description: 'Basically a charger.',
        additionalInfo: 'Take as many as you need.',
        imgSrc: items['gems'].img,
        itemName: 'gems'
    },
    'Object_4': {
        title: 'U.S Flag',
        description: 'USA KAWWHHH!!!',
        additionalInfo: 'Americans never made it to the moon by the way.',
        imgSrc: 'images/flag.png',
        itemName: 'flag'
    },
    'Cylinder002': {
        title: 'Battery',
        description: 'These batteries are essential to powering high-energy devices.',
        additionalInfo: 'Each charge could be your last hope of escape.',
        imgSrc: items['battery'].img,
        itemName: 'battery'
    },
   
    'Cylinder004': {
        title: 'Battery',
        description: 'These batteries are essential to powering high-energy devices.',
        additionalInfo: 'Each charge could be your last hope of escape.',
        imgSrc: items['battery'].img,
        itemName: 'battery'
    },
    'Cube': {
        title: 'Circuit',
        description: 'A delicate web of connections, this circuit equivalent to a machine\'s heart.',
        additionalInfo: 'Without it, escape is impossible.',
        imgSrc: items['circuit'].img,
        itemName: 'circuit'
    },
    'Plane': {
        title: 'Circuit',
        description: 'A delicate web of connections, this circuit equivalent to a machine\'s heart.',
        additionalInfo: 'Without it, escape is impossible.',
        imgSrc: items['circuit'].img,
        itemName: 'circuit'
    },
    'Cylinder': {
        title: 'Activation Button',
        description: 'This button controls the sequence that will send you home.',
        additionalInfo: 'Once pressed, the teleportation process will begin—no turning back.',
        imgSrc: items['button'].img,
        itemName: 'button'
    },
    'Oil_Barrel_0001': {
        title: 'Crude Oil',
        description: 'Crude oil is a valuable resource used for many purposes.',
        additionalInfo: 'In space exploration, crude oil could be useful as an energy resource.',
        imgSrc: items['crudeOil'].img,
        itemName: 'crudeOil'
    }
};
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
            if (clickedObject.name in itemDataMapping || clickedObject.userData.customId === 'power-crystal') {
                const itemData = itemDataMapping[clickedObject.name] || itemDataMapping[clickedObject.userData.customId];
                showItemModal(itemData);
            }
            
        }
    });
    console.log(objectsToRaycast)
}
