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
        this.speed = 10; 

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

        // Update astronaut's rotation to match the camera's Y rotation
        const cameraEuler = new THREE.Euler().setFromQuaternion(this.camera.quaternion, 'YXZ');
        const astronautEuler = new THREE.Euler(0, cameraEuler.y, 0, 'YXZ');

        // If you want smooth rotation, uncomment the following lines
        // const astronautQuaternion = new THREE.Quaternion().setFromEuler(astronautEuler);
        // this.model.quaternion.slerp(astronautQuaternion, 0.1); // Adjust the 0.1 value for rotation speed

        // Otherwise, directly set the rotation
        this.model.rotation.copy(astronautEuler);

        // Compute movement direction based on camera orientation
        const moveVector = new THREE.Vector3();

        if (keysPressed['arrowup'] || keysPressed['w']) {
            moveVector.z -= 1;
            this.currentAction = 'floating';
        }
        if (keysPressed['arrowdown'] || keysPressed['s']) {
            moveVector.z += 1;
            this.currentAction = 'floating';
        }
        if (keysPressed['arrowleft'] || keysPressed['a']) {
            moveVector.x -= 1;
            this.currentAction = 'floating';
        }
        if (keysPressed['arrowright'] || keysPressed['d']) {
            moveVector.x += 1;
            this.currentAction = 'floating';
        }

        let isMoving = moveVector.lengthSq() > 0;

        if (isMoving) {
            moveVector.normalize();

            // Rotate movement vector by the camera's Y rotation
            moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraEuler.y);

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
        } else if (!this.isJumping) {
            this.currentAction = 'idle';
        }

        // Handle jumping
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
