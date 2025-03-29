import { get, writable, type Writable } from "svelte/store";
import type { Session, Time, WCAUser } from "./types";
import { persisted } from "svelte-persisted-store";
import { pg } from "./pglite";

export const user: Writable<WCAUser | null> = writable(null);
export const token: Writable<string | null> = writable(null);

export const times: Writable<Time[]> = writable([]);
export const sessions: Writable<Session[]> = writable([]);

export const currentSession = persisted<string>("currentSession", "undefined");

const session_query = pg.live.query(
  'SELECT * FROM sessions WHERE archived = false ORDER BY "order"',
  [],
  (data) => {
    sessions.set(data.rows as Session[]);
  }
);

let time_query;

currentSession.subscribe(async (session) => {
  if (session === "undefined") {
    times.set([]);
    time_query = undefined;
    return;
  }

  time_query = pg.live.query(
    "SELECT * FROM times WHERE session_id = $1 AND archived = false ORDER BY timestamp DESC",
    [session],
    (data) => {
      times.set(data.rows as Time[]);
    }
  );
});
