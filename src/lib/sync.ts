import { persisted } from 'svelte-persisted-store';
import type { SessionJson, TimeJson } from './types';
import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';

export const session_id = persisted<string>('session_id', '');

export const user_data = persisted<SessionJson[]>('data', [
	{
		_id: '',
		user_id: '',
		name: 'Default',
		order: 0,
		scramble_type: '333',
		times: []
	}
]);

export const times = writable<TimeJson[]>([]);
export const fetching = writable<boolean>(false);

class UserDataSync {
	last_sync: number = 0;

	constructor() {
		this.sync_all();
	}

	async sync_all() {
		if (!browser) return;
    fetching.set(true);
		let sessions = await get_sessions();
		let session_times: SessionJson[] = [];

		for (let session of sessions) {
			let times = await get_times_of_session(session._id);
			session.times = times;
			session_times.push(session);
		}

		if (session_times.length > 0 && get(session_id) == '') {
			session_id.set(session_times[0]._id);
		}

		user_data.set(session_times);
		this.last_sync = Date.now();
    fetching.set(false);
	}

  async sync_times() {
    times.set(get(user_data).find((s) => s._id == get(session_id))?.times ?? []);
  }

	async get_sessions() {
		return await get_sessions();
	}

  async get_time(time_id: string) {
    let time: TimeJson | undefined = undefined;
    for (let session of get(user_data)) {
      time = session.times.find((t) => t._id == time_id);
      if (time) return time;
    }
    time = await get_time(time_id);
    return time;
  }

  async get_session_times(session_id: string) {
    return await get_times_of_session(session_id);
  }

  async post_time(time: TimeJson) {
    fetching.set(true);
    times.set([time, ...get(times)]);
    await post_time(time);
    await this.sync_all()
    await this.sync_times();
    fetching.set(false);  
  }

  async delete_time(time_id: string) {
    fetching.set(true);
    times.set(get(times).filter((t) => t._id != time_id));
    await delete_time(time_id);
    await this.sync_all();
    await this.sync_times();
    fetching.set(false);
  }
}

export const sync = new UserDataSync();

session_id.subscribe(async () => {
  sync.sync_all();
  sync.sync_times();
})

user_data.subscribe(async () => {
  sync.sync_times();
})

async function post_time(time: TimeJson) {
	await fetch('/api/times', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(time)
	});
}

async function delete_time(time_id: string) {
	await fetch(`/api/times/${time_id}`, { method: 'DELETE' });
}

async function get_time(time_id: string): Promise<TimeJson> {
  let response = await fetch(`/api/times/${time_id}`, { method: 'GET' });
  return await response.json();
}

async function get_times_of_session(session_id: string): Promise<TimeJson[]> {
	let response = await fetch(`/api/sessions/${session_id}/times`, { method: 'GET' });
	return await response.json();
}

async function get_sessions(): Promise<SessionJson[]> {
	let response = await fetch('/api/sessions', { method: 'GET' });
	return await response.json();
}

async function get_session(session_id: string): Promise<SessionJson> {
	let response = await fetch(`/api/sessions/${session_id}`, { method: 'GET' });
	return await response.json();
}
