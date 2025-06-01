import { UserState } from "@/types/User";
import { create } from "zustand";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  loadUserFromCookie: async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (!res.ok) return set({ user: null });
      set({ user: data.user });
    } catch {
      set({ user: null });
    }
  },
  logout: async () => {
    const res = await fetch("/api/logout", { method: "DELETE" });
    if (res.ok) set({ user: null });
  },
}));
