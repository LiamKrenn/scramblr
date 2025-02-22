import { triplit } from "./client";
import { sessions, times } from "./stores";

export async function clearData() {
  await triplit.endSession();
  await triplit.clear();
  sessions.set([]);
  times.set([]);
}

export async function getSessionWithId(id: string) {
  return await triplit.fetchById("sessions", id);
}

export async function getNTimesSinceTime(id: string, n: number) {
  const initTime = await triplit.fetchById("times", id);
  if (!initTime) return [];

  const query = triplit
    .query("times")
    .where("session_id", "=", initTime.session_id)
    .where("timestamp", ">=", initTime.timestamp)
    .order("timestamp", "ASC")
    .limit(n)
    .build();

  return await triplit.fetch(query);
}
