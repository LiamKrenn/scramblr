import {
  db,
  getSessionAuth,
  getTimeAuth,
  type TimeDB,
} from "$lib/server/db.server";
import { check_auth } from "$lib/server/utils.server";
import type { Time } from "$lib/types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  return new Response();
};

export const PUT: RequestHandler = async (event) => {
  let user = await check_auth(event.cookies);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload_session = (await event.request.json()) as Time;

  // Check auth for time and session
  const existing_time = await getTimeAuth(payload_session.id, user.id);
  await getSessionAuth(payload_session.session_id, user.id);

  const new_session: TimeDB = {
    id: payload_session.id,
    session_id: payload_session.session_id,
    time: payload_session.time,
    penalty: payload_session.penalty,
    scramble: payload_session.scramble,
    comment: payload_session.comment,
    timestamp: payload_session.timestamp,
    state: 2,
    user_id: user.id,
    archived: payload_session.archived,
  };

  if (existing_time) {
    try {
      await db.query(
        `UPDATE times SET session_id = $1, time = $2, penalty = $3, scramble = $4, comment = $5, timestamp = $6, state = $7, archived = $8
          WHERE id = $9 AND user_id = $10`,
        [
          new_session.session_id,
          new_session.time,
          new_session.penalty,
          new_session.scramble,
          new_session.comment,
          new_session.timestamp,
          2,
          new_session.archived,
          new_session.id,
          user.id,
        ]
      );
    } catch (err) {
      return new Response("Error creating session", {
        status: 500,
      });
    }
  } else {
    try {
      await db.query(
        `INSERT INTO times (id, session_id, time, penalty, scramble, comment, timestamp, state, user_id, archived) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          new_session.id,
          new_session.session_id,
          new_session.time,
          new_session.penalty,
          new_session.scramble,
          new_session.comment,
          new_session.timestamp,
          2,
          user.id,
          new_session.archived,
        ]
      );
    } catch (err) {
      return new Response("Error creating session", {
        status: 500,
      });
    }
  }

  return new Response(null, {
    status: 200,
  });
};
