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

export async function createSessionWithSession(session: {
  id: string;
  name: string;
  order: number;
}) {
  const res = await pg.query<Session>(
    'INSERT INTO sessions (id, name, "order", state, archived) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [session.id, session.name, session.order, 1, false]
  );

  return res.rows[0];
}

export async function createSession(name: string) {
  let new_session: Session = {
    id: getUUID(),
    name: name,
    order: (await getHighestOrder()) + 1,
  };

  const res = await pg.query<Session>(
    'INSERT INTO sessions (id, name, "order", state, archived) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [new_session.id, new_session.name, new_session.order, 1, false]
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
    "INSERT INTO times (id, session_id, time, penalty, scramble, comment, timestamp, state, archived) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [
      time.id,
      time.session_id,
      time.time,
      time.penalty,
      time.scramble,
      time.comment,
      time.timestamp,
      1,
      false,
    ]
  );

  return res.rows[0];
}

export async function updateSession(session: Session) {
  const res = await pg.query<Session>(
    'UPDATE sessions SET name = $1, "order" = $2 WHERE id = $3 RETURNING *',
    [session.name, session.order, session.id]
  );

  return res.rows[0];
}

export async function updateTime(time: {
  id: string;
  penalty: number;
  comment: string;
}) {
  const res = await pg.query<Time>(
    "UPDATE times SET penalty = $1, comment = $2 WHERE id = $3 RETURNING *",
    [time.penalty, time.comment, time.id]
  );

  return res.rows[0];
}

export async function deleteSession(id: string) {
  await pg.query("UPDATE sessions SET archived = true WHERE id = $1", [id]);
}

export async function deleteTime(id: string) {
  await pg.query("UPDATE times SET archived = true WHERE id = $1", [id]);
}

export async function resetAll() {
  await fetch("/api/reset", {
    method: "DELETE",
  });
}
