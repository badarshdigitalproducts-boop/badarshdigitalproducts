import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getDatabase, type Database } from "firebase-admin/database";

const DEFAULT_DATABASE_URL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  "https://badarsh-d353b-default-rtdb.asia-southeast1.firebasedatabase.app";

let cachedApp: App | null = null;
let cachedFirestore: Firestore | null = null;
let cachedRtdb: Database | null = null;

function parseServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (raw) {
    try {
      const jsonText = raw.startsWith("{")
        ? raw
        : Buffer.from(raw, "base64").toString("utf8");
      const parsed = JSON.parse(jsonText) as {
        project_id?: string;
        projectId?: string;
        client_email?: string;
        clientEmail?: string;
        private_key?: string;
        privateKey?: string;
      };
      const projectId = parsed.project_id || parsed.projectId;
      const clientEmail = parsed.client_email || parsed.clientEmail;
      const privateKey = (parsed.private_key || parsed.privateKey || "").replace(/\\n/g, "\n");
      if (projectId && clientEmail && privateKey) {
        return { projectId, clientEmail, privateKey };
      }
    } catch (err) {
      console.warn("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format:", (err as Error).message);
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim() || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  return null;
}

export function isFirebaseAdminConfigured(): boolean {
  return parseServiceAccount() !== null;
}

export function getFirebaseAdminApp(): App | null {
  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }

  const serviceAccount = parseServiceAccount();
  if (!serviceAccount) return null;

  try {
    cachedApp = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: DEFAULT_DATABASE_URL,
    });
    return cachedApp;
  } catch (err) {
    console.warn("Firebase Admin initialization warning:", (err as Error).message);
    return null;
  }
}

export function getAdminFirestore(): Firestore | null {
  if (cachedFirestore) return cachedFirestore;
  const app = getFirebaseAdminApp();
  if (!app) return null;
  cachedFirestore = getFirestore(app);
  return cachedFirestore;
}

export function getAdminRtdb(): Database | null {
  if (cachedRtdb) return cachedRtdb;
  const app = getFirebaseAdminApp();
  if (!app) return null;
  cachedRtdb = getDatabase(app);
  return cachedRtdb;
}
