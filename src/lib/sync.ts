import { persisted } from 'svelte-persisted-store';
import type { Session, Time } from './types';
import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import Dexie, { liveQuery, type EntityTable, type Observable } from 'dexie';
import { type } from './scramble';
import { getUUID } from './utils';
import { ldb } from './rxdb';

export const session_id = persisted<string>('session_id', '');

export const fetching = writable<boolean>(false);

export let sessions = ldb.sessions.find({ sort: [{ order: 'asc' }] }).$;

export async function getSession(id: string): Promise<Session> {
	return ldb.sessions.findOne(id).exec();
}

session_id.subscribe(async (id) => {
	type.set((await getSession(id))?.scramble_type || '333');
});

// TODO:
// type.subscribe(async (value) => {
// 	sync.setSessionDefaultType(get(session_id), value);
// });
