import { persisted } from 'svelte-persisted-store';
import type { Session, Time } from './types';
import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import Dexie, { liveQuery, type EntityTable } from 'dexie';
import { type } from './scramble';
import { getUUID } from './utils';

export const session_id = persisted<string>('session_id', '');

export const sessions = writable<Session[]>([]);
export const times = writable<Time[]>([]);
export const fetching = writable<boolean>(false);

class UserDataSync {
	last_sync: number = 0;
	db = new Dexie('data') as Dexie & {
		times: EntityTable<Time, 'id'>;
		sessions: EntityTable<Session, 'id'>;
	};

	constructor() {
		this.db.version(6).stores({
			times: 'id,session_id,updated,timestamp',
			sessions: 'id,updated,order'
		});

		this.init();
	}

	async init() {
		if ((await this.db.sessions.count()) == 0) {
			this.db.sessions.add({
				id: getUUID(),
				name: 'Default',
				order: 0,
				scramble_type: '333',
				updated: Date.now(),
				user_id: 0
			});
		}

		sessions.set(await this.getSessions());
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
			archived: time?.archived || false
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

	async getTimesOfSession(session_id: string) {
		return this.db.times.where('session_id').equals(session_id).reverse().sortBy('timestamp');
	}

	async getTime(id: string) {
		return this.db.times.get(id);
	}

	async deleteTime(id: string) {
		return this.db.times.delete(id);
	}

	async getSessions() {
		return this.db.sessions.orderBy('order').toArray();
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
}

export const sync = new UserDataSync();

session_id.subscribe(async (id) => {
	fetching.set(true);
	times.set([]);
  type.set((await sync.getSession(id))?.scramble_type || '333');
	times.set(await sync.getTimesOfSession(id));
	fetching.set(false);
});
