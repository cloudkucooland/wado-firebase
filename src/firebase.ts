import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { toasts } from "svelte-toasts";
import { offline } from "./model/preferences";

const firebaseConfig = {
  apiKey: "AIzaSyAtVBGVEjDM50VXljFFV-g_xltotL878b8",
  authDomain: "osl-dailyoffice.firebaseapp.com",
  projectId: "osl-dailyoffice",
  storageBucket: "osl-dailyoffice.appspot.com",
  messagingSenderId: "912288843295",
  appId: "1:912288843295:web:2f760d10ee11a579e3372a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (offline) enableOfflineDataMode();

export function enableOfflineDataMode() {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == "failed-precondition") {
      toasts.info("Offline data mode running in another tab/window", null, {
        uid: 20,
        duration: 5,
      });
    } else if (err.code == "unimplemented") {
      toasts.error("Browser does not support offline data mode", null, {
        uid: 20,
        duration: 5,
      });
    }
  });
}

export function recordEvent(name: string, details?: object) {
  if (!name) return;
  logEvent(analytics, name, details);
}

export async function isEditor() {
  if (!auth.currentUser) return false;

  const res = await auth.currentUser.getIdTokenResult();
  if (res.claims.role == "Editor") {
    return true;
  } else {
    return false;
  }
}
