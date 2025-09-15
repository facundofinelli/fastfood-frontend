import './App.css'
import { Cart } from './Components/Cart'
import { Footer } from './Components/Footer'
import { Login } from './Components/Login'
import { NavBar } from './Components/NavBar'
import { ProductList } from './Components/ProductList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Register } from './Components/Register'
import { Profile } from './Components/Profile';

import { ProductForm } from './Components/ProductForm'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />

        {/* Contenido principal */}
        <main className="flex-1 pt-20 px-6">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            {/* Rutas para agregar y editar productos */}
            <Route path="/product/add" element={<ProductForm isEdit={false} />} />
            <Route path="/product/edit/:id" element={<ProductForm isEdit={true} />} />
            {/* otras rutas como /login, /account, etc */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
