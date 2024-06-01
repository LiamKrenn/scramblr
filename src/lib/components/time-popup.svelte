<script lang="ts">
	import { mediaQuery } from 'svelte-legos';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button from './ui/button/button.svelte';
	import type { TimeJson } from '$lib/types';
	import { get } from 'svelte/store';
	import TimePopupContent from './time-popup-content.svelte';
	import { sync } from '$lib/sync';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 768px)');

	let time: TimeJson | undefined;

	export async function openTimePopup(id: string) {
		time = await sync.get_time(id);
		open = true;
	}

	async function deleteTime(id: string) {
		sync.delete_time(id);
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
				<TimePopupContent {time} {deleteTime} {close} />
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger asChild let:builder class="absolute"></Drawer.Trigger>
		<Drawer.Content class="">
			{#if time != undefined}
				<TimePopupContent {time} {deleteTime} {close} />
			{/if}
		</Drawer.Content>
	</Drawer.Root>
{/if}
