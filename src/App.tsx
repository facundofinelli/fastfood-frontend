import './App.css'
import { Footer } from './Components/Footer'
import { NavBar } from './Components/NavBar'
import { ProductList } from './Components/ProductList'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* Contenido principal */}
      <main className="flex-1 pt-20 px-6">
        <h1 className="text-2xl font-bold">Nuestros Productos</h1>
        <ProductList />
      </main>

      <Footer />
    </div>
  )
}

export default App
