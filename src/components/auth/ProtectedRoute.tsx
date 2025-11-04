import { Navigate, Outlet } from "react-router-dom";
import userService from "../../services/UserService";

type Props = {
  adminOnly?: boolean;
};

export const ProtectedRoute = ({ adminOnly = false }: Props) => {
  const isLoggedIn = userService.isLoggedIn();
  const isAdmin = userService.isAdmin();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, renderiza las rutas hijas
  return <Outlet />;
};
