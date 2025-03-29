import { db, getSession, getTime, type TimeDB } from "$lib/server/db.server";
import { check_auth } from "$lib/server/utils.server";
import type { Time } from "$lib/types";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async (event) => {
  let user = await check_auth(event.cookies);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  db.query("DELETE FROM times WHERE user_id = $1", [user.id]);
  db.query("DELETE FROM sessions WHERE user_id = $1", [user.id]);

  return new Response();
};
