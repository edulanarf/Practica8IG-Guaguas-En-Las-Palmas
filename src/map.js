import * as THREE from "three";
import { Plano } from "./utils.js";
import { loadCSV } from "./csvLoader";
import { procesarCSVViajes } from "./trips.js";
import { procesarCSVParadas } from "./stops.js";
import { procesarCSVShapes } from "./shapes.js";

let shapesGlobal = null;

export function loadMap(url, scene, scale, esferaPorStop) {
  new THREE.TextureLoader().load(url, (texture) => {
    const txAspectRatio = texture.image.width / texture.image.height;
    const mapsy = scale;
    const mapsx = mapsy * txAspectRatio;
    const mapa = Plano(0, 0, 0, mapsx, mapsy, scene);

    mapa.material.map = texture;
    mapa.material.needsUpdate = true;

    // Cargamos shapes.csv y lo guardamos globalmente
    loadCSV("csv/shapes.csv", (content) => {
      shapesGlobal = procesarCSVShapes(content);

      loadCSV("csv/stops.csv", (content) =>
        procesarCSVParadas(content, mapsx, mapsy, scene, esferaPorStop)
      );

      loadCSV("csv/stop_times.csv", (content) =>
        procesarCSVViajes(
          content,
          scene,
          esferaPorStop,
          shapesGlobal,
          mapsx,
          mapsy
        )
      );
    });

    return mapa;
  });
}
