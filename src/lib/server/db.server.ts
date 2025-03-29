import { DB_URL } from "$env/static/private";
import type { Time } from "$lib/types";
import pg from "pg";

export const db = new pg.Pool({ connectionString: DB_URL });

export type TimeDB = Time & {
  user_id: number;
};

export async function getTimeAuth(
  id: string,
  user_id: number
): Promise<TimeDB | null | Response> {
  const res = await db.query<TimeDB>("SELECT * FROM times WHERE id = $1", [id]);

  if (res.rows.length > 0 && res.rows[0].user_id !== user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  return res.rows[0] || null;
}

export async function getSessionAuth(
  id: string,
  user_id: number
): Promise<TimeDB | null | Response> {
  const res = await db.query<TimeDB>("SELECT * FROM sessions WHERE id = $1", [
    id,
  ]);

  if (res.rows.length > 0 && res.rows[0].user_id !== user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  return res.rows[0] || null;
}
