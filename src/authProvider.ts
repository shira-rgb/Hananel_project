import type { AuthProvider } from "@refinedev/core";
import { supabaseClient } from "./supabaseClient";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: { email?: string; password?: string }) => {
    const cleanEmail = (email ?? "").trim().toLowerCase();
    const cleanPassword = (password ?? "").trim();
    if (!cleanEmail || !cleanPassword) {
      return {
        success: false,
        error: { name: "שגיאת כניסה", message: "חסר מייל או סיסמה" },
      };
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });
    if (error || !data?.session) {
      return {
        success: false,
        error: { name: "שגיאת כניסה", message: error?.message || "סיסמה שגויה" },
      };
    }
    return { success: true, redirectTo: "/" };
  },

  logout: async () => {
    await supabaseClient.auth.signOut();
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const { data } = await supabaseClient.auth.getSession();
    if (data?.session) return { authenticated: true };
    return { authenticated: false, redirectTo: "/login" };
  },

  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();
    if (!data?.user) return null;
    const { id, email, user_metadata } = data.user;
    return {
      id,
      email,
      name: (user_metadata?.full_name as string) || email || "משתמש",
    };
  },

  forgotPassword: async ({ email }: { email?: string }) => {
    const cleanEmail = (email ?? "").trim().toLowerCase();
    if (!cleanEmail) {
      return {
        success: false,
        error: { name: "שגיאה", message: "חסר מייל" },
      };
    }
    const redirectTo = `${window.location.origin}/auth/set-password`;
    const { error } = await supabaseClient.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo,
    });
    if (error) {
      return { success: false, error: { name: "שגיאה", message: error.message } };
    }
    return { success: true };
  },

  updatePassword: async ({ password }: { password?: string }) => {
    const clean = (password ?? "").trim();
    if (!clean || clean.length < 8) {
      return {
        success: false,
        error: { name: "שגיאה", message: "סיסמה חייבת להיות לפחות 8 תווים" },
      };
    }
    const { error } = await supabaseClient.auth.updateUser({ password: clean });
    if (error) {
      return { success: false, error: { name: "שגיאה", message: error.message } };
    }
    return { success: true, redirectTo: "/" };
  },

  onError: async (error) => {
    return { error };
  },
};
