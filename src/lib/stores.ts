import { get, writable, type Writable } from "svelte/store";
import type { Session, Time, WCAUser } from "./types";
import { persisted } from "svelte-persisted-store";
import { pg } from "./pglite";
import type { LiveQuery } from "@electric-sql/pglite/live";

export const user: Writable<WCAUser | null> = writable(null);
export const token: Writable<string | null> = writable(null);

export const times: Writable<Time[]> = writable([]);
export const sessions: Writable<Session[]> = writable([]);

export const currentSession = persisted<string>("currentSession", "undefined");

const session_query = await pg.live.query(
  'SELECT * FROM sessions WHERE archived = false ORDER BY "order"',
  [],
  (data) => {
    sessions.set(data.rows as Session[]);
  }
);

let time_query:
  | LiveQuery<{
      [key: string]: any;
    }>
  | undefined = undefined;

currentSession.subscribe(async (session) => {
  time_query?.unsubscribe?.();
  if (session === "undefined") {
    times.set([]);
    return;
  }
  time_query = await pg.live.query(
    "SELECT id, time, penalty FROM times WHERE session_id = $1 AND archived = false ORDER BY timestamp DESC",
    [session],
    // "id",
    (data) => {
      times.set(data.rows as Time[]);
    }
  );
});
