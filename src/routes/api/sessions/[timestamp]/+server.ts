import { updated } from '$app/stores';
import { check_auth, prisma } from '$lib/server/db.server';
import type { Session, Time } from '$lib/types';
import { getUUID } from '$lib/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, cookies, params }) => {
	const decoded = await check_auth(cookies);
	if (!decoded) {
		return new Response('Not logged in', { status: 401 });
	}

	const sessions = await prisma.sessions.findMany({ where: { user_id: { equals: decoded.id}, updated: { gt: parseInt(params.timestamp) } } });
	return new Response(JSON.stringify(sessions), {
		headers: { 'content-type': 'application/json' }
	});
};
