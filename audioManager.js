import * as THREE from 'three';

export class AudioManager {
    constructor(camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener); // Attach the listener to the camera
        this.audioLoader = new THREE.AudioLoader();
        this.sounds = {}; // To store different sound buffers
    }

    loadSound(name, filePath, loop = false, volume = 0.5) {
        this.audioLoader.load(filePath, (buffer) => {
            console.log(`Sound loaded: ${name}`);  // Add this log to verify loading
            const sound = new THREE.Audio(this.listener);
            sound.setBuffer(buffer);
            sound.setLoop(loop);
            sound.setVolume(volume);
            this.sounds[name] = sound; // Store the sound by its name
        }, undefined, (err) => {
            console.error(`Error loading sound: ${name}`, err);
        });
    }
    
    playSound(name) {
        const sound = this.sounds[name];
        if (sound && !sound.isPlaying) {
            sound.play();
        }
    }

    stopSound(name) {
        const sound = this.sounds[name];
        if (sound && sound.isPlaying) {
            sound.stop();
        }
    }

    stopAll() {
        for (const sound of Object.values(this.sounds)) {
            if (sound.isPlaying) {
                sound.stop();
            }
        }
    }
}
