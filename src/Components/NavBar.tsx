import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold">FastFood</div>

        {/* Links desktop */}
        <ul className="hidden md:flex gap-6">
          <li><a href="#" className="hover:text-gray-300">Inicio</a></li>
          <li><a href="#" className="hover:text-gray-300">Mi Cuenta</a></li>
          <li><a href="#" className="hover:text-gray-300">Contacto</a></li>
        </ul>

        {/* Right side: carrito y hamburguesa */}
        <div className="flex items-center gap-4">
          {/* Carrito */}
          <button className="relative">
            <ShoppingCart size={28} />
            {/* Contador de productos en el carrito */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </button>

          {/* Botón hamburguesa en mobile */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {isOpen && (
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