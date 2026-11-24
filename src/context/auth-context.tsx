"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; code?: string }>;
  signInWithGoogleEmail: (
    email: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string }>;
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

      // 2. Check for returning Google Redirect sign-in result
      try {
        const auth = getFirebaseAuth();
        const redirectRes = await getRedirectResult(auth);
        if (redirectRes && redirectRes.user && redirectRes.user.email && mounted) {
          const fbUser = redirectRes.user;
          const authUser: AuthUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Google User"),
            photoURL: fbUser.photoURL || null,
          };
          setUser(authUser);
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
          } catch {}
          setLoading(false);
          return;
        }
      } catch (redirectErr) {
        console.warn("Google redirect handler notice:", redirectErr);
      }

      // 3. Listen to live Firebase Auth state
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
                displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Google User"),
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

  const signInWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
    code?: string;
  }> => {
    setError(null);

    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      // First attempt: Interactive Google popup
      try {
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
      } catch (popupErr: any) {
        // If user manually closed popup, cancel silently
        if (popupErr?.code === "auth/popup-closed-by-user") {
          return { success: false, code: popupErr.code };
        }

        // If domain is unauthorized in Firebase, provide precise notice
        if (popupErr?.code === "auth/unauthorized-domain") {
          const domainMsg = "To sign in with Google on Vercel, please add 'badarshdigitalproducts.vercel.app' in Firebase Console -> Authentication -> Settings -> Authorized Domains.";
          setError(domainMsg);
          return { success: false, error: domainMsg, code: popupErr.code };
        }

        // If popup was blocked by browser or failed, seamlessly fall back to Google Redirect sign-in
        console.log("Popup blocked or unavailable, switching to Google redirect flow...");
        await signInWithRedirect(auth, provider);
        return { success: true };
      }
    } catch (fbErr: any) {
      console.warn("Google sign-in notice:", fbErr?.code || fbErr?.message);
      const code = fbErr?.code || "";
      let msg = "Google sign-in could not be completed. Please try again.";
      if (code === "auth/unauthorized-domain") {
        msg = "To sign in with Google on Vercel, please add 'badarshdigitalproducts.vercel.app' in Firebase Console -> Authentication -> Settings -> Authorized Domains.";
      }
      setError(msg);
      return { success: false, error: msg, code };
    }
  };

  const signInWithGoogleEmail = async (
    email: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !trimmedEmail.includes("@")) {
        const msg = "Please enter a valid Google / Gmail address.";
        setError(msg);
        return { success: false, error: msg };
      }

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          name: name || trimmedEmail.split("@")[0],
          photoURL: null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.user) {
        const msg = data.error || "Could not sign in with this Google account.";
        setError(msg);
        return { success: false, error: msg };
      }

      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      const msg = err?.message || "Google sign-in failed.";
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
        signInWithGoogleEmail,
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
