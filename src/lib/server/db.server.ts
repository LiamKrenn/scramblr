import { CLIENT_SECRET } from '$env/static/private';
import type { WCAUser } from '$lib/types';
import { PrismaClient } from '@prisma/client';
import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

// This is a workaround for a bug in Prisma where BigInts are not serialized correctly
declare global {
	interface BigInt {
		toJSON(): string | number;
	}
}

BigInt.prototype.toJSON = function () {
	const int = Number.parseInt(this.toString());
	return int ?? this.toString();
};

// This function is used to check if a user is authenticated
export async function check_auth(cookies: Cookies): Promise<WCAUser | null> {
  const token = cookies.get('token');
  let decoded: WCAUser | null = null;
  if (token) {
    decoded = jwt.verify(token, CLIENT_SECRET) as WCAUser;
  }
  return decoded;
}

export const prisma = new PrismaClient();
