import { playerName } from './intro.js';
let step = 0;

// document.addEventListener('DOMContentLoaded', () => {
//     const introScreen = document.getElementById('introScreen');
//     const dialogueText = document.getElementById('dialogueText');
//     const nameInput = document.getElementById('nameInput');
//     const nextButton = document.getElementById('nextButton');

//     // Show the intro screen when the game starts
//     introScreen.style.display = 'flex';

//     // Handle dialogue progression
//     nextButton.addEventListener('click', () => {
//         if (step === 0) {
//             // Ask for the player's name
//             nameInput.style.display = 'block';
//             nameInput.focus();
//             nextButton.textContent = 'Submit';
//             step++;
//         } else if (step === 1) {
//                 dialogueText.textContent = `I see, ${playerName}, you are a long way from home.`;
                
//                 step++;
            
//         } else if (step === 2) {
//             // Explanation of the game mechanics
//             dialogueText.innerHTML = `
//                 <p>Your teleporter ran out of energy!</p>
//                 <p>Find crystals to recharge it around the map</p>
//                 <div style="display: flex; justify-content: flex-start; align-items: center; height: 100%; padding-left: 160px; margin-top: 2%; ">
//                     <ul style="text-align: left; list-style-position: inside; margin: 0; padding-left: 20px;">
//                         <li>W - Move forward</li>
//                         <li>S - Move backward</li>
//                         <li>A - Move left</li>
//                         <li>D - Move right</li>
//                         <li>Oxygen Meter - You get 100 units of oxygen</li>
//                         <li>If you need help - Click The Cat</li>
//                         <li>Esc - Restart/Leave game</li>
//                         <li>Mouse click - Click Objects</li>
//                         <li>Mouse right click and drag- Look around the map</li>
//                     </ul>
//                 </div>
//                 <p>Good luck, ${playerName}!</p>
//             `;

//             //add loading screen so all models have time to load.
//             nextButton.textContent = 'Start Game';
//             step++;
//         } else if (step === 3) {
//             // Hide intro and start the game
//             introScreen.style.display = 'none';
//             startGame(); // Function to start the game
//         }
//     });
// });

// export { playerName };