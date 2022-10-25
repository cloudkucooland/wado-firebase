// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { notifyInfo, notifyWarn, registerToast } from "./notify";
// import { Hymn, Lection, Prayer, Psalm } from "./model";

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
const auth = getAuth(app);
const firestore = getFirestore(app);

enableIndexedDbPersistence(firestore).catch((err) => {
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

const rootDir =
  location.pathname +
  (location.pathname.slice(-1) === "/" ? "" : "/") +
  "build/";

const sw = navigator.serviceWorker.register(rootDir + "sw.js", {
  scope: rootDir,
});

export function recordEvent(name: string) {
  logEvent(analytics, name);
}
