<script lang="ts">
	import type { Session } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import { type } from '$lib/scramble';
	import { session_id, sessions, sync } from '$lib/sync';

	export let session: Session;
	export let open: Writable<boolean>;

	async function createSessionClick() {
		session.scramble_type = $type;
		session.order = (await sync.getSessionCount()) + 1;
		let id = await sync.createSession(session);
		sessions.set(await sync.getSessions());
		session_id.set(id);
		open.set(false);
	}
</script>

<div class="h-full w-full p-4">
	<p>Session Name</p>
	<Input type="text" class="mt-4 h-8 w-full" bind:value={session.name} />
	<Button on:click={createSessionClick} variant="default" class="mt-4 h-8 w-full"
		>Create Session</Button
	>
</div>
