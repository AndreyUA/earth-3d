import "./style.css";

import * as THREE from "three";

// ! Textures
const textureLoader = new THREE.TextureLoader();

const albedoTexture = textureLoader.load("/Albedo.jpg");
albedoTexture.colorSpace = THREE.SRGBColorSpace;
const oceanTexture = textureLoader.load("/Ocean.jpg");

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
camera.position.set(0, 5, 5);
scene.add(camera);

// Earth sphere
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 16),
  new THREE.MeshStandardMaterial({
    map: albedoTexture,
    roughnessMap: oceanTexture,
    metalnessMap: oceanTexture,
  })
);
// Correct rotation order
earth.rotation.reorder("ZYX");
// Rotate by 25 degrees by Z axis
earth.rotateZ((25 * Math.PI) / 180);
scene.add(earth);
camera.lookAt(earth.position);

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
  earth.rotation.y = (elapsedTime * Math.PI) / 24;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
