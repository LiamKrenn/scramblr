import {
  WCA_ORIGIN,
  APPLICATION_ID,
  CLIENT_SECRET,
  APP_ROUTE,
} from "$env/static/private";
import jwt from "jsonwebtoken";
const { sign } = jwt;

export async function GET(req) {
  const code = req.url.searchParams.get("code");

  const tokenRes = await req.fetch(`${WCA_ORIGIN}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: APPLICATION_ID!,
      client_secret: CLIENT_SECRET!,
      redirect_uri: `${APP_ROUTE}/callback`,
      grant_type: "authorization_code",
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  const user = await (
    await req.fetch(`${WCA_ORIGIN}/api/v0/me`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
  ).json();

  const token = sign(
    {
      id: user.me.id,
      name: user.me.name,
      email: user.me.email,
      avatar: {
        url: user.me.avatar.thumb_url,
      },
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.created_at + tokenData.expires_in,
    },
    CLIENT_SECRET
  );

  // let sessions = await prisma.sessions.findMany({
  //   where: {
  //     user_id: {
  //       equals: user.me.id,
  //     },
  //   },
  // });

  // if (sessions.length === 0) {
  //   let default_session = {
  //     name: "Default",
  //     order: 0,
  //     scramble_type: "333",
  //     user_id: user.me.id,
  //   };
  //   await prisma.sessions.create({
  //     data: default_session,
  //   });
  // }

  let resp = new Response(null, {
    status: 302,
    headers: { Location: "/", "Set-Cookie": `token=${token}` },
  });

  return resp;
}
