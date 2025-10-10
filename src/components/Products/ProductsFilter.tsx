import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export type FilterOptions = {
  search: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
};

type Props = {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
};

export const ProductsFilter = ({ filters, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof FilterOptions, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onChange({ search: "", category: null, minPrice: null, maxPrice: null });
  };

  return (
    <>
      {/* Botón visible en mobile */}
      <button
        className="sm:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal size={18} /> Filtros
      </button>

      {/* Sidebar Desktop */}
      <div className="hidden sm:block w-64 bg-white p-4 rounded-lg shadow h-fit">
        <h2 className="font-semibold mb-4">Filtros</h2>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
        />

        {/* Categoría */}
        <select
          value={filters.category ?? ""}
          onChange={(e) => handleChange("category", e.target.value || null)}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
        >
          <option value="">Todas las categorías</option>
          <option value="pizza">Pizza</option>
          <option value="pasta">Pasta</option>
          <option value="bebida">Bebidas</option>
        </select>

        {/* Precio */}
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              handleChange("minPrice", e.target.value ? Number(e.target.value) : null)
            }
            className="border border-gray-300 rounded px-3 py-2 w-1/2"
          />
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              handleChange("maxPrice", e.target.value ? Number(e.target.value) : null)
            }
            className="border border-gray-300 rounded px-3 py-2 w-1/2"
          />
        </div>

        {/* Botones */}
        <button
        onClick={handleClear}
        className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
        Limpiar filtros
        </button>

      </div>

      {/* Overlay Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex">
          <div className="bg-white w-72 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Filtros</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Los mismos filtros que en desktop */}
            <input
              type="text"
              placeholder="Buscar producto..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            />

            <select
              value={filters.category ?? ""}
              onChange={(e) => handleChange("category", e.target.value || null)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              <option value="">Todas las categorías</option>
              <option value="pizza">Pizza</option>
              <option value="pasta">Pasta</option>
              <option value="bebida">Bebidas</option>
            </select>

            <div className="flex gap-2 mb-4">
              <input
                type="number"
                placeholder="Mín"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  handleChange("minPrice", e.target.value ? Number(e.target.value) : null)
                }
                className="border border-gray-300 rounded px-3 py-2 w-1/2"
              />
              <input
                type="number"
                placeholder="Máx"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  handleChange("maxPrice", e.target.value ? Number(e.target.value) : null)
                }
                className="border border-gray-300 rounded px-3 py-2 w-1/2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Aplicar
              </button>
              <button
                onClick={handleClear}
                className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
