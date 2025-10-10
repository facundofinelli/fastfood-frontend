import { useEffect, useState } from "react";
import { Plus, Minus, X } from "lucide-react";
import { ProductsFilter, type FilterOptions } from "./ProductsFilter";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/ApiService";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
};

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: null,
    minPrice: null,
    maxPrice: null,
  });

  const navigate = useNavigate();

  // Cargar usuario
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Obtener productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.get<Product[]>("/products");
        setProducts(data);
        const initialQuantities = data.reduce((acc: any, p: Product) => ({ ...acc, [p.id]: 1 }), {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setErrorMessage("No se pudieron cargar los productos. Intenta más tarde.");
      }
    };
    fetchProducts();
  }, []);

  const increase = (id: number) => setQuantities({ ...quantities, [id]: quantities[id] + 1 });
  const decrease = (id: number) =>
    setQuantities({ ...quantities, [id]: quantities[id] > 1 ? quantities[id] - 1 : 1 });

  const addToCart = async (productId: number) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }
    try {
      const orders = (await apiService.get<any[]>(`/orders?user_id=${user.id}&status=pending`)) as any[];
      let order = orders.length > 0 ? orders[0] : null;
      if (!order) {
        order = await apiService.post("/orders", { user_id: user.id, status: "pending" });
      }
      await apiService.post("/order-items", {
        order_id: order.id,
        product_id: productId,
        quantity: quantities[productId],
      });
      alert(`Agregaste ${quantities[productId]} unidades del producto ${productId} al carrito`);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al agregar al carrito. Intenta nuevamente.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchCategory = filters.category ? p.category === filters.category : true;
    const matchMinPrice = filters.minPrice ? p.price >= filters.minPrice : true;
    const matchMaxPrice = filters.maxPrice ? p.price <= filters.maxPrice : true;
    return matchSearch && matchCategory && matchMinPrice && matchMaxPrice;
  });

  if (errorMessage)
    return (
      <div className="text-center text-red-500 font-semibold mt-6">{errorMessage}</div>
    );

  return (
    <div className="mt-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar de filtros */}
        <div className="flex justify-end mb-4">
          <ProductsFilter filters={filters} onChange={setFilters} />
        </div>

        {/* Contenedor principal */}
        <div className="flex-1">
          {/* Botón agregar producto */}
          {user?.role === "admin" && (
            <div className="flex justify-end mb-4">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                onClick={() => navigate("/product/add")}
              >
                + Agregar producto
              </button>
            </div>
          )}

          {/* Lista de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 ${
                  user?.role === "cliente" ? "cursor-pointer hover:scale-105 hover:shadow-2xl" : "cursor-default"
                }`}
                onClick={() => user?.role === "cliente" && setSelectedProduct(p)}
              >
                {/* Imagen */}
                <div className="relative w-full h-52">
                  <img
                    src={p.image || "https://via.placeholder.com/300"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {user?.role === "admin" && (
                    <button
                      className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 shadow"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/edit/${p.id}`);
                      }}
                    >
                      Editar
                    </button>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {p.description || "Sin descripción disponible."}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-blue-600 font-bold text-lg">${p.price}</span>
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          decrease(p.id);
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-2 font-medium">{quantities[p.id]}</span>
                      <button
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          increase(p.id);
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="mt-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors font-semibold shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p.id);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
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

      {/* MODAL AMPLIADO */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full transform scale-100 animate-zoom-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setSelectedProduct(null)}
            >
              <X size={20} />
            </button>
            <img
              src={selectedProduct.image || "https://via.placeholder.com/250"}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-gray-700 mb-2">${selectedProduct.price}</p>
            <p className="text-sm text-gray-500">
              {selectedProduct.description || "Sin descripción disponible."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
