import { Esfera, Map2Range } from "./utils.js";

let minlon = -15.524582542,
  maxlon = -15.377402565;
let minlat = 28.033867293,
  maxlat = 28.196133779;

const datosEstaciones = [];

export function procesarCSVParadas(
  content,
  mapsx,
  mapsy,
  scene,
  esferaPorStop
) {
  const sep = ",";
  const filas = content.split("\n").filter((f) => f.trim());
  const encabezados = filas[0].split(sep);
  const indices = {
    id: encabezados.indexOf("stop_id"),
    name: encabezados.indexOf("stop_name"),
    lat: encabezados.indexOf("stop_lat"),
    lon: encabezados.indexOf("stop_lon"),
  };

  for (let i = 1; i < filas.length; i++) {
    const col = filas[i].split(sep);
    if (col.length < 4) continue;

    const stop = {
      id: col[indices.id],
      name: col[indices.name],
      lat: parseFloat(col[indices.lat]),
      lon: parseFloat(col[indices.lon]),
    };
    datosEstaciones.push(stop);

    const px = Map2Range(stop.lon, minlon, maxlon, -mapsx / 2, mapsx / 2);
    const py = Map2Range(stop.lat, minlat, maxlat, -mapsy / 2, mapsy / 2);
    Esfera(px, py, 0, 0.006, 10, 10, 0x009688, stop.id, scene, esferaPorStop);
  }
}
