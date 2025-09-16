import apiService from "./ApiService";

export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

const userService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    // Guardar token y usuario en localStorage
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    return response;
  },

  logout: () => {
    // TODO: si quieres, hacer request al backend para invalidar token
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "/login";
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getProfile: (): User | null => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  },

  isAdmin: (): boolean => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return false;
    const parsedUser: User = JSON.parse(user);
    return parsedUser.role === "admin";
  },
};

export default userService;
