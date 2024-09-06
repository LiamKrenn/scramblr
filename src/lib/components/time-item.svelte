<script lang="ts">
	import type { Time } from '$lib/types';
	import { timeToFormattedString } from '$lib/utils';

	import Button from '$lib/components/ui/button/button.svelte';
	import type { Observable } from 'dexie';
	import Separator from './ui/separator/separator.svelte';
	import type { StoredAttempt } from 'timer-db';
	export let time: StoredAttempt;
	export let index: number;
	export let times: StoredAttempt[];

	export let openTimePopup: (id: string, i: number) => Promise<void>;

  console.log(time);
  
</script>

<div
	class="flex h-[20px] w-full basis-2 items-center justify-start rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
>
	<Separator orientation="vertical" />
	<Button
		class="flex h-[20px] w-12 items-center justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:w-20 2xl:text-lg"
		variant="ghost"
		on:click={async () => {
			await openTimePopup(time._id, index);
		}}>{index}</Button
	>
	<Separator orientation="vertical" />
	<Button
		class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
		variant="ghost"
		on:click={async () => {
			await openTimePopup(time._id, index);
		}}>{timeToFormattedString(time.resultTotalMs || 0, 3)}</Button
	>
	<Separator orientation="vertical" />
	<Button
		class="flex h-[20px] flex-1 grow items-center  justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
		variant="ghost"
		on:click={async () => {
			await openTimePopup(time._id , index);
		}}>{timeToFormattedString(time.resultTotalMs || 0, 3)}</Button
	>
	<Separator orientation="vertical" />
	<Button
		class="flex  h-[20px] flex-1 grow items-center  justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
		variant="ghost"
		on:click={async () => {
			await openTimePopup(time._id, index);
		}}>{timeToFormattedString(time.resultTotalMs || 0, 3)}</Button
	>
	<Separator orientation="vertical" />
	<Button
		class="flex  h-[20px] flex-1 grow items-center  justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
		variant="ghost"
		on:click={async () => {
			await openTimePopup(time._id, index);
		}}>{timeToFormattedString(time.resultTotalMs || 0, 3)}</Button
	>
	<Separator orientation="vertical" />
</div>

<!-- </Button> -->
