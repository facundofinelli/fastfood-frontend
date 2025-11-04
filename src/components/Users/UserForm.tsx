import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/ApiService";
import toast from "react-hot-toast";

type User = {
  id?: number;
  name: string;
  email: string;
  role: string;
};

type Props = {
  isEdit?: boolean;
};

export const UserForm = ({ isEdit = false }: Props) => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      const fetchUser = async () => {
        try {
          const data = await apiService.get<User>(`/users/${id}`);
          setUser(data);
        } catch (err) {
          console.error("Error cargando usuario:", err);
          toast.error("No se pudo cargar el usuario ❌");
        }
      };
      fetchUser();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await apiService.put(`/users/${id}`, user);
        toast.success("Usuario actualizado ✅");
      } else {
        await apiService.post("/users", user);
        toast.success("Usuario creado ✅");
      }
      navigate("/users");
    } catch (err) {
      console.error("Error guardando usuario:", err);
      toast.error("Hubo un error al guardar el usuario ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar Usuario" : "Agregar Usuario"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />

        <select
          name="role"
          value={user.role}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="" disabled>
            Selecciona un rol
          </option>
          <option value="admin">Administrador</option>
          <option value="customer">Cliente</option>
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
