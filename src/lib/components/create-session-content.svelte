<script lang="ts">
	import type { Session } from "$lib/types";
	import type { Writable } from "svelte/store";
	import Button from "./ui/button/button.svelte";
	import Input from "./ui/input/input.svelte";
	import { session_id, sessions, sync } from "$lib/sync";

  export let session: Session;
  export let open: Writable<boolean>;

  async function createSessionClick() {
    let id = await sync.createSession(session);
    sessions.set(await sync.getSessions());
    session_id.set(id);
    open.set(false);
  }

</script>

<div class="w-full h-full p-4">
<p>Session Name</p>
<Input type="text" class="w-full h-8 mt-4" bind:value={session.name} />
<Button on:click={createSessionClick} variant="default" class="w-full h-8 mt-4">Create Session</Button>
</div>
