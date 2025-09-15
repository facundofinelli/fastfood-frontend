import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../Services/ApiService";

type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
  image?: string;
};

type Props = {
  isEdit?: boolean;
};

export const ProductForm = ({ isEdit = false }: Props) => {
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Si es edición, cargar datos del producto
  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          const data = await apiService.get<Product>(`/products/${id}`);
          setProduct(data);
        } catch (error) {
          console.error("Error al cargar producto:", error);
          alert("No se pudo cargar el producto.");
        }
      };
      fetchProduct();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: name === "price" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await apiService.put(`/products/${id}`, product);
        alert("Producto actualizado correctamente ✅");
      } else {
        await apiService.post("/products", product);
        alert("Producto creado correctamente ✅");
      }
      navigate("/products");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Hubo un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Producto" : "Agregar Producto"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          name="price"
          value={product.price}
          onChange={(e) => {
            const value = e.target.value;
            // Solo permitir dígitos y un punto decimal
            if (/^\d*\.?\d*$/.test(value)) {
              setProduct({ ...product, price: value === "" ? 0 : Number(value) });
            }
          }}
          placeholder="Precio"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Categoría"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          name="image"
          value={product.image}
          onChange={handleChange}
          placeholder="URL de imagen (opcional)"
          className="border border-gray-300 rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
};
