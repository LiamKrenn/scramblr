<script lang="ts">
  import type { Writable } from "svelte/store";
  import Button from "./ui/button/button.svelte";
  import Input from "./ui/input/input.svelte";
  import { currentSession, user } from "$lib/stores";
  import { createSession } from "$lib/db";

  interface Props {
    open: Writable<boolean>;
  }

  let { open }: Props = $props();

  let name = "";

  async function createSessionClick() {
    // let res = await triplit.insert("sessions", {
    //   name: name,
    //   scramble_type: "333",
    //   order: 2,
    //   user_id: $user?.id || -1,
    // });

    let res = await createSession(name);
    console.log(res);

    $currentSession = res.id;

    // if (res.output) {
    //   $currentSession = res.output.id;
    // }
    // open.set(false);
    // session.order = (await sync.getSessionCount()) + 1;
    // let id = await sync.createSession(session);
    // sessions.set(await sync.getSessions());
    // session_id.set(id);
    open.set(false);
  }
</script>

<div class="h-full w-full p-4">
  <p>Session Name</p>
  <Input type="text" class="mt-4 h-8 w-full" bind:value={name} />
  <Button onclick={createSessionClick} variant="default" class="mt-4 h-8 w-full"
    >Create Session</Button
  >
</div>
