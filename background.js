const moveSpeed = 0.1;
const move = { forward: false, backward: false, left: false, right: false };  // Move this up

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const spaceTexture = new THREE.TextureLoader().load('textures/stars.jpg');
const spaceGeometry = new THREE.SphereGeometry(100, 64, 64);
const spaceMaterial = new THREE.MeshBasicMaterial({
  map: spaceTexture,
  side: THREE.BackSide
});
const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(space);

const earthTexture = new THREE.TextureLoader().load('textures/earth.jpg');
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, 0, -10);
scene.add(earth);

const celestialBodies = [];

function createCelestialBody(textureUrl, size, position) {
  const texture = new THREE.TextureLoader().load(textureUrl);
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const body = new THREE.Mesh(geometry, material);
  body.position.set(position.x, position.y, position.z);
  scene.add(body);
  celestialBodies.push(body);
}
createCelestialBody('textures/jupiter.jpg', 0.5, {x: -3, y: 2, z: -15});
createCelestialBody('textures/planet.jpg', 1.5, {x: 4, y: -2, z: -20});
createCelestialBody('textures/saturn.jpg', 0.2, {x: -5, y: -3, z: -8});

const shootingStars = [];

function createShootingStar() {
  const starGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const shootingStar = new THREE.Mesh(starGeometry, starMaterial);

  const startX = Math.random() * 20 - 10;
  const startY = Math.random() * 10 - 5;
  shootingStar.position.set(startX, startY, -50);
  scene.add(shootingStar);
  shootingStars.push({
    mesh: shootingStar,
    velocity: new THREE.Vector3(Math.random() * 0.05 - 0.02, Math.random() * 0.02 - 0.01, 0.1)
  });
}

function updateShootingStars() {
  shootingStars.forEach((star, index) => {
    star.mesh.position.add(star.velocity);
    if (star.mesh.position.z > 5) {
      scene.remove(star.mesh);
      shootingStars.splice(index, 1);
    }
  });
}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.001;

  celestialBodies.forEach(body => {
    body.rotation.y += 0.001;
  });

  if (Math.random() < 0.01) {
    createShootingStar();
  }

  updateShootingStars();

  if (move.forward) camera.translateZ(-moveSpeed);
  if (move.backward) camera.translateZ(moveSpeed);
  if (move.left) camera.translateX(-moveSpeed);
  if (move.right) camera.translateX(moveSpeed);

  renderer.render(scene, camera);
}

animate();

const controls = new THREE.PointerLockControls(camera, document.body);

document.getElementById('instructions').addEventListener('click', function () {
  controls.lock();
});

controls.addEventListener('lock', () => {
  document.getElementById('instructions').style.display = 'none';
});

controls.addEventListener('unlock', () => {
  document.getElementById('instructions').style.display = 'block';
});


document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      move.forward = true;
      break;
    case 'ArrowDown':
    case 's':
      move.backward = true;
      break;
    case 'ArrowLeft':
    case 'a':
      move.left = true;
      break;
    case 'ArrowRight':
    case 'd':
      move.right = true;
      break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      move.forward = false;
      break;
    case 'ArrowDown':
    case 's':
      move.backward = false;
      break;
    case 'ArrowLeft':
    case 'a':
      move.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      move.right = false;
      break;
  }
});

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
