import { writable, type Writable } from "svelte/store";
import type { WCAUser } from "./types";
import type { Time, Session } from "../../triplit/schema";
import { persisted } from "svelte-persisted-store";

export const user: Writable<WCAUser | null> = writable(null);
export const token: Writable<string | null> = writable(null);

export const times: Writable<Time[]> = writable([]);
export const currentSession = persisted<string | undefined>(
  "currentSession",
  undefined
);
export const sessions: Writable<Session[]> = writable([]);
