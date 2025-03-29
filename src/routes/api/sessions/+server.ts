import { db, getSession } from "$lib/server/db.server";
import { check_auth } from "$lib/server/utils.server";
import type { Session } from "$lib/types";
import type { RequestHandler } from "./$types";

type SessionDB = Session & {
  user_id: number;
};

export const GET: RequestHandler = async () => {
  return new Response();
};

export const PUT: RequestHandler = async (event) => {
  let user = await check_auth(event.cookies);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload_session = (await event.request.json()) as Session;

  const new_session: SessionDB = {
    id: payload_session.id,
    name: payload_session.name,
    order: payload_session.order,
    state: 2,
    user_id: user.id,
  };

  // Check if session already exists
  const existing_session = await getSession(payload_session.id);

  if (existing_session) {
    if (existing_session.user_id !== user.id) {
      console.log(existing_session, user.id);
      return new Response("Unauthorized", { status: 401 });
    }
    try {
      await db.query(
        `UPDATE sessions SET name = $1, "order" = $2, state = $3 WHERE id = $4 AND user_id = $5`,
        [new_session.name, new_session.order, 2, new_session.id, user.id]
      );
    } catch (err) {
      return new Response("Error creating session", {
        status: 500,
      });
    }
  } else {
    try {
      await db.query(
        `INSERT INTO sessions (id, name, "order", state, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          new_session.id,
          new_session.name,
          new_session.order,
          2,
          new_session.user_id,
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
