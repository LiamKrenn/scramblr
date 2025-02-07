<script lang="ts">
  import type { Time } from "$lib/types";
  import { timeToFormattedString } from "$lib/utils";

  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "./ui/separator/separator.svelte";

  // interface Props {
  //   time: Time;
  //   index: number;
  //   times: Observable<Time[]>;
  //   time_count: number;
  //   ao5?: number;
  //   ao12?: number;
  //   ao100?: number;
  //   openTimePopup: (id: string, i: number) => Promise<void>;
  // }

  let {
    time,
    index,
    times,
    time_count,
    ao5 = 0,
    ao12 = 0,
    ao100 = 0,
    openTimePopup,
  }: Props = $props();
</script>

<div
  class="flex h-[20px] w-full basis-2 items-center justify-start rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
>
  <Separator orientation="vertical" />
  <Button
    class="flex h-[20px] w-12 items-center justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:w-20 2xl:text-lg"
    variant="ghost"
    on:click={async () => {
      await openTimePopup(time.id, index);
    }}>{time_count - index}</Button
  >
  <Separator orientation="vertical" />
  <Button
    class="flex h-[20px] flex-1 grow items-center justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
    variant="ghost"
    on:click={async () => {
      await openTimePopup(time.id, index);
    }}>{timeToFormattedString(time.time, 3)}</Button
  >
  <Separator orientation="vertical" />
  <Button
    class="flex h-[20px] flex-1 grow items-center  justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
    variant="ghost"
    on:click={async () => {
      await openTimePopup(time.id, index);
    }}>{timeToFormattedString(ao5, 3)}</Button
  >
  <Separator orientation="vertical" />
  <Button
    class="flex  h-[20px] flex-1 grow items-center  justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
    variant="ghost"
    on:click={async () => {
      await openTimePopup(time.id, index);
    }}>{timeToFormattedString(ao12, 3)}</Button
  >
  <Separator orientation="vertical" />
  <Button
    class="flex  h-[20px] flex-1 grow items-center  justify-center rounded-none p-0 text-[10px] font-normal duration-150 xs:text-xs 2xl:h-[32px] 2xl:text-lg"
    variant="ghost"
    on:click={async () => {
      await openTimePopup(time.id, index);
    }}>{timeToFormattedString(ao100, 3)}</Button
  >
  <Separator orientation="vertical" />
</div>
