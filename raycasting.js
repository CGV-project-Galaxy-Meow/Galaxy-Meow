import * as THREE from 'three';

import { showCrudeOilModal, showSkeletonModal , showBatteryModal, showGemsModal, showFlagModal, showCircuitModal, showButtonModal} from './modal.js';

<<<<<<< HEAD
=======
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
    'Object_3': {
        title: 'U.S Flag',
        description: 'USA KAWWHHH!!!',
        additionalInfo: 'Americans never made it to the moon by the way.',
        imgSrc: 'images/flag.png',
        itemName: 'flag'
    },
    'Object_5': {
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
    },
    'antenna': {
        title: 'Antenna',
        description: 'The antenna is useful for netowrk.',
        additionalInfo: 'In space exploration, you need a way to connect back to Earth.',
        imgSrc: items['antenna'].img,
        itemName: 'antenna'
    },
    'console': {
        title: 'Console',
        description: 'The final piece of the puzzle... or is it ?',
        additionalInfo: 'Did Margie ever see this ?',
        imgSrc: items['console'].img,
        itemName: 'console'
    }
};
>>>>>>> 270c5e6e2c74eebdbb4cc7d491968d0bb33dd3a3
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
            
        }
    });
    console.log(objectsToRaycast)
}
