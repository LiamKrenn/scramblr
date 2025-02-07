import { CLIENT_SECRET } from "$env/static/private";
import type { WCAUser } from "$lib/types";
import type { Cookies } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

// This function is used to check if a user is authenticated
export async function check_auth(cookies: Cookies): Promise<WCAUser | null> {
  const token = cookies.get("token");
  let decoded: WCAUser | null = null;
  if (token) {
    decoded = jwt.verify(token, CLIENT_SECRET) as WCAUser;
  }
  return decoded;
}
