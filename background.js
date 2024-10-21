import * as THREE from 'three';


export function createSun(scene) {
  const sunGeometry = new THREE.SphereGeometry(200, 64, 64);

  const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg');

  const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture
  });

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 0, -950); 
  scene.add(sun);
}



export function createCelestialBody(textureUrl, size, position, scene) {
    const texture = new THREE.TextureLoader().load(textureUrl);
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const body = new THREE.Mesh(geometry, material);
    body.position.set(position.x, position.y, position.z);
    scene.add(body);
}
