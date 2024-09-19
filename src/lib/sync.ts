import { persisted } from 'svelte-persisted-store';
import type { Session, Time } from './types';
import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import Dexie, { liveQuery, type EntityTable, type Observable } from 'dexie';
import { type } from './scramble';
import { getUUID } from './utils';

export const session_id = persisted<string>('session_id', '');

export const fetching = writable<boolean>(false);

class UserDataSync {
	last_sync: number = 0;
	db = new Dexie('data') as Dexie & {
		times: EntityTable<Time, 'id'>;
		sessions: EntityTable<Session, 'id'>;
	};

	constructor() {
		this.db.version(9).stores({
			times: 'id,session_id,updated,timestamp',
			sessions: 'id,updated,order'
		});

		this.init();
	}

	async init() {
		const db_sessions: Session[] = await (await fetch('/api/sessions')).json();

		db_sessions.forEach((session) => {
			this.db.sessions.add(session, session.id);
		});
	}

	async sync() {}

	async getNewTimes() {
		return this.db.times.where('updated').aboveOrEqual(this.last_sync).toArray();
	}

	async createTime(time: Time): Promise<string> {
		let new_time: Time = {
			id: getUUID(),
			session_id: time.session_id,
			time: time.time,
			penalty: time.penalty,
			scramble: time.scramble,
			comment: time.comment,
			timestamp: time.timestamp,
			updated: Date.now() - 1,
			archived: time?.archived
		};

		return this.db.times.add(new_time);
	}

	async createSession(session: Session): Promise<string> {
		let new_session: Session = {
			id: getUUID(),
			name: session.name,
			order: session.order,
			scramble_type: session.scramble_type,
			updated: Date.now() - 1
		};

		return this.db.sessions.add(new_session);
	}

	async getTime(id: string) {
		return this.db.times.get(id);
	}

	async deleteTime(id: string) {
		return this.db.times.delete(id);
	}

	async getSession(id: string) {
		return this.db.sessions.get(id);
	}

	async deleteAllTimes() {
		return this.db.times.clear();
	}

	async deleteAllSessions() {
		return this.db.sessions.clear();
	}

	async getSessionCount() {
		return this.db.sessions.count();
	}

	async getTimeCountOfSession(session_id: string) {
		return this.db.times.where('session_id').equals(session_id).count();
	}

	async getTimeCount() {
		return this.db.times.count();
	}

	async setSessionDefaultType(session_id: string, type: string) {
		let session = await this.getSession(session_id);
		if (!session) return;
		session.scramble_type = type;
		session.updated = Date.now();
		await this.db.sessions.put(session);
	}
}

export const sync = new UserDataSync();

export let sessions = liveQuery(() => {
	return sync.db.sessions.orderBy('order').toArray();
});

session_id.subscribe(async (id) => {
	type.set((await sync.getSession(id))?.scramble_type || '333');
});

type.subscribe(async (value) => {
	sync.setSessionDefaultType(get(session_id), value);
});
