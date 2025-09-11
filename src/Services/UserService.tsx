import apiService from "./ApiService";

export type User = {
  id: number;
  email: string;
  name: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

const TOKEN_KEY = "token";

const userService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    // Guardar token en localStorage
    localStorage.setItem(TOKEN_KEY, response.token);

    return response;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getProfile: async (): Promise<User> => {
    return apiService.get<User>("/auth/profile"); // Depende del back, modificar luego 
  },
};

export default userService;
