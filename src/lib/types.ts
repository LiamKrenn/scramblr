export type Time = [[number, number], string, string, number, number];
export type Session = Time[];

export type WCAUser = {
	id: string;
	name: string;
	email: string;
	avatar: {
		url: string;
	};
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
	iat: number;
};
