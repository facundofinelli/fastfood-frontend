import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import apiService from "../Services/ApiService";

type Product = {
  id: number;
  name: string;
};

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.get<Product[]>("/products");
        setProducts(data);

        // Inicializar cantidades en 1
        const initialQuantities = data.reduce(
          (acc: any, p: { id: any; }) => ({ ...acc, [p.id]: 1 }),
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


  if (errorMessage) {
    return (
      <div className="text-center text-red-500 font-semibold mt-6">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {products.map((p) => (
        <div
          key={p.id}
          className="border rounded-lg shadow-md p-4 flex flex-col items-center"
        >
          <img
            src={p.image}
            alt={p.name}
            className="w-32 h-32 object-cover rounded-md"
          />
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
    </div>
  );
};
