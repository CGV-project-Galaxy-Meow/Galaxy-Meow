const inventorySlots = document.querySelectorAll('.inventory-slot');

// Define the available items and their images
export const items = {

    gems: { img: 'public/images/gems.png', count: 0 },
    sword: { img: 'public/images/sword.png', count: 0 },
    potion: { img: 'public/images/potion.png', count: 0 },
    crudeOil: { img: 'public/images/crude_oil.png', count: 0 } ,
    battery: {img: 'public/images/ '},
    skull: {img: 'public/images/skull.png', count: 0},
    flag: {img: 'public/images/flag.png', count: 0}


};

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
    const availableSlot = getNextAvailableSlot();

    // Check if the item is already in the inventory
    if (items[itemName] && items[itemName].hasItem) {
        alert(`${itemName} is already in your inventory!`);
        return; // Exit the function if item already exists
    }

    if (availableSlot) {
        addItemToSlot(availableSlot, itemName);
        items[itemName].hasItem = true;
    } else {
        showInventoryFullMessage(); 
    }
}

// Function to show a message when inventory is full
function showInventoryFullMessage() {
    const message = document.createElement('div');
    message.textContent = 'Inventory is full!';
    message.classList.add('inventory-full-message');
    document.body.appendChild(message);
    setTimeout(() => {
        document.body.removeChild(message);
    }, 2000); // Remove the message after 2 seconds
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

    console.log('Inventory cleared.');
}

// Function to create and show the "Remove?" prompt
function showRemovePrompt(slot, itemName) {
    // Create a small prompt element
    const removePrompt = document.createElement('div');
    removePrompt.textContent = "Remove?";
    removePrompt.classList.add('remove-prompt');
    
    // Style the prompt
    removePrompt.style.position = 'absolute';
    removePrompt.style.backgroundColor = 'red';
    removePrompt.style.color = 'white';
    removePrompt.style.padding = '5px';
    removePrompt.style.cursor = 'pointer';
    
    // Append the prompt to the slot
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

const bagIcon = document.getElementById('bagIcon');
bagIcon.addEventListener('click', toggleInventory);


