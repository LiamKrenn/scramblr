
export type Session = TimeJson[];

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

export type TimeJson = {
  _id: string;
  user_id: string;
  time: {
    penalty: number;
    time: number;
  },
  scramble: string;
  comment: string;
  timestamp: number;
}
