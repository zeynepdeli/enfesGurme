import { api } from "@/lib/api";
import { User } from "@/types";

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post<User>("/api/auth/register", data);
    return response.data!;
  },

  async login(email: string, password: string) {
    const response = await api.post<User>("/api/auth/login", {
      email,
      password,
    });
    return response.data!;
  },

  async logout() {
    await api.post("/api/auth/logout");
  },

  async getProfile() {
    const response = await api.get<User>("/api/users/profile");
    return response.data!;
  },
};
