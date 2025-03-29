import { pg } from "./pglite";
import { currentSession } from "./stores";
import type { Session, Time } from "./types";
import { getUUID } from "./utils";

async function getHighestOrder(): Promise<number> {
  const res = await pg.query<{ max: number | null }>(
    'SELECT MAX("order") FROM sessions'
  );
  return res.rows[0].max || 0;
}

export async function createSession(name: string) {
  let new_session: Session = {
    id: getUUID(),
    name: name,
    order: (await getHighestOrder()) + 1,
  };

  const res = await pg.query<Session>(
    'INSERT INTO sessions (id, name, "order", state) VALUES ($1, $2, $3, 1) RETURNING *',
    [new_session.id, new_session.name, new_session.order]
  );

  return res.rows[0];
}

export async function getSession(id: string) {
  const res = await pg.query<Session>("SELECT * FROM sessions WHERE id = $1", [
    id,
  ]);
  return res.rows[0] || null;
}

export async function createTime(time: Time) {
  const res = await pg.query<Time>(
    "INSERT INTO times (id, session_id, time, penalty, scramble, comment, timestamp, state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      time.id,
      time.session_id,
      time.time,
      time.penalty,
      time.scramble,
      time.comment,
      time.timestamp,
      1,
    ]
  );

  return res.rows[0];
}
