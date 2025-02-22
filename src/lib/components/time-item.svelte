<script lang="ts">
  import { timeToFormattedString } from "$lib/utils";

  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "./ui/separator/separator.svelte";
  import type { Time } from "../../../triplit/schema";

  interface Props {
    time: Time;
    index: number;
    time_count: number;
    ao5?: number;
    ao12?: number;
    ao100?: number;
    openTimePopup: (id: Time, i: number) => Promise<void>;
  }

  let {
    time,
    index,
    time_count,
    ao5 = 0,
    ao12 = 0,
    ao100 = 0,
    openTimePopup,
  }: Props = $props();
</script>

<div
  class="flex w-full basis-2 items-center justify-start rounded-none p-0 font-normal duration-150 xs:text-sm h-[32px] 2xl:text-lg"
>
  <Separator orientation="vertical" />
  <Button
    class="time-button !w-12 2xl:!w-20 "
    variant="ghost"
    onclick={async () => {
      await openTimePopup(time, index);
    }}>{time_count - index}</Button
  >
  <Separator orientation="vertical" />
  <Button
    class="time-button flex-1 grow"
    variant="ghost"
    onclick={async () => {
      await openTimePopup(time, index);
    }}>{timeToFormattedString(time.time, 3)}</Button
  >
  <Separator orientation="vertical" />
  <Button
    class="time-button flex-1 grow"
    variant="ghost"
    onclick={async () => {
      await openTimePopup(time, index);
    }}>{timeToFormattedString(ao5, 3)}</Button
  >
  <Separator orientation="vertical" />
  <Button
    class="time-button flex-1 grow"
    variant="ghost"
    onclick={async () => {
      await openTimePopup(time, index);
    }}>{timeToFormattedString(ao12, 3)}</Button
  >
  <Separator orientation="vertical" />
  <Button
    class="time-button flex-1 grow"
    variant="ghost"
    onclick={async () => {
      await openTimePopup(time, index);
    }}>{timeToFormattedString(ao100, 3)}</Button
  >
  <Separator orientation="vertical" />
</div>

<style>
  :global(.time-button) {
    @apply flex   items-center  justify-center rounded-none p-0 text-xs font-normal duration-150 xs:text-sm h-[32px] 2xl:text-lg;
  }
</style>
