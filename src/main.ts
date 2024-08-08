import "./style.css";

import * as THREE from "three";

import GUI from "lil-gui";

// Debug
const gui = new GUI({
  width: 400,
});
const debugObject: Record<string, string | number | Function> = {
  earthRotationSpeed: 24,
  moonRotationSpeed: 10,
  moonPositionSpeed: 0.2,
};

// ! Textures
const textureLoader = new THREE.TextureLoader();

const earthTexture = textureLoader.load("/earth.jpg");
earthTexture.colorSpace = THREE.SRGBColorSpace;
const moonTexture = textureLoader.load("/moon.jpg");
moonTexture.colorSpace = THREE.SRGBColorSpace;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// ! Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// ! Scene
const scene = new THREE.Scene();

// ! Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 5, 6);
scene.add(camera);

// Earth sphere
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 16),
  new THREE.MeshPhongMaterial({
    map: earthTexture,
  })
);
// Correct rotation order
earth.rotation.reorder("ZYX");
// Rotate by 25 degrees by Z axis
earth.rotateZ((22 * Math.PI) / 180);
scene.add(earth);
camera.lookAt(earth.position);

// Moon sphere
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 16),
  new THREE.MeshPhongMaterial({
    map: moonTexture,
  })
);
moon.position.set(4, 0, 0);
scene.add(moon);

// ! Lights
const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.3);
const sunLight = new THREE.DirectionalLight("#b9d5ff", 10);
sunLight.position.set(-10, 0, 0);

scene.add(ambientLight, sunLight);

// ! Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ! Animation
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Earth rotation animation
  earth.rotation.y = (elapsedTime * Math.PI) / +debugObject.earthRotationSpeed;

  // Moon position animation
  moon.position.x = 4 * Math.cos(elapsedTime * +debugObject.moonPositionSpeed);
  moon.position.z = 4 * Math.sin(elapsedTime * +debugObject.moonPositionSpeed);

  // Moon rotation animation
  moon.rotation.y = (elapsedTime * Math.PI) / +debugObject.moonRotationSpeed;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.0001)
  .name("Ambient Light Intensity");
gui
  .add(sunLight, "intensity")
  .min(0)
  .max(10)
  .step(0.01)
  .name("sunLight Light Intensity");
gui
  .add(debugObject, "earthRotationSpeed")
  .min(0)
  .max(100)
  .step(1)
  .name("Rotation Speed of Earth (less is faster)");
gui
  .add(debugObject, "moonRotationSpeed")
  .min(0)
  .max(100)
  .step(1)
  .name("Rotation Speed of Moon (less is faster)");
gui
  .add(debugObject, "moonPositionSpeed")
  .min(0)
  .max(100)
  .step(1)
  .name("Changing position of Moon (less is slower)");

// TODO: add shadows from Earth to the Moon
// TODO: add controls for camera
