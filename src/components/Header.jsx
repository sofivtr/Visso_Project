import { Link, useLocation } from 'react-router-dom';

function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <header id="header" className="header d-flex align-items-center sticky-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <Link to="/" className="logo d-flex align-items-center me-auto">
          <span className="d-flex align-items-center gap-2">
            <img src="assets/img/logo.png" alt="Logo Visso" className="rounded-circle" style={{ height: 48, width: 48, objectFit: 'cover' }} />
            <h1 className="sitename mb-0 font-story-script">Visso</h1>
          </span>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            {isHome ? (
              <>
                <li><a href="#hero" className="active">Inicio<br /></a></li>
                <li><a href="#about">Nosotros</a></li>
                <li><a href="#contacto">Contacto</a></li>
              </>
            ) : (
              <>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/#about">Nosotros</Link></li>
                <li><Link to="/#contacto">Contacto</Link></li>
              </>
            )}
            <li><Link className="navbar-brand" to="/productos">Productos</Link></li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" />
        </nav>

        <div className="d-flex gap-2">
          <Link className="btn-getstarted d-flex align-items-center gap-1" to="/carrito">
            <i className="bi bi-cart" /> Carrito
          </Link>
          <Link className="btn-getstarted d-flex align-items-center gap-1" to="/auth">
            <i className="bi bi-person" /> Ingresar
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;