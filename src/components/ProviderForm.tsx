import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../services/ApiService";

type Provider = {
  id?: number;
  name: string;
};

type Props = {
  isEdit?: boolean;
};

export const ProviderForm = ({ isEdit = false }: Props) => {
  const [provider, setProvider] = useState<Provider>({ name: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Si es edición, cargar datos del proveedor
  useEffect(() => {
    if (isEdit && id) {
      const fetchProvider = async () => {
        try {
          const data = await apiService.get<Provider>(`/providers/${id}`);
          setProvider(data);
        } catch (error) {
          console.error("Error al cargar proveedor:", error);
          alert("No se pudo cargar el proveedor.");
        }
      };
      fetchProvider();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProvider({ ...provider, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await apiService.put(`/providers/${id}`, provider);
        alert("Proveedor actualizado correctamente ✅");
      } else {
        await apiService.post("/providers", provider);
        alert("Proveedor creado correctamente ✅");
      }
      navigate("/providers");
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      alert("Hubo un error al guardar el proveedor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Proveedor" : "Agregar Proveedor"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={provider.name}
          onChange={handleChange}
          placeholder="Nombre del proveedor"
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
