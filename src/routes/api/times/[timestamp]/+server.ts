import { check_auth, prisma } from '$lib/server/db.server';
import type { Time } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, cookies, params }) => {
  // check if authenticated
	const decoded = await check_auth(cookies);
  
	if (!decoded) {
		return new Response('Not logged in', { status: 401 });
	}

  const user_id = decoded.id;

	const times = await prisma.times.findMany({include: {sessions: true}, where: {sessions: {user_id: user_id}, updated: { gt: parseInt(params.timestamp) }}});
	return new Response(JSON.stringify(times), {
		headers: { 'content-type': 'application/json' }
	});
};