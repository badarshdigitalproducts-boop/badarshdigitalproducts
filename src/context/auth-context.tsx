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
import { syncAccountPurchasedProducts } from "@/hooks/use-product-access";

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
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; code?: string; redirectTriggered?: boolean }>;
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

async function computeCanonicalFallbackUid(email: string | null | undefined, fbUid: string): Promise<string> {
  if (!email || typeof window === "undefined" || !window.crypto?.subtle) {
    return fbUid;
  }
  try {
    const data = new TextEncoder().encode(email.toLowerCase().trim());
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `usr-${hex.slice(0, 12)}`;
  } catch {
    return fbUid;
  }
}

async function syncGoogleSessionWithServer(fbUser: FirebaseUser): Promise<AuthUser> {
  const canonicalFallbackUid = await computeCanonicalFallbackUid(fbUser.email, fbUser.uid);
  const fallbackUser: AuthUser = {
    uid: canonicalFallbackUid,
    email: fbUser.email,
    displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Creator"),
    photoURL: fbUser.photoURL || null,
  };

  try {
    const idToken = await fbUser.getIdToken();
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
        name: fallbackUser.displayName,
        photoURL: fallbackUser.photoURL,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data.user) {
        return data.user as AuthUser;
      }
    }
  } catch {
    // Non-blocking: Firebase client session preserves deterministic fallback ID
  }

  return fallbackUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribeFirebase: (() => void) | null = null;

    // Purge any legacy demo artifacts from browser storage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("badarsh_creator_demo_user");
      } catch {
        // Safe
      }
    }

    async function initAuth() {
      let hasCookieSession = false;
      let activeSessionEmail = "";

      // 1. Check for returning Google Redirect sign-in result first
      try {
        const auth = getFirebaseAuth();
        const redirectRes = await getRedirectResult(auth);
        if (redirectRes && redirectRes.user && redirectRes.user.email && mounted) {
          const syncedUser = await syncGoogleSessionWithServer(redirectRes.user);
          if (mounted) {
            setUser(syncedUser);
            hasCookieSession = true;
            activeSessionEmail = syncedUser.email?.toLowerCase().trim() || "";
            setLoading(false);
            syncAccountPurchasedProducts(true).catch(() => {});
          }
        }
      } catch (redirectErr) {
        console.warn("Google redirect handler notice:", redirectErr);
      }

      // 2. Check existing HttpOnly server cookie session (covers email/password + persisted logins)
      if (!hasCookieSession) {
        try {
          const res = await fetch("/api/auth/me", { cache: "no-store" });
          const data = await res.json();
          if (data.user && mounted) {
            setUser(data.user);
            hasCookieSession = true;
            activeSessionEmail = data.user.email?.toLowerCase().trim() || "";
            setLoading(false);
            syncAccountPurchasedProducts().catch(() => {});
          }
        } catch {
          // Fallback to Firebase listener
        }
      }

      // 3. Always attach live Firebase Auth listener (and clean up cleanly on unmount)
      try {
        const auth = getFirebaseAuth();
        unsubscribeFirebase = onAuthStateChanged(
          auth,
          async (fbUser: FirebaseUser | null) => {
            if (!mounted) return;
            if (fbUser && fbUser.email) {
              const fbEmail = fbUser.email.toLowerCase().trim();
              // Skip redundant re-sync if cookie session already verified this exact user
              if (hasCookieSession && activeSessionEmail === fbEmail) {
                setLoading(false);
                return;
              }
              const syncedUser = await syncGoogleSessionWithServer(fbUser);
              if (mounted) {
                setUser(syncedUser);
                hasCookieSession = true;
                activeSessionEmail = syncedUser.email?.toLowerCase().trim() || "";
                setLoading(false);
                syncAccountPurchasedProducts().catch(() => {});
              }
              return;
            }

            // Do not clobber an active email/password server session if Firebase client is signed out
            if (!hasCookieSession) {
              try {
                const res = await fetch("/api/auth/me", { cache: "no-store" });
                const data = await res.json();
                if (mounted) {
                  setUser(data.user || null);
                }
              } catch {
                if (mounted) setUser(null);
              }
            }
            if (mounted) setLoading(false);
          },
          () => {
            if (mounted) setLoading(false);
          }
        );
      } catch {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
      if (unsubscribeFirebase) unsubscribeFirebase();
    };
  }, []);

  const signInWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
    code?: string;
    redirectTriggered?: boolean;
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

        const syncedUser = await syncGoogleSessionWithServer(fbUser);
        setUser(syncedUser);
        syncAccountPurchasedProducts(true).catch(() => {});
        return { success: true };
      } catch (popupErr: any) {
        const code = popupErr?.code || "";

        // If user manually closed popup or double-clicked, cancel quietly
        if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
          return { success: false, code };
        }

        // If domain is unauthorized in Firebase Console, surface exact actionable message
        if (code === "auth/unauthorized-domain") {
          const host = typeof window !== "undefined" ? window.location.hostname : "this domain";
          const domainMsg = `Google Sign-In is not yet authorized for ${host}. Add it in Firebase Console -> Authentication -> Settings -> Authorized domains, or sign in with email & password below.`;
          setError(domainMsg);
          return { success: false, error: domainMsg, code };
        }

        // Only fall back to redirect when browser blocks popups or webview disallows popups
        if (
          code === "auth/popup-blocked" ||
          code === "auth/operation-not-supported-in-this-environment" ||
          code === "auth/internal-error"
        ) {
          await signInWithRedirect(auth, provider);
          return { success: true, redirectTriggered: true };
        }

        const msg = popupErr?.message || "Google sign-in could not be completed. Please try again.";
        setError(msg);
        return { success: false, error: msg, code };
      }
    } catch (fbErr: any) {
      console.warn("Google sign-in notice:", fbErr?.code || fbErr?.message);
      const code = fbErr?.code || "";
      let msg = "Google sign-in could not be completed. Please try again.";
      if (code === "auth/unauthorized-domain") {
        const host = typeof window !== "undefined" ? window.location.hostname : "this domain";
        msg = `Google Sign-In is not yet authorized for ${host}. Add it in Firebase Console -> Authentication -> Settings -> Authorized domains, or sign in with email & password below.`;
      }
      setError(msg);
      return { success: false, error: msg, code };
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
            const syncedUser = await syncGoogleSessionWithServer(fbRes.user);
            setUser(syncedUser);
            syncAccountPurchasedProducts(true).catch(() => {});
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
      syncAccountPurchasedProducts(true).catch(() => {});

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
      syncAccountPurchasedProducts(true).catch(() => {});

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
