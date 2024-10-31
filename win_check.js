import {items} from "./inventory";
import { showWinningModal, showWinningModal_l2 } from "./modal";
import * as THREE from 'three';

const listener = new THREE.AudioListener();
const winSound=new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();


audioLoader.load('/sound/triumph-83761.mp3', function(buffer) {
    winSound.setBuffer(buffer);
    winSound.setLoop(false);
    winSound.setVolume(0.5);

});

// List of items required to win
const requiredItems = ['circuit', 'battery','antenna','console', 'button'];
const requiredItems_l2=['jub','diamant','redruby','redgem','gems']
// const requiredItems = ['circuit', 'battery', 'button'];
// Function to check if the player has won
export function checkForWin() {
    for (let itemName of requiredItems) {
        if (!items[itemName] || items[itemName].count === 0) {
            return false; // Player hasn't collected all required items
        }
    }
    winSound.play();
    return true; // All required items collected
}

export function checkForWin_l2() {
    for (let itemName of requiredItems_l2) {
        if (!items[itemName] || items[itemName].count === 0) {
            return false; // Player hasn't collected all required items
        }
    }
    // winSound.play();
    return true; // All required items collected
} 

// Function to handle winning logic
export function handleWin() {
    winSound.play();
    setTimeout(() => {
        showWinningModal();
    }, 500); // Adjust delay as needed
}

export function handleWin_l2() {
    winSound.play();
    setTimeout(() => {
        showWinningModal_l2();
    }, 500); // Adjust delay as needed
}

// placeholder Function to proceed to the next level
/*document.getElementById('proceedButton').addEventListener('click', function() {
   
    // Hide the modal after clicking
    document.getElementById('winningModal').style.display = 'none';
    window.location.href = 'level2.html';
  });*/
