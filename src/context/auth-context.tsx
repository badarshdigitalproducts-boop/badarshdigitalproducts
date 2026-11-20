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
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Purge any legacy demo artifacts from browser storage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("badarsh_creator_demo_user");
      } catch {
        // Safe
      }
    }

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

      // 2. Listen to live Firebase Auth state
      try {
        const auth = getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(
          auth,
          async (fbUser: FirebaseUser | null) => {
            if (!mounted) return;
            if (fbUser && fbUser.email) {
              const authUser: AuthUser = {
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName || fbUser.email.split("@")[0],
                photoURL: fbUser.photoURL || null,
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
            } else {
              setUser(null);
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

    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleAuthProvider();
      // Ensure Google forces account selection so user picks their real Gmail
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      if (!fbUser || !fbUser.email) {
        throw new Error("No Google account was returned. Please try again.");
      }

      const authUser: AuthUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || fbUser.email.split("@")[0],
        photoURL: fbUser.photoURL || null,
      };

      // Persist real Google user session to server cookie and database
      await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authUser.email,
          name: authUser.displayName,
          photoURL: authUser.photoURL,
        }),
      });

      setUser(authUser);
      return { success: true };
    } catch (fbErr: any) {
      console.error("Firebase Google sign-in error:", fbErr);

      let msg = "Google sign-in could not be completed.";
      const code = fbErr?.code || "";

      if (code === "auth/popup-closed-by-user") {
        msg = "Sign-in cancelled. The Google window was closed before selecting an account.";
      } else if (code === "auth/unauthorized-domain") {
        msg = "Domain not authorized: Please add 'badarshdigitalproducts.vercel.app' in Firebase Console -> Authentication -> Settings -> Authorized Domains.";
      } else if (code === "auth/operation-not-allowed") {
        msg = "Google sign-in is disabled in Firebase Console -> Authentication -> Sign-in method. Please enable Google provider.";
      } else if (fbErr?.message?.includes("suspended") || fbErr?.message?.includes("CONSUMER_SUSPENDED")) {
        msg = "Firebase project is suspended in Google Cloud Console. Please resume project or sign in with your Gmail and password below.";
      } else if (fbErr?.message) {
        msg = fbErr.message;
      }

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
          if (fbRes.user && fbRes.user.email) {
            const authUser: AuthUser = {
              uid: fbRes.user.uid,
              email: fbRes.user.email,
              displayName: fbRes.user.displayName || email.split("@")[0],
              photoURL: fbRes.user.photoURL,
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
      return { success: true };
    }
  };

  const logout = async (): Promise<void> => {
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
