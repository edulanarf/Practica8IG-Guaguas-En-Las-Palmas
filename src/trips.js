import { simularViajeDiaCompleto } from "./index.js";
import { crearGUI } from "./utils.js";

export function procesarCSVViajes(
  content,
  scene,
  esferaPorStop,
  shapesGlobal,
  mapsx,
  mapsy
) {
  const sep = ",";
  content = content.replace(/\r\n/g, "\n").replace(/^\uFEFF/, "");
  const filas = content
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => f);
  if (filas.length <= 1) return;

  const encabezados = filas[0].split(sep);
  const indices = {
    trip_id: encabezados.indexOf("trip_id"),
    stop_id: encabezados.indexOf("stop_id"),
    arrival_time: encabezados.indexOf("arrival_time"),
    stop_sequence: encabezados.indexOf("stop_sequence"),
  };

  const viajes = {};
  const viajesPorLinea = {};

  const CHUNK = 5000;
  let i = 1;

  function procesarBloque() {
    const hasta = Math.min(i + CHUNK, filas.length);
    for (; i < hasta; i++) {
      const col = filas[i].split(sep);
      const trip = col[indices.trip_id] ? col[indices.trip_id].trim() : null;
      const stop = col[indices.stop_id] ? col[indices.stop_id].trim() : null;
      const time = col[indices.arrival_time]
        ? col[indices.arrival_time].trim()
        : null;
      const seq = parseInt(col[indices.stop_sequence]);

      if (!trip || !stop || !time) continue;

      if (!viajes[trip]) viajes[trip] = [];
      viajes[trip].push({ stop, time, seq });

      const lineaMatch = trip.match(/LA(\d{3})/i);
      if (lineaMatch) {
        const linea = lineaMatch[1];
        if (!viajesPorLinea[linea]) viajesPorLinea[linea] = [];
        if (!viajesPorLinea[linea].includes(trip))
          viajesPorLinea[linea].push(trip);
      }
    }

    if (i < filas.length) setTimeout(procesarBloque, 0);
    else {
      crearGUI(
        scene,
        viajes,
        viajesPorLinea,
        esferaPorStop,
        shapesGlobal,
        mapsx,
        mapsy
      );
    }
  }

  procesarBloque();
}
