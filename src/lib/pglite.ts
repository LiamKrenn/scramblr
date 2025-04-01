import { ShapeStream, Shape } from "@electric-sql/client";
import {
  PGlite,
  type Extensions,
  type PGliteOptions,
} from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import {
  electricSync,
  type SyncShapesToTablesResult,
} from "@electric-sql/pglite-sync";
import { PUBLIC_APP_ROUTE } from "$env/static/public";
import localsql from "./local.sql?raw";
import type { Session, Time } from "$lib/types";
import { getUUID } from "$lib/utils";
import { PGliteWorker } from "@electric-sql/pglite/worker";

export const pg = await PGliteWorker.create(
  new Worker(new URL("./pglite-worker.js", import.meta.url), {
    type: "module",
  }),
  {
    dataDir: "idb://scramblr",
    relaxedDurability: true,
    initialMemory: 256 * 1024 * 1024, // 256MB
    extensions: {
      electric: electricSync({
        // debug: true,
      }),
      live,
    },
  }
);

await pg.exec(localsql);

let sync: SyncShapesToTablesResult;

export async function initSync() {
  console.log("Initializing sync...");
  sync = await pg.electric.syncShapesToTables({
    shapes: {
      times: {
        shape: {
          url: `${PUBLIC_APP_ROUTE}/api/sync?ts=${Date.now()}`,
          params: {
            table: "times",
          },
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "Thu, 01 Jan 1970 00:00:00 GMT",
          },
        },
        table: "times",
        primaryKey: ["id"],
      },
      sessions: {
        shape: {
          url: `${PUBLIC_APP_ROUTE}/api/sync?ts=${Date.now()}`,
          params: {
            table: "sessions",
          },
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "Thu, 01 Jan 1970 00:00:00 GMT",
          },
        },
        table: "sessions",
        primaryKey: ["id"],
      },
    },
    key: "sync",
    useCopy: true,
    // onInitialSync: async () => {
    //   console.log("Initial sync complete");
    // },
  });

  // await pg.waitReady;
  // console.log("pg ready");
  // setInterval(async () => {
  //   console.log("uptodate..", sync.isUpToDate);
  // }, 1000); // every 10 seconds
}

export async function closeSync() {
  if (sync) {
    await sync.unsubscribe();
  }
}

// Session Outward Sync
pg.live.query("SELECT * FROM sessions WHERE state = 1", [], async (data) => {
  const sessions = data.rows as Session[];

  // if no sessions, return
  if (sessions.length === 0) {
    return;
  }

  try {
    // try syncing
    const res = await fetch(`api/sessions?ts=${Date.now()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "Thu, 01 Jan 1970 00:00:00 GMT",
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
    const res = await fetch(`api/times?ts=${Date.now()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "Thu, 01 Jan 1970 00:00:00 GMT",
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
