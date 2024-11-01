
import {items} from "./inventory.js";
import { showWinningModal, showWinningModal_l2 } from "./modal.js";
import * as THREE from './node_modules/three/build/three.module.min.js';

const listener = new THREE.AudioListener();
const winSound=new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();


audioLoader.load('public/sound/triumph-83761.mp3', function(buffer) {
    winSound.setBuffer(buffer);
    winSound.setLoop(false);
    winSound.setVolume(0.5);

});


// List of items required to win
const requiredItems_l1 = ['circuit', 'battery','antenna','console', 'button'];
const requiredItems_l2=['jub','diamant','redruby','redgem','gems']
// const requiredItems = ['circuit', 'battery', 'button'];
// Function to check if the player has won
// Function to check if the player has won for a specific level
export function checkForWin(level) {
    const requiredItems = level === 2 ? requiredItems_l2 : requiredItems_l1;
    for (let itemName of requiredItems) {
        if (!items[itemName] || items[itemName].count === 0) {
            return false; // Player hasn't collected all required items
        }
    }
    winSound.play();
    return true; // All required items collected
}

// Function to handle winning logic based on the level
export function handleWin(level) {
    winSound.play();
    setTimeout(() => {
        level === 2 ? showWinningModal_l2() : showWinningModal();
    }, 500); 
}
