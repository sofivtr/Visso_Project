import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
//import Footer from './components/Footer';
import Productos from './components/Productos';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Routes>
         <Route path='/' element={<Home />} />
        <Route path='/productos' element={<Productos />} />
      </Routes>
    </>
  )
}

export default App

//las rutas tienen que estar en español
//html -> react
//backend a aws
//html to JSX
//pensar en lo que no se va a mover de nuestro proyecto.