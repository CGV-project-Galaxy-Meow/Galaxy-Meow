
import { addItem } from "./inventory.js";




export function showItemModal(itemDetails) {
    const { itemName, title, description, imgSrc, additionalInfo } = itemDetails;

// import { addItem , items} from "./inventory.js";
// import {camera, objectsToRaycast} from "./main.js";
// const mouse = new THREE.Vector2();
// const raycaster = new THREE.Raycaster();


// export function showCrudeOilModal() {
//     const modal = document.getElementById('myModal2');
//     const catConversation = document.getElementById('catConversation2');
//     const helpButton = document.getElementById('helpButton2');
//     const itemName = 'crudeOil';

//     modal.style.display = 'block'; 

//     // Set the modal content
//     catConversation.innerHTML = `
//         <h2>Crude Oil</h2>
//         <p>Crude oil is a valuable resource used for many purposes.</p>
//         <p>In space exploration, crude oil could be useful as an energy resource.</p>
//     `;

//     document.getElementById('catImage2').src = items[itemName].img;

    
//     const responsesDiv = document.getElementById('responses2');
//     responsesDiv.style.display = 'flex'; // Show the responses div

//     // Set up the button's onclick event
//     helpButton.onclick = function() {
//         addItem(itemName); // Add the item to the inventory
//         modal.style.display = 'none'; // Hide the modal after adding
//     };


   
    //console.log("Showing modal for item:", title, description, imgSrc, itemName);

    const modal = document.getElementById('myModal2');
    const catConversation = document.getElementById('catConversation2');
    const helpButton = document.getElementById('helpButton2');

    modal.style.display = 'block';

    catConversation.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    <p>${additionalInfo}</p>
`;


    document.getElementById('catImage2').src = imgSrc;

    const responsesDiv = document.getElementById('responses2');
    responsesDiv.style.display = 'flex';

    // Set up the button's onclick event
    helpButton.onclick = function () {
        addItem(itemName); // Add the item to the inventory
        modal.style.display = 'none'; // Hide the modal after adding
    };


    // Close modal functionality
    document.getElementById('closeModal2').onclick = function () {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}


// export function showGemsModal() {
//     const modal = document.getElementById('myModal2');
//     const catConversation = document.getElementById('catConversation2');
//     const helpButton = document.getElementById('helpButton2');
//     const itemName = 'gems';

//     modal.style.display = 'block'; 

//     // Set the modal content
//     catConversation.innerHTML = `
//         <h2>Power Crystal</h2>
//         <p>Basically a charger.</p>
//         <p>Take as many as you need.</p>
//     `;

//     document.getElementById('catImage2').src = items[itemName].img;

    
//     const responsesDiv = document.getElementById('responses2');
//     responsesDiv.style.display = 'flex';

//     // Set up the button's onclick event
//     helpButton.onclick = function() {
//         addItem(itemName); 
//         modal.style.display = 'none'; 
//     };


//     document.getElementById('closeModal2').onclick = function() {
//         modal.style.display = 'none';
//     };

//     // Close modal when clicking outside of it
//     window.onclick = function(event) {
//         if (event.target === modal) {
//             modal.style.display = 'none'; // Hide the modal
//         }
//     };
// }


// export function showObjectModal() {
//     const modal = document.getElementById('myModal2');
//     modal.style.display = 'block';

//     const itemName = 'gems'; 
//     const catConversation = "You've found a precious gem!";

//     document.getElementById('catConversation2').innerText = catConversation;
//     document.getElementById('catImage').src = 'public/images/gems.png'; // Set the correct image

//     document.getElementById('helpButton').onclick = function() {
//         addItem(itemName); // Call the function to add the item to the inventory
//         modal.style.display = 'none'; // Hide the modal after adding
//     };
// }


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

window.addEventListener('keydown', function(event) {
    const modal = document.getElementById('myModal2');
    if (event.key === 'x' || event.key === 'X') { // Check for both lowercase and uppercase "X"
        modal.style.display = 'none';
    }
});

export function showWinningModal() {
    const winningModal = document.getElementById('winningModal');
    winningModal.style.display = 'flex'; // Show the modal
}

export function showWinningModal_l2() {
    const winningModal = document.getElementById('winningModal_l2');
    winningModal.style.display = 'flex'; // Show the modal

    console.log('showWinningModall2')
}