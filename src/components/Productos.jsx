import React, { useEffect, useMemo, useState } from 'react';
import images from '../assets/js/images';
import { Api } from '../assets/js/api';
import { addItem as cartAdd } from '../assets/js/carrito';
import { iniciarVistaPreviaAuto } from '../assets/js/visionPreview';

const CATEGORIES = {
  todos: 'Todos',
  oftalmicos: 'Oftálmicos',
  sol: 'Gafas de Sol',
  lectura: 'Lectura',
  fotocromaticos: 'Fotocromáticos',
};

function formatCLP(value) {
  try { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value); } catch { return `$${value}`; }
}

function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('todos');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await Api.products();
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter(p => (category === 'todos' || p.categoria === category) && (!term || (p.nombre || '').toLowerCase().includes(term)));
  }, [products, category, search]);

  const openModal = (p) => {
    setSelected(p);
    setQty(1);
  };
  const changeQuantity = (d) => setQty(prev => Math.max(1, Math.min(10, prev + d)));
  const addToCartFromModal = () => {
    if (!selected) return;
    cartAdd({
      id: selected.id,
      nombre: selected.nombre,
      categoria: selected.categoria,
      precio: selected.precio,
      imagenKey: selected.imagenKey,
    }, qty);
  };
  const getImage = (key) => images[key] || images.demo;


  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(() => {
      iniciarVistaPreviaAuto({
        idMedio: 'vpMedia',
        idEntrada: 'vpInput',
        origen: 'https://lottie.host/embed/af5df129-1927-42ac-92ea-a01d4299cecf/g3WuUxTXWY.lottie',
        ancho: 220,
        alto: 124,
        desenfoque: 8,
      });
    }, 50);
    return () => clearTimeout(t);
  }, [selected]);

  return (
    <main className="main">
      {/* =================== [SECCIÓN HEADER TIENDA] =================== */}
      <section className="page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="fw-bold mb-3" id="titulo_tienda">Nuestros Productos</h1>
              <p className="lead mb-0">Descubre la colección más exclusiva de lentes y gafas de sol</p>
            </div>
          </div>
        </div>
      </section>

      {/* =================== [SECCIÓN FILTROS Y BÚSQUEDA] =================== */}
      <div className="container">
        <div className="filters-section">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3">
              <h5 className="mb-3">Filtrar por categoría:</h5>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <button
                  key={key}
                  className={`filter-btn btn btn-outline-dark me-2 mb-2 ${category === key ? 'active' : ''}`}
                  onClick={() => setCategory(key)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="mb-3">Buscar producto:</h5>
              <input
                type="text"
                className="form-control search-box"
                placeholder="Buscar lentes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* =================== [SECCIÓN GRID DE PRODUCTOS] =================== */}
        <div className="row" id="productsContainer">
          {loading && <div className="col-12 text-center py-5">Cargando productos…</div>}
          {!loading && filtered.length === 0 && (
            <div className="col-12 text-center text-muted py-5">No hay productos que coincidan</div>
          )}
          {!loading && filtered.map((p) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={p.id}>
              <div className="card h-100 shadow-sm">
                <img src={getImage(p.imagenKey)} className="card-img-top" alt={p.nombre} style={{ objectFit: 'contain', height: 180 }} />
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-light text-dark align-self-start mb-2">{CATEGORIES[p.categoria] || p.categoria}</span>
                  <h5 className="card-title mb-1">{p.nombre}</h5>
                  <p className="card-text text-muted mb-3" style={{ minHeight: 40 }}>{p.descripcion}</p>
                  <div className="mt-auto d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-primary">{formatCLP(p.precio)}</span>
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#productModal"
                      onClick={() => openModal(p)}
                    >
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================== [MODAL DETALLE PRODUCTO] =================== */}
      <div className="modal fade" id="productModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitle">{selected ? selected.nombre : 'Detalles del Producto'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="product-gallery">
                    <img
                      id="modalImage"
                      src={selected ? getImage(selected.imagenKey) : ''}
                      alt={selected ? selected.nombre : 'Producto'}
                      className="img-fluid rounded"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <span className="badge bg-light text-dark" id="modalCategory">{selected ? (CATEGORIES[selected.categoria] || selected.categoria) : ''}</span>
                  <h3 className="mt-3 mb-3" id="modalProductTitle">{selected ? selected.nombre : ''}</h3>
                  <p className="text-muted mb-3" id="modalDescription">{selected ? selected.descripcion : ''}</p>
                  <div className="d-flex align-items-center mb-4">
                    <h4 className="product-price mb-0 me-3" id="modalPrice">{selected ? formatCLP(selected.precio) : ''}</h4>
                    <small className="text-muted">IVA incluido</small>
                  </div>
                  
                  <div className="mb-3 p-3 border rounded bg-light d-flex align-items-start gap-3 flex-wrap" style={{maxWidth: 520}}>
                    <div id="vpMedia" style={{ width: 220, height: 124 }} className="flex-shrink-0" />
                    <div className="flex-grow-1" style={{ minWidth: 220 }}>
                      <label htmlFor="vpInput" className="form-label fw-semibold mb-1">Ingrese su graduación (D)</label>
                      <div className="input-group mb-2" style={{ maxWidth: 260 }}>
                        <input id="vpInput" type="text" className="form-control" placeholder="Ej: -2.00" />
                      </div>
                      <small className="text-muted d-block">Simulación visual aproximada. Deja vacío para ver borroso; escribe un número para ver nítido.</small>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cantidad:</label>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary" type="button" onClick={() => changeQuantity(-1)}>−</button>
                      <input type="number" className="form-control mx-2 text-center" id="quantity" value={qty} min={1} max={10} onChange={(e)=>setQty(Math.max(1, Math.min(10, Number(e.target.value)||1)))} style={{ width: 80 }} />
                      <button className="btn btn-outline-secondary" type="button" onClick={() => changeQuantity(1)}>+</button>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg w-100" onClick={addToCartFromModal} data-bs-dismiss="modal">
                    <i className="bi bi-cart" /> Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Productos;