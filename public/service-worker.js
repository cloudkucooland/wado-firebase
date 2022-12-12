let fbkey = { key: "unset" };
let waitingOn = 0;

self.addEventListener("install", (event) => {
  console.log("wado prayer reminder installed");
  if (
    "Notification" in self &&
    Notification.permission === "default" &&
    "requestPermission" in Notification
  ) {
    Notification.requestPermission(() => {
      console.log("granted notification permission");
    });
  }
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("statechange", (event) => {
  console.log("wado prayer statechange", event);
});

self.addEventListener("activate", (event) => {
  console.log("wado prayer reminder activated, starting reminders");
  event.waitUntil(self.clients.claim());
  nextOffice();
});

self.addEventListener("message", (event) => {
  switch (event.data.eventType) {
    case "keyChanged": // from firebase, just hold on to it for now
      fbkey = event.data.data;
      break;
    case "ping": // from firebase, just log
      console.log("ping");
      break;
    case "reset":
      console.log("resetting wado prayer reminder");
      if (waitingOn != 0) clearTimeout(waitingOn);
      waitingOn = 0;
      nextOffice();
      break;
    default:
      console.log("unknown message type", event.data);
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("wado prayer reminder notificationclick", event);
});

function nextOffice() {
  const now = new Date();
  const next = new Date();

  const h = now.getHours();
  if (h < 7) nextHour = 7; // lauds
  if (h >= 7 && h < 9) nextHour = 9; // terce
  if (h >= 9 && h < 12) nextHour = 12; // sext
  if (h >= 12 && h < 15) nextHour = 15; // none
  if (h >= 15 && h < 18) nextHour = 18; // vespers
  if (h >= 18 && h < 21) nextHour = 21; // compline
  if (h >= 21) {
    next.setDate(now.getDate + 1);
    nextHour = 7;
  } // lauds tomorrow - does this roll across months correctly?
  next.setHours(nextHour);
  next.setMinutes(0);
  next.setSeconds(0);
  next.setMilliseconds(0);

  console.log("next reminder:", next);

  const when = next - now;
  // shouldn't happen, but if it does, sleep for 3 hours
  if (typeof when !== "number" || when < 1000) {
    when = 3 * 3600 * 1000;
  }
  console.log("setTimeout ms:", when);
  waitingOn = setTimeout(remindToPray, when);
}

function remindToPray() {
  try {
    if (
      Notification.permission === "granted" &&
      "showNotification" in self.registration
    ) {
      console.log("sending reminder:", new Date());
      self.registration.showNotification("WADO Reminder");
    } else {
      // console.log("shutting down reminder loop");
      // return; // break the loop, no reason to keep going
    }
  } catch (err) {
    console.log(err);
    return; // break the loop
  }

  // keep going, rest 10 minutes first
  waitingOn = setTimeout(nextOffice, 600 * 1000);
}
