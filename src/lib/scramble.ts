import { Scrambow } from "$lib/scrambow/scrambow";
import type { PuzzleID } from "cubing/twisty";
import { get, writable } from "svelte/store";
import { resize_to_fit } from "./utils";
import { browser } from "$app/environment";
import { persisted } from "svelte-persisted-store";

export const scramble = writable("loading...");
export const type = persisted("type", "333");

type.subscribe((value) => {
  // TODO: change session default scramble type
});

export const types: { [group: string]: string[] } = {
  WCA: [
    "333",
    "222",
    "444",
    "555",
    "666",
    "777",
    "megaminx",
    "pyraminx",
    "skewb",
    "square1",
    "clock",
  ],
  CFOP: ["cross", "oll", "pll"],
  Roux: ["cmll", "lse"],
};

export const typemap: {
  [type: string]: {
    display: string;
    puzzle: PuzzleID;
    pre_moves: string;
    b_display: string;
  };
} = {
  "333": {
    display: "3x3x3",
    puzzle: "3x3x3",
    pre_moves: "",
    b_display: "3x3x3",
  },
  "222": {
    display: "2x2x2",
    puzzle: "2x2x2",
    pre_moves: "",
    b_display: "2x2x2",
  },
  "444": {
    display: "4x4x4",
    puzzle: "4x4x4",
    pre_moves: "",
    b_display: "4x4x4",
  },
  "555": {
    display: "5x5x5",
    puzzle: "5x5x5",
    pre_moves: "",
    b_display: "5x5x5",
  },
  "666": {
    display: "6x6x6",
    puzzle: "6x6x6",
    pre_moves: "",
    b_display: "6x6x6",
  },
  "777": {
    display: "7x7x7",
    puzzle: "7x7x7",
    pre_moves: "",
    b_display: "7x7x7",
  },
  megaminx: {
    display: "Megaminx",
    puzzle: "megaminx",
    pre_moves: "",
    b_display: "Mega",
  },
  pyraminx: {
    display: "Pyraminx",
    puzzle: "pyraminx",
    pre_moves: "",
    b_display: "Pyra",
  },
  skewb: {
    display: "Skewb",
    puzzle: "skewb",
    pre_moves: "",
    b_display: "Skewb",
  },
  square1: {
    display: "Square-1",
    puzzle: "square1",
    pre_moves: "",
    b_display: "SQ-1",
  },
  cross: {
    display: "Cross",
    puzzle: "3x3x3",
    pre_moves: "z2",
    b_display: "Cross",
  },
  clock: {
    display: "Clock",
    puzzle: "clock",
    pre_moves: "",
    b_display: "Clock",
  },
  oll: { display: "OLL", puzzle: "3x3x3", pre_moves: "z2", b_display: "OLL" },
  pll: { display: "PLL", puzzle: "3x3x3", pre_moves: "z2", b_display: "PLL" },
  cmll: {
    display: "CMLL",
    puzzle: "3x3x3",
    pre_moves: "z2",
    b_display: "CMLL",
  },
  lse: { display: "LSE", puzzle: "3x3x3", pre_moves: "z2", b_display: "LSE" },
};

export async function new_scramble() {
  scramble.set(new Scrambow().setType(get(type)).get()[0].scramble_string);
}
