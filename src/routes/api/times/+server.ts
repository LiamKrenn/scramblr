import { db, getSession, getTime, type TimeDB } from "$lib/server/db.server";
import { check_auth } from "$lib/server/utils.server";
import type { Time } from "$lib/types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  return new Response();
};

export const PUT: RequestHandler = async (event) => {
  const user = await check_auth(event.cookies);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload_times = (await event.request.json()) as Time[];
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Get all relevant session IDs and time IDs
    const sessionIds = [...new Set(payload_times.map((t) => t.session_id))];
    const timeIds = payload_times.map((t) => t.id);

    // Verify session ownership in bulk
    const sessions = await client.query(
      `SELECT id, user_id FROM sessions WHERE id = ANY($1)`,
      [sessionIds]
    );

    const unauthorizedSession = sessions.rows.find(
      (s) => s.user_id !== user.id
    );
    if (unauthorizedSession) {
      await client.query("ROLLBACK");
      return new Response("Unauthorized session access", { status: 401 });
    }

    // Check existing times ownership
    const existingTimes =
      timeIds.length > 0
        ? await client.query(
            `SELECT id, user_id FROM times WHERE id = ANY($1)`,
            [timeIds]
          )
        : { rows: [] };

    const unauthorizedTime = existingTimes.rows.find(
      (t) => t.user_id !== user.id
    );
    if (unauthorizedTime) {
      await client.query("ROLLBACK");
      return new Response("Unauthorized time access", { status: 401 });
    }

    // Separate updates and inserts
    const existingIds = new Set(existingTimes.rows.map((t) => t.id));
    const timesToUpdate = payload_times.filter((t) => existingIds.has(t.id));
    const timesToInsert = payload_times.filter((t) => !existingIds.has(t.id));

    // Bulk update
    if (timesToUpdate.length > 0) {
      const updateData = timesToUpdate.map((t) => ({
        id: t.id,
        session_id: t.session_id,
        time: t.time,
        penalty: t.penalty,
        scramble: t.scramble,
        comment: t.comment,
        timestamp: t.timestamp,
        archived: t.archived,
      }));

      await client.query(
        `
        UPDATE times
        SET
          session_id = u.session_id,
          time = u.time,
          penalty = u.penalty,
          scramble = u.scramble,
          comment = u.comment,
          timestamp = u.timestamp,
          state = 2,
          archived = u.archived
        FROM jsonb_to_recordset($1::jsonb) AS u(
          id uuid,
          session_id uuid,
          time int,
          penalty int,
          scramble text,
          comment text,
          timestamp timestamp,
          archived boolean
        )
        WHERE times.id = u.id AND times.user_id = $2
      `,
        [JSON.stringify(updateData), user.id]
      );
    }

    // Bulk insert
    if (timesToInsert.length > 0) {
      const insertData = timesToInsert.map((t) => ({
        id: t.id,
        session_id: t.session_id,
        time: t.time,
        penalty: t.penalty,
        scramble: t.scramble,
        comment: t.comment,
        timestamp: t.timestamp,
        archived: t.archived,
      }));

      await client.query(
        `
        INSERT INTO times (
          id, session_id, time, penalty, scramble,
          comment, timestamp, state, user_id, archived
        )
        SELECT
          s.id, s.session_id, s.time, s.penalty, s.scramble,
          s.comment, s.timestamp, 2, $1, s.archived
        FROM jsonb_to_recordset($2::jsonb) AS s(
          id uuid,
          session_id uuid,
          time int,
          penalty int,
          scramble text,
          comment text,
          timestamp timestamp,
          archived boolean
        )
      `,
        [user.id, JSON.stringify(insertData)]
      );
    }

    await client.query("COMMIT");
    return new Response(null, { status: 200 });
  } catch (err) {
    await client.query("ROLLBACK");
    return new Response("Error processing times", { status: 500 });
  } finally {
    client.release();
  }
};

// export const POST: RequestHandler = async (event) => {
//   // bulk insert
//   let user = await check_auth(event.cookies);
//   if (!user) {
//     throw new Response("Unauthorized", { status: 401 });
//   }

//   let times = (await event.request.json()) as Time[];

//   let new_times: TimeDB[] = [];

//   times.forEach(async (time) => {
//     const time_session = await getSession(time.session_id);
//     if (time_session?.user_id !== user.id) {
//       return new Response("Unauthorized", { status: 401 });
//     } else {
//       new_times.push({
//         id: time.id,
//         session_id: time.session_id,
//         time: time.time,
//         penalty: time.penalty,
//         scramble: time.scramble,
//         comment: time.comment,
//         timestamp: time.timestamp,
//         state: 0,
//         user_id: user.id,
//         archived: time.archived,
//       });
//     }
//   });

//   try {
//     let query = `INSERT INTO times (id, session_id, time, penalty, scramble, comment, timestamp, state, user_id, archived) VALUES `;

//     for (const new_time of new_times) {
//       query += `('${new_time.id}', '${new_time.session_id}', '${new_time.time}', '${new_time.penalty}', '${new_time.scramble}', '${new_time.comment}', '${new_time.timestamp}', ${2}, '${user.id}', ${new_time.archived}),`;
//     }

//     await db.query(
//       `INSERT INTO times (id, session_id, time, penalty, scramble, comment, timestamp, state, user_id, archived) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
//       [
//         new_times[0].id,
//         new_times[0].session_id,
//         new_times[0].time,
//         new_times[0].penalty,
//         new_times[0].scramble,
//         new_times[0].comment,
//         new_times[0].timestamp,
//         2,
//         user.id,
//         new_times[0].archived,
//       ]
//     );
//   }
// };
