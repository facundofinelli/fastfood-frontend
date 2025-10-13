import React, { useState } from "react";

type ProductsFilterProps = {
  onFilter: (filters: {
    name?: string;
    minPrice?: string;
    maxPrice?: string;
  }) => void;
  onClear: () => void;
};

export const ProductsFilter: React.FC<ProductsFilterProps> = ({
  onFilter,
  onClear,
}) => {
  const [filters, setFilters] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
  });

  // Maneja cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "minPrice" || name === "maxPrice") {
      // Permite solo números (y un punto opcional)
      const numericValue = value.replace(/[^0-9.]/g, "");
      setFilters({ ...filters, [name]: numericValue });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  // Ejecuta el filtrado al presionar el botón
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  // Limpia todos los filtros y notifica al padre
  const handleClear = () => {
    const cleared = { name: "", minPrice: "", maxPrice: "" };
    setFilters(cleared);
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-col items-end gap-4 bg-gray-50 p-4 rounded-lg shadow-sm"
    >
      {/* Filtro por nombre */}
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Buscar producto..."
          className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Precio desde */}
      <div className="flex flex-col">
        <label htmlFor="minPrice" className="text-sm font-medium text-gray-700">
          Precio desde
        </label>
        <input
          type="text"
          id="minPrice"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="0"
          className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Precio hasta */}
      <div className="flex flex-col">
        <label htmlFor="maxPrice" className="text-sm font-medium text-gray-700">
          Precio hasta
        </label>
        <input
          type="text"
          id="maxPrice"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="1000"
          className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};
