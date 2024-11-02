import * as THREE from './node_modules/three/build/three.module.min.js';

import {showItemModal} from './modal.js';
import {items,,addItem} from "./inventory.js";


const itemDataMapping = {
    'Object_2': {
        title: 'M.S Fitzgerald',
        description: '19/04/02 - ??/??/22, Margie Sandy Fitzgerald was SPO\'s youngest assigned agent.',
        additionalInfo: 'What is her story ?',
        imgSrc: 'public/images/skull.png',
        itemName: 'skull'
    },
    'power-crystal': {
        title: 'Power Crystal',
        description: 'Basically a charger.',
        additionalInfo: 'Taking too many can be dangerous.',
        imgSrc: items['gems'].img,
        itemName: 'gems'
    },
    'Object_4': {
        title: 'U.S Flag',
        description: 'USA KAWWHHH!!!',
        additionalInfo: 'Americans never made it to the moon by the way.',
        imgSrc: 'public/images/flag.png',
        itemName: 'flag'
    },
    'Object_3': {
        title: 'U.S Flag',
        description: 'USA KAWWHHH!!!',
        additionalInfo: 'Americans never made it to the moon by the way.',
        imgSrc: 'public/images/flag.png',
        itemName: 'flag'
    },
    'Object_5': {
        title: 'U.S Flag',
        description: 'USA KAWWHHH!!!',
        additionalInfo: 'Americans never made it to the moon by the way.',
        imgSrc: 'public/images/flag.png',
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
        title: 'Clue',
        description: 'Part of a code.',
        additionalInfo: '1',
        imgSrc: items['Clue1'].img,
        itemName: 'Clue1'
    },
    'Cube_Cube001':{
        title: 'Clue',
        description: 'Part of a code.',
        additionalInfo: 'The first digit of Y2K.',
        imgSrc: items['Clue2'].img,
        itemName: 'Clue2'
    },
    'Debris_Papers_2':{
        title: 'Clue',
        description: 'Part of a code',
        additionalInfo: 'The number of triplets.',
        imgSrc: items['Clue3'].img,
        itemName: 'Clue3'
    },
    'Node-Mesh':{
        title: 'Clue',
        description: 'Part of a code',
        additionalInfo: 'What is 2 raised to the power of 2 ?',
        imgSrc: items['Clue4'].img,
        itemName: 'Clue4'
    },
    'Box003':{
        title: 'Clue',
        description: 'Part of a code',
        additionalInfo: 'Factorial question x! = 120 Find x.',
        imgSrc: items['Clue5'].img,
        itemName: 'Clue5'
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
            console.log("the clicked object :", clickedObject);
            
            if (clickedObject.name in itemDataMapping || clickedObject.userData.customId === 'power-crystal') {
                const itemData = itemDataMapping[clickedObject.name] || itemDataMapping[clickedObject.userData.customId];
                showItemModal(itemData);
            } else if (clickedObject.name === 'node_id31') {
                const blueprintOverlay = document.getElementById('blueprint-overlay');
                blueprintOverlay.style.display = 'block';
                
                // Add event listener to close the overlay when close button is clicked
                const closeButton = document.getElementById('close-blueprint');
                closeButton.addEventListener('click', function() {
                    blueprintOverlay.style.display = 'none';
                });


                
                
            }
        }

        
    });
}

let currentItemName = null; // Store the current item name

