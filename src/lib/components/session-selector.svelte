<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { Plus, Settings } from 'lucide-svelte';
	import { session_id, sessions, sync } from '$lib/sync';
	import ScrollArea from './ui/scroll-area/scroll-area.svelte';
	import CreateSession from './create-session.svelte';
	import type { Session } from '$lib/types';

	let create_session: CreateSession;
	let display_name: string = 'Select Session';
	let open: boolean;

	async function setToSession(id: string) {
		let res: Session | undefined = await sync.getSession(id);
		if (res) {
			session_id.set(id);
			display_name = res.name;
		} else {
			let first_session = $sessions[0];
			session_id.set(first_session.id);
			display_name = first_session.name;
		}
	}

	session_id.subscribe(async (value) => {
		await setToSession(value);
	});

	onMount(async () => {
		setToSession($session_id);
	});
</script>

<CreateSession bind:this={create_session} />

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="outline"
			builders={[builder]}
			class=" z-20 h-6 max-w-32 flex-shrink select-none p-1 text-sm focus:border-slate-50 sm:max-w-52 sm:px-2 2xl:h-8 2xl:text-base"
		>
			<div class="max-w-full overflow-hidden overflow-ellipsis font-normal">
				{display_name}
			</div>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-52">
		<DropdownMenu.Label>Sessions</DropdownMenu.Label>
		<DropdownMenu.RadioGroup bind:value={$session_id}>
			<ScrollArea class="cscroll max-h-[40svh] !overflow-y-auto">
				{#each $sessions as session}
					<DropdownMenu.RadioItem
						on:click={() => {
							open = !open;
						}}
						value={session.id.toString()}
						class="mr-1 w-48 cursor-pointer select-none"
					>
						<p class="overflow-hidden overflow-ellipsis">
							{session.name}
						</p>
					</DropdownMenu.RadioItem>
				{/each}
			</ScrollArea>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<Button
					on:click={create_session.openCreateDialog}
					variant="ghost"
					class="m-0 h-6 p-0 font-normal"
				>
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
