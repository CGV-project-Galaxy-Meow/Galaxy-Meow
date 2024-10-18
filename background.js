import * as THREE from 'https://lamp.ms.wits.ac.za/~sgalaxy/node_modules/three/build/three.module.min.js';



// const backgroundContainer = document.getElementById('background');
// if (backgroundContainer) {
//     backgroundContainer.appendChild(renderer.domElement);
//     console.log('Renderer successfully attached to the #background container.');
// } else {
//     console.error('Background container not found!');
// }
// camera.position.z = 5;

// const spaceTexture = new THREE.TextureLoader().load('public/textures/stars.jpg');
// const spaceGeometry = new THREE.SphereGeometry(100, 64, 64);
// const spaceMaterial = new THREE.MeshBasicMaterial({
//   map: spaceTexture,
//   side: THREE.BackSide
// });
// const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
// scene.add(space);

// const earthTexture = new THREE.TextureLoader().load('publictextures/earth.jpg');
// const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
// const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
// const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// earth.position.set(0, 0, -10);
// scene.add(earth);

// const celestialBodies = [];

// // function createCelestialBody(textureUrl, size, position) {
// //   const texture = new THREE.TextureLoader().load(textureUrl);
// //   const geometry = new THREE.SphereGeometry(size, 32, 32);
// //   const material = new THREE.MeshBasicMaterial({ map: texture });
// //   const body = new THREE.Mesh(geometry, material);
// //   body.position.set(position.x, position.y, position.z);
// //   scene.add(body);
// //   celestialBodies.push(body);
// // }
// createCelestialBody('public/textures/jupiter.jpg', 0.5, {x: -3, y: 2, z: -15});
// createCelestialBody('public/textures/planet.jpg', 1.5, {x: 4, y: -2, z: -20});
// createCelestialBody('public/textures/saturn.jpg', 0.2, {x: -5, y: -3, z: -8});

// export function createSun(scene) {
//   const sunGeometry = new THREE.SphereGeometry(150, 64, 64);


//   const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg');

//   const sunMaterial = new THREE.MeshBasicMaterial({
//       map: sunTexture
//   });

//   const sun = new THREE.Mesh(sunGeometry, sunMaterial);
//   sun.position.set(0, 0, -500);  // Position the sun in the scene
//   scene.add(sun);
// }



// export function createCelestialBody(textureUrl, size, position, scene) {
//     const texture = new THREE.TextureLoader().load(textureUrl);
//     const geometry = new THREE.SphereGeometry(size, 32, 32);
//     const material = new THREE.MeshBasicMaterial({ map: texture });
//     const body = new THREE.Mesh(geometry, material);
//     body.position.set(position.x, position.y, position.z);
//     scene.add(body);
// }

export function createSun(scene) {
  const sunGeometry = new THREE.SphereGeometry(200, 64, 64);

  const sunTexture = new THREE.TextureLoader().load('public/textures/sun.jpg');

  const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture
  });

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 0, -600);  // Position the sun in the scene
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