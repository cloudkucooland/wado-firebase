// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  // MessagePayload,
  // onMessage,
} from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { notifyInfo, notifyWarn, registerToast } from "./notify";
import { Hymn, Lection, Prayer, Psalm } from "./model";

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
const messaging = getMessaging(app);
const analytics = getAnalytics(app);
// onMessage(messaging, onFBMessage);
const auth = getAuth(app);

const rootDir =
  location.pathname +
  (location.pathname.slice(-1) === "/" ? "" : "/") +
  "build/";

const sw = navigator.serviceWorker.register(rootDir + "sw.js", {
  scope: rootDir,
});

let firebaseToken: string = null;
sw.then((sw) => {
  getToken(messaging, {
    serviceWorkerRegistration: sw,
  })
    .then((token) => {
      firebaseToken = token;
    })
    .catch(console.error);
}).catch(console.error);

export function sendTokenToServer() {
  // if (firebaseToken) return sendTokenToWasabee(firebaseToken);
}
