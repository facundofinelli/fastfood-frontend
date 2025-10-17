import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/ApiService";
import toast from "react-hot-toast";

type Provider = {
  id: number;
  name: string;
};

type Ingredient = {
  id?: number;
  description: string;
  providerId?: number;
};

type Props = {
  isEdit?: boolean;
};

export const IngredientForm = ({ isEdit = false }: Props) => {
  const [ingredient, setIngredient] = useState<Ingredient>({
    description: "",
    providerId: undefined,
  });
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar proveedores
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await apiService.get<Provider[]>("/providers");
        setProviders(data);
      } catch (err) {
        console.error("Error cargando proveedores:", err);
        toast.error("No se pudieron cargar los proveedores ❌");
      }
    };
    fetchProviders();
  }, []);

  // Cargar ingrediente si es edición
  useEffect(() => {
    if (isEdit && id) {
      const fetchIngredient = async () => {
        try {
          const data = await apiService.get<Ingredient>(`/ingredients/${id}`);
          setIngredient(data);
        } catch (err) {
          console.error("Error cargando ingrediente:", err);
          toast.error("No se pudo cargar el ingrediente. ❌");
        }
      };
      fetchIngredient();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setIngredient((prev) => ({
      ...prev,
      [name]:
        name === "providerId"
          ? value === ""
            ? undefined
            : value
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await apiService.put(`/ingredients/${id}`, ingredient);
        toast.success("Ingrediente actualizado ✅");
      } else {
        await apiService.post("/ingredients", ingredient);
        toast.success("Ingrediente creado ✅");
      }
      navigate("/ingredients");
    } catch (err) {
      console.error("Error guardando ingrediente:", err);
      toast.error("Hubo un error al guardar el ingrediente. ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Ingrediente" : "Agregar Ingrediente"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="description"
          value={ingredient.description}
          onChange={handleChange}
          placeholder="Descripcion del ingrediente"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />

        <select
          name="providerId"
          value={ingredient.providerId ?? ""}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="" disabled>
            Selecciona un proveedor
          </option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
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
