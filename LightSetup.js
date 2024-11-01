import * as THREE from 'three';

export default class LightSetup {
    constructor(scene, ambientConfig, directionalConfig, spotlightsConfig = []) {
      this.scene = scene;
  
      // Ambient Light
      const ambientLight = new THREE.AmbientLight(
        ambientConfig.color || 0xffffff,
        ambientConfig.intensity || 0.5
      );
      this.scene.add(ambientLight);
  
      // Directional Light
      const directionalLight = new THREE.DirectionalLight(
        directionalConfig.color || 0x999793,
        directionalConfig.intensity || 25
      );
      directionalLight.position.set(
        directionalConfig.position?.x ?? 0,
        directionalConfig.position?.y ?? 50,
        directionalConfig.position?.z ?? -50
      ).normalize();
      this.scene.add(directionalLight);
  
      // Ensure spotlightsConfig is an array
      if (!Array.isArray(spotlightsConfig)) {
        console.error("spotlightsConfig should be an array of spotlight configurations.");
        spotlightsConfig = []; // Default to empty array if not passed correctly
      }
  
      // Multiple Spotlights
      spotlightsConfig.forEach((spotlightConfig) => {
        const spotLight = new THREE.SpotLight(
          spotlightConfig.color || 0xb900ff,
          spotlightConfig.intensity || 80
        );
        spotLight.position.set(
          spotlightConfig.position?.x ?? 0,
          spotlightConfig.position?.y ?? 0,
          spotlightConfig.position?.z ?? 0
        );
        spotLight.angle = spotlightConfig.angle || Math.PI / 2;
        spotLight.penumbra = spotlightConfig.penumbra || 0.1;
        spotLight.decay = spotlightConfig.decay || 2;
        spotLight.distance = spotlightConfig.distance || 50;
        spotLight.castShadow = spotlightConfig.castShadow ?? true;
  
        // Set spotlight target
        spotLight.target.position.set(
          spotlightConfig.target?.x ?? spotlightConfig.position.x,
          spotlightConfig.target?.y ?? spotlightConfig.position.y - 1,
          spotlightConfig.target?.z ?? spotlightConfig.position.z
        );
        spotLight.target.updateMatrixWorld();
  
        this.scene.add(spotLight);
        this.scene.add(spotLight.target); // Add the target to the scene
      });
    }
  }
  
