import { horaASegundos, segundosAHora } from "./utils.js";
import * as THREE from "three";
import { drawShapes, deleteShapes } from "./shapes.js";

export function simularViajeDiaCompleto(
  paradas,
  linea,
  scene,
  esferaPorStop,
  shapesGlobal,
  mapsx,
  mapsy
) {
  // 🔹 Borrar shapes anteriores
  deleteShapes(scene);

  // 🔹 Dibujar shapes de la línea actual
  if (shapesGlobal) {
    const ids = Object.keys(shapesGlobal).filter((id) => id.startsWith(linea));
    ids.forEach((id, i) => {
      const color = i % 2 === 0 ? 0xff0000 : 0x0000ff;
      drawShapes(scene, shapesGlobal[id], mapsx, mapsy, color);
    });
  }

  const viajesPorTrip = agruparYOrdenarViajes(paradas);

  const { buses, busesSimulacion } = crearMeshesBuses(viajesPorTrip, scene);
  const { minTiempo, maxTiempo } = calcularRangoTiempos(paradas);

  let tiempoSimulado = minTiempo;
  const escala = 60; //Este parametro es el tiempo que pasa (en segundos) entre cada actualizacion

  const intervalo = setInterval(() => {
    tiempoSimulado += escala;
    if (tiempoSimulado > maxTiempo) {
      clearInterval(intervalo);
      return;
    }

    // Actualizo reloj de la UI
    const horaDiv = document.getElementById("horaActual");
    if (horaDiv)
      horaDiv.textContent = ` ${segundosAHora(
        tiempoSimulado
      )} (Línea ${linea})`;

    // Actualizo la posicion del bus
    for (const trip in viajesPorTrip) {
      const paradasTrip = viajesPorTrip[trip];
      const tTrip = paradasTrip.map((p) => horaASegundos(p.time));
      actualizarBus(
        buses[trip],
        paradasTrip,
        tTrip,
        tiempoSimulado,
        esferaPorStop
      );
    }
  }, 1000);

  return { intervalo, busesSimulacion };
}

function agruparYOrdenarViajes(paradas) {
  const viajesPorTrip = {};
  paradas.forEach((p) => {
    if (!viajesPorTrip[p.trip_id]) viajesPorTrip[p.trip_id] = [];
    viajesPorTrip[p.trip_id].push(p);
  });

  for (const trip in viajesPorTrip) {
    viajesPorTrip[trip].sort(
      (a, b) => horaASegundos(a.time) - horaASegundos(b.time)
    );
  }

  return viajesPorTrip;
}

function crearMeshesBuses(viajesPorTrip, scene) {
  const buses = {};
  const busesSimulacion = [];

  for (const trip in viajesPorTrip) {
    //El color dependera de la dirección (último numero del trip impar o par)
    const match = trip.match(/(\d+)$/);
    const num = match ? parseInt(match[1], 10) : 0;
    const colorBus = num % 2 === 1 ? 0xff0000 : 0x0000ff;

    const busMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 12, 12),
      new THREE.MeshBasicMaterial({ color: colorBus })
    );
    busMesh.visible = false;
    scene.add(busMesh);
    buses[trip] = { mesh: busMesh, index: 0 };
    busesSimulacion.push(buses[trip]);
  }

  return { buses, busesSimulacion };
}

function calcularRangoTiempos(paradas) {
  const todosTiempos = paradas.map((p) => horaASegundos(p.time));
  //Los 3 puntos sirven para separar los parametros de una lista ejemplo:
  // Math.min(...[3600, 7200, 5400]) pasa a ser Math.min(3600, 7200, 5400)
  const minTiempo = Math.min(...todosTiempos);
  const maxTiempo = Math.max(...todosTiempos);
  return { minTiempo, maxTiempo };
}

function actualizarBus(bus, paradasTrip, tTrip, tiempoSimulado, esferaPorStop) {
  if (!tTrip.length) {
    bus.mesh.visible = false;
    return;
  }

  // Antes del inicio → ocultar
  if (tiempoSimulado < tTrip[0]) {
    bus.mesh.visible = false;
    bus.index = 0;
    return;
  }

  // Después del final → mostrar última parada
  if (tiempoSimulado >= tTrip[tTrip.length - 1]) {
    const lastStop = esferaPorStop[paradasTrip[paradasTrip.length - 1].stop];
    if (lastStop) bus.mesh.position.copy(lastStop.position);
    bus.mesh.visible = true; // mostrar o false si quieres desaparecer
    return;
  }

  // 🔹 Encontrar la última parada alcanzada
  let paradaIndex = 0;
  for (let i = 0; i < tTrip.length; i++) {
    if (tiempoSimulado >= tTrip[i]) {
      paradaIndex = i;
    } else {
      break;
    }
  }

  const stop = esferaPorStop[paradasTrip[paradaIndex].stop];
  if (!stop) return;

  bus.mesh.position.copy(stop.position);
  bus.mesh.visible = true;
}
