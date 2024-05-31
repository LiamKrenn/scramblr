import type { RequestHandler } from './$types';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { CLIENT_SECRET, MONGODB_URI } from '$env/static/private';
import Joi from 'joi';
import type { TimeJson, WCAUser } from '$lib/types';
import jwt from 'jsonwebtoken';
import type { Cookies } from '@sveltejs/kit';

const session_schema = Joi.object({
  name: Joi.string().required(),
  order: Joi.number().required(),
  scramble_type: Joi.string().required(),
});

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
await client.connect()


async function check_auth(cookies: Cookies): Promise<WCAUser | null> {
  const token = cookies.get('token');
  let decoded: WCAUser | null = null;
  if (token) {
    decoded = jwt.verify(token, CLIENT_SECRET) as WCAUser;
  }
  return decoded;
}

export const GET: RequestHandler = async ({request, cookies, params}) => {
  const decoded = await check_auth(cookies);
  if (!decoded) { return new Response("Unauthorized", { status: 401 }); }

  const user_id = decoded.id;

  let sessions = await client.db('times').collection('sessions').find({ "_id": new ObjectId(params.id) }).toArray();

  if (sessions.length === 0) {
    return new Response(null, { status: 404 });
  }

  if (sessions[0].user_id !== user_id) {
    return new Response("Unauthorized", { status: 401 });
  }
  

  return new Response(JSON.stringify(sessions[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

