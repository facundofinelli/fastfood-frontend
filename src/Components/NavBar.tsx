import { useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userService from "../Services/UserService";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Hook para redireccionar
  const isLoggedIn = userService.isLoggedIn();


  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold">FastFood</div>

        {/* Links desktop */}
        {isLoggedIn && (
          <ul className="hidden md:flex gap-6">
            <li><a href="#" className="hover:text-gray-300" onClick={() => navigate("/")}>Inicio</a></li>
            <li><a href="#" className="hover:text-gray-300">Contacto</a></li>
          </ul>
        )}

        {/* Right side: carrito y hamburguesa */}
        <div className="flex items-center gap-4">
          {/* Carrito */}
          <button
            className="relative p-2 rounded-full hover:bg-gray-700 transition-all duration-200 cursor-pointer flex items-center justify-center"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={28} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </button>

          {/* Login/Profile */}
          <button
            className="p-2 rounded-full hover:bg-gray-700 transition-all duration-200 cursor-pointer flex items-center justify-center"
            onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
          >
            <User size={28} />
          </button>

          {/* Botón hamburguesa en mobile */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {isOpen && isLoggedIn && (
        <div className="md:hidden bg-gray-800 px-6 py-4">
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="hover:text-gray-300">Inicio</a></li>
            <li><a href="#" className="hover:text-gray-300">Mi Cuenta</a></li>
            <li><a href="#" className="hover:text-gray-300">Contacto</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};