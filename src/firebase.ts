import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { notifyInfo, notifyWarn } from "./notify";
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

if (offline) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == "failed-precondition") {
      notifyInfo("Unable to start persistence");
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == "unimplemented") {
      notifyWarn("Browser cannot start persistence");
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });
}

export function recordEvent(name: string) {
  logEvent(analytics, name);
}

export async function isEditor<Boolean>() {
  if (!auth.currentUser) return false;

  const res = await auth.currentUser.getIdTokenResult();
  if (res.claims.role == "Editor") {
    return true;
  } else {
    return false;
  }
}
