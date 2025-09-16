import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import apiService from "../services/ApiService";
import { ProductsFilter, type FilterOptions } from "./ProductsFilter";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
};

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [user, setUser] = useState<{ role: string } | null>(null); // 👈 usuario

  // Estado de filtros
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: null,
    minPrice: null,
    maxPrice: null,
  });

  const navigate = useNavigate(); // 👈 hook

    // Cargar usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.get<Product[]>("/products");
        setProducts(data);

        // Inicializar cantidades en 1
        const initialQuantities = data.reduce(
          (acc: any, p: Product) => ({ ...acc, [p.id]: 1 }),
          {}
        );
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setErrorMessage("No se pudieron cargar los productos. Intenta más tarde.");
      }
    };

    fetchProducts();
  }, []);

  const increase = (id: number) => {
    setQuantities({ ...quantities, [id]: quantities[id] + 1 });
  };

  const decrease = (id: number) => {
    setQuantities({
      ...quantities,
      [id]: quantities[id] > 1 ? quantities[id] - 1 : 1,
    });
  };

  const addToCart = (id: number) => {
    alert(`Agregaste ${quantities[id]} unidades del producto ${id} al carrito`);
  };

  // POR EL MOMENTO, EL FILTRADO SE HACE EN EL FRONTEND
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchCategory = filters.category
      ? p.category === filters.category
      : true;

    const matchMinPrice = filters.minPrice ? p.price >= filters.minPrice : true;
    const matchMaxPrice = filters.maxPrice ? p.price <= filters.maxPrice : true;

    return matchSearch && matchCategory && matchMinPrice && matchMaxPrice;
  });

  if (errorMessage) {
    return (
      <div className="text-center text-red-500 font-semibold mt-6">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex gap-6 mt-6">
      {/* Sidebar de filtros */}
      <ProductsFilter filters={filters} onChange={setFilters} />

      {/* Contenedor principal */}
      <div className="flex-1">
        {/* Botón para agregar producto */}
        <div className="flex justify-end mb-4">
          {user?.role === "admin" && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() => navigate("/product/add")}
            >
              + Agregar producto
            </button>
          )}
        </div>

        {/* Lista de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={p.image || "https://via.placeholder.com/150"}
                alt={p.name}
                className="w-32 h-32 object-cover rounded-md"
              />
              <div className="w-full flex justify-between items-center mt-2">
                <h2 className="font-semibold text-lg">{p.name}</h2>
                {user?.role === "admin" && (
                  <button
                    className="text-sm px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-500"
                    onClick={() => navigate(`/product/edit/${p.id}`)}
                  >
                    Editar
                  </button>
                )}
              </div>

              <h2 className="mt-2 font-semibold text-lg">{p.name}</h2>
              <p className="text-gray-700 mt-1">${p.price}</p>

              {/* Contador de cantidad */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="p-1 bg-gray-200 rounded"
                  onClick={() => decrease(p.id)}
                >
                  <Minus size={16} />
                </button>
                <span className="px-2">{quantities[p.id]}</span>
                <button
                  className="p-1 bg-gray-200 rounded"
                  onClick={() => increase(p.id)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => addToCart(p.id)}
              >
                Agregar al carrito
              </button>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No se encontraron productos con los filtros aplicados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
