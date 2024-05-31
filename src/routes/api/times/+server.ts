import type { RequestHandler } from './$types';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { CLIENT_SECRET, MONGODB_URI } from '$env/static/private';
import Joi from 'joi';
import type { WCAUser } from '$lib/types';
import jwt from 'jsonwebtoken';
import type { Cookies } from '@sveltejs/kit';

const time_schema = Joi.object({
  time: Joi.object({
    penalty: Joi.number().required(),
    time: Joi.number().required()
  }),
  scramble: Joi.string().required(),
  comment: Joi.string().allow(''),
  timestamp: Joi.number().required()
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

  let times = await client.db('times').collection('times').find({ "user_id": user_id }).toArray();
  
  return new Response(JSON.stringify(times), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: RequestHandler = async ({request, cookies}) => {
  const decoded = await check_auth(cookies);
  if (!decoded) { return new Response("Unauthorized", { status: 401 }); }

  const user_id = decoded.id;

  let time = await request.json();

  delete time._id;
  delete time.user_id;

  const { error, value } = time_schema.validate(time);

  if (error) {
    console.log(error.details);
    
    return new Response("Bad Request", { status: 400 });
  }

  time = value;
  time.user_id = user_id;

  await client.db('times').collection('times').insertOne(time);
  return new Response(null, { status: 201 });
}