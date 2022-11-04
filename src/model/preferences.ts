import { writable } from "svelte/store";

// show extended debugging
const storedDebug: boolean = localStorage["debugOn"] === "true" ? true : false;
export const debugOn = writable(storedDebug);
debugOn.subscribe((value: boolean) => {
  if (value !== true) value = false;
  // console.debug("storing debugOn", value);
  localStorage["debugOn"] = value ? "true" : "false";
});

// show media links
const storedShowMedia: boolean =
  localStorage["showMedia"] === "true" ? true : false;
export const showMedia = writable(storedShowMedia);
showMedia.subscribe((value: boolean) => {
  if (value !== true) value = false;
  // console.debug("storing showMedia", value);
  localStorage["showMedia"] = value ? "true" : "false";
});

// show edit links
const storedShowEdit: boolean =
  localStorage["showEdit"] === "true" ? true : false;
export const showEdit = writable(storedShowEdit);
showEdit.subscribe((value: boolean) => {
  if (value !== true) value = false;
  // console.debug("storing showEdit", value);
  localStorage["showEdit"] = value ? "true" : "false";
});

// enable offline mode
const storedOffline: boolean =
  localStorage["Offline"] === "true" ? true : false;
export const offline = writable(storedOffline);
offline.subscribe((value: boolean) => {
  if (value !== true) value = false;
  localStorage["Offline"] = value ? "true" : "false";
});
