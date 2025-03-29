import { ShapeStream, Shape } from "@electric-sql/client";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { electricSync } from "@electric-sql/pglite-sync";
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

await pg.electric.syncShapesToTables({
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

// Session Outward Sync
pg.live.query("SELECT * FROM sessions WHERE state = 1", [], async (data) => {
  const sessions = data.rows as Session[];

  for (let i = 0; i < sessions.length; i++) {
    try {
      // try syncing
      const res = await fetch(`api/sessions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessions[i]),
      });

      console.log(res);

      // mark sent
      await pg.query("UPDATE sessions SET state = 2 WHERE id = $1", [
        sessions[i].id,
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
      await pg.query("UPDATE sessions SET state = 3 WHERE id = $1", [
        sessions[i].id,
      ]);
    }
  }
});

// Times Outward Sync
pg.live.query("SELECT * FROM times WHERE state = 1", [], async (data) => {
  const times = data.rows as Time[];

  for (let i = 0; i < times.length; i++) {
    try {
      // try syncing
      const res = await fetch(`api/times`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(times[i]),
      });

      // mark sent
      await pg.query("UPDATE times SET state = 2 WHERE id = $1", [times[i].id]);

      if (res?.status !== 200) {
        throw new Error("Failed to sync");
      } else {
        // retry failed syncs
        await pg.query("UPDATE times SET state = 1 WHERE state = 3");
      }
    } catch (err) {
      console.warn(err);
      // mark failed syncs
      await pg.query("UPDATE times SET state = 3 WHERE id = $1", [times[i].id]);
    }
  }
});
