import { DB_URL } from "$env/static/private";
import type { Time } from "$lib/types";
import pg from "pg";

export const db = new pg.Pool({ connectionString: DB_URL });

export type TimeDB = Time & {
  user_id: number;
};

export async function getTime(id: string): Promise<TimeDB | null> {
  const res = await db.query<TimeDB>("SELECT * FROM times WHERE id = $1", [id]);
  return res.rows[0] || null;
}

export async function getSession(id: string): Promise<TimeDB | null> {
  const res = await db.query<TimeDB>("SELECT * FROM sessions WHERE id = $1", [
    id,
  ]);
  return res.rows[0] || null;
}
