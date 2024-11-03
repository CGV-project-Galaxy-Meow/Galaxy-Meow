// intro for level 3.js
import {startGame} from './level3.js';
let step = 0;

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const introScreen = document.getElementById('introScreen');
    const dialogueText = document.getElementById('dialogueText');
    const nextButton = document.getElementById('nextButton');

    // Show the intro screen when the game starts
    loadingScreen.style.display = 'none';
    introScreen.style.display = 'flex';

    // Handle dialogue progression
    nextButton.addEventListener('click', () => {
        if (step === 0) {
            // Ask for the player's name
            dialogueText.textContent = `Find all the numbers to the code.`;
            nextButton.textContent = 'Next';
            step++;
        } else if (step === 1) {
                dialogueText.textContent = `Input them on the magic carpet`;
                nextButton.textContent = 'Next';
                step++;
            
        } else if (step === 2) {
            // Explanation of the game mechanics
            dialogueText.innerHTML = `
                <p>You have landed on an astroid and need to collect the code to escape!</p>
                <p>Find the numbers to the code around the map and enter the code in the magic carpet!</p>
                <div style="display: flex; justify-content: flex-start; align-items: center; height: 100%; padding-left: 160px; margin-top: 2%; ">
                    <ul style="text-align: left; list-style-position: inside; margin: 0; padding-left: 20px;">
                        <li>W - Move forward</li>
                        <li>S - Move backward</li>
                        <li>A - Move left</li>
                        <li>D - Move right</li>
                        <li>Space - Jump</li>
                        <li>Oxygen Meter - You get 80 units of oxygen</li>
                        <li>If you need help - Click The Cat</li>
                        <li>Esc - Restart/Leave game</li>
                        <li>Shift - Sprint</li>
                        <li>Cntrl - Opens inventory</li>
                        <li>Left mouse click - To select objects</li>
                        <li>Right mouse click and drag - Look around the map</li>
                        <li>V - Change prespective</li>
                        <li>E - Interact with objects in first person perspective</li>
                        <li>X - Close object popups in first person perspective</li>
                        <li>1 - Add items to inventory in first person perspective</li>
                    </ul>
                </div>
                <p>Good luck!</p>
            `;

            //add loading screen so all models have time to load.
            nextButton.textContent = 'Start Game';
            step++;
        } else if (step === 3) {
            // Hide intro and start the game
            introScreen.style.display = 'none';
            loadingScreen.style.display = 'flex';
            startGame(); // Function to start the game
        }
    });
});

//export { playerName };