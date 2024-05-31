import type { RequestHandler } from './$types';
import { MongoClient, ServerApiVersion } from 'mongodb';
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

export const GET: RequestHandler = async ({request, cookies}) => {
  const decoded = await check_auth(cookies);
  if (!decoded) { return new Response("Unauthorized", { status: 401 }); }

  const user_id = decoded.id;

  let sessions = await client.db('times').collection('sessions').find({ "user_id": user_id }).sort({ order: 1 }).toArray();
  
  return new Response(JSON.stringify(sessions), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: RequestHandler = async ({request, cookies}) => {
  const decoded = await check_auth(cookies);
  if (!decoded) { return new Response("Unauthorized", { status: 401 }); }

  const user_id = decoded.id;

  let session = await request.json();

  delete session._id;
  delete session.user_id;

  const { error, value } = session_schema.validate(session);

  if (error) {
    console.log(error.details);
    
    return new Response("Bad Request", { status: 400 });
  }

  session = value;
  session.user_id = user_id;

  await client.db('times').collection('sessions').insertOne(session);
  return new Response(null, { status: 201 });
}
