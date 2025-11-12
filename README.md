# Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)  
2. [Estructura del Proyecto](#estructura-del-proyecto)  
3. [Módulos y Funciones](#módulos-y-funciones)  
   - `camera.js`  
   - `render.js`  
   - `loadcsv.js`  
   - `shapes.js`  
   - `stops.js`  
   - `trips.js`  
   - `simulation.js`  
   - `utils.js`  
4. [Flujo de la Simulación](#flujo-de-la-simulación)  
5. [Archivos CSV Necesarios](#archivos-csv-necesarios) 

---

# Descripción del Proyecto

Este proyecto permite simular en 3D el movimiento de las guaguas de Las Palmas De Gran Canaria sobre rutas definidas en un mapa.  
Utiliza **Three.js** para la representación gráfica y archivos CSV que contienen información de rutas, paradas y viajes.  
Los usuarios pueden seleccionar líneas de transporte y observar la simulación de las guaguas siguiendo los horarios indicados en los CSV.

# Estructura del Proyecto

- **index.js**  
  Archivo principal que inicializa la escena de Three.js, la cámara, el render y carga el mapa. También inicia la animación.

- **camera.js**  
  Contiene funciones para crear la cámara de la escena y los controles de cámara usando `OrbitControls`.

- **render.js**  
  Define la función para crear el renderer de Three.js y añadirlo al DOM.

- **loadcsv.js**  
  Función genérica para cargar archivos CSV de manera asíncrona.

- **shapes.js**  
  Procesa los archivos CSV de shapes (rutas de las guaguas), dibuja las líneas en la escena y permite eliminar las rutas dibujadas previamente (debido a un cambio de elección de línea sugerido por el usuario).

- **stops.js**  
  Procesa los CSV de paradas de guaguas, crea esferas 3D en la escena para representar las paradas y las almacena en un objeto para referencia.

- **trips.js**  
  Procesa los CSV de viajes, organiza los viajes por línea y crea la interfaz GUI para seleccionar qué línea simular.

- **simulation.js**  
  Contiene la lógica de simulación de las guaguas: cálculo de tiempos, posiciones, creación de meshes de guaguas y actualización de su posición según el horario.

- **utils.js**  
  Funciones generales: conversión de horas a segundos y viceversa, creación de esferas y planos, remapeo de coordenadas, y creación de la interfaz GUI.

# Módulos y Funciones

## 3.1 `index.js`
Archivo principal que inicializa la escena, cámara, render y carga del mapa.

- **Variables principales**  
  - `scene`: Escena de Three.js.  
  - `renderer`: Renderer WebGL.  
  - `camera`: Cámara principal.  
  - `camcontrols`: Controles de cámara.  
  - `scale`: Escala del mapa.  
  - `mapUrl`: URL del mapa.  
  - `map`: Mesh del plano del mapa.  
  - `esferaPorStop`: Objeto que almacena las referencias a las esferas de cada parada.

- **Funciones**  
  - `init()`: Inicializa escena, cámara, renderer, controles y carga el mapa.  
  - `animate()`: Función de animación que actualiza el renderer continuamente.

---

## 3.2 `camera.js`
Gestiona la cámara y sus controles en la escena.

- **Funciones**  
  - `createCamera(fov, near, far)`: Crea una cámara `PerspectiveCamera` con los parámetros indicados.  
  - `createCameraControl(camera, renderer)`: Crea controles de cámara `OrbitControls` permitiendo zoom y paneo, pero deshabilitando la rotación.

---

## 3.3 `render.js`
Crea el renderer de Three.js y lo añade al DOM.

- **Funciones**  
  - `createRender()`: Devuelve un `WebGLRenderer` configurado con el tamaño de la ventana y añade su canvas al `document.body`.

---

## 3.4 `loadcsv.js`
Carga archivos CSV de manera asíncrona y ejecuta una función callback al completarse.

- **Funciones**  
  - `loadCSV(url, funcion)`: Carga el archivo CSV desde `url` y llama a `funcion` con el contenido.

---

## 3.5 `shapes.js`
Gestiona las rutas de las guaguas.

- **Funciones**  
  - `procesarCSVShapes(content)`: Procesa el CSV de shapes y devuelve un objeto con arrays de puntos ordenados por secuencia.  
  - `drawShapes(scene, shape, mapsx, mapsy, color)`: Dibuja una línea 3D en la escena basada en un shape.  
  - `deleteShapes(scene)`: Elimina todas las líneas dibujadas previamente de la escena.

---

## 3.6 `stops.js`
Gestiona las paradas de guagua y su representación en la escena.

- **Funciones**  
  - `procesarCSVParadas(content, mapsx, mapsy, scene, esferaPorStop)`: Procesa CSV de paradas, crea esferas 3D en la escena y las almacena en `esferaPorStop`.

---

## 3.7 `trips.js`
Procesa los CSV de viajes y administra la GUI para seleccionar líneas.

- **Funciones**  
  - `procesarCSVViajes(content, scene, esferaPorStop, shapesGlobal, mapsx, mapsy)`: Procesa los viajes, organiza los trips por línea y crea la GUI para seleccionar la línea a simular.

---

## 3.8 `simulation.js`
Contiene la lógica de simulación de las guaguas.

- **Funciones principales**  
  - `simularViajeDiaCompleto(paradas, linea, scene, esferaPorStop, shapesGlobal, mapsx, mapsy)`: Inicia la simulación de todas las guaguas de una línea.  
  - `actualizarBus(bus, paradasTrip, tTrip, tiempoSimulado, esferaPorStop)`: Actualiza la posición del bus según el tiempo simulado (cada 60 segundos de manera predeterminada).  
  - `agruparYOrdenarViajes(paradas)`: Organiza las paradas por trip_id y las ordena por hora.  
  - `crearMeshesBuses(viajesPorTrip, scene)`: Crea los meshes de los buses en la escena.  
  - `calcularRangoTiempos(paradas)`: Calcula el tiempo mínimo y máximo de todos los viajes.

---

## 3.9 `utils.js`
Funciones auxiliares  

- **Funciones principales**  
  - `Esfera(px, py, pz, radio, nx, ny, col, stop_id, scene, esferaPorStop)`: Crea una esfera 3D en la escena y la registra por `stop_id`.  
  - `Plano(px, py, pz, sx, sy, scene)`: Crea un plano 3D en la escena.  
  - `Map2Range(val, vmin, vmax, dmin, dmax)`: Remapea un valor de un rango a otro.  
  - `horaASegundos(hora)`: Convierte un string `"HH:MM:SS"` a segundos.  
  - `segundosAHora(seg)`: Convierte segundos a string `"HH:MM:SS"`.  
  - `crearGUI(scene, viajes, viajesPorLinea, esferaPorStop, shapesGlobal, mapsx, mapsy)`: Crea la interfaz GUI para seleccionar la línea a simular y controla la simulación.  

# Flujo de la Simulación

La simulación sigue un flujo bien definido que va desde la carga de datos hasta la animación de los buses en la escena 3D.

## 4.1 Inicialización de la Escena
1. **Creación de la escena**  
   - Se crea un objeto `THREE.Scene()` para contener todos los elementos 3D.  
2. **Cámara y controles**  
   - `createCamera(fov, near, far)` crea la cámara principal.  
   - `createCameraControl(camera, renderer)` añade los controles de la cámara (`OrbitControls`).  
3. **Renderer**  
   - `createRender()` crea un `WebGLRenderer` y lo añade al `document.body`.  
4. **Mapa base**  
   - `loadMap(url, scene, scale, esferaPorStop)` carga la textura del mapa y la aplica a un plano 3D.

## 4.2 Carga de Datos
1. **Shapes**  
   - Se carga el CSV de shapes con `loadCSV()` y se procesa con `procesarCSVShapes(content)`.  
   - Cada shape representa la ruta de una línea de guagua.  
2. **Paradas**  
   - Se carga el CSV de paradas y se procesa con `procesarCSVParadas(content, mapsx, mapsy, scene, esferaPorStop)`.  
   - Cada parada se dibuja como una esfera 3D en la escena y se registra en `esferaPorStop`.  
3. **Viajes/Trips**  
   - Se carga el CSV de viajes y se procesa con `procesarCSVViajes(content, scene, esferaPorStop, shapesGlobal, mapsx, mapsy)`.  
   - Se organiza la información por `trip_id` y se clasifica por línea.  

## 4.3 Configuración de la Interfaz
- `crearGUI(scene, viajes, viajesPorLinea, esferaPorStop, shapesGlobal, mapsx, mapsy)` crea una GUI con `dat.GUI` que permite seleccionar la línea a simular.  
- Al cambiar la línea, se detiene cualquier simulación previa y se inicia una nueva.

## 4.4 Simulación de Guaguas
1. **Preparación de la simulación**  
   - `simularViajeDiaCompleto(paradasConTrip, linea, scene, esferaPorStop, shapesGlobal, mapsx, mapsy)`:  
     - Borra los shapes anteriores con `deleteShapes()`.  
     - Dibuja las rutas de la línea seleccionada con `drawShapes()`.  
     - Agrupa y ordena las paradas por `trip_id`.  
     - Crea los meshes de los buses (`crearMeshesBuses`).  
     - Calcula el tiempo mínimo y máximo de todos los viajes (`calcularRangoTiempos`).  

2. **Animación de las Guaguas**  
   - Cada segundo (`setInterval`) se actualiza `tiempoSimulado`.  
   - Para cada `trip`, se calcula la posición del bus con `actualizarBus(bus, paradasTrip, tTrip, tiempoSimulado, esferaPorStop)`.  
   - La posición se actualiza siguiendo la lógica de:
     - Mostrar la guagua en la última parada alcanzada si aún no ha llegado al siguiente punto.  
     - Ocultar la guagua antes de que comience su viaje o después de finalizarlo.

3. **Lógica de tiempo y posición**
   - Se usa `horaASegundos()` y `segundosAHora()` para convertir entre tiempo legible y segundos.

## 4.5 Actualización de la Escena
- La función `animate()` ejecuta `requestAnimationFrame()` para actualizar continuamente el renderer y mostrar la posición actual de las guaguas y el mapa.

## 4.6 Flujo resumido
1. Carga de escena y cámara → mapa base.  
2. Carga y procesamiento de CSV: shapes, paradas, viajes.  
3. Creación de GUI y selección de línea.  
4. Iniciar simulación de la línea:
   - Dibujar shapes de la línea.  
   - Crear meshes de buses.  
   - Animar guaguas según hora simulada.  
5. Actualización continua del renderer para mostrar la escena.  

# Archivos CSV Necesarios

La simulación requiere varios archivos CSV que contienen información sobre rutas, paradas y horarios de las guaguas.

## 5.1 shapes.csv

- Contiene las rutas de las líneas de las diferentes guaguas.
- Columnas:
  - `shape_id`: Identificador único de la ruta.
  - `shape_pt_lat`: Latitud del punto de la ruta.
  - `shape_pt_lon`: Longitud del punto de la ruta.
  - `shape_pt_sequence`: Secuencia del punto dentro de la ruta.

**Uso:** Se procesa mediante `procesarCSVShapes(content)` en `shapes.js`.  
Cada ruta se dibuja en la escena con `drawShapes(scene, shape, mapsx, mapsy, color)`.

## 5.2 stops.csv

- Contiene la información de las paradas.
- Columnas:
  - `stop_id`: Identificador único de la parada.
  - `stop_name`: Nombre descriptivo de la parada.
  - `stop_lat`: Latitud de la parada.
  - `stop_lon`: Longitud de la parada.

**Uso:** Se procesa mediante `procesarCSVParadas(content, mapsx, mapsy, scene, esferaPorStop)` en `stops.js`.  
Se crean esferas en la escena para cada parada y se guardan en el objeto `esferaPorStop` para referencias durante la simulación.

## 5.3 stop_times.csv

- Contiene los horarios de cada viaje (trip) y la secuencia de paradas.
- Columnas esperadas:
  - `trip_id`: Identificador único del viaje.
  - `stop_id`: Identificador de la parada correspondiente.
  - `arrival_time`: Hora de llegada a la parada (formato `HH:MM:SS`).
  - `stop_sequence`: Secuencia de la parada dentro del viaje.

**Uso:** Se procesa mediante `procesarCSVViajes(content, scene, esferaPorStop, shapesGlobal, mapsx, mapsy)` en `trips.js`.  
Organiza los viajes por trip y por línea, y prepara los datos para la simulación con `simularViajeDiaCompleto(...)`.





