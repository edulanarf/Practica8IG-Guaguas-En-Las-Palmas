export function loadCSV(url, funcion) {
  fetch(url)
    .then((res) => (res.ok ? res.text() : Promise.reject(res.statusText)))
    .then(funcion)
    .catch(console.error);
}
