import { ShapeStream, Shape } from "@electric-sql/client";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import {
  electricSync,
  type SyncShapesToTablesResult,
} from "@electric-sql/pglite-sync";
import { PUBLIC_APP_ROUTE } from "$env/static/public";
import localsql from "./local.sql?raw";
import type { Session, Time } from "$lib/types";
import { getUUID } from "$lib/utils";

export const pg = await PGlite.create({
  dataDir: "idb://scramblr",
  relaxedDurability: true,
  extensions: {
    electric: electricSync(),
    live,
  },
});

await pg.exec(localsql);

let sync: SyncShapesToTablesResult;

export async function initSync() {
  sync = await pg.electric.syncShapesToTables({
    shapes: {
      times: {
        shape: {
          url: `${PUBLIC_APP_ROUTE}/api/sync`,
          params: {
            table: "times",
          },
        },
        table: "times",
        primaryKey: ["id"],
      },
      sessions: {
        shape: {
          url: `${PUBLIC_APP_ROUTE}/api/sync`,
          params: {
            table: "sessions",
          },
        },
        table: "sessions",
        primaryKey: ["id"],
      },
    },
    key: "sync",
  });
}

export async function closeSync() {
  if (sync) {
    await sync.unsubscribe();
  }
}

initSync();

// Session Outward Sync
pg.live.query("SELECT * FROM sessions WHERE state = 1", [], async (data) => {
  const sessions = data.rows as Session[];

  // if no sessions, return
  if (sessions.length === 0) {
    return;
  }

  try {
    // try syncing
    const res = await fetch(`api/sessions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessions),
    });

    console.log(res);

    // mark sent
    await pg.query("UPDATE sessions SET state = 2 WHERE id = ANY($1)", [
      sessions.map((s) => s.id),
    ]);

    if (res?.status !== 200) {
      throw new Error("Failed to sync");
    } else {
      // retry failed syncs
      await pg.query("UPDATE sessions SET state = 1 WHERE state = 3");
    }
  } catch (err) {
    console.warn(err);
    // mark failed syncs
    await pg.query("UPDATE sessions SET state = 3 WHERE id = ANY($1)", [
      sessions.map((s) => s.id),
    ]);
  }
});

// Times Outward Sync
pg.live.query("SELECT * FROM times WHERE state = 1", [], async (data) => {
  const times = data.rows as Time[];

  // if no times, return#
  if (times.length === 0) {
    return;
  }

  try {
    // try syncing
    const res = await fetch(`api/times`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(times),
    });

    // mark sent
    await pg.query("UPDATE times SET state = 2 WHERE id = ANY($1)", [
      times.map((t) => t.id),
    ]);

    if (res?.status !== 200) {
      throw new Error("Failed to sync");
    } else {
      // retry failed syncs
      await pg.query("UPDATE times SET state = 1 WHERE state = 3");
    }
  } catch (err) {
    console.warn(err);
    // mark failed syncs
    await pg.query("UPDATE times SET state = 3 WHERE id = ANY($1)", [
      times.map((t) => t.id),
    ]);
  }
});
