import { Navigate, Outlet } from "react-router-dom";
import userService from "../../services/UserService";

type Role = "admin" | "customer" | "guest";

type Props = {
  requiredRole?: Role;
};

export const ProtectedRoute = ({ requiredRole }: Props) => {
  const isLoggedIn = userService.isLoggedIn();
  const userRole = userService.getRole();

  // Si no está logueado → redirige al login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo cumple redirige
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderiza las rutas hijas
  return <Outlet />;
};
