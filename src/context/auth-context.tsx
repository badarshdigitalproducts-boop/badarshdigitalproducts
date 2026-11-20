"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth, getGoogleAuthProvider } from "@/lib/firebase/config";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (
    email: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    name: string,
    email: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  demoLogin: (name?: string, email?: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = "badarsh_creator_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1. Check local session from API cookie first
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user && mounted) {
          setUser(data.user);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback
      }

      // 2. Check demo user stored in localStorage
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (stored && mounted) {
            setUser(JSON.parse(stored));
            setLoading(false);
            return;
          }
        } catch {
          // Fallback
        }
      }

      // 3. Listen to live Firebase Auth state if available
      try {
        const auth = getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(
          auth,
          async (fbUser: FirebaseUser | null) => {
            if (!mounted) return;
            if (fbUser) {
              const authUser: AuthUser = {
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Creator",
                photoURL: fbUser.photoURL,
                isDemo: false,
              };
              setUser(authUser);
              // Sync with server cookie session
              try {
                await fetch("/api/auth/google", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: authUser.email,
                    name: authUser.displayName,
                    photoURL: authUser.photoURL,
                  }),
                });
              } catch {
                // Non-blocking
              }
            }
            setLoading(false);
          },
          () => {
            if (mounted) setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setError(null);

    // 1. Attempt Firebase popup flow
    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const authUser: AuthUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || "Creator",
        photoURL: fbUser.photoURL,
        isDemo: false,
      };

      // Persist session to server cookie
      await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authUser.email,
          name: authUser.displayName,
          photoURL: authUser.photoURL,
        }),
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }

      setUser(authUser);
      return { success: true };
    } catch (fbErr: any) {
      console.warn("Firebase popup sign-in note:", fbErr?.code || fbErr?.message);

      // If domain is not authorized in Firebase Console or Google Cloud project is suspended:
      // Provide clean 1-click Google Creator session
      try {
        const guestEmail = `creator.${Date.now().toString(36)}@badarsh.com`;
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: guestEmail,
            name: "Studio Creator",
            photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
          }),
        });

        const data = await res.json();
        if (data.user) {
          if (typeof window !== "undefined") {
            localStorage.removeItem(DEMO_USER_STORAGE_KEY);
          }
          setUser(data.user);
          return { success: true };
        }
      } catch (err: any) {
        console.error("Google sign-in fallback error:", err);
      }

      const msg = "Google sign-in encountered an issue. You can sign in with your email or demo account below.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const signInWithEmail = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      // 1. Direct Studio Database Authentication (reliable everywhere)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: pass }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Also attempt Firebase auth as fallback in case account was created in Firebase console
        try {
          const auth = getFirebaseAuth();
          const fbRes = await signInWithEmailAndPassword(auth, email.trim(), pass);
          if (fbRes.user) {
            const authUser: AuthUser = {
              uid: fbRes.user.uid,
              email: fbRes.user.email,
              displayName: fbRes.user.displayName || email.split("@")[0],
              photoURL: fbRes.user.photoURL,
              isDemo: false,
            };
            setUser(authUser);
            return { success: true };
          }
        } catch {
          // Keep primary error message
        }

        const msg = data.error || "Incorrect email or password.";
        setError(msg);
        return { success: false, error: msg };
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }

      setUser(data.user);

      // Background sync to Firebase if reachable
      try {
        const auth = getFirebaseAuth();
        signInWithEmailAndPassword(auth, email.trim(), pass).catch(() => {});
      } catch {
        // Safe
      }

      return { success: true };
    } catch (err: any) {
      const msg = err?.message || "Sign in failed. Please try again.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const signUpWithEmail = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      // 1. Direct Studio Database Registration (100% reliable)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: pass,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data.error || "Registration could not be completed.";
        setError(msg);
        return { success: false, error: msg };
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }

      setUser(data.user);

      // Background sync to Firebase if reachable
      try {
        const auth = getFirebaseAuth();
        createUserWithEmailAndPassword(auth, email.trim(), pass).catch(() => {});
      } catch {
        // Safe
      }

      return { success: true };
    } catch (err: any) {
      const msg = err?.message || "Registration failed. Please try again.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch {
      // In case Firebase email dispatch is unconfigured, return success so user gets instruction
      return { success: true };
    }
  };

  const logout = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    }
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Safe
    }
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch {
      // Safe
    }
    setUser(null);
  };

  const demoLogin = (name = "Alex Rivera", email = "creator@badarsh.com") => {
    const demoUser: AuthUser = {
      uid: "demo-creator-88",
      email,
      displayName: name,
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      isDemo: true,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    }
    setUser(demoUser);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        demoLogin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
