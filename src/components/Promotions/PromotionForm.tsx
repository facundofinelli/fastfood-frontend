import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/ApiService";

type Promotion = {
  id?: number;
  description: string;
  discount: number;
  start_date: string; // Usamos string para input type="date"
  product_id: string | number;
};

type Props = {
  isEdit?: boolean;
};

export const PromotionForm = ({ isEdit = false }: Props) => {
  const [promotion, setPromotion] = useState<Promotion>({
    description: "",
    discount: 0,
    start_date: "",
    product_id: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit && id) {
      const fetchPromotion = async () => {
        try {
          const data = await apiService.get<Promotion>(`/promotions/${id}`);
          // Convertimos fecha a formato yyyy-mm-dd para el input
          const formattedData = {
            ...data,
            start_date: new Date(data.start_date).toISOString().split("T")[0],
          };
          setPromotion(formattedData);
        } catch (error) {
          console.error("Error al cargar promoción:", error);
          alert("No se pudo cargar la promoción.");
        }
      };
      fetchPromotion();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPromotion({ ...promotion, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await apiService.put(`/promotions/${id}`, promotion);
        alert("Promoción actualizada correctamente ✅");
      } else {
        await apiService.post("/promotions", promotion);
        alert("Promoción creada correctamente ✅");
      }
      navigate("/promotions");
    } catch (error) {
      console.error("Error al guardar promoción:", error);
      alert("Hubo un error al guardar la promoción.");
    } finally {
      setLoading(false);
    }
  };

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
        <input
          type="number"
          name="discount"
          value={promotion.discount}
          onChange={handleChange}
          placeholder="Descuento (%)"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="date"
          name="start_date"
          value={promotion.start_date}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="product_id"
          value={promotion.product_id}
          onChange={handleChange}
          placeholder="ID del producto"
          required
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
