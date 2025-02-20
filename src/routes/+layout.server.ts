import type { LayoutServerLoad } from "./$types";
import jwt from "jsonwebtoken";
import { CLIENT_SECRET } from "$env/static/private";
import type { WCAUser } from "$lib/types";

export const load = (async ({ cookies }) => {
  const token = cookies.get("token");
  let decoded: WCAUser | null = null;
  if (token) {
    decoded = jwt.verify(token, CLIENT_SECRET) as WCAUser;
  }

  return {
    user: decoded,
    token: token,
  };
}) satisfies LayoutServerLoad;
