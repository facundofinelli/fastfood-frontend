import { useState } from "react";
import { Menu, X } from "lucide-react"; // iconos

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

        {/* Botun hamburguesa en mobile */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
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