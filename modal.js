import { addItem } from "./inventory";




export function showItemModal(itemDetails) {
    const { itemName, title, description, imgSrc, additionalInfo } = itemDetails;

   
    console.log("Showing modal for item:", title, description, imgSrc, itemName);

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

export function showWinningModal() {
    const winningModal = document.getElementById('winningModal');
    winningModal.style.display = 'flex'; // Show the modal
}

export function showWinningModal_l2() {
    const winningModal = document.getElementById('winningModal_l2');
    winningModal.style.display = 'flex'; // Show the modal

    console.log('showWinningModall2')
}