export type WCAUser = {
  id: number;
  name: string;
  email: string;
  avatar: {
    url: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  iat: number;
  "x-triplit-user-id": number;
};

// export type Session = {
//   id: string;
//   user_id?: number;
//   name: string;
//   order: number;
//   scramble_type: string;
//   updated?: number;
// };

// export type Time = {
// 	id: string;
// 	session_id: string;
// 	time: number;
// 	penalty: number;
// 	scramble?: string;
// 	comment?: string;
// 	timestamp: number;
// 	updated?: number;
// 	archived?: boolean;
// };
