<script lang="ts">
	import type { SessionJson } from "$lib/types";
	import type { Writable } from "svelte/store";
	import Button from "./ui/button/button.svelte";
	import Input from "./ui/input/input.svelte";
	import { sync } from "$lib/sync";

  export let session: SessionJson;
  export let open: Writable<boolean>;

  function createSession() {
    sync.post_session(session);
    open.set(false);
  }

</script>

<div class="w-full h-full p-4">
<p>Session Name</p>
<Input type="text" class="w-full h-8 mt-4" bind:value={session.name} />
<Button on:click={createSession} variant="default" class="w-full h-8 mt-4">Create Session</Button>
</div>
