"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
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

function formatAuthError(err: any): string {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please verify and try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please choose at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was cancelled.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked by your browser. Please allow popups.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a few minutes before trying again.";
    case "auth/operation-not-allowed":
      return "Email or Google sign-in is not yet enabled in Firebase console. Use Demo Sign In or enable it in Authentication.";
    default:
      if (err?.message?.includes("suspended") || err?.message?.includes("CONSUMER_SUSPENDED")) {
        return "Firebase project is currently resuming. You can click 'Instant Demo Access' below to sign in immediately!";
      }
      return err?.message || "Authentication error. Please try again.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check for stored demo user first (client-side only)
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setLoading(false);
          return;
        }
      } catch {
        // Safe fallback
      }
    }

    // 2. Listen to live Firebase Auth state
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(
        auth,
        (fbUser: FirebaseUser | null) => {
          if (fbUser) {
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Creator",
              photoURL: fbUser.photoURL,
              isDemo: false,
            });
          } else {
            // Check if demo user was active
            if (typeof window !== "undefined") {
              const demo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
              if (demo) {
                setUser(JSON.parse(demo));
              } else {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
          setLoading(false);
        },
        (err) => {
          console.warn("Firebase Auth listener warning:", err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Firebase Auth initialization skipped:", err);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setError(null);
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

      if (typeof window !== "undefined") {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }

      setUser(authUser);
      return { success: true };
    } catch (err: any) {
      console.error("Google sign in error:", err);
      const msg = formatAuthError(err);
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
      const auth = getFirebaseAuth();
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = result.user;

      const authUser: AuthUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || email.split("@")[0],
        photoURL: fbUser.photoURL,
        isDemo: false,
      };

      if (typeof window !== "undefined") {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }

      setUser(authUser);
      return { success: true };
    } catch (err: any) {
      console.error("Email sign in error:", err);
      const msg = formatAuthError(err);
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
      const auth = getFirebaseAuth();
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = result.user;

      // Update display name
      if (name.trim()) {
        try {
          await updateProfile(fbUser, { displayName: name.trim() });
        } catch {
          // Non-blocking
        }
      }

      const authUser: AuthUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: name.trim() || email.split("@")[0],
        photoURL: fbUser.photoURL,
        isDemo: false,
      };

      if (typeof window !== "undefined") {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }

      setUser(authUser);
      return { success: true };
    } catch (err: any) {
      console.error("Email sign up error:", err);
      const msg = formatAuthError(err);
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
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      console.error("Password reset error:", err);
      const msg = formatAuthError(err);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    }
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch (err) {
      console.warn("Sign out error:", err);
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
