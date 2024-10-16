export class CharacterControls {
    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.orbitControl = orbitControl;
        this.camera = camera;

        this.toggleRun = true;
        this.currentAction = currentAction;
        this.speed = 0.05;

        this.playCurrentAction();
    }

    // Play the current action with smooth blending
    playCurrentAction() {
        this.animationsMap.forEach((action, key) => {
            if (key === this.currentAction) {
                if (this.currentAction !== 'idle') {
                    action.reset().fadeIn(0.2).play();
                } else {
                    action.reset().fadeIn(0.5).play();
                }
                action.setEffectiveWeight(1);
            } else {
                action.fadeOut(0.2);
                action.setEffectiveWeight(0);
            }
        });
    }

    update(delta, keysPressed) {
        this.mixer.update(delta);

        let previousAction = this.currentAction;
        this.currentAction = 'idle';

        // moving forward
        if (keysPressed['arrowdown'] || keysPressed['s']) {
            this.currentAction = 'floating';
            this.model.position.z -= this.speed;
        }

        // moving backward
        if (keysPressed['arrowup'] || keysPressed['w']) {
            this.currentAction = 'floating';
            this.model.position.z += this.speed;
        }

        // moving left
        if (keysPressed['arrowright'] || keysPressed['d']) {
            this.currentAction = 'floating';
            this.model.position.x -= this.speed;
        }

        // moving right
        if (keysPressed['arrowleft'] || keysPressed['a']) {
            this.currentAction = 'floating';
            this.model.position.x += this.speed;
        }

        if (this.currentAction !== previousAction) {
            this.playCurrentAction();
        }

        console.log('Current Action:', this.currentAction);
    }
}
