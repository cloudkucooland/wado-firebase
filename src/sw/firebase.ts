/// <reference lib="webworker" />

// Default type of `self` is `WorkerGlobalScope & typeof globalThis`
// https://github.com/microsoft/TypeScript/issues/14877
declare var self: ServiceWorkerGlobalScope;

import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAtVBGVEjDM50VXljFFV-g_xltotL878b8",
  authDomain: "osl-dailyoffice.firebaseapp.com",
  projectId: "osl-dailyoffice",
  storageBucket: "osl-dailyoffice.appspot.com",
  messagingSenderId: "912288843295",
  appId: "1:912288843295:web:2f760d10ee11a579e3372a",
  measurementId: "G-EC241H9HZH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

onBackgroundMessage(messaging, async (payload) => {
  console.log("Received background message ", payload);
});
