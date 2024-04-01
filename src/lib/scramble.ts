import { Scrambow } from "$lib/scrambow/scrambow";
import { writable } from "svelte/store";

export const scramble = writable("loading...");

export const type = writable("333");

export const types = [
  "_Cubes",
  "333",
  "222",
  "444",
  "_CFOP",
  "cross",
  "oll",
  "pll",
  "_Roux",
  "cmll",
  "lse",
]

export const typemap: {[type: string]: string} = {
  "333": "3x3x3",
  "222": "2x2x2",
  "444": "4x4x4",
  "cross": "Cross",
  "oll": "OLL",
  "pll": "PLL",
  "cmll": "CMLL",
  "lse": "LSE",
}


export async function new_scramble(type: string) {
  let tmp = "";
  if (type == "pll") {
    tmp = new Scrambow().setType(type).setLength(16).get()[0].scramble_string;
  } else {
    tmp = new Scrambow().setType(type).get()[0].scramble_string;
  }
  scramble.set(tmp);
}
