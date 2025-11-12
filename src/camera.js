import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

export function createCamera(fov, near, far) {
  const camera = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    near,
    far
  );

  camera.position.z = 5;
  return camera;
}

export function createCameraControl(camera, renderer) {
  const camcontrols = new OrbitControls(camera, renderer.domElement);
  camcontrols.enableRotate = false;
  camcontrols.enableZoom = true;
  camcontrols.enablePan = true;
  camcontrols.screenSpacePanning = true;

  return camcontrols;
}
