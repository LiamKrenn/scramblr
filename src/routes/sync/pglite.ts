import { ShapeStream, Shape } from "@electric-sql/client";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { electricSync } from "@electric-sql/pglite-sync";
import { PUBLIC_APP_ROUTE } from "$env/static/public";

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

await pg.exec(`
CREATE TABLE IF NOT EXISTS foo (
id SERIAL PRIMARY KEY,
name VARCHAR(255),
value FLOAT,
state SMALLINT
);

CREATE OR REPLACE FUNCTION set_state_to_one()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the current state is 0
  IF OLD.state = 0 THEN
    NEW.state := 1;  -- Set state to 1
  END IF;

  RETURN NEW;  -- Return the modified row
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS before_update_set_state_to_one ON foo;
CREATE TRIGGER before_update_set_state_to_one
BEFORE UPDATE ON foo
FOR EACH ROW
EXECUTE FUNCTION set_state_to_one();
`);

await pg.electric.syncShapeToTable({
  shape: {
    url: `${PUBLIC_APP_ROUTE}/sync`,
    params: {
      table: "foo",
      // experimental_compaction: 'true'
    },
  },
  table: "foo",
  primaryKey: ["id"],
  shapeKey: "foo",
});

pg.live.query("SELECT * FROM foo WHERE state = 1", [], async (data) => {
  console.log(data.rows);

  for (let i = 0; i < data.rows.length; i++) {
    try {
      // try syncing
      const res = await fetch(`http://localhost:3001/foo/${data.rows[i].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: data.rows[i].value,
        }),
      });

      // mark sent
      await pg.query("UPDATE foo SET state = 2 WHERE id = $1", [
        data.rows[i].id,
      ]);

      if (res?.status !== 200) {
        throw new Error("Failed to sync");
      } else {
        // retry failed syncs
        await pg.query("UPDATE foo SET state = 1 WHERE state = 3");
      }
    } catch (err) {
      console.warn(err);
      // mark failed syncs
      await pg.query("UPDATE foo SET state = 3 WHERE id = $1", [
        data.rows[i].id,
      ]);
    }
  }
});

export async function incrementFoo(id: number, value: number) {
  let new_value = (value + 1).toFixed(1);
  await pg.query("UPDATE foo SET value = $2 WHERE id = $1", [id, new_value]);
}
