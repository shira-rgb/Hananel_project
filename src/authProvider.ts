import type { AuthProvider } from "@refinedev/core";

const STORAGE_KEY = "hananel_auth";
const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || "hananel2024";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    if (username === "admin" && password === DASHBOARD_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ username }));
      return { success: true, redirectTo: "/" };
    }
    return {
      success: false,
      error: { name: "שגיאת כניסה", message: "שם משתמש או סיסמה שגויים" },
    };
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY);
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const auth = localStorage.getItem(STORAGE_KEY);
    if (auth) return { authenticated: true };
    return { authenticated: false, redirectTo: "/login" };
  },

  getIdentity: async () => {
    const auth = localStorage.getItem(STORAGE_KEY);
    if (auth) {
      const { username } = JSON.parse(auth);
      return { id: username, name: username };
    }
    return null;
  },

  onError: async (error) => {
    return { error };
  },
};
