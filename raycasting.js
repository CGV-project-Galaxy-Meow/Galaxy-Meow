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
    },
    'polySurface67_group1':{

        title: 'Chest of Gold',
        description: 'Gold could be used as an energy source',
        additionalInfo: 'You might need the whole chest out here.',
        imgSrc: items['chest'].img,
        itemName: 'chest'

    },
    'object_0':{

        title: 'Lava Obsidian',
        description: 'A gem reminiscent of heat.',
        additionalInfo: 'One might say heat is necessary in all reactions.',
        imgSrc: items['redgem'].img,
        itemName: 'redgem'

    },
    'NGon001':{

        title: 'Red Ruby',
        description: 'Red Ruby is a known SPO energy source.',
        additionalInfo: 'Obviously pick this one up.',
        imgSrc: items['redruby'].img,
        itemName: 'redruby'

    },
    'Dimant':{

        title: 'Diamant',
        description: 'In 1932, many countries powered their ships with this.',
        additionalInfo: 'Well there is no ocean on Mars.',
        imgSrc: items['diamant'].img,
        itemName: 'diamant'

    },
    'Cube_0': {
        title: 'Jubilee Gem',
        description: 'A delicate gem crafted by the the JuJu extraterrestrial population.',
        additionalInfo: 'Its power is unknown.',
        imgSrc: items['jub'].img,
        itemName: 'jub'
    },
    'Node-Mesh_1':{
        title: 'Magic Carpet',
        description: 'Maybe you will finally get home.',
        additionalInfo: 'You have been here long enough I fear.',
        imgSrc: items['mat'].img,
        itemName: 'mat'
    },
    'Cube_Cube001':{
        title: 'Clue',
        description: 'Enter info',
        additionalInfo: 'Info',
        imgSrc: items['mat'].img,
        itemName: 'mat'
    },
    'Debris_Papers_2':{
        title: 'Clue',
        description: 'Enter info',
        additionalInfo: 'Enter ifnfo',
        imgSrc: items['mat'].img,
        itemName: 'mat'
    },
    'Node-Mesh':{
        title: 'Clue',
        description: 'Enter info',
        additionalInfo: 'Enter info',
        imgSrc: items['mat'].img,
        itemName: 'mat'
    },
    'Box003':{
        title: 'Clue',
        description: 'Enter info',
        additionalInfo: 'Enter info',
        imgSrc: items['mat'].img,
        itemName: 'mat'
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
        //console.log('Intersections:', intersects);

        // If an intersection is found, process it
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log("the clicked object :", clickedObject)
            if (clickedObject.name in itemDataMapping || clickedObject.userData.customId === 'power-crystal') {
                const itemData = itemDataMapping[clickedObject.name] || itemDataMapping[clickedObject.userData.customId];
                showItemModal(itemData);
            }
            else if(clickedObject.name ==='node_id31'){
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
    //console.log(objectsToRaycast)
}
