import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/ApiService";
import toast from "react-hot-toast";

type Product = {
  id: string; // UUID o número, depende de tu backend
  description: string;
};

type Promotion = {
  id?: number;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  productId?: string;
};

type Props = {
  isEdit?: boolean;
};

export const PromotionForm = ({ isEdit = false }: Props) => {
  const [promotion, setPromotion] = useState<Promotion>({
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    productId: undefined,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔹 Cargar productos para el <select>
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.get<Product[]>("/products");
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        toast.error("No se pudieron cargar los productos. ❌");
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Cargar datos si es edición
  useEffect(() => {
    if (isEdit && id) {
      const fetchPromotion = async () => {
        try {
          const data = await apiService.get<Promotion>(`/promotions/${id}`);
          // Convertimos fechas al formato yyyy-mm-dd para los inputs
          const formattedData = {
            ...data,
            startDate: new Date(data.startDate).toISOString().split("T")[0],
            endDate: new Date(data.endDate).toISOString().split("T")[0],
          };
          setPromotion(formattedData);
        } catch (error) {
          console.error("Error al cargar promoción:", error);
          toast.error("No se pudo cargar la promoción. ❌");
        }
      };
      fetchPromotion();
    }
  }, [isEdit, id]);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setPromotion((prev) => ({
      ...prev,
      [name]:
        name === "discount"
          ? Number(value)
          : name === "productId"
          ? value === ""
            ? undefined
            : value
          : value,
    }));
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones básicas
      if (!promotion.productId) {
        toast.error("Debe seleccionar un producto. ❌");
        setLoading(false);
        return;
      }

      if (!promotion.endDate || !promotion.startDate) {
        toast.error("Debe ingresar las fechas de inicio y fin. ❌");
        setLoading(false);
        return;
      }

      if (isEdit && id) {
        await apiService.put(`/promotions/${id}`, promotion);
        toast.success("Promoción actualizada correctamente ✅");
      } else {
        await apiService.post("/promotions", promotion);
        toast.success("Promoción creada correctamente ✅");
      }

      navigate("/promotions");
    } catch (error) {
      console.error("Error al guardar promoción:", error);
      toast.error("Hubo un error al guardar la promoción. ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Render
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Promoción" : "Agregar Promoción"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="description"
          value={promotion.description}
          onChange={handleChange}
          placeholder="Descripción de la promoción"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />

        <label className="flex flex-col">
          <span className="mb-1 font-medium text-gray-700">Descuento</span>
          <input
            type="number"
            name="discount"
            value={promotion.discount}
            onChange={handleChange}
            placeholder="Descuento (%)"
            required
            min={0}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium text-gray-700">Fecha de inicio</span>
          <input
            type="date"
            name="startDate"
            value={promotion.startDate}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>


        <label className="flex flex-col">
          <span className="mb-1 font-medium text-gray-700">Fecha de fin</span>
          <input
            type="date"
            name="endDate"
            value={promotion.endDate}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <select
          name="productId"
          value={promotion.productId ?? ""}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="" disabled>
            Selecciona un producto
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.description}
            </option>
          ))}
        </select>

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
