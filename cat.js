//import { health } from './main.js';
import { playerName } from './intro.js';
import { loadModel } from './model_loader.js';
import {showDeathMessage} from './levelMenus.js'
import { ambianceSound, gameOverSound, startGame } from './main.js';
import { items } from './inventory.js';
import { clearInventory } from './inventory.js';

const modal = document.getElementById('myModal');
const responses = document.getElementById('responses');
const closeModalBtn = document.getElementById('closeModal');
const helpButton = document.getElementById('helpButton');
const dontHelpButton = document.getElementById('dontHelpButton');
const catConversation = document.getElementById('catConversation')

export let health = 100;
export let healthElement = document.getElementById('healthBar');
let healthInterval;

export function decreaseHealth() {
    if (healthInterval) {
        clearInterval(healthInterval); // Clear any previous interval
    }
    healthInterval = setInterval(() => {
        if (health > 0) {
            health -= 1;
            healthElement.innerHTML = `Oxygen: ${health}/100`;
            checkOxygen();
        } else {
            clearInterval(healthInterval); // Stop the timer when health reaches 0
            showDeathMessage();

            // Stop the ambiance music
            if (ambianceSound.isPlaying) {
                ambianceSound.stop();
            }

            // Play the game over sound
            gameOverSound.play();
        }
    }, 5000); // Decrease health every 5 seconds
}

//cat warns you of the oxygen
export function checkOxygen(){
    if(health == 40){
        modal.style.display = 'flex';
        catConversation.style.animation = 'none';
        catConversation.textContent = `Be careful, ${playerName}! Your oxygen is running low.`;
    
        void catConversation.offsetWidth; 
        catConversation.style.animation = 'typing 3.5s steps(40, end)';
    
        // Keep the buttons hidden
        responses.style.display = 'none'; 
    }
}

export function loadCatModel(cat_model, scene, controls, camera, catObject, objectsToRaycast, raycaster, mouse, modal, responses, catConversation, playerName) {
    // Load the static model
    loadModel(cat_model, scene, controls, camera, (object, mixer, animationsMap) => {
        console.log('Static model loaded:', object);
        object.scale.set(1, 1, 1);
        object.position.set(-10, 0, -10);
        object.rotation.y = Math.PI / 2;

        catObject = object;
        scene.add(object);
        objectsToRaycast.push(catObject);
        setupRaycasting(camera, objectsToRaycast);
    });

    // Event listener for model click
    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Check if the object is intersected by the ray
        if (catObject) {
            const intersects = raycaster.intersectObject(catObject, true);

            if (intersects.length > 0) {
                console.log('Model clicked:', catObject);

                modal.style.display = 'flex';
                responses.style.display = 'none';
                catConversation.textContent = `Do you need help, ${playerName}? I hope you are willing to trade some oxygen for a clue.`;

                catConversation.style.animation = 'none';
                void catConversation.offsetWidth;
                catConversation.style.animation = 'typing 3.5s steps(40, end)';

                catConversation.addEventListener('animationend', function onAnimationEnd() {
                    responses.style.display = 'flex';
                    catConversation.removeEventListener('animationend', onAnimationEnd);
                });
            }
        }
    });

    // Event listener for 'Don't Help' button

    
    dontHelpButton.addEventListener('click', () => {
        catConversation.style.animation = 'none';
        catConversation.textContent = `As you wish.`;

        void catConversation.offsetWidth;
        catConversation.style.animation = 'typing 3.5s steps(40, end)';

        responses.style.display = 'none';
    });

    function isItemInInventory(itemName) {
        return items[itemName] && items[itemName].count > 0;
    }

    // Event listener for 'Help' button
    helpButton.addEventListener('click', () => {
        let conversationText;
        catConversation.style.animation = 'none';
    
        if (!isItemInInventory('battery')) {
            conversationText = `Very well. The battery can be found near the vehicle you arrived here with.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
            void catConversation.offsetWidth; 
            catConversation.style.animation = 'typing 3.5s steps(40, end)'; 
    
            setTimeout(() => {
                conversationText = '';
                document.getElementById('catConversation').innerHTML = conversationText; 
                
                conversationText = 'I do wonder how such sound equipment managed to get destroyed.';
                document.getElementById('catConversation').innerHTML = conversationText; 

                void catConversation.offsetWidth; 
                catConversation.style.animation = 'none';

                setTimeout(() => {
                    catConversation.style.animation = 'typing 3.5s steps(40, end)'; 
                }, 50);
            }, 5000); 
        }

        else if(!isItemInInventory('button')){
            conversationText = `Perhaps you can ask Mr Neil Armstrong on the whereabouts of the button.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
            void catConversation.offsetWidth; 
            catConversation.style.animation = 'typing 3.5s steps(40, end)'; 
    
            setTimeout(() => {
                conversationText = '';
                document.getElementById('catConversation').innerHTML = conversationText; 
                
                conversationText = 'By the way, who was it that sent you here?';
                document.getElementById('catConversation').innerHTML = conversationText; 

                void catConversation.offsetWidth; 
                catConversation.style.animation = 'none';

                setTimeout(() => {
                    catConversation.style.animation = 'typing 3.5s steps(40, end)'; 
                }, 50);
            }, 5000); 
        }

        else if(!isItemInInventory('circuit')){
            conversationText = `You should venture near the fallen asteroid, ${playerName}.`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
            void catConversation.offsetWidth; 
            catConversation.style.animation = 'typing 3.5s steps(40, end)';  
        }

        else if(!isItemInInventory('gems')){
            conversationText = `Ruins on the moon... How did they get here?`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
            void catConversation.offsetWidth; 
            catConversation.style.animation = 'typing 3.5s steps(40, end)';  
        }

        //for antenna
        /*else if(!isItemInInventory('gems')){
            conversationText = `Ruins on the moon... How did they get here?`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
            void catConversation.offsetWidth; 
            catConversation.style.animation = 'typing 3.5s steps(40, end)';  
        }*/

        else{
            conversationText = `Help? But you have everything you need to proceed, ${playerName}`;             
            document.getElementById('catConversation').innerHTML = conversationText;
            catConversation.textContent = conversationText;
            void catConversation.offsetWidth; 
            catConversation.style.animation = 'typing 3.5s steps(40, end)';  
        }

        responses.style.display = 'none';

        health -= 10;
    });

    // Close modal on button click
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none'; // Hide the modal
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal when clicking outside
        }
    });
}

export function restartLevel() {
    clearInventory();
    // Reset health
    health = 100;
    healthElement.innerHTML = `Oxygen: ${health}/100`;

    decreaseHealth();

    // Hide death and exit menus
    deathMessage.style.display = 'none';
    exitMenu.style.display = 'none';

    // Reset astronaut position and controls
    if (astronaut) {
        astronaut.position.copy(initialAstronautPosition);
        astronaut.rotation.set(0, 0, 0); 
    }

    // Stop the game over sound if it's playing
    if (gameOverSound.isPlaying) {
        gameOverSound.stop();
    }

    // Start the ambiance music if it's not playing
    if (!ambianceSound.isPlaying) {
        ambianceSound.play();
    }
}


// Event Listeners for buttons
document.getElementById('restartButton').addEventListener('click', restartLevel);
document.getElementById('restartButtonDeath').addEventListener('click', restartLevel);