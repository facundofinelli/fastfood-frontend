import './App.css'
import { Cart } from './components/Orders/Cart'
import { Footer } from './components/ui/Footer'
import { Login } from './components/ui/Login'
import { NavBar } from './components/ui/NavBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Register } from './components/ui/Register'
import { Profile } from './components/ui/Profile';

import UserList from './components/Users/UserList'
import ProviderList from './components/Providers/ProviderList'
import { ProviderForm } from './components/Providers/ProviderForm'

import AboutUs from './components/ui/AboutUs'
import { ProductList } from './components/Products/ProductList'
import IngredientList from './components/Ingredients/IngredientList'
import CategoryList from './components/Categories/CategoryList'
import { ProductForm } from './components/Products/ProductForm'
import { IngredientForm } from './components/Ingredients/IngredientForm'
import { ContactPage } from './components/ui/ContactPage'
import { CategoryForm } from './components/Categories/CategoryForm'
import OrderList from './components/Orders/OrderList'
import PromotionList from './components/Promotions/PromotionList'
import { PromotionForm } from './components/Promotions/PromotionForm'
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />

        {/* Contenido principal */}
        <main className="flex-1 pt-20 px-6">
          <Routes>
            {/* Rutas generales */}
            <Route path="/"           element={<ProductList/>}/>
            <Route path="/cart"       element={<Cart/>}/>
            <Route path="/login"      element={<Login/>}/>
            <Route path="/register"   element={<Register/>}/>
            <Route path="/profile"    element={<Profile/>}/>
            <Route path="/users"      element={<UserList/>}/>
            <Route path="/providers"  element={<ProviderList/>}/>
            <Route path="/ingredients"element={<IngredientList/>}/>
            <Route path="/categories" element={<CategoryList/>}/>
            <Route path="/about-us"   element={<AboutUs/>}/>
            <Route path="/contact"    element={<ContactPage/>}/>
            <Route path="/orders"     element={<OrderList/>}/>
            <Route path="/promotions" element={<PromotionList/>}/>
            {/* Rutas para agregar y editar forms */}
            <Route path="/product/add"         element={<ProductForm isEdit={false}/>}/>
            <Route path="/product/edit/:id"    element={<ProductForm isEdit={true}/>}/>
            <Route path="/provider/add"        element={<ProviderForm isEdit={false}/>}/>
            <Route path="/provider/edit/:id"   element={<ProviderForm isEdit={true}/>}/>
            <Route path="/ingredient/add"      element={<IngredientForm isEdit={false}/>}/>
            <Route path="/ingredient/edit/:id" element={<IngredientForm isEdit={true}/>}/>
            <Route path="/categories/add"      element={<CategoryForm isEdit={false}/>}/>  
            <Route path="/categories/edit/:id" element={<CategoryForm isEdit={true}/>}/>
            <Route path="/promotions/add"      element={<PromotionForm isEdit={true}/>}/>
            <Route path="/promotions/edit/:id" element={<PromotionForm isEdit={true}/>}/>
          </Routes>
        </main>

        <Footer />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </Router>
  )
}

export default App
