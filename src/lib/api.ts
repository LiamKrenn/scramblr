import { triplit } from "./client";

export async function clearData() {
  await triplit.endSession();
  await triplit.clear({
    full: true,
  });
  location.reload();
}

export async function getSessionWithId(id: string) {
  return await triplit.fetchById("sessions", id);
}
