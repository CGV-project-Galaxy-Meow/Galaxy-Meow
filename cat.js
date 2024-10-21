import { health } from './main.js';
import { playerName# } from './intro.js';

const modal = document.getElementById('myModal');
const responses = document.getElementById('responses');
const catConversation = document.getElementById('catConversation')

//cat warns you of the oxygen
export function checkOxygen(){
    if(health == 98){
        modal.style.display = 'flex';
        catConversation.style.animation = 'none';
        catConversation.textContent = `Be careful, ${playerName}! Your oxygen is running low.`;
    
        void catConversation.offsetWidth; 
        catConversation.style.animation = 'typing 3.5s steps(40, end)';
    
        // Keep the buttons hidden
        responses.style.display = 'none'; 
    }
}