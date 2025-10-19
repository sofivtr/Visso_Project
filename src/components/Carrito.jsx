import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import images from '../assets/js/images';
import { getCart, updateQty, removeItem, clearCart, subscribeCart, computeTotals } from '../assets/js/carrito';
import { validarRut, validarEmail, validarTelefonoChile, formatearRut, formatearTelefonoChile } from '../assets/js/validaciones';

function Carrito() {
  const [items, setItems] = useState(getCart());
  const [coupon, setCoupon] = useState('');
  const [couponPct, setCouponPct] = useState(0);
  const getImage = (key) => images[key] || images.demo;

  useEffect(() => {
    const unsubscribe = subscribeCart(() => setItems(getCart()));
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  const totalsBase = useMemo(() => computeTotals(items), [items]);
  const discount = useMemo(() => Math.round(totalsBase.subtotal * couponPct), [totalsBase.subtotal, couponPct]);
  const totals = useMemo(() => ({
    subtotal: totalsBase.subtotal,
    iva: totalsBase.iva,
    envio: totalsBase.envio,
    total: totalsBase.total - discount
  }), [totalsBase, discount]);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === 'VISSO10') setCouponPct(0.10);
    else if (code === 'VISSO20') setCouponPct(0.20);
    else setCouponPct(0);
  };

  const fmt = (n) => `$${(n || 0).toLocaleString('es-CL')}`;

  return (
<div>
  <main className="main">
    {/* Header de página */}
    <section className="page-header">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <h1 className="fw-bold mb-3" id="titulo_carrito">Carrito de Compras</h1>
            <p className="lead mb-0">Revisa y confirma tu selección antes de proceder al pago</p>
          </div>
        </div>
      </div>
    </section>
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          {/* Botón continuar comprando */}
          <div className="mb-4">
            <Link to="/productos" className="btn btn-continue">
              <i className="bi bi-arrow-left me-2" />Continuar Comprando
            </Link>
          </div>
          {/* Lista de productos en el carrito */}
          <div id="cartItemsContainer">
            {items.length === 0 ? (
              <div className="alert alert-info d-flex align-items-center" role="alert">
                <i className="bi bi-info-circle me-2" />
                Tu carrito está vacío. <Link to="/productos" className="ms-1">Explora productos</Link>
              </div>
            ) : (
              <div className="list-group">
                {items.map((it) => (
                  <div key={it.id} className="list-group-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      {it.imagenKey && (
                        <img src={getImage(it.imagenKey)} alt={it.nombre} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                      )}
                      <div>
                        <div className="fw-semibold">{it.nombre}</div>
                        <small className="text-muted">{fmt(it.precio)} c/u</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="input-group" style={{ width: 140 }}>
                        <button className="btn btn-outline-secondary" onClick={() => updateQty(it.id, (it.cantidad || 1) - 1)} disabled={it.cantidad <= 1}>-</button>
                        <input type="number" className="form-control text-center" value={it.cantidad}
                               min={1} max={10}
                               onChange={(e) => updateQty(it.id, Number(e.target.value))} />
                        <button className="btn btn-outline-secondary" onClick={() => updateQty(it.id, (it.cantidad || 1) + 1)} disabled={it.cantidad >= 10}>+</button>
                      </div>
                      <div className="text-end" style={{ width: 110 }}>
                        <div className="fw-semibold">{fmt(it.precio * (it.cantidad || 0))}</div>
                      </div>
                      <button className="btn btn-outline-danger" title="Quitar" onClick={() => removeItem(it.id)}>
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="list-group-item d-flex justify-content-end">
                  <button className="btn btn-outline-danger" onClick={() => clearCart()}>
                    <i className="bi bi-x-circle me-1" />Vaciar Carrito
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          {/* Resumen de la compra */}
          <div className="summary-card">
            <h4 className="mb-4">Resumen de la Compra</h4>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span id="subtotal">{fmt(totalsBase.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span id="shipping">Gratis</span>
            </div>
            <div className="summary-row">
              <span>IVA (19%):</span>
              <span id="iva">{fmt(totalsBase.iva)}</span>
            </div>
            <div className="coupon-section">
              <h6 className="mb-3">¿Tienes un cupón de descuento?</h6>
              <div className="d-flex gap-2">
                <input type="text" className="form-control coupon-input" id="couponInput" placeholder="Código del cupón" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <button className="btn btn-coupon" onClick={applyCoupon} type="button">Aplicar</button>
              </div>
              <div id="couponMessage" className="mt-2" style={{display: 'none'}} />
            </div>
            <div className="summary-row" id="discountRow" style={{display: couponPct > 0 ? 'flex' : 'none'}}>
              <span>Descuento:</span>
              <span id="discount" className="text-success">-{fmt(discount)}</span>
            </div>
            <div className="summary-row">
              <span>Total:</span>
              <span id="total">{fmt(totals.total)}</span>
            </div>
            <button className="btn btn-checkout mt-3" id="checkoutBtn" data-bs-toggle="modal" data-bs-target="#checkoutModal">
              <i className="bi bi-credit-card me-2" />Proceder al Pago
            </button>
            <div className="text-center mt-3">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1" />
                Compra 100% segura y protegida
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  {/* Modal de Checkout */}
  <div className="modal fade" id="checkoutModal" tabIndex={-1} aria-labelledby="checkoutModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="checkoutModalLabel">
            <i className="bi bi-credit-card me-2" />Finalizar Compra
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
        </div>
        <div className="modal-body">
          <form id="checkoutForm" onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const nombre = form.querySelector('#checkoutNombre');
            const rut = form.querySelector('#checkoutRut');
            const email = form.querySelector('#checkoutEmail');
            const tel = form.querySelector('#checkoutTelefono');
            let ok = true;
            if (!nombre.value.trim()) ok = false;
            if (rut.value) rut.value = formatearRut(rut.value);
            if (!validarRut(rut.value)) ok = false;
            if (!validarEmail(email.value)) ok = false;
            if (tel.value) tel.value = formatearTelefonoChile(tel.value);
            if (!validarTelefonoChile(tel.value)) ok = false;
            if (!ok) return;
          }}>
            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3">Información Personal</h6>
                <div className="mb-3">
                  <label htmlFor="checkoutNombre" className="form-label">Nombre Completo *</label>
                  <input type="text" className="form-control" id="checkoutNombre" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="checkoutRut" className="form-label">RUT *</label>
                  <input type="text" className="form-control" id="checkoutRut" placeholder="12.345.678-9" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="checkoutEmail" className="form-label">Email *</label>
                  <input type="email" className="form-control" id="checkoutEmail" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="checkoutTelefono" className="form-label">Teléfono *</label>
                  <input type="tel" className="form-control" id="checkoutTelefono" placeholder="9 1234 5678" required />
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="mb-3">Dirección de Envío</h6>
                <div className="mb-3">
                  <label htmlFor="checkoutDireccion" className="form-label">Dirección *</label>
                  <input type="text" className="form-control" id="checkoutDireccion" required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="checkoutComuna" className="form-label">Comuna *</label>
                    <input type="text" className="form-control" id="checkoutComuna" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="checkoutRegion" className="form-label">Región *</label>
                    <select className="form-select" id="checkoutRegion" required>
                      <option value>Seleccionar región</option>
                      <option value="metropolitana">Región Metropolitana</option>
                      <option value="valparaiso">Valparaíso</option>
                      <option value="biobio">Biobío</option>
                      <option value="araucania">La Araucanía</option>
                      <option value="los-lagos">Los Lagos</option>
                    </select>
                  </div>
                </div>
                <h6 className="mb-3 mt-4">Método de Pago</h6>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="metodoPago" id="pagoTarjeta" defaultValue="tarjeta" defaultChecked />
                    <label className="form-check-label" htmlFor="pagoTarjeta">
                      <i className="bi bi-credit-card me-2" />Tarjeta de Crédito/Débito
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="metodoPago" id="pagoTransferencia" defaultValue="transferencia" />
                    <label className="form-check-label" htmlFor="pagoTransferencia">
                      <i className="bi bi-bank me-2" />Transferencia Bancaria
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <h6>Resumen del Pedido</h6>
                <div id="checkoutResumen">
                  {items.map(it => (
                    <div key={it.id} className="d-flex justify-content-between small">
                      <span>{it.nombre} x{it.cantidad}</span>
                      <span>{fmt(it.precio * (it.cantidad || 0))}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span id="checkoutSubtotal">{fmt(totalsBase.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Envío:</span>
                    <span id="checkoutEnvio">Gratis</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2" id="checkoutDescuentoRow" style={{display: couponPct > 0 ? 'flex' : 'none'}}>
                    <span>Descuento:</span>
                    <span id="checkoutDescuento" className="text-success">-{fmt(discount)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span id="checkoutTotal">{fmt(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => { clearCart(); }}>Confirmar Compra</button>
        </div>
      </div>
    </div>
  </div>
</div>

    );
}

export default Carrito;