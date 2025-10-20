export async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${path}`);
  return res.json();
}

export const Api = {
  products: () => fetchJSON(`${import.meta.env.BASE_URL}productos.json`),
  users: () => fetchJSON(`${import.meta.env.BASE_URL}usuarios.json`),
  regionesComunas: () => fetchJSON(`${import.meta.env.BASE_URL}regionesComunas.json`),
};
