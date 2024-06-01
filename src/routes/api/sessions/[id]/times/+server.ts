import type { RequestHandler } from './$types';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { CLIENT_SECRET, MONGODB_URI } from '$env/static/private';
import Joi from 'joi';
import type { TimeJson, WCAUser } from '$lib/types';
import jwt from 'jsonwebtoken';
import type { Cookies } from '@sveltejs/kit';
import { session_id } from '$lib/sync';

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

  let session = await client.db('times').collection('sessions').findOne({ "_id": new ObjectId(params.id) });

  if (!session) return new Response("Not Found", { status: 404 });
  if (session.user_id != decoded.id) return new Response("Unauthorized", { status: 401 });

  let times = await client.db('times').collection('times').find({ "session_id": params.id }).sort({ timestamp: -1 }).toArray();
  
  return new Response(JSON.stringify(times), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
