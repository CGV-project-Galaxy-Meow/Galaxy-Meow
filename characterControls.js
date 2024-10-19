export class CharacterControls {
    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.orbitControl = orbitControl;
        this.camera = camera;

        this.toggleRun = true;
        this.currentAction = currentAction;
        this.speed = 1;

        this.isJumping = false;
        this.jumpHeight = 20; // Height of the jump
        this.jumpSpeed = 20; // Speed of the jump ascent
        this.gravity = 12; // Gravity affecting the character
        this.velocityY = 0; // Vertical velocity
        this.isOnGround = true; // Check if the character is on the ground

        this.playCurrentAction();
    }

    playCurrentAction() {
        const action = this.animationsMap.get(this.currentAction);
        if (action) {
            action.reset().fadeIn(0.2).play();
        }
    }

    update(delta, keysPressed) {
        this.mixer.update(delta);

        let previousAction = this.currentAction;

        const centerX = 0;
        const centerZ = 0;
        const radius = 400;

        // Handle lateral movement
        let newX = this.model.position.x;
        let newZ = this.model.position.z;

        const isWithinBoundary = (newX, newZ) => {
            const distance = Math.sqrt((newX - centerX) ** 2 + (newZ - centerZ) ** 2);
            return distance <= radius;
        };

    // Moving forward
    if (keysPressed['arrowup'] || keysPressed['w']) {
        newZ -= this.speed;
        if (isWithinBoundary(newX, newZ)) {
            this.currentAction = 'floating';
            this.model.position.z = newZ;
            this.model.rotation.y = Math.PI; // Rotate to face forward
        }
    }

    // Moving backward
    if (keysPressed['arrowdown'] || keysPressed['s']) {
        newZ += this.speed;
        if (isWithinBoundary(newX, newZ)) {
            this.currentAction = 'floating';
            this.model.position.z = newZ;
            this.model.rotation.y = 0; // Rotate to face backward
        }
    }

    // Moving left
    if (keysPressed['arrowleft'] || keysPressed['a']) {
        newX -= this.speed;
        if (isWithinBoundary(newX, newZ)) {
            this.currentAction = 'floating';
            this.model.position.x = newX;
            this.model.rotation.y = -Math.PI/2; // Rotate to face left
        }
    }

    // Moving right
    if (keysPressed['arrowright'] || keysPressed['d']) {
        newX += this.speed;
        if (isWithinBoundary(newX, newZ)) {
            this.currentAction = 'floating';
            this.model.position.x = newX;
            this.model.rotation.y = Math.PI/2; // Rotate to face right
        }
    }

        // Start the jump when spacebar is pressed and the character is on the ground
        if (keysPressed[' '] && this.isOnGround) {
            this.isJumping = true;
            this.velocityY = this.jumpSpeed;
            this.isOnGround = false;

            // Check if jumping animation exists, else fallback to floating animation
            if (this.animationsMap.has('jumping')) {
                this.currentAction = 'jumping';
            } else {
                this.currentAction = 'floating'; // Fallback to floating if no jump animation
            }
        }

        // Handle jumping
        if (this.isJumping) {
            this.velocityY -= this.gravity * delta; // Apply gravity
            this.model.position.y += this.velocityY * delta; // Update vertical position

            // Allow lateral movement during the jump
            this.model.position.x = newX; // Maintain lateral movement
            this.model.position.z = newZ;

            // Detect when the character lands on the ground
            if (this.model.position.y <= 0) {
                this.model.position.y = 0;
                this.isJumping = false;
                this.isOnGround = true;
                this.currentAction = 'idle'; // Reset to idle after the jump
            }
        }

        // Play current action if it has changed
        if (this.currentAction !== previousAction) {
            this.playCurrentAction();
        }
    }
}