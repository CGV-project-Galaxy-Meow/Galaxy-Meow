

import * as THREE from './node_modules/three/build/three.module.min.js';;



export class CharacterControls {
    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.orbitControl = orbitControl;
        this.camera = camera;
        this.objectsToCollide = []; // Initialize objectsToCollide

        this.toggleRun = true;
        this.currentAction = currentAction;
        this.speed = 20; // Adjust movement speed as needed


        this.isJumping = false;
        this.jumpHeight = 15; // Height of the jump
        this.jumpSpeed = 12; // Speed of the jump ascent
        this.gravity = 12; // Gravity affecting the character
        this.velocityY = 0; // Vertical velocity
        this.isOnGround = true; // Check if the character is on the ground
        this.groundCheckDistance = 0.1;
        this.playCurrentAction();
    }

  // characterControls.js

playCurrentAction() {
    if (this.currentAnimationAction) {
        this.currentAnimationAction.fadeOut(0.2);
    }

    this.currentAnimationAction = this.animationsMap.get(this.currentAction);

    if (this.currentAnimationAction) {
        this.currentAnimationAction.reset().fadeIn(0.2).play();
        this.currentAnimationAction.timeScale = 1; // Reset timeScale to 1
    }
}

    
  update(delta, keysPressed, isFirstPerson) {
  this.mixer.update(delta);

  let previousAction = this.currentAction;

  const centerX = 0;
  const centerZ = 0;
  const radius = 400;

  // Compute movement direction based on key presses
  const moveVector = new THREE.Vector3();

  if (keysPressed['arrowup'] || keysPressed['w']) {
    moveVector.z -= 1;
  }
  if (keysPressed['arrowdown'] || keysPressed['s']) {
    moveVector.z += 1;
  }
  if (keysPressed['arrowleft'] || keysPressed['a']) {
    moveVector.x -= 1;
  }
  if (keysPressed['arrowright'] || keysPressed['d']) {
    moveVector.x += 1;
  }

  let isMoving = moveVector.lengthSq() > 0;

  if (isMoving) {
    // Normalize moveVector to ensure consistent movement speed
    moveVector.normalize();

    // Determine if sprinting
    const isSprinting = keysPressed['shift'];

    // Adjust movement speed
    let moveSpeed = this.speed * delta * (isSprinting ? 2 : 1); // Double speed if sprinting

    // In first-person view, movement is relative to the camera's orientation
    if (isFirstPerson) {
        // Get the camera's forward and right directions
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0; // Ignore vertical component
        cameraDirection.normalize();
    
        const cameraRight = new THREE.Vector3();
        cameraRight.crossVectors(this.camera.up, cameraDirection).normalize();
    
        // Reverse the moveVector components for correct forward/backward and left/right movement
        const forward = cameraDirection.multiplyScalar(-moveVector.z);
        const right = cameraRight.multiplyScalar(-moveVector.x);
        const movement = new THREE.Vector3().addVectors(forward, right).normalize();
    
        // Update astronaut position
        const newPosition = new THREE.Vector3().copy(this.model.position);
        newPosition.addScaledVector(movement, moveSpeed);
        
        // Check boundaries (as before)
        const isWithinBoundary = (x, z) => {
            const distance = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
            return distance <= radius;
        };
        if (isWithinBoundary(newPosition.x, newPosition.z)) {
            this.model.position.x = newPosition.x;
            this.model.position.z = newPosition.z;
        }
    
        // Set the appropriate action
        this.currentAction = 'moon_walk';
    }
     else {
      // Third-person movement logic remains the same

      // Rotate moveVector by the camera's Y-axis rotation
      const cameraEuler = new THREE.Euler().setFromQuaternion(this.camera.quaternion, 'YXZ');
      const cameraYRotation = cameraEuler.y;

      moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYRotation);

      // Update astronaut position
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

      // Set the appropriate action
      this.currentAction = 'moon_walk';

      // Adjust animation speed
      const action = this.animationsMap.get(this.currentAction);
      if (action) {
        action.timeScale = isSprinting ? 2 : 1; // Double animation speed if sprinting
      }
    }
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
                this.currentAction = 'floating'; // Fallback to floating if no jump animation
            }
        }

        // Apply gravity and vertical movement
        if (this.isJumping) {
            if (keysPressed[' '] && this.isOnGround) {
                this.isJumping = true;
                this.velocityY = this.jumpSpeed;
                this.isOnGround = false;
    
                this.currentAction = this.animationsMap.has('jumping') ? 'jumping' : 'floating';
            }
    
            if (this.isJumping) {
                this.velocityY -= this.gravity * delta; // Apply gravity
                this.model.position.y += this.velocityY * delta; // Update vertical position
    
                if (this.model.position.y <= 0) {
                    this.model.position.y = 0; // Reset to ground level
                    this.isJumping = false;
                    this.isOnGround = true;
                    this.currentAction = this.currentAction === 'jumping' ? 'idle' : this.currentAction;
                }
            }
        }
        this.detectCollision(moveVector);
        // Play current action if it has changed
        if (this.currentAction !== previousAction) {
            this.playCurrentAction();
        }
    }

    detectCollision(moveVector) {
        if (!this.objectsToCollide) return; // Ensure objectsToCollide is defined
    
        const box = new THREE.Box3().setFromObject(this.model); // Bounding box of the character
        let collided = false;
    
        for (const object of this.objectsToCollide) {
            const objectBox = new THREE.Box3().setFromObject(object); // Bounding box of the object
    
            if (box.intersectsBox(objectBox)) {
                // Check if the character is above the object
                const characterAboveObject = box.min.y > objectBox.max.y;
                
                // Ignore collisions if character is above the object
                if (characterAboveObject) {
                    continue; // Skip collision handling for this object
                }
    
                collided = true;
                //console.log("Collision detected with", object.name);
    

                // Calculate overlap distances on the X and Z axes
                const overlapX = Math.min(box.max.x - objectBox.min.x, objectBox.max.x - box.min.x);
                const overlapZ = Math.min(box.max.z - objectBox.min.z, objectBox.max.z - box.min.z);

    
                // Determine which axis to resolve collision on, based on the smaller overlap
                if (overlapX < overlapZ) {
                    // Resolve collision on the X axis
                    this.model.position.x += (box.min.x < objectBox.min.x) ? -overlapX : overlapX;
                } else {
                    // Resolve collision on the Z axis
                    this.model.position.z += (box.min.z < objectBox.min.z) ? -overlapZ : overlapZ;
                }
    
                // Recalculate bounding box position after collision adjustment
                box.setFromObject(this.model);
                break; // Exit loop after handling one collision
            }
        }
    }

    
    
    

    handleJumping(delta, keysPressed) {
        if (keysPressed[' '] && this.isOnGround) {
            this.isJumping = true;
            this.velocityY = this.jumpSpeed;
            this.isOnGround = false;

            this.currentAction = this.animationsMap.has('jumping') ? 'jumping' : 'floating';
        }

        if (this.isJumping) {
            this.velocityY -= this.gravity * delta; // Apply gravity
            this.model.position.y += this.velocityY * delta; // Update vertical position

            if (this.model.position.y <= 0) {
                this.model.position.y = 0; // Reset to ground level
                this.isJumping = false;
                this.isOnGround = true;
                this.currentAction = this.currentAction === 'jumping' ? 'idle' : this.currentAction;
            }
        }
    }
}