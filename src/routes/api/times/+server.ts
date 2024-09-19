import { check_auth, prisma } from '$lib/server/db.server';
import type { Time } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const times = await prisma.times.findMany();
	return new Response(JSON.stringify(times), {
		headers: { 'content-type': 'application/json' }
	});
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	// check if authenticated
	const decoded = await check_auth(cookies);
	if (!decoded) {
		return new Response('Not logged in', { status: 401 });
	}

	const user_id = decoded.id;

	let time = await request.json();

	console.log(time.session_id, user_id);

	// check if session exists and belongs to user
	const session = await prisma.sessions.findFirst({ where: { id: time.session_id, user_id } });
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	delete time.id;

	await prisma.times.create({ data: { ...time } });
	return new Response(null, { status: 201 });
};
