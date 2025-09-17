import './App.css'
import { Cart } from './components/Cart'
import { Footer } from './components/Footer'
import { Login } from './components/Login'
import { NavBar } from './components/NavBar'
import { ProductList } from './components/ProductList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Register } from './components/Register'
import { Profile } from './components/Profile';

import { ProductForm } from './components/ProductForm'
import UserList from './components/UserList'
import ProviderList from './components/ProviderList'
import { ProviderForm } from './components/ProviderForm'
import IngredientList from './components/IngredientList'
import { IngredientForm } from './components/IngredientForm'

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
            <Route path="/users" element={<UserList />} /> 
            <Route path="/providers" element={<ProviderList />} /> 
            <Route path="/ingredients" element={<IngredientList />} /> 
            {/* Rutas para agregar y editar productos */}
            <Route path="/product/add" element={<ProductForm isEdit={false} />} />
            <Route path="/product/edit/:id" element={<ProductForm isEdit={true} />} />
            <Route path="/provider/add" element={<ProviderForm isEdit={false} />} />
            <Route path="/provider/edit/:id" element={<ProviderForm isEdit={true} />} />
            <Route path="/ingredient/add" element={<IngredientForm isEdit={false} />} />
            <Route path="/ingredient/edit/:id" element={<IngredientForm isEdit={true} />} />
            {/* otras rutas como /login, /account, etc */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
