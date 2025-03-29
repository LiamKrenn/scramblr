import { ELECTRIC_SECRET, ELECTRIC_URL } from "$env/static/private";
import { check_auth } from "$lib/server/utils.server";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (req) => {
  const user = await check_auth(req.cookies);
  if (!user) {
    return new Response(`Unauthorized`, { status: 401 });
  }

  const originUrl = new URL(`${ELECTRIC_URL}/v1/shape`);

  // Copy over the relevant query params that the Electric client adds
  // so that we return the right part of the Shape log.
  req.url.searchParams.forEach((value, key) => {
    if ([`live`, `table`, `handle`, `offset`, `cursor`].includes(key)) {
      originUrl.searchParams.set(key, value);
    }
  });

  let columns = "";
  const table = originUrl.searchParams.get("table");
  if (table == "times") {
    columns = `id,session_id,time,penalty,scramble,comment,timestamp,state,archived`;
  } else if (table == "sessions") {
    columns = `id,name,"order",state,archived`;
  }

  originUrl.searchParams.set(`columns`, columns);
  originUrl.searchParams.set("where", "user_id='" + user.id + "'");
  originUrl.searchParams.set("api_secret", `${ELECTRIC_SECRET}`);

  // When proxying long-polling requests, content-encoding &
  // content-length are added erroneously (saying the body is
  // gzipped when it's not) so we'll just remove them to avoid
  // content decoding errors in the browser.
  //
  // Similar-ish problem to https://github.com/wintercg/fetch/issues/23

  let resp = await fetch(originUrl.toString());

  if (resp.headers.get(`content-encoding`)) {
    const headers = new Headers(resp.headers);
    headers.delete(`content-encoding`);
    headers.delete(`content-length`);
    resp = new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  }
  return resp;
};
