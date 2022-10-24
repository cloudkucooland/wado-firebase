import { toasts } from "svelte-toasts";
import type { ToastProps } from "svelte-toasts/types/common";

export async function notifyOnError<T>(promise: Promise<T>) {
  try {
    const result = await promise;
    return result;
  } catch (e) {
    return Promise.reject(e);
  }
}

export function notifyInfo(text: string) {
  return toasts.info(text);
}

export function notifyWarn(text: string) {
  return toasts.warning(text);
}

export function notifyError(text: string) {
  return toasts.error(text, {
    duration: 0,
  });
}

export function notifyDismiss(uid: number) {
  const toast = toasts.getById(uid);
  if (toast && toast.remove) toast.remove();
}

const updateToastID = new Map<string, number[]>();

export function registerToast(toast: ToastProps, updateID: string) {
  if (!updateToastID.has(updateID)) updateToastID.set(updateID, []);
  updateToastID.get(updateID).push(toast.uid);
}

export function dismissUpdateID(updateID: string) {
  const uids = updateToastID.get(updateID);
  if (uids) {
    uids.forEach(notifyDismiss);
    updateToastID.delete(updateID);
  }
}
