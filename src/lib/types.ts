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

type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type Session = {
  id: UUID;
  name?: string | null;
  order?: number;
  state?: number;
};

export type Time = {
  id: UUID;
  session_id: UUID;
  time: number;
  penalty?: number;
  scramble?: string | null;
  comment?: string | null;
  timestamp?: Date | null;
  state?: number;
};
