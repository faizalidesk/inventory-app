import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const rememberSessionKey = "desktopalie-remember-session";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variable.");
}

const authStorage = {
  getItem(key) {
    return window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
  },
  setItem(key, value) {
    const rememberSession = window.localStorage.getItem(rememberSessionKey) === "true";
    const selectedStorage = rememberSession ? window.localStorage : window.sessionStorage;
    const unusedStorage = rememberSession ? window.sessionStorage : window.localStorage;

    selectedStorage.setItem(key, value);
    unusedStorage.removeItem(key);
  },
  removeItem(key) {
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
  },
};

export function setRememberSession(rememberSession) {
  if (rememberSession) {
    window.localStorage.setItem(rememberSessionKey, "true");
  } else {
    window.localStorage.removeItem(rememberSessionKey);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
