import './App.css'
import { Footer } from './Components/Footer'
import { NavBar } from './Components/NavBar'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* Contenido principal */}
      <main className="flex-1 pt-20 px-6">
        <h1 className="text-2xl font-bold">Bienvenido a MiApp</h1>
        <p className="mt-4">Contenido de prueba...</p>
      </main>

      <Footer />
    </div>
  )
}

export default App
