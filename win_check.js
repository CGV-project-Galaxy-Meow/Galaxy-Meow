import {items} from "./inventory.js";
import { showWinningModal } from "./modal";

// List of items required to win
const requiredItems = ['circuit', 'battery','antenna','console', 'button'];
// const requiredItems = ['circuit', 'battery', 'button'];
// Function to check if the player has won
export function checkForWin() {
    for (let itemName of requiredItems) {
        if (!items[itemName] || items[itemName].count === 0) {
            return false; // Player hasn't collected all required items
        }
    }
    return true; // All required items collected
}

// Function to handle winning logic
export function handleWin() {
    showWinningModal();
    
    //proceedToNextLevel();
}

// placeholder Function to proceed to the next level
document.getElementById('proceedButton').addEventListener('click', function() {
   
    // Hide the modal after clicking
    document.getElementById('winningModal').style.display = 'none';
  });