export function setupPickupRaycasting(camera, objectsToRaycast) {
    const raycaster = new THREE.Raycaster();

    const interactionPrompt = document.createElement("div");
    interactionPrompt.style.position = "fixed";
    interactionPrompt.style.bottom = "50px";
    interactionPrompt.style.left = "50%";
    interactionPrompt.style.transform = "translateX(-50%) translateY(-10%)";
    interactionPrompt.style.padding = "10px 20px";
    interactionPrompt.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    interactionPrompt.style.color = "#fff";
    interactionPrompt.style.fontSize = "36px";
    interactionPrompt.style.borderRadius = "5px";
    interactionPrompt.style.zIndex = "1000";
    interactionPrompt.style.display = "none";
    interactionPrompt.innerText = "Press E to interact. X to close modal. 1 to add items.";
    document.body.appendChild(interactionPrompt);

    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.bottom = "50px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%) translateY(-50%)";
    notification.style.padding = "10px 20px";
    notification.style.backgroundColor = "rgba(0, 128, 0, 0.7)";
    notification.style.color = "#fff";
    notification.style.fontSize = "24px";
    notification.style.borderRadius = "5px";
    notification.style.zIndex = "1000";
    notification.style.display = "none";
    notification.innerText = "Added to inventory";
    document.body.appendChild(notification);

    function checkProximity() {
        raycaster.set(camera.position, camera.getWorldDirection(new THREE.Vector3()));
        const intersects = raycaster.intersectObjects(objectsToRaycast, true);

        if (intersects.length > 0 && intersects[0].distance <= 20) {
            interactionPrompt.style.display = "block";
            currentItemName = itemDataMapping[intersects[0].object.name]?.itemName || null;
        } else {
            interactionPrompt.style.display = "none";
            currentItemName = null;
        }

        requestAnimationFrame(checkProximity);
    }
    
    checkProximity();

    window.addEventListener('keydown', (event) => {
        if (event.key === 'e' || event.key === 'E') {
            const intersects = raycaster.intersectObjects(objectsToRaycast, true);
            if (intersects.length > 0 && intersects[0].distance <= 20) {
                const targetObject = intersects[0].object;
                handlePickup(targetObject);
            } else {
                console.log("No object within pickup range.");
            }
        }

        if (event.key === '1' && currentItemName) {
            addItem(currentItemName);
            showNotification();
        }
    });

    function showNotification() {
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }

    function handlePickup(object) {
        if (object.name in itemDataMapping || object.userData.customId === 'power-crystal') {
            const itemData = itemDataMapping[object.name] || itemDataMapping[object.userData.customId];
            currentItemName = itemData.itemName;
            showItemModal(itemData);
        } else if (object.name === 'node_id31') {
            const blueprintOverlay = document.getElementById('blueprint-overlay');
            blueprintOverlay.style.display = 'block';
            const closeButton = document.getElementById('close-blueprint');
            closeButton.addEventListener('click', () => {
                blueprintOverlay.style.display = 'none';
            });

            window.addEventListener('keydown', function(event) {
                if (event.key === 'x' || event.key === 'X' && blueprintOverlay.style.display === 'block') {
                    blueprintOverlay.style.display = 'none';
                }
            });
        } else if (object.name === 'magic-carpet') {
            if (document.getElementById("codeInputContainer")) {
                handleMagicCarpetClick();
            }
        }
    }

    function handleMagicCarpetClick() {
        const container = document.getElementById("codeInputContainer");
        const inputField = document.getElementById("codeInput");
        const button = document.getElementById("winCheck");
        const correctCode = "19402";

        if (!container || !inputField || !button) return;

        container.style.display = 'flex';
        inputField.focus();
        inputField.value = '';

        button.onclick = checkCode;
        inputField.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') checkCode();
            if (event.key === 'x' || event.key === 'X') event.preventDefault();
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'x' || event.key === 'X') {
                container.style.display = 'none';
            }
        });

        function checkCode() {
            const userCode = inputField.value;
            if (userCode === correctCode) {
                window.location.href = 'epilogue.html';
                container.style.display = 'none';
            } else {
                const modal = document.getElementById("modal");
                if (modal) {
                    modal.style.display = 'flex';
                    const meow = new Audio('path/to/meow.mp3');
                    meow.play();
                    document.getElementById('catConversation').innerHTML = `That's not right. Try again, little astronaut.`;
                }
            }
        }
    }
}
