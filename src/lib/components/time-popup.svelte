<script lang="ts">
	import { mediaQuery } from 'svelte-legos';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button from './ui/button/button.svelte';
	import type { Time } from '$lib/types';
	import { get } from 'svelte/store';
	import TimePopupContent from './time-popup-content.svelte';
	import { session_id, sync, times } from '$lib/sync';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 768px)');

	let time: Time | undefined;
	let index: number = 0;

	export async function openTimePopup(id: string, i: number) {
		time = await sync.getTime(id);
		index = i;
		open = true;
	}

	async function deleteTime(id: string) {
		sync.deleteTime(id);
		times.set(await sync.getTimesOfSession($session_id));
		open = false;
	}

	function close() {
		open = false;
	}
</script>

{#if $isDesktop}
	<Dialog.Root bind:open>
		<Dialog.Trigger asChild let:builder></Dialog.Trigger>
		<Dialog.Content class="p-0 sm:max-w-[425px]">
			{#if time != undefined}
				<TimePopupContent {time} {deleteTime} {close} {index} />
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger asChild let:builder class="absolute"></Drawer.Trigger>
		<Drawer.Content class="">
			{#if time != undefined}
				<TimePopupContent {time} {deleteTime} {close} {index} />
			{/if}
		</Drawer.Content>
	</Drawer.Root>
{/if}
