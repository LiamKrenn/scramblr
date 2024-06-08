<script lang="ts">
	import { mediaQuery } from 'svelte-legos';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import type { Session } from '$lib/types';
	import { writable } from 'svelte/store';
	import CreateSessionContent from './create-session-content.svelte';
	import { disable_key_tracking } from '$lib/utils';
	import { type } from '$lib/scramble';

	let open = writable(false);
	const isDesktop = mediaQuery('(min-width: 768px)');

  export function openCreateDialog() {
    disable_key_tracking.set(true);
    open.set(true);
  }

  open.subscribe((value) => {
    if (!value) {
      disable_key_tracking.set(false);
    }
  });

	let session: Session = {
    id: "",
    name: '',
    scramble_type: "333",
    order: 0
  };
</script>

{#if $isDesktop}
	<Dialog.Root bind:open={$open}>
		<Dialog.Trigger asChild let:builder></Dialog.Trigger>
		<Dialog.Content class="p-0 sm:max-w-[425px]">
			<CreateSessionContent {session} {open} />
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open={$open}>
		<Drawer.Trigger asChild let:builder class=""></Drawer.Trigger>
		<Drawer.Content class="">
			<CreateSessionContent {session} {open} />
		</Drawer.Content>
	</Drawer.Root>
{/if}
