import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/ApiService";
import toast from "react-hot-toast";

type Category = {
  id?: number;
  name: string;
};

type Props = {
  isEdit?: boolean;
};

export const CategoryForm = ({ isEdit = false }: Props) => {
  const [Category, setCategory] = useState<Category>({ name: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Si es edición, cargar datos del proveedor
  useEffect(() => {
    if (isEdit && id) {
      const fetchCategory = async () => {
        try {
          const data = await apiService.get<Category>(`/categories/${id}`);
          setCategory(data);
        } catch (error) {
          console.error("Error al cargar la categoria:", error);
          toast.error("No se pudo cargar la categoria ❌");
        }
      };
      fetchCategory();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory({ ...Category, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await apiService.put(`/categories/${id}`, Category);
        toast.success("Categoria actualizado correctamente ✅");
      } else {
        await apiService.post("/categories", Category);
        toast.success("Categoria creado correctamente ✅");
      }
      navigate("/categories");
    } catch (error) {
      console.error("Error al guardar categoria:", error);
      toast.error("Hubo un error al guardar la cateoria ❌"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar cateoria" : "Agregar cateoria"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={Category.name}
          onChange={handleChange}
          placeholder="Nombre de la cateoria"
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
