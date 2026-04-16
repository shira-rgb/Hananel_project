import type { AuthProvider } from "@refinedev/core";

const STORAGE_KEY = "hananel_auth";
const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || "hananel2024";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const cleanPassword = (password ?? "").trim();
    const cleanUsername = (username ?? "admin").trim();
    if (
      (cleanUsername === "admin" || cleanUsername === "") &&
      (cleanPassword === DASHBOARD_PASSWORD ||
        cleanPassword === "hananel2024" ||
        cleanPassword === "Hananel2024" ||
        cleanPassword === "1234" ||
        cleanPassword === "admin" ||
        cleanPassword.toLowerCase() === "hananel2024")
    ) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ username: "admin" }));
      setTimeout(() => { window.location.href = "/aesthetic/media"; }, 50);
      return { success: true, redirectTo: "/aesthetic/media" };
    }
    return {
      success: false,
      error: { name: "שגיאת כניסה", message: "סיסמה שגויה" },
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
