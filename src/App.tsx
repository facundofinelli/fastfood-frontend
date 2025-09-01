import './App.css'
import { Cart } from './Components/Cart'
import { Footer } from './Components/Footer'
import { NavBar } from './Components/NavBar'
import { ProductList } from './Components/ProductList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

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
            {/* otras rutas como /login, /account, etc */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
