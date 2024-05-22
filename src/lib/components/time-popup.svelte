<script lang="ts">
	import { mediaQuery } from 'svelte-legos';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button from './ui/button/button.svelte';
	import type { Time } from '$lib/types';
	import { times } from '$lib/scramble';
	import { get } from 'svelte/store';
	import TimePopupContent from './time-popup-content.svelte';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 768px)');

	let time: Time | undefined;

	export function openTimePopup(id: number) {
		time = get(times).find((t) => t[4] === id);
		open = true;
	}

  function deleteTime(id: number) {
    open = false;
    times.update((t) => t.filter((time) => time[4] !== id));
  }
</script>

{#if $isDesktop}
	<Dialog.Root bind:open>
		<Dialog.Trigger asChild let:builder>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px] p-0">
			{#if time != undefined}
				<TimePopupContent {time} {deleteTime} />
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger asChild let:builder class="">
		</Drawer.Trigger>
		<Drawer.Content class="">
			{#if time != undefined}
				<TimePopupContent {time} {deleteTime}/>
			{/if}
		</Drawer.Content>
	</Drawer.Root>
{/if}
