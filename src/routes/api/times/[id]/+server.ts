import type { RequestHandler } from './$types';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
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
  timestamp: Joi.number().required(),
  session_id: Joi.string().required()
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


export const DELETE: RequestHandler = async ({request, cookies, params}) => {
  const decoded = await check_auth(cookies);
  if (!decoded) { return new Response("Unauthorized", { status: 401 }); }

  const time_id = params.id;

  let res = await client.db('times').collection('times').deleteOne({"_id": new ObjectId(time_id)});
  return new Response(null, { status: 204 });
}