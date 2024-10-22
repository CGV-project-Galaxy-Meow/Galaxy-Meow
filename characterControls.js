import * as THREE from 'three';

export class CharacterControls {
    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.orbitControl = orbitControl;
        this.camera = camera;

        this.toggleRun = true;
        this.currentAction = currentAction;
<<<<<<< HEAD
        this.speed = 2; // Adjust movement speed as needed

        this.isJumping = false;
        this.jumpHeight = 10; // Height of the jump
        this.jumpSpeed = 10; // Speed of the jump ascent
=======
        this.speed = 3; // Adjust movement speed as needed

        this.isJumping = false;
        this.jumpHeight = 5; // Height of the jump
        this.jumpSpeed = 12; // Speed of the jump ascent
>>>>>>> 270c5e6e2c74eebdbb4cc7d491968d0bb33dd3a3
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
    
        // Compute movement direction based on key presses
        const moveVector = new THREE.Vector3();
    
        if (keysPressed['arrowup'] || keysPressed['w']) {
            moveVector.z -= 1;
<<<<<<< HEAD
        }
        if (keysPressed['arrowdown'] || keysPressed['s']) {
            moveVector.z += 1;
        }
        if (keysPressed['arrowleft'] || keysPressed['a']) {
            moveVector.x -= 1;
        }
        if (keysPressed['arrowright'] || keysPressed['d']) {
            moveVector.x += 1;
=======
            this.currentAction = 'moon_walk';
        }
        if (keysPressed['arrowdown'] || keysPressed['s']) {
            moveVector.z += 1;
            this.currentAction = 'moon_walk';
        }
        if (keysPressed['arrowleft'] || keysPressed['a']) {
            moveVector.x -= 1;
            this.currentAction = 'moon_walk';
        }
        if (keysPressed['arrowright'] || keysPressed['d']) {
            moveVector.x += 1;
            this.currentAction = 'moon_walk';
>>>>>>> 270c5e6e2c74eebdbb4cc7d491968d0bb33dd3a3
        }
    
        let isMoving = moveVector.lengthSq() > 0;
    
        if (isMoving) {
            // Set to moon_walk when moving
            this.currentAction = 'moon_walk';
    
            // Normalize moveVector to ensure consistent movement speed
            moveVector.normalize();
    
            // Get the camera's Y-axis rotation
            const cameraEuler = new THREE.Euler().setFromQuaternion(this.camera.quaternion, 'YXZ');
            const cameraYRotation = cameraEuler.y;
    
            // Rotate moveVector by the camera's Y-axis rotation
            moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYRotation);
    
            // Update astronaut position
            const moveSpeed = this.speed * delta;
            const newPosition = new THREE.Vector3().copy(this.model.position);
            newPosition.addScaledVector(moveVector, moveSpeed);
    
            // Check boundaries
            const isWithinBoundary = (x, z) => {
                const distance = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
                return distance <= radius;
            };
            if (isWithinBoundary(newPosition.x, newPosition.z)) {
                this.model.position.x = newPosition.x;
                this.model.position.z = newPosition.z;
            }
    
            // Rotate astronaut to face movement direction
            const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, 1), // The astronaut's forward vector
                moveVector.clone().normalize() // The desired movement direction
            );
    
            // Smoothly rotate astronaut towards the movement direction
            this.model.quaternion.slerp(targetQuaternion, 0.1); // Adjust slerp factor as needed
        } else if (!this.isJumping) {
            // If not moving and not jumping, switch to idle animation
            this.currentAction = 'idle';
        }
    
        // Handle jumping
        if (keysPressed[' '] && this.isOnGround) {
            this.isJumping = true;
            this.velocityY = this.jumpSpeed;
            this.isOnGround = false;
    
            // Switch to jumping animation if available
            if (this.animationsMap.has('jumping')) {
                this.currentAction = 'jumping';
            } else {
                this.currentAction = 'jumping'; // Fallback to floating if no jump animation
            }
        }
    
        // Apply gravity and vertical movement
        if (this.isJumping) {
            this.velocityY -= this.gravity * delta; // Apply gravity
            this.model.position.y += this.velocityY * delta; // Update vertical position
    
            // Allow lateral movement during the jump
            if (isMoving) {
                const moveSpeed = this.speed * delta;
                this.model.position.x += moveVector.x * moveSpeed;
                this.model.position.z += moveVector.z * moveSpeed;
            }
    
            // Detect when the character lands on the ground
            if (this.model.position.y <= 0) {
                this.model.position.y = 0;
                this.isJumping = false;
                this.isOnGround = true;
                this.currentAction = isMoving ? 'floating' : 'idle'; // Reset to appropriate action
            }
        }
    
        // Play current action if it has changed
        if (this.currentAction !== previousAction) {
            this.playCurrentAction();
        }
    }
    
}
