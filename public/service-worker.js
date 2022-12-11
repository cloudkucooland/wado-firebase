let fbkey = { key: "unset" };

self.addEventListener("install", (event) => {
  console.log("wado prayer reminder installed");
  if (
    Notification.permission === "default" &&
    "requestPermission" in Notification
  ) {
    Notification.requestPermission(() => {
      console.log("granted notification permission");
    });
  }
});

self.addEventListener("activate", (event) => {
  console.log("wado prayer reminder activated, starting reminders");
  nextOffice(remindToPray);
});

self.addEventListener("message", (event) => {
  switch (event.data.eventType) {
    case "keyChanged":
      fbkey = event.data;
      break;
    case "ping":
      console.log("ping");
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
  if (h >= 12 && h < 15) nextHour = 12; // none
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
  // shouldn't happen, but... sleep for 3 hours
  if (when < 0) {
    when = 3 * 3600 * 1000;
  }
  console.log("setTimeout ms:", when);
  const timer = setTimeout(remindToPray, when);
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
      console.log("shutting down reminder loop");
      return; // break the loop, no reason to keep going
    }
  } catch (err) {
    console.log(err);
  }

  // keep going, after an hour off
  setTimeout(nextOffice, 3600 * 1000);
}
