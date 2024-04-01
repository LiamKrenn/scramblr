import { Scrambow } from "$lib/scrambow/scrambow";
import type { PuzzleID } from "cubing/twisty";
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

export const typemap: {[type: string]: {display: string, puzzle: PuzzleID}} = {
  "333": {display: "3x3x3", puzzle: "3x3x3"},
  "222": {display: "2x2x2", puzzle: "2x2x2"},
  "444": {display: "4x4x4", puzzle: "4x4x4"},
  "cross": {display: "Cross", puzzle: "3x3x3"},
  "oll": {display: "OLL", puzzle: "3x3x3"},
  "pll": {display: "PLL", puzzle: "3x3x3"},
  "cmll": {display: "CMLL", puzzle: "3x3x3"},
  "lse": {display: "LSE", puzzle: "3x3x3"}
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
