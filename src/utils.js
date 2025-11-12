import * as THREE from "three";
import * as dat from "dat.gui";
import { simularViajeDiaCompleto } from "./simulation.js";

export function Esfera(
  px,
  py,
  pz,
  radio,
  nx,
  ny,
  col,
  stop_id = null,
  scene,
  esferaPorStop
) {
  const geom = new THREE.SphereBufferGeometry(radio, nx, ny);
  const mat = new THREE.MeshBasicMaterial({ color: col });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(px, py, pz);
  scene.add(mesh);
  if (stop_id) esferaPorStop[String(stop_id).trim()] = mesh;
  return mesh;
}

export function Plano(px, py, pz, sx, sy, scene) {
  const geom = new THREE.PlaneGeometry(sx, sy);
  const mat = new THREE.MeshBasicMaterial({});
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(px, py, pz);
  scene.add(mesh);
  return mesh;
}

export function Map2Range(val, vmin, vmax, dmin, dmax) {
  const t = 1 - (vmax - val) / (vmax - vmin);
  return dmin + t * (dmax - dmin);
}

export function horaASegundos(hora) {
  const [h, m, s] = (hora || "00:00:00").split(":").map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

export function segundosAHora(seg) {
  const h = Math.floor(seg / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seg % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seg % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function crearGUI(
  scene,
  viajes,
  viajesPorLinea,
  esferaPorStop,
  shapesGlobal,
  mapsx,
  mapsy
) {
  const gui = new dat.GUI();
  const guiParams = { linea: "" };
  let intervaloSimulacion = null;
  let busesSimulacion = [];

  gui
    .add(guiParams, "linea", Object.keys(viajesPorLinea).sort())
    .name("Selecciona línea")
    .onChange((value) => {
      // Detener simulación anterior
      if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        busesSimulacion.forEach((bus) => scene.remove(bus.mesh));
        busesSimulacion = [];
        intervaloSimulacion = null;
      }

      if (!value) return;

      const viajesDeLinea = viajesPorLinea[value] || [];
      let paradasConTrip = [];
      viajesDeLinea.forEach((tripId) => {
        const paradasTrip = (viajes[tripId] || []).map((p) => ({
          ...p,
          trip_id: tripId,
        }));
        paradasTrip.sort((a, b) => a.seq - b.seq);
        paradasConTrip.push(...paradasTrip);
      });

      // Iniciar simulación
      const result = simularViajeDiaCompleto(
        paradasConTrip,
        value,
        scene,
        esferaPorStop,
        shapesGlobal,
        mapsx,
        mapsy
      );
      intervaloSimulacion = result.intervalo;
      busesSimulacion = result.busesSimulacion;
    });

  return gui;
}
