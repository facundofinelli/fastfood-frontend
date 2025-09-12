import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import apiService from "../Services/ApiService.tsx";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiService.post("/auth/login", {
        email,
        password,
      });

      console.log("Login exitoso:", response);

      const { token } = response as { token: string };
      localStorage.setItem("token", token);

      navigate("/");
    } catch (error: any) {
      if (error.response) {
        console.error("Error de login:", error.response.data);
        alert(error.response.data.message || "Error en el login");
      } else {
        console.error(error);
        alert("Error de conexión con el servidor");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Iniciar Sesión
        </button>
      </form>

      {/* Link para registrarse */}
      <p className="mt-4 text-sm text-gray-600 text-center">
        ¿No tienes cuenta?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-blue-600 hover:underline"
        >
          Regístrate aquí
        </button>
      </p>
    </div>
  );
};
