
// Select all inventory slots
const inventorySlots = document.querySelectorAll('.inventory-slot');

// Define the available items and their images
const items = {
    gems: 'images/gems.png',
    sword: 'images/sword.png',
    potion: 'images/potion.png'
};

// Function to find the next available slot
function getNextAvailableSlot() {
    for (let slot of inventorySlots) {
        if (slot.children.length === 0) {
            return slot; // Return the first empty slot
        }
    }
    return null; // No available slot
}

// Function to add an item to a specific slot
function addItemToSlot(slot, itemName) {
    if (items[itemName]) { // Check if the item exists in the items object
        const itemImage = document.createElement('img');
        itemImage.src = items[itemName];
        slot.appendChild(itemImage);
    } else {
        console.warn(`Item "${itemName}" not found in items.`);
    }
}

// Function to add an item to the next available slot
function addItem(itemName) {
    const availableSlot = getNextAvailableSlot();
    if (availableSlot) {
        addItemToSlot(availableSlot, itemName);
    } else {
        alert('Inventory is full!');
    }
}

// Function to remove an item from a specific slot
function removeItemFromSlot(slot) {
    if (slot.firstChild) {
        slot.removeChild(slot.firstChild);
    }
}

// Add event listeners for in-game items
const gameItems = document.querySelectorAll('.game-item'); // Select all in-game clickable items
gameItems.forEach(item => {
    item.addEventListener('click', () => {
        const itemName = item.getAttribute('data-item'); // Get item name from a custom attribute
        addItem(itemName); // Add the clicked item to the inventory
        item.style.display = 'none'; // Hide the item in the game after it's picked up
    });
});

// Example of initializing game items
// Add this to your HTML for interactive items:
// <div class="game-item" data-item="gems"></div>
// <div class="game-item" data-item="sword"></div>
// <div class="game-item" data-item="potion"></div>



function toggleInventory() {
    const inventory = document.getElementById('inventory');
    
   
    if (inventory.style.display === 'none' || inventory.style.display === '') {
        inventory.style.display = 'grid'; 
    } else {
        inventory.style.display = 'none'; 
    }
}

const bagIcon = document.getElementById('bagIcon');
bagIcon.addEventListener('click', toggleInventory);


