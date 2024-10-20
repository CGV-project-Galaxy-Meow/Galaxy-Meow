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
    
        // Calculate camera's direction vectors
        let moveX = 0;
        let moveZ = 0;
    
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0; // Ignore vertical component
        cameraDirection.normalize();
    
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(this.camera.up, cameraDirection);
        cameraRight.y = 0;
        cameraRight.normalize();
    
        const isWithinBoundary = (x, z) => {
            const distance = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
            return distance <= radius;
        };
    
        // Moving forward
        if (keysPressed['arrowup'] || keysPressed['w']) {
            moveZ -= this.speed * delta;
            this.currentAction = 'floating';
        }
    
        // Moving backward
        if (keysPressed['arrowdown'] || keysPressed['s']) {
            moveZ += this.speed * delta;
            this.currentAction = 'floating';
        }
    
        // Moving left
        if (keysPressed['arrowleft'] || keysPressed['a']) {
            moveX -= this.speed * delta;
            this.currentAction = 'floating';
        }
    
        // Moving right
        if (keysPressed['arrowright'] || keysPressed['d']) {
            moveX += this.speed * delta;
            this.currentAction = 'floating';
        }
    
        // Compute the movement vector
        const moveVector = new THREE.Vector3();
        moveVector.addScaledVector(cameraDirection, moveZ);
        moveVector.addScaledVector(cameraRight, moveX);
    
        // Update the astronaut's position
        this.model.position.add(moveVector);
    
        // Rotate astronaut to face movement direction
        if (moveVector.length() > 0) {
            this.model.rotation.y = Math.atan2(moveVector.x, moveVector.z);
        }
    
        // Ensure astronaut stays within boundaries
        const newX = this.model.position.x;
        const newZ = this.model.position.z;
        if (!isWithinBoundary(newX, newZ)) {
            // If outside boundaries, revert the movement
            this.model.position.sub(moveVector);
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