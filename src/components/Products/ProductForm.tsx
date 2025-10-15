import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/ApiService";
import { ImageSelector } from "../shared/ImageSelector";

import burger1 from "../../assets/burger1.jpg";
import fries1 from "../../assets/fries1.jpg";
import pizza from "../../assets/pizza.jpg";
import nuggets from "../../assets/nuggets.jpg";

type Category = { id: number; name: string; };
type Product = { id?: number; description: string; price: number; category_id: string | number; image?: string; };
type Props = { isEdit?: boolean; };

export const ProductForm = ({ isEdit = false }: Props) => {
  const [product, setProduct] = useState<Product>({
    description: "",
    price: 0,
    category_id: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [snackbar, setSnackbar] = useState(""); // 🟢 snackbar

  const navigate = useNavigate();
  const { id } = useParams();
  const imageOptions = [burger1, fries1, pizza, nuggets];

  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          const data = await apiService.get<Product & { category?: Category }>(`/products/${id}`);
          setProduct({
            ...data,
            category_id: data.category?.id ?? "", // guardamos el id
          });
          setSearchTerm(data.category?.name ?? ""); // mostramos el nombre en el input
        } catch (error) {
          console.error("Error al cargar producto:", error);
          setSnackbar("No se pudo cargar el producto.");
        }
      };
      fetchProduct();
    }
  }, [isEdit, id]);

  const fetchCategories = async (query?: string) => {
    try {
      const endpoint = query?.trim() !== "" ? `/categories?search=${query}` : `/categories`;
      const data = await apiService.get<Category[]>(endpoint);
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await apiService.put(`/products/${id}`, product);
        setSnackbar("Producto actualizado correctamente ✅");
      } else {
        await apiService.post("/products", product);
        setSnackbar("Producto creado correctamente ✅");
      }
      navigate("/");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setSnackbar("Hubo un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ cerrar snackbar automáticamente
  useEffect(() => {
    if (snackbar) {
      const timer = setTimeout(() => setSnackbar(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded relative">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? "Editar Producto" : "Agregar Producto"}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="descripcion" value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} placeholder="Descripción" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="price" value={product.price} onChange={e => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) setProduct({ ...product, price: value === "" ? 0 : Number(value) });
        }} placeholder="Precio" required className="border border-gray-300 rounded px-3 py-2" />

        {/* Categoría con autocomplete */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); fetchCategories(e.target.value); }}
            onFocus={() => { setShowDropdown(true); fetchCategories(); }}
            placeholder="Seleccionar categoría..."
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {showDropdown && categories.length > 0 && (
            <ul className="absolute z-50 bg-white border border-gray-200 w-full rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
              {categories.map((cat) => (
                <li key={cat.id} onClick={() => { setProduct({ ...product, category_id: String(cat.id) }); setSearchTerm(cat.name); setShowDropdown(false); }} className="px-3 py-2 hover:bg-blue-50 cursor-pointer">
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ImageSelector images={imageOptions} selected={product.image} onSelect={img => setProduct({ ...product, image: img })} />

        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400">
          {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* 🟢 Snackbar */}
      {snackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all">
          {snackbar}
        </div>
      )}
    </div>
  );
};
