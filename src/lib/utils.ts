import { type ClassValue, clsx } from "clsx";
import { writable } from "svelte/store";
import { twMerge } from "tailwind-merge";

export let disable_key_tracking = writable(false);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSelectedText() {
  var text = "";
  if (typeof window.getSelection != "undefined") {
    text = window.getSelection()?.toString() || "";
  } else if (
    typeof document.getSelection() != "undefined" &&
    document.getSelection()?.type == "Text"
  ) {
    text = document.getSelection()?.getRangeAt(0).toString() || "";
  }
  return text;
}

export function resize_to_fit(document: Document, first = true) {
  let output = document.getElementById("scramble");
  let outputContainer = document.getElementById("scrambleContainer");
  if (output == null || outputContainer == null) return;
  if (first) {
    output.style.fontSize = "3rem";
    output.style.lineHeight = "150%";
    setTimeout(() => {
      //resize_to_fit(document, false);
    }, 100);
  }
  let fontSize = window.getComputedStyle(output).fontSize;
  if (output.clientHeight >= outputContainer.clientHeight) {
    output.style.fontSize = parseFloat(fontSize) - 2 + "px";
    //resize_to_fit(document, false);
  }
}

export function timeToFormattedString(time: number, decimals: number = 3) {
  if (time < 0) return "";
  time = time / 1000;
  let minutes = Math.floor(time / 60);
  let seconds = (time % 60).toFixed(decimals);
  if (minutes == 0) return seconds;
  if (parseFloat(seconds) < 10) seconds = "0" + seconds;
  return `${minutes}:${seconds}`;
}

export function timeToListString(
  time: number,
  penalty: number,
  decimals: number = 3
) {
  if (penalty < 0) {
    return "DNF";
  }
  let timeString = timeToFormattedString(time + penalty, decimals);

  if (penalty !== 0) {
    return timeString + "+";
  } else {
    return timeString;
  }
}

export function getUUID() {
  return crypto.randomUUID();
}
