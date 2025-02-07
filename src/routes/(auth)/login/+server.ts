import { WCA_ORIGIN, APPLICATION_ID, APP_ROUTE } from '$env/static/private';

export function GET() {
	const urlParams = new URLSearchParams({
		client_id: APPLICATION_ID,
		redirect_uri: `${APP_ROUTE}/callback`,
		response_type: 'code',
		scope: 'email public'
	});

	const url = `${WCA_ORIGIN}/oauth/authorize?${urlParams.toString()}`;
	return Response.redirect(url);
}
