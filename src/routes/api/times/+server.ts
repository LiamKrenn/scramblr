import type { RequestHandler } from './$types';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { DATABASE_URL } from '$env/static/private';
import Joi from 'joi';

const time_schema = Joi.object({
  time: Joi.object({
    penalty: Joi.number().required(),
    time: Joi.number().required()
  }),
  scramble: Joi.string().required(),
  comment: Joi.string().allow(''),
  timestamp: Joi.number().required()
});


const client = new MongoClient(DATABASE_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
await client.connect()

export const GET: RequestHandler = async () => {

  let times = await client.db('times').collection('times').find().toArray();
  console.log(times);
  
  return new Response(JSON.stringify(times), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: RequestHandler = async ({request}) => {
  let time = await request.json();
  const { error, value } = time_schema.validate(time);

  if (error) {
    console.log(error.details);
    return new Response("Bad Request", { status: 400 });
  }

  console.log("yipie");
  time = value;

  await client.db('times').collection('times').insertOne(time);
  return new Response(null, { status: 201 });
}