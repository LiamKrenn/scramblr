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
	}

	async sync(hard_sync = false) {
    if (!browser) return;
    console.log("syncing");
    let new_sync_time = Date.now();
    console.log(new_sync_time, this.last_sync);
    
    let new_db_sessions = await (await fetch('/api/sessions/' + this.last_sync)).json();
    let current_local_sessions = await this.db.sessions.where('updated').aboveOrEqual(this.last_sync).toArray();

    for (let server_session of new_db_sessions) {
      let local_session = current_local_sessions.find((session) => session.id == server_session.id);
      if (local_session) {
        if ((local_session.updated || 0) < server_session.updated) {
          await this.db.sessions.put(server_session);
        }
      } else {
        await this.db.sessions.add(server_session);
    }}

    if (!hard_sync) {
      let new_local_sessions = await this.db.sessions.where('updated').aboveOrEqual(this.last_sync).toArray();
      for (let new_session of new_local_sessions) {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(new_session)
        });
      }
    }

    let new_db_times = await (await fetch('/api/times/' + this.last_sync)).json();
    let current_local_times = await this.db.times.where('updated').aboveOrEqual(this.last_sync).toArray();

    console.log(new_db_times, current_local_times);
    

    for (let server_time of new_db_times) {
      let local_time = current_local_times.find((time) => time.id == server_time.id);
      if (local_time) {
        if ((local_time.updated || 0) < server_time.updated) {
          await this.db.times.put(server_time);
        }
      } else {
        await this.db.times.add(server_time);
    }}

    let new_local_times = await this.db.times.where('updated').aboveOrEqual(this.last_sync).toArray();

    if (!hard_sync) {
      for (let new_time of new_local_times) {
        await fetch('/api/times', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(new_time)
        });
      }
    }
    

    if (await this.getTimeCount() != await (await fetch('/api/times/count')).json() || 
        await this.getSessionCount() != await (await fetch('/api/sessions/count')).json()
  ) {
      // offsync
      this.hardSync();
      return
    }

    if (await this.getSessionCount() == 0) {
      // await this.createSession({
      //   name: 'Default',
      //   order: 0,
      //   scramble_type: '333',
      //   id: getUUID()
      // });
      // await this.sync();
      return;
    }

    if (await this.getSession(get(session_id)) == undefined) {
      session_id.set((await this.db.sessions.orderBy('order').first())?.id || '');
    } 

    this.last_sync = new_sync_time;
  }

  async hardSync() {
    console.log("hard syncing");
    
    this.last_sync = 0;
    this.db.times.clear();
    this.db.sessions.clear();
    await this.sync(true);
  }

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
