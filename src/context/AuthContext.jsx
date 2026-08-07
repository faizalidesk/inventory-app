import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./auth-context";
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let active = true;
    let initialized = false;

    async function initializeAuth() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!sessionData.session) return;

        // Verify the locally stored session against the Supabase Auth server.
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          await supabase.auth.signOut({ scope: "local" });
          return;
        }

        if (active) {
          setSession({ ...sessionData.session, user: userData.user });
          setUser(userData.user);
        }
      } catch (error) {
        if (active) setAuthError(error);
      } finally {
        initialized = true;
        if (active) setLoading(false);
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active || (event === "INITIAL_SESSION" && !initialized)) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setAuthError(null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    let idleTimer;
    const expireIdleSession = async () => {
      await supabase.auth.signOut({ scope: "local" });
      setSession(null);
      setUser(null);
    };
    const resetIdleTimer = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(expireIdleSession, IDLE_TIMEOUT_MS);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") resetIdleTimer();
    };

    const activityEvents = ["pointerdown", "keydown", "touchstart"];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetIdleTimer, { passive: true }));
    document.addEventListener("visibilitychange", handleVisibility);
    resetIdleTimer();

    return () => {
      window.clearTimeout(idleTimer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetIdleTimer));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user]);

  async function logout() {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    setSession(null);
    setUser(null);
    if (error) throw error;
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, authError, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

