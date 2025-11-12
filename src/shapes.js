import { Map2Range } from "./utils.js";
import * as THREE from "three";

let minlon = -15.524582542,
  maxlon = -15.377402565;
let minlat = 28.033867293,
  maxlat = 28.196133779;

let lineasDibujadas = [];

export function procesarCSVShapes(content) {
  const shapes = {};

  const sep = ",";
  const filas = content.split("\n").filter((f) => f.trim());
  const encabezados = filas[0].split(sep);
  const indices = {
    id: encabezados.indexOf("shape_id"),
    lat: encabezados.indexOf("shape_pt_lat"),
    lon: encabezados.indexOf("shape_pt_lon"),
    seq: encabezados.indexOf("shape_pt_sequence"),
  };

  for (let i = 1; i < filas.length; i++) {
    const col = filas[i].split(sep);
    if (col.length < 4) continue;

    const id = col[indices.id];
    const lat = parseFloat(col[indices.lat]);
    const lon = parseFloat(col[indices.lon]);
    const seq = parseInt(col[indices.seq]);

    if (!shapes[id]) shapes[id] = [];

    shapes[id].push({ lat, lon, seq });
  }

  //cada shape lo ordeno por su secuencia
  for (const id in shapes) {
    shapes[id].sort((a, b) => a.seq - b.seq);
  }

  return shapes;
}

export function drawShapes(scene, shape, mapsx, mapsy, color = 0x0000ff) {
  const points = shape.map((p) => {
    const x = Map2Range(p.lon, minlon, maxlon, -mapsx / 2, mapsx / 2);
    const y = Map2Range(p.lat, minlat, maxlat, -mapsy / 2, mapsy / 2);
    return new THREE.Vector3(x, y, 0.01);
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    linewidth: 30,
    transparent: true,
    opacity: 0.9,
  });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  lineasDibujadas.push(line);
  return line;
}

export function deleteShapes(scene) {
  for (const line of lineasDibujadas) {
    scene.remove(line);
  }
  lineasDibujadas = [];
}
