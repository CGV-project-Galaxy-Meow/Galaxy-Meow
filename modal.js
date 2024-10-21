import * as THREE from 'three';
import { addItem , items} from "./inventory";
import {camera, objectsToRaycast} from "./main.js";
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();




export function showCrudeOilModal() {
    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
    const helpButton = document.getElementById('helpButton2');
    const itemName = 'crudeOil';

    modal.style.display = 'block'; 

    // Set the modal content
    catConversation.innerHTML = `
        <h2>Crude Oil</h2>
        <p>Crude oil is a valuable resource used for many purposes.</p>
        <p>In space exploration, crude oil could be useful as an energy resource.</p>
    `;

    document.getElementById('catImage2').src = items[itemName].img;

    
    const responsesDiv = document.getElementById('responses2');
    responsesDiv.style.display = 'flex'; // Show the responses div

    // Set up the button's onclick event
    helpButton.onclick = function() {
        addItem(itemName); // Add the item to the inventory
        modal.style.display = 'none'; // Hide the modal after adding
    };

    // Close modal functionality
    document.getElementById('closeModal2').onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };
}

export function showSkeletonModal() {
    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
    const helpButton = document.getElementById('helpButton2');
    const itemName = 'skull';

    modal.style.display = 'block'; 

    // Set the modal content
    catConversation.innerHTML = `
        <h2>M.S Fitzgerald</h2>
        <p>12/09/67 - ??/??/2022, Margie Sandy Fitzgerald was SPO's first assigned agent.</p>
        <p>What is her story ?</p>
    `;

    document.getElementById('catImage2').src = 'images/skull.png';

    
    const responsesDiv = document.getElementById('responses2');
    responsesDiv.style.display = 'flex'; // Show the responses div

    // Set up the button's onclick event
    helpButton.onclick = function() {
        addItem(itemName); // Add the item to the inventory
        modal.style.display = 'none'; // Hide the modal after adding
    };

    // Close modal functionality
    document.getElementById('closeModal2').onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };
}

export function showFlagModal() {
    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
    const helpButton = document.getElementById('helpButton2');
    const itemName = 'flag';

    modal.style.display = 'block'; 

    // Set the modal content
    catConversation.innerHTML = `
        <h2>U.S Flag</h2>
        <p>USA KAWWHHH!!!</p>
        <p>Americans never made it the moon by the way.</p>
    `;

    document.getElementById('catImage2').src = 'images/flag.png';

    
    const responsesDiv = document.getElementById('responses2');
    responsesDiv.style.display = 'flex'; // Show the responses div

    // Set up the button's onclick event
    helpButton.onclick = function() {
        addItem(itemName); // Add the item to the inventory
        modal.style.display = 'none'; // Hide the modal after adding
    };

    // Close modal functionality
    document.getElementById('closeModal2').onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };
}

export function showBatteryModal() {
    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
    const helpButton = document.getElementById('helpButton2');
    const itemName = 'battery';

    modal.style.display = 'block'; 

    // Set the modal content
    catConversation.innerHTML = `
    <h2>Teleporter Batteries</h2>
    <p>These batteries are essential to powering high-energy devices.</p>
    <p>They hold immense potential, but handle with care—each charge could be your last hope of escape.</p>
`;


    document.getElementById('catImage2').src = items[itemName].img;

    
    const responsesDiv = document.getElementById('responses2');
    responsesDiv.style.display = 'flex'; // Show the responses div

    // Set up the button's onclick event
    helpButton.onclick = function() {
        addItem(itemName); // Add the item to the inventory
        modal.style.display = 'none'; // Hide the modal after adding
    };

    // Close modal functionality
    document.getElementById('closeModal2').onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };
}

export function showGemsModal() {
    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
    const helpButton = document.getElementById('helpButton2');
    const itemName = 'gems';

    modal.style.display = 'block'; 

    // Set the modal content
    catConversation.innerHTML = `
        <h2>Power Crystal</h2>
        <p>Basically a charger.</p>
        <p>Take as many as you need.</p>
    `;

    document.getElementById('catImage2').src = items[itemName].img;

    
    const responsesDiv = document.getElementById('responses2');
    responsesDiv.style.display = 'flex';

    // Set up the button's onclick event
    helpButton.onclick = function() {
        addItem(itemName); 
        modal.style.display = 'none'; 
    };


    document.getElementById('closeModal2').onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };
}

export function showCircuitModal() {
    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
    const helpButton = document.getElementById('helpButton2');
    const itemName = 'circuit';

    modal.style.display = 'block'; 

    // Set the modal content
    catConversation.innerHTML = `
    <h2>Circuit</h2>
    <p>A delicate web of connections, this circuit equivalent to a machines's heart </p>
    <p>Though fragile, it holds the key to bridging worlds—without it, escape is impossible.</p>
`;

    document.getElementById('catImage2').src = items[itemName].img;

    
    const responsesDiv = document.getElementById('responses2');
    responsesDiv.style.display = 'flex';

    // Set up the button's onclick event
    helpButton.onclick = function() {
        addItem(itemName); 
        modal.style.display = 'none'; 
    };


    document.getElementById('closeModal2').onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };
}

export function showButtonModal() {
    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
    const helpButton = document.getElementById('helpButton2');
    const itemName = 'button';

    modal.style.display = 'block'; 

    catConversation.innerHTML = `
    <h2>Activation Button</h2>
    <p>This button controls the sequence that will send you home.</p>
    <p>Once pressed, the teleportation process will begin—but be warned, there's no turning back.</p>
    <p>Make sure everything is in place before you press it.</p>
    `;


    document.getElementById('catImage2').src = items[itemName].img;

    
    const responsesDiv = document.getElementById('responses2');
    responsesDiv.style.display = 'flex';

    // Set up the button's onclick event
    helpButton.onclick = function() {
        addItem(itemName); 
        modal.style.display = 'none'; 
    };


    document.getElementById('closeModal2').onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };
}


export function showObjectModal() {
    const modal = document.getElementById('myModal2');
    modal.style.display = 'block';

    const itemName = 'gems'; 
    const catConversation = "You've found a precious gem!";

    document.getElementById('catConversation2').innerText = catConversation;
    document.getElementById('catImage').src = 'images/gems.png'; // Set the correct image

    document.getElementById('helpButton').onclick = function() {
        addItem(itemName); // Call the function to add the item to the inventory
        modal.style.display = 'none'; // Hide the modal after adding
    };
}

// Close modal logic
document.getElementById('closeModal2').onclick = function() {
    document.getElementById('myModal2').style.display = 'none';
};

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('myModal2');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(objectsToRaycast, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.name === 'barrel') {
            showCrudeOilModal(); // Show the modal when barrel is clicked
        }
    }
});