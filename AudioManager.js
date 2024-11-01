// AudioManager.js
import * as THREE from 'three';

export class AudioManager {
    constructor() {
        this.listener = new THREE.AudioListener();
        this.audioLoader = new THREE.AudioLoader();
        
        // Sound instances
        this.sounds = {
            ambiance: new THREE.Audio(this.listener),
            gameOver: new THREE.Audio(this.listener),
            timerWarning: new THREE.Audio(this.listener),
        };
    }

    // Generalized method to load sounds
    loadSound(name, filePath, loop = false, volume = 0.5) {
        const audio = this.sounds[name];
        this.audioLoader.load(filePath, (buffer) => {
            audio.setBuffer(buffer);
            audio.setLoop(loop);
            audio.setVolume(volume);
        });
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (sound && !sound.isPlaying) sound.play();
    }

    stopSound(name) {
        const sound = this.sounds[name];
        if (sound && sound.isPlaying) sound.stop();
    }

    setVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound) sound.setVolume(volume);
    }

    addListenerTo(camera) {
        camera.add(this.listener);
    }
}
