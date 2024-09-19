import { check_auth, prisma } from '$lib/server/db.server';
import type { Time } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, cookies }) => {
	const decoded = await check_auth(cookies);
	if (!decoded) {
		return new Response('Not logged in', { status: 401 });
	}

	const count = (await prisma.sessions.findMany({ where: { user_id: decoded.id } })).length;
	return new Response(JSON.stringify(count), {
		headers: { 'content-type': 'application/json' }
	});
};
