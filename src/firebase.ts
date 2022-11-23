import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  enableIndexedDbPersistence,
  getDocsFromCache,
  getDocsFromServer,
  getDocFromCache,
  getDocFromServer,
  Query,
  DocumentReference,
} from "firebase/firestore";
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
export const storage = getStorage();

export function enableOfflineDataMode() {
  toasts.info("Starting offline data mode", null, { uid: 21, duration: 5 });
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

export function screenView(name: string) {
  // logEvent(analytics, 'screen_view', { firebase_screen: name });
  recordEvent("screen_view", { firebase_screen: name });
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

export async function getDocsCacheFirst(q: Query) {
  try {
    const res = await getDocsFromCache(q);
    if (res.empty) {
      // console.debug("result empty");
      throw new Error("query cache miss");
    }
    console.debug("query cache hit");
    return res;
  } catch (err) {
    console.debug("query cache miss");
    const res = await getDocsFromServer(q);
    return res;
  }
}

export async function getDocCacheFirst(r: DocumentReference) {
  try {
    const res = await getDocFromCache(r);
    console.debug("doc cache hit");
    return res;
  } catch (err) {
    console.debug("doc cache miss");
    const res = await getDocFromServer(r);
    return res;
  }
}
