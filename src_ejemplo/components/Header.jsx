import { Link } from 'react-router-dom';

function Header(){
    return(

            <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
                <div className='container-fluid'>
                    <Link className='navbar-brand' to='/'>Inicio</Link>
                    <Link className='navbar-brand' to='/about'>Acerca</Link>
                    <Link className='navbar-brand' to='/contact'>Contacto</Link>
                    <Link className='navbar-brand' to='/product'>Producto</Link>
                </div>
            </nav>

         //<>averiguar eso
    )
}

export default Header;
