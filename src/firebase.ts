import { initializeApp, registerVersion } from "firebase/app";
import { type Analytics, getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  clearIndexedDbPersistence,
  enableIndexedDbPersistence,
  getFirestore,
  getDocsFromCache,
  getDocsFromServer,
  getDocFromCache,
  getDocFromServer,
  Query,
  DocumentReference,
  terminate,
  waitForPendingWrites,
} from "firebase/firestore";
import { toasts } from "svelte-toasts";

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
registerVersion("WADO", "2.0");
export const auth = getAuth(app);
export let db = getFirestore(app);
export const storage = getStorage();
let analytics: Analytics;
let _analyticsRunning: boolean = false;

// make this callable from the browser's js console
// @ts-ignore
window.wado = {};
// @ts-ignore
window.wado.clearCache = async () => {
  await waitForPendingWrites(db);
  await terminate(db);
  await clearIndexedDbPersistence(db);
  db = getFirestore(app);
};

export function initAnalytics() {
  analytics = getAnalytics(app);
  _analyticsRunning = true;
}

export function recordEvent(name: string, details?: object) {
  if (!_analyticsRunning || !name) return;
  logEvent(analytics, name, details);
}

export function screenView(name: string) {
  recordEvent("screen_view", { firebase_screen: name });
}

export function enableOfflineDataMode() {
  // toasts.info("Starting offline data mode", null, { uid: 21, duration: 5 });
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

export async function getDocsCacheFirst(q: Query) {
  try {
    const res = await getDocsFromCache(q);
    if (res.empty) {
      // console.debug("result empty");
      throw new Error("query cache miss");
    }
    // console.debug("query cache hit");
    return res;
  } catch (err) {
    // console.debug("query cache miss");
    const res = await getDocsFromServer(q);
    return res;
  }
}

export async function getDocCacheFirst(r: DocumentReference) {
  try {
    const res = await getDocFromCache(r);
    // console.debug("doc cache hit");
    return res;
  } catch (err) {
    // console.debug("doc cache miss");
    const res = await getDocFromServer(r);
    return res;
  }
}
