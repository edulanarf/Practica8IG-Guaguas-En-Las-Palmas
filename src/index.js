import * as THREE from "three";
import { createCamera, createCameraControl } from "./camera.js";
import { createRender } from "./render.js";
import { loadMap } from "./map.js";

let scene, renderer, camera, camcontrols;
let scale = 5;
const mapUrl =
  "https://raw.githubusercontent.com/edulanarf/mapaGranCanaria/main/.idea/MapaFinal.png";
let map;

let esferaPorStop = {};

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = createCamera(75, 0.1, 1000);
  renderer = createRender();
  camcontrols = createCameraControl(camera, renderer);
  map = loadMap(mapUrl, scene, scale, esferaPorStop);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
