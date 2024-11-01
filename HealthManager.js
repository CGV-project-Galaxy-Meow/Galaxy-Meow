import {showDeathMessage} from './levelMenus.js'

export class HealthManager {
    constructor(initialHealth, audioManager) {
        this.health = initialHealth;
        this.healthElement = document.getElementById('healthBar');
        if (!this.healthElement) {
            console.error('Health element not found! Check that healthBar ID exists in the HTML.');
        }
        this.healthInterval = null;
        this.audioManager = audioManager;
    }

    updateHealthBar() {
        if (this.healthElement) {
            this.healthElement.innerHTML = `Oxygen: ${this.health}/100`;
        } else {
            console.error('Health element not found! Cannot update health bar.');
        }
    }

    startHealthDecrease() {
        console.log('Health decrease started'); // Debug log
        this.updateHealthBar();
        if (this.healthInterval) clearInterval(this.healthInterval); 
        
        this.healthInterval = setInterval(() => {
            if (this.health > 0) {
                this.health -= 1;
                console.log('Health:', this.health); // Debug log
                this.updateHealthBar();
                this.checkOxygenLevel();
            } else {
                clearInterval(this.healthInterval);
                this.handleGameOver();
            }
        }, 5000);
    }

    decreaseHealthBy(amount) {
        this.health -= amount;
        this.updateHealthBar();
        this.checkOxygenLevel();
        if (this.health <= 0) {
            this.handleGameOver();
        }
    }

    checkOxygenLevel() {
        if (this.health === 30) {
            console.log('Warning: Low oxygen level'); // Debug log
            this.audioManager.playSound('timerWarning'); // Play warning sound when oxygen is low
        }
    }

    handleGameOver() {
        console.log('Game over triggered'); // Debug log
        this.audioManager.stopSound('ambiance');
        this.audioManager.playSound('gameOver'); // Play game-over sound
        showDeathMessage();
    }

    resetHealth() {
        console.log('Health reset to 100'); // Debug log
        this.health = 100;
        this.updateHealthBar();
        if (this.healthInterval) clearInterval(this.healthInterval);
        this.startHealthDecrease();
    }

    stopHealthDecrease() {
        if (this.healthInterval) {
            console.log('Stopping health decrease'); // Debug log
            clearInterval(this.healthInterval);
        }
    }
}
