<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { type } from '$lib/scramble';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';
	import type { SessionJson } from '$lib/types';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { Plus, Settings } from 'lucide-svelte';
	import { user_data, session_id, sync } from '$lib/sync';

	let selected_session: SessionJson;

	async function get_session(id: string): Promise<SessionJson> {
		return new Promise((resolve) => {
			const session = get(user_data).find((s) => s._id === id);
			if (session) {
				resolve(session);
			}
		});
	}

	session_id.subscribe(async (value) => {
		selected_session = await get_session(value);
		type.set(selected_session.scramble_type);
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder class="">
		<Button variant="outline" builders={[builder]} class=" z-20 h-8 select-none px-2 text-base "
			>{#if selected_session == null}
				No Session
			{:else}
				{selected_session.name}
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="lg:w-40">
		<DropdownMenu.Label>Sessions</DropdownMenu.Label>
		<DropdownMenu.RadioGroup bind:value={$session_id}>
			{#each $user_data as session}
				<DropdownMenu.RadioItem value={session._id} class="cursor-pointer select-none ">
					{session.name}
				</DropdownMenu.RadioItem>
			{/each}
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<Button variant="ghost" class="m-0 h-6 p-0 font-normal">
					<Plus class="-ml-1 mr-1 h-4" /> Add Session
				</Button>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Button variant="ghost" class="m-0 h-6 p-0 font-normal">
					<Settings class="-ml-1 mr-1 h-4" /> Manage Session
				</Button>
			</DropdownMenu.Item>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
