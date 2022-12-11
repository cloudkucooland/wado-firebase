let fbkey = { key: "unset" };

self.addEventListener("install", (event) => {
  console.log("wado prayer reminder installed");
  if (Notification.permission === "default") {
    Notification.requestPermission(() => {
      console.log("granted notification permission");
    });
  }
});

self.addEventListener("activate", (event) => {
  console.log("wado prayer reminder activated, starting reminders");
  if (Notification.permission === "default") {
    Notification.requestPermission(() => {
      console.log("granted notification permission");
    });
  }
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

function nextOffice(func) {
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

  const when = next - now;
  const timer = setTimeout(func, when);
}

function remindToPray() {
  try {
    if (Notification.permission === "granted") {
      registration.showNotification("WADO Reminder (direct)");
    } else {
      console.log(Notification.permission);
    }
  } catch (err) {
    console.log(err);
  }

  // keep going
  nextOffice(remindToPray);
}
