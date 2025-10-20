export async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${path}`);
  return res.json();
}

export const Api = {
  products: () => fetchJSON('/api/productos.json'),
  users: () => fetchJSON('/api/usuarios.json'),
  regionesComunas: () => fetchJSON('/api/regionesComunas.json'),
};
