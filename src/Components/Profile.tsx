import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../Services/UserService";

export const Profile = () => {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Aquí puedes decodificar JWT para mostrar info, o pedirla al backend
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    UserService.logout();
    navigate("/login");
  };

  if (!user) return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
        <div className="mt-20 p-4">Cargando...</div>
        <button
        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
        onClick={handleLogout}
        >
            Cerrar Sesión
        </button>
        </div>
  )

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      <button
        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
        onClick={handleLogout}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};
