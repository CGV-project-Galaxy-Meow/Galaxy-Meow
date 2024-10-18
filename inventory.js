
const inventorySlots = document.querySelectorAll('.inventory-slot');

const items = {
    gems: 'images/gems.png',
    sword: 'images/sword.png',
};

function addItemToSlot(slotId, itemName) {
    const slot = document.getElementById(slotId);
    const itemImage = document.createElement('img');
    itemImage.src = items[itemName];
    slot.appendChild(itemImage);
}

function removeItemFromSlot(slotId) {
    const slot = document.getElementById(slotId);
    if (slot.firstChild) {
        slot.removeChild(slot.firstChild);
    }
}

addItemToSlot('slot1', 'gems');
addItemToSlot('slot2', 'potion');
addItemToSlot('slot3', 'potion');
addItemToSlot('slot4', 'potion');

