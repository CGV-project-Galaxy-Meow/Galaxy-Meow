const inventorySlots = document.querySelectorAll('.inventory-slot');

export const items = {
    gems: { img: 'images/gems.png', count: 0 },
    sword: { img: 'images/sword.png', count: 0 },
    potion: { img: 'images/potion.png', count: 0 },
    crudeOil: { img: 'images/crude_oil.png', count: 0 } // Add your items here
};

function getNextAvailableSlot() {
    for (let slot of inventorySlots) {
        if (slot.children.length === 0) {
            return slot; 
        }
    }
    return null; 
}


function addItemToSlot(slot, itemName) {
    if (items[itemName]) {
        const itemImage = document.createElement('img');
        itemImage.src = items[itemName].img; 
        itemImage.alt = itemName; 

        
        items[itemName].count += 1;
        const countDisplay = document.createElement('span');
        countDisplay.textContent = items[itemName].count;
        countDisplay.classList.add('item-count');

        slot.appendChild(itemImage); 
        slot.appendChild(countDisplay); 
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


function showInventoryFullMessage() {
    const message = document.createElement('div');
    message.textContent = 'Inventory is full!';
    message.classList.add('inventory-full-message');
    document.body.appendChild(message);
    setTimeout(() => {
        document.body.removeChild(message);
    }, 2000);
}




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


