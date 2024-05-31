<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { session_id, type } from '$lib/scramble';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';
	import type { SessionJson } from '$lib/types';
	import { onMount } from 'svelte';
	import { get_session, get_sessions, sync_times_of_current_session } from '$lib/utils';
	import { get } from 'svelte/store';
	import { Plus, Settings } from 'lucide-svelte';

	let sessions: SessionJson[] = [];

	async function fetch_sessions() {
		sessions = await get_sessions();
	}

	let selected_session: SessionJson;

	session_id.subscribe(async (value) => {
		selected_session = await get_session(value);
    type.set(selected_session.scramble_type);
    sync_times_of_current_session();
	});

	onMount(async () => {
		fetch_sessions();
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder class="">
		<Button
			on:click={fetch_sessions}
			variant="outline"
			builders={[builder]}
			class=" z-20 h-8 select-none px-2 text-base "
			>{#if selected_session == null}
				Loading...
			{:else}
				{selected_session.name}
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="lg:w-40">
    <DropdownMenu.Label>Sessions</DropdownMenu.Label>
		<DropdownMenu.RadioGroup bind:value={$session_id}>
			{#each sessions as session}
				<DropdownMenu.RadioItem value={session._id} class="cursor-pointer select-none ">
					{session.name}
				</DropdownMenu.RadioItem>
			{/each}
      <DropdownMenu.Separator />
      <DropdownMenu.Item>
        <Button variant="ghost" class="p-0 m-0 h-6 font-normal">
          <Plus class="h-4 -ml-1 mr-1"/> Add Session
        </Button>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <Button variant="ghost" class="p-0 m-0 h-6 font-normal">
          <Settings class="h-4 -ml-1 mr-1"/> Manage Session
        </Button>
      </DropdownMenu.Item>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
