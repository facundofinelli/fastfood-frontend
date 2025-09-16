import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import apiService from "../services/ApiService.tsx";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    if (!role) {
      setErrorMessage("Debes seleccionar un rol");
      return;
    }

    try {
      const response = await apiService.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      console.log("Usuario registrado:", response);

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error: any) {
      console.error("Error en el registro:", error);
      setErrorMessage(error.response?.data?.error || "Error al registrar usuario");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Crear Cuenta</h1>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errorMessage}</div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full pr-10"
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full pr-10"
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="">Selecciona un rol</option>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};
