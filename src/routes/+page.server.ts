import jwt, { decode } from "jsonwebtoken";
import {
  WCA_ORIGIN,
  APPLICATION_ID,
  CLIENT_SECRET,
  APP_ROUTE,
} from "$env/static/private";
import type { WCAUser } from "$lib/types";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  let decoded: WCAUser | null = null;
  if (token) {
    decoded = jwt.verify(token, CLIENT_SECRET) as WCAUser;
  }

  return {
    user: decoded,
  };
};
