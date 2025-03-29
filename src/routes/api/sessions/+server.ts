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

  const payload_sessions = (await event.request.json()) as Session[];
  const sessionIds = payload_sessions.map((s) => s.id);

  // Check for any unauthorized existing sessions
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Get existing sessions from the database
    const existingSessions =
      sessionIds.length > 0
        ? (
            await client.query(
              `SELECT id, user_id FROM sessions WHERE id = ANY($1)`,
              [sessionIds]
            )
          ).rows
        : [];

    // Verify ownership of existing sessions
    const unauthorizedSession = existingSessions.find(
      (s) => s.user_id !== user.id
    );
    if (unauthorizedSession) {
      await client.query("ROLLBACK");
      return new Response("Unauthorized", { status: 401 });
    }

    // Separate sessions into updates and inserts
    const existingIds = new Set(existingSessions.map((s) => s.id));
    const sessionsToUpdate = payload_sessions.filter((s) =>
      existingIds.has(s.id)
    );
    const sessionsToInsert = payload_sessions.filter(
      (s) => !existingIds.has(s.id)
    );

    // Bulk update existing sessions
    if (sessionsToUpdate.length > 0) {
      const updateData = sessionsToUpdate.map((s) => ({
        id: s.id,
        name: s.name,
        order: s.order,
      }));

      await client.query(
        `
        UPDATE sessions
        SET name = u.name,
            "order" = u.order,
            state = 2
        FROM jsonb_to_recordset($1::jsonb) AS u(id uuid, name text, "order" int)
        WHERE sessions.id = u.id AND sessions.user_id = $2
      `,
        [JSON.stringify(updateData), user.id]
      );
    }

    // Bulk insert new sessions
    if (sessionsToInsert.length > 0) {
      const insertData = sessionsToInsert.map((s) => ({
        id: s.id,
        name: s.name,
        order: s.order,
      }));

      await client.query(
        `
        INSERT INTO sessions (id, name, "order", state, user_id)
        SELECT s.id, s.name, s."order", 2, $1
        FROM jsonb_to_recordset($2::jsonb) AS s(id uuid, name text, "order" int)
      `,
        [user.id, JSON.stringify(insertData)]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    return new Response("Error processing sessions", { status: 500 });
  } finally {
    client.release();
  }

  return new Response(null, { status: 200 });
};
