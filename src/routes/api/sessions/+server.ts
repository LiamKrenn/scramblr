import { check_auth, prisma } from '$lib/server/db.server';
import type { Session, Time } from '$lib/types';
import { getUUID } from '$lib/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, cookies }) => {
	const decoded = await check_auth(cookies);
	if (!decoded) {
		return new Response('Not logged in', { status: 401 });
	}

	const sessions = await prisma.sessions.findMany({ where: { user_id: decoded.id } });
	return new Response(JSON.stringify(sessions), {
		headers: { 'content-type': 'application/json' }
	});
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const decoded = await check_auth(cookies);
	if (!decoded) {
		return new Response('Unauthorized', { status: 401 });
	}

	const user_id = decoded.id;

	let session = await request.json();
	session.user_id = user_id;

	await prisma.sessions.upsert({ where: { id: session.id }, update: { ...session }, create: { ...session } });
	return new Response(null, { status: 201 });
};
