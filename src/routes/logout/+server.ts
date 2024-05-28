import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	let resp = new Response(null, {
		status: 302,
		headers: { Location: '/', 'Set-Cookie': `token=` }
	});

	return resp;
};
