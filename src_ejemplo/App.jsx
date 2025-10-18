import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import Product from './components/Products';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/products' element={<Products />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App

//las rutas tienen que estar en español
//html -> react
//backend a aws
//html to JSX
//pensar en lo que no se va a mover de nuestro proyecto.