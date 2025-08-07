// ~/store/authStore.ts
import { create } from "zustand";

type User = {
  id: number;
  username: string;
  type: "farmer" | "organicFarmer" | "admin";
  email?: string;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
