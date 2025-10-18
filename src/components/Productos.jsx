import React from 'react';

function Productos() {
  const productos = [
    { id: 1, nombre: 'Producto A', precio: '$25.00' },
    { id: 2, nombre: 'Producto B', precio: '$18.50' },
    { id: 3, nombre: 'Producto C', precio: '$42.10' },
  ];

  return (
    <section>
      <h1>Catálogo de productos</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            <strong>{producto.nombre}</strong> — {producto.precio}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Productos;