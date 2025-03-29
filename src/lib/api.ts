import { pg } from "./pglite";
import type { Session, Time } from "./types";

export async function createBulkSessions(
  sessions: {
    id: string;
    name: string;
    order?: number;
  }[]
) {
  const res = await fetch("/api/sessions", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessions),
  });

  return res;
}

export async function createBulkTimes(times: Time[]) {
  const res = await fetch("/api/times", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(times),
  });

  return res;
}
