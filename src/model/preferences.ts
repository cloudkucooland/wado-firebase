import { writable } from "svelte/store";

// show extended debugging
const storedDebug: string = localStorage["debugOn"];
export const debugOn = writable(storedDebug);
debugOn.subscribe((value) => {
  console.log("setting debugOn", value);
  localStorage["debugOn"] = value;
});

// show media links
const storedShowMedia: string = localStorage["showMedia"];
export const showMedia = writable(storedShowMedia);
showMedia.subscribe((value) => {
  console.log("setting showMedia", value);
  localStorage["showMedia"] = value;
});

// show edit links
const storedShowEdit: string = localStorage["showEdit"];
export const showEdit = writable(storedShowEdit);
showEdit.subscribe((value) => {
  console.log("setting showEdit", value);
  localStorage["showEdit"] = value;
});
