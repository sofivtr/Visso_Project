import { useEffect, useState } from 'react';
import { Api } from '../assets/js/api';
import { validarRut, validarEmail, validarTelefonoChile, setFieldError, formatearRut, formatearTelefonoChile } from '../assets/js/validaciones';

function Admin() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('usuarios');

  // Carga inicial de usuarios y productos
  useEffect(() => {
    (async () => {
      try {
        const [u, p] = await Promise.all([Api.users(), Api.products()]);
        setUsers(u);
        setProducts(p);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="main">
      <section className="section">
        <div className="container">
          <div className="mb-4">
            <h2 className="mb-1">Panel de Administrador</h2>
            <p className="text-muted mb-0">Gestiona usuarios y productos de forma eficiente</p>
          </div>
          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button className={`nav-link ${tab === 'usuarios' ? 'active' : ''}`} onClick={() => setTab('usuarios')}>Gestión de Usuarios</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab === 'productos' ? 'active' : ''}`} onClick={() => setTab('productos')}>Gestión de Productos</button>
            </li>
          </ul>

          {/* Panel Usuarios */}
          {tab === 'usuarios' && (
            <>
              <div className="row g-4 align-items-center mb-3">
                <div className="col-md-3">
                  <div className="stats-card text-center p-3 rounded border">
                    <h3 className="mb-1">{loading ? '—' : users.length}</h3>
                    <p className="mb-0">Total de usuarios</p>
                  </div>
                </div>
                <div className="col-md-9">
                  <h2 className="gestion-title mb-0">Gestión de usuarios</h2>
                </div>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#userModal">
                  <i className="bi bi-plus-circle" /> Agregar Usuario
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>RUT</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Contraseña</th>
                      <th>Fecha de registro</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={9} className="text-center py-4">Cargando…</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={9} className="text-center py-4 text-muted">Sin usuarios</td></tr>
                    ) : (
                      users.map(u => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.rut || '-'}</td>
                          <td>{u.nombre}</td>
                          <td>{u.email}</td>
                          <td>{u.telefono || '-'}</td>
                          <td>{u.contrasena ? '••••••••' : '-'}</td>
                          <td>{u.fechaRegistro || '-'}</td>
                          <td><span className="badge bg-light text-dark text-capitalize">{u.rol}</span></td>
                          <td className="text-nowrap">
                            <button className="btn btn-sm btn-success me-2" data-bs-toggle="modal" data-bs-target="#userModal"><i className="bi bi-pencil-square" /></button>
                            <button className="btn btn-sm btn-danger"><i className="bi bi-trash" /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Panel Productos */}
          {tab === 'productos' && (
            <>
              <div className="row g-4 align-items-center mb-3">
                <div className="col-md-3">
                  <div className="stats-card text-center p-3 rounded border">
                    <h3 className="mb-1">{loading ? '—' : products.length}</h3>
                    <p className="mb-0">Total de productos</p>
                  </div>
                </div>
                <div className="col-md-9">
                  <h2 className="gestion-title mb-0">Gestión de productos</h2>
                </div>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#productModal">
                  <i className="bi bi-plus-circle" /> Agregar Producto
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-4">Cargando…</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4 text-muted">Sin productos</td></tr>
                    ) : (
                      products.map(p => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.nombre}</td>
                          <td className="text-capitalize">{p.categoria}</td>
                          <td>${p.precio.toLocaleString('es-CL')}</td>
                          <td className="text-nowrap">
                            <button className="btn btn-sm btn-success me-2" data-bs-toggle="modal" data-bs-target="#productModal"><i className="bi bi-pencil-square" /></button>
                            <button className="btn btn-sm btn-danger"><i className="bi bi-trash" /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Modales de usuario y producto (solo presentación, no funcionales) */}
        <div className="modal fade" id="userModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Usuario</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
              </div>
              <div className="modal-body">
                <form id="userAdminForm" noValidate onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const nombre = form.querySelector('#userNombre');
                  const rut = form.querySelector('#userRut');
                  const email = form.querySelector('#userEmail');
                  const tel = form.querySelector('#userTelefono');
                  const pass = form.querySelector('#userPassword');
                  const nombreErr = form.querySelector('#userNombreError');
                  const rutErr = form.querySelector('#userRutError');
                  const emailErr = form.querySelector('#userEmailError');
                  const telErr = form.querySelector('#userTelefonoError');
                  const passErr = form.querySelector('#userPasswordError');
                  const success = form.parentElement.querySelector('#userAdminSuccess');
                  if (success) success.style.display = 'none';
                  let ok = true;
                  if (!nombre.value.trim()) { setFieldError(nombre, nombreErr, 'Ingrese el nombre'); ok = false; } else { setFieldError(nombre, nombreErr, ''); }
                  if (rut.value) rut.value = formatearRut(rut.value);
                  if (!validarRut(rut.value)) { setFieldError(rut, rutErr, 'RUT inválido'); ok = false; } else { setFieldError(rut, rutErr, ''); }
                  if (!validarEmail(email.value)) { setFieldError(email, emailErr, 'Correo inválido'); ok = false; } else { setFieldError(email, emailErr, ''); }
                  if (tel.value) tel.value = formatearTelefonoChile(tel.value);
                  if (!validarTelefonoChile(tel.value)) { setFieldError(tel, telErr, 'Formato: 9 1234 5678'); ok = false; } else { setFieldError(tel, telErr, ''); }
                  if (!pass.value || pass.value.length < 8) { setFieldError(pass, passErr, 'Mínimo 8 caracteres'); ok = false; } else { setFieldError(pass, passErr, ''); }
                  if (!ok) return;
                  if (success) {
                    success.style.display = 'block';
                    setTimeout(() => { success.style.display = 'none'; }, 3000);
                  }
                }}>
                  <div className="mb-3">
                    <label htmlFor="userNombre" className="form-label">Nombre</label>
                    <input id="userNombre" className="form-control" />
                    <div id="userNombreError" className="error-message text-danger small" style={{display:'none'}} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userRut" className="form-label">RUT</label>
                    <input id="userRut" className="form-control" placeholder="12.345.678-9" />
                    <div id="userRutError" className="error-message text-danger small" style={{display:'none'}} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userEmail" className="form-label">Email</label>
                    <input id="userEmail" type="email" className="form-control" placeholder="correo@ejemplo.com" />
                    <div id="userEmailError" className="error-message text-danger small" style={{display:'none'}} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userTelefono" className="form-label">Teléfono</label>
                    <input id="userTelefono" className="form-control" placeholder="9 1234 5678" />
                    <div id="userTelefonoError" className="error-message text-danger small" style={{display:'none'}} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userPassword" className="form-label">Contraseña</label>
                    <input id="userPassword" type="password" className="form-control" placeholder="Mínimo 8 caracteres" />
                    <div id="userPasswordError" className="error-message text-danger small" style={{display:'none'}} />
                  </div>
                </form>
                <div id="userAdminSuccess" className="alert alert-success mt-2" style={{display:'none'}}>Usuario guardado con éxito.</div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary" form="userAdminForm">Guardar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="productModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Producto</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
              </div>
              <div className="modal-body">
                <form id="productAdminForm" noValidate onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const nombre = form.querySelector('#productNombre');
                  const categoria = form.querySelector('#productCategoria');
                  const precio = form.querySelector('#productPrecio');
                  const nombreErr = form.querySelector('#productNombreError');
                  const categoriaErr = form.querySelector('#productCategoriaError');
                  const precioErr = form.querySelector('#productPrecioError');
                  const success = form.parentElement.querySelector('#productAdminSuccess');
                  if (success) success.style.display = 'none';
                  let ok = true;
                  if (!nombre.value.trim()) { setFieldError(nombre, nombreErr, 'Ingrese el nombre'); ok = false; } else { setFieldError(nombre, nombreErr, ''); }
                  if (!categoria.value.trim()) { setFieldError(categoria, categoriaErr, 'Ingrese la categoría'); ok = false; } else { setFieldError(categoria, categoriaErr, ''); }
                  const precioVal = Number(precio.value);
                  if (Number.isNaN(precioVal) || precioVal <= 0) { setFieldError(precio, precioErr, 'Ingrese un precio válido (> 0)'); ok = false; } else { setFieldError(precio, precioErr, ''); }
                  if (!ok) return;
                  if (success) {
                    success.style.display = 'block';
                    setTimeout(() => { success.style.display = 'none'; }, 3000);
                  }
                }}>
                  <div className="mb-3">
                    <label htmlFor="productNombre" className="form-label">Nombre</label>
                    <input id="productNombre" className="form-control" />
                    <div id="productNombreError" className="error-message text-danger small" style={{display:'none'}} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productCategoria" className="form-label">Categoría</label>
                    <input id="productCategoria" className="form-control" />
                    <div id="productCategoriaError" className="error-message text-danger small" style={{display:'none'}} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productPrecio" className="form-label">Precio</label>
                    <input id="productPrecio" type="number" className="form-control" />
                    <div id="productPrecioError" className="error-message text-danger small" style={{display:'none'}} />
                  </div>
                </form>
                <div id="productAdminSuccess" className="alert alert-success mt-2" style={{display:'none'}}>Producto guardado con éxito.</div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary" form="productAdminForm">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Admin;
