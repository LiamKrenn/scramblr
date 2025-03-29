import { ShapeStream, Shape } from "@electric-sql/client";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { electricSync } from "@electric-sql/pglite-sync";
import { PUBLIC_APP_ROUTE } from "$env/static/public";
import localsql from "./local.sql?raw";
import type { Time } from "$lib/types";
import { getUUID } from "$lib/utils";

// const stream = new ShapeStream({
// 	url: `http://localhost:3000/v1/shape`,
// 	params: {
// 		table: 'foo'
// 	}
// });
// const shape = new Shape(stream);

export const pg = await PGlite.create({
  dataDir: "idb://electric-test",
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
          // experimental_compaction: 'true'
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
          // experimental_compaction: 'true'
        },
      },
      table: "sessions",
      primaryKey: ["id"],
    },
  },
  key: "sync",
});

// pg.live.query("SELECT * FROM foo WHERE state = 1", [], async (data) => {
//   console.log(data.rows);

//   for (let i = 0; i < data.rows.length; i++) {
//     try {
//       // try syncing
//       const res = await fetch(`http://localhost:3001/foo/${data.rows[i].id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           value: data.rows[i].value,
//         }),
//       });

//       // mark sent
//       await pg.query("UPDATE foo SET state = 2 WHERE id = $1", [
//         data.rows[i].id,
//       ]);

//       if (res?.status !== 200) {
//         throw new Error("Failed to sync");
//       } else {
//         // retry failed syncs
//         await pg.query("UPDATE foo SET state = 1 WHERE state = 3");
//       }
//     } catch (err) {
//       console.warn(err);
//       // mark failed syncs
//       await pg.query("UPDATE foo SET state = 3 WHERE id = $1", [
//         data.rows[i].id,
//       ]);
//     }
//   }
// });

export async function createTime() {
  let time: Time = {
    id: getUUID(),
    session_id: getUUID(),
    time: parseInt((1000 * Math.random()).toFixed(0)),
    timestamp: new Date(),
  };
  // await pg.query("UPDATE foo SET value = $2 WHERE id = $1", [id, new_value]);
  let res = await pg.query(
    "INSERT INTO times (id, session_id, time, timestamp) VALUES ($1, $2, $3, $4)",
    [time.id, time.session_id, time.time, time.timestamp]
  );

  console.log(res);
}
