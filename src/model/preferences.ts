import { writable } from "svelte/store";

// show extended debugging
const storedDebug: boolean = localStorage["debugOn"] ? true : false;
export const debugOn = writable(storedDebug);
debugOn.subscribe((value: boolean) => {
  if (value !== true) value = false;
  console.log("setting debugOn", value);
  localStorage["debugOn"] = value;
});

// show media links
const storedShowMedia: boolean = localStorage["showMedia"] ? true : false;
export const showMedia = writable(storedShowMedia);
showMedia.subscribe((value: boolean) => {
  if (value !== true) value = false;
  console.log("setting showMedia", value);
  localStorage["showMedia"] = value;
});

// show edit links
const storedShowEdit: boolean = localStorage["showEdit"] ? true : false;
export const showEdit = writable(storedShowEdit);
showEdit.subscribe((value: boolean) => {
  if (value !== true) value = false;
  console.log("setting showEdit", value);
  localStorage["showEdit"] = value;
});
