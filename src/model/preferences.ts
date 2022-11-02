import { writable } from "svelte/store";

// show extended debugging
const storedDebug: boolean = localStorage["debugOn"];
export const debugOn = writable(storedDebug);
debugOn.subscribe((value) => {
  let v: boolean = false;
  if (value == "true") v = true;
  console.log("setting debugOn", v);
  localStorage["debugOn"] = v;
});

// show media links
const storedShowMedia: boolean = localStorage["showMedia"];
export const showMedia = writable(storedShowMedia);
showMedia.subscribe((value) => {
  let v: boolean = false;
  if (value == "true") v = true;
  console.log("setting showMedia", v);
  localStorage["showMedia"] = v;
});
