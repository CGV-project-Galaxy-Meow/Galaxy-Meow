
import { checkForWin, handleWin, } from "./win_check.js";



const inventorySlots = document.querySelectorAll('.inventory-slot');
const inventoryFullElement = document.getElementById('inventoryFull')
const MAX_ITEMS = 8;

const urlPath = window.location.pathname;
const fileName = urlPath.substring(urlPath.lastIndexOf('/') + 1);

let currentLevel;


export const items = {
    gems: { img: 'public/images/crystal.png', count: 0 },
    sword: { img: 'public/images/sword.png', count: 0 },
    potion: { img: 'public/images/potion.png', count: 0 },
    crudeOil: { img: 'public/images/crude_oil.png', count: 0 },
    battery: { img: 'public/images/bat.png', count: 0},
    skull: { img: 'public/images/skull.png', count: 0 },
    flag: { img: 'public/images/flag.png', count: 0 },
    button: { img: 'public/images/button.png', count: 0 },

    circuit: { img: 'public/images/circuit.png', count: 0},
    antenna: { img: 'public/Graphics/anttena.png', count: 0 },
    console: { img: 'public/Graphics/teleporterHull.png', count: 0},
    chest: {img: 'public/Graphics/chest.png', count: 0},
    redgem: {img: 'public/Graphics/redgem.png', count: 0},
    redruby: {img: 'public/Graphics/redruby.png', count: 0},
    diamant: {img: 'public/Graphics/quartz.png', count: 0},
    jub: {img: 'public/Graphics/jub.png', count: 0},
    mat: {img: 'public/Graphics/map.png', count: 0},
    Clue1: {img: 'public/Graphics/firstDigit.png', count: 0},
    Clue2: {img: 'public/Graphics/secondDigit.png', count: 0},
    Clue3: {img: 'public/Graphics/thirdDigit.png', count: 0},
    Clue4: {img: 'public/Graphics/fourthDigit.png', count: 0},
    Clue5: {img: 'public/Graphics/FithDigit.png', count: 0}
 
};

function getNextAvailableSlot() {
    for (let slot of inventorySlots) {
        if (slot.children.length === 0) {
            return slot; 
        }
    }
    return null; // No available slot
}

// Function to check if the inventory is full
function isInventoryFull() {
    let itemCount = 0;
    for (let slot of inventorySlots) {
        if (slot.children.length > 0) {
            itemCount++;
        }
    }
    // console.log(itemCount);
    return itemCount >= MAX_ITEMS;
}


function addItemToSlot(slot, itemName) {
    if (items[itemName]) { // Check if the item exists in the items object
        const itemImage = document.createElement('img');
        itemImage.src = items[itemName].img; // Set the image for the item
        itemImage.alt = itemName; // Set alt text for the image

        items[itemName].count += 1;
        const countDisplay = document.createElement('span');
        countDisplay.textContent = items[itemName].count;
        countDisplay.classList.add('item-count');

        slot.appendChild(itemImage); // Add the image to the slot
        slot.appendChild(countDisplay); // Add the count to the slot
    } else {
        console.warn(`Item "${itemName}" not found in items.`);
    }
}

function removeItemFromSlot(slot, itemName) {
    if (items[itemName]) {
        const itemImage = slot.querySelector(`img[alt="${itemName}"]`);
        const countDisplay = slot.querySelector('.item-count');

        if (itemImage && countDisplay) {
            items[itemName].count -= 1;

            if (items[itemName].count === 0) {
                slot.removeChild(itemImage); // Remove the item image
                slot.removeChild(countDisplay); // Remove the item count display
                items[itemName].hasItem = false; // Mark the item as no longer in the inventory
            } else {
                countDisplay.textContent = items[itemName].count;
            }
        } else {
            console.warn(`Item "${itemName}" not found in this slot.`);
        }
    } else {
        console.warn(`Item "${itemName}" not found in items.`);
    }
}

export function addItem(itemName) {
    // Check if the inventory is full
    if (isInventoryFull()) {
        showInventoryFullMessage();
        return; // Stop the function from adding more items
    }

    const availableSlot = getNextAvailableSlot();

    // Check if the item is already in the inventory
    if (items[itemName] && items[itemName].hasItem) {
        alert(`${itemName} is already in your inventory!`);
        return; // Exit the function if item already exists
    }

    if (availableSlot) {
        addItemToSlot(availableSlot, itemName);
        items[itemName].hasItem = true;
        clearInventoryFullMessage(); 

        if (fileName === 'game.html') {
            currentLevel = 1;
        } else if (fileName === 'level2.html') {
            currentLevel = 2;
        }
        console.log(currentLevel);

        if(checkForWin(currentLevel)){
            handleWin(currentLevel);
            
        }



    } else {
        showInventoryFullMessage(); 
    }
}

function showInventoryFullMessage() {
    inventoryFullElement.textContent = 'Inventory is full!'; // Set the message text
    inventoryFullElement.style.display = 'block'; // Show the message
    
    // Hide the message after 2 seconds
    setTimeout(() => {
        inventoryFullElement.style.display = 'none'; // Hide the message
    }, 2000); // 2000 milliseconds = 2 seconds
}


function clearInventoryFullMessage() {
    inventoryFullElement.textContent = ''; // Clear the message text
    inventoryFullElement.style.display = 'none'; // Hide the message
}


export function clearInventory() {
    inventorySlots.forEach(slot => {
        while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
        }
    });

    for (let itemName in items) {
        items[itemName].count = 0;
        items[itemName].hasItem = false;
    }

    // console.log('Inventory cleared.');
}

// Function to create and show the "Remove?" prompt
function showRemovePrompt(slot, itemName) {
    const removePrompt = document.createElement('div');
    removePrompt.textContent = "Remove?";
    removePrompt.classList.add('remove-prompt');
    
    removePrompt.style.position = 'absolute';
    removePrompt.style.backgroundColor = 'red';
    removePrompt.style.color = 'white';
    removePrompt.style.padding = '5px';
    removePrompt.style.cursor = 'pointer';

    slot.appendChild(removePrompt);

    function handleClickOutside(event) {
        if (!removePrompt.contains(event.target) && !slot.contains(event.target)) {
            slot.removeChild(removePrompt);
            document.removeEventListener('click', handleClickOutside);
        }
    }

    removePrompt.addEventListener('click', (e) => {
        e.stopPropagation();
        removeItemFromSlot(slot, itemName); 
        slot.removeChild(removePrompt);
        document.removeEventListener('click', handleClickOutside); 
    });

    document.addEventListener('click', handleClickOutside);
}

inventorySlots.forEach(slot => {
    slot.addEventListener('click', function() {
        const itemImage = slot.querySelector('img'); // Check if the slot contains an item
        if (itemImage) {
            const itemName = itemImage.alt; // Get the item name from the image's alt attribute
            showRemovePrompt(slot, itemName); // Show the remove prompt
        }
    });
});


function toggleInventory() {
    const inventory = document.getElementById('inventory');
    
    if (inventory.style.display === 'none' || inventory.style.display === '') {
        inventory.style.display = 'grid'; 
    } else {
        inventory.style.display = 'none'; 
    }
}

// Listen for the "keydown" event to detect the "Shift" key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Control') {
        toggleInventory();  // Toggle inventory when Shift is pressed
    }
});

// Optional: Add the existing bag icon click handler if you still want that functionality
const bagIcon = document.getElementById('bagIcon');
bagIcon.addEventListener('click', toggleInventory);



