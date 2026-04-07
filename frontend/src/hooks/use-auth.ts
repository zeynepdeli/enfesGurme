import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  return {
    user,
    login,
    register,
    logout,
    isLoading,
    checkAuth,
  };
}
