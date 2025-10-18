import React from 'react';

function Home() {
  return (
    <main className="py-5 text-center">
      <h1 className="display-4 fw-bold">Transforma tu hogar con Visso</h1>
      <p className="lead text-muted">
        Encuentra muebles y accesorios seleccionados para cada espacio de tu casa.
      </p>
      <section className="row mt-5">
        <article className="col-md-4 mb-4">
          <h2 className="h5">Diseño moderno</h2>
          <p>Curaduría de piezas actuales creadas por artesanos latinoamericanos.</p>
        </article>
        <article className="col-md-4 mb-4">
          <h2 className="h5">Entrega rápida</h2>
          <p>Logística optimizada para que recibas tus compras sin demoras.</p>
        </article>
        <article className="col-md-4 mb-4">
          <h2 className="h5">Atención personalizada</h2>
          <p>Asesoría gratuita de nuestro equipo para armar tus ambientes.</p>
        </article>
      </section>
    </main>
  );
}

export default Home;