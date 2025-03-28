<script lang="ts">
  import { onMount } from "svelte";

  import { incrementFoo, pg } from "./pglite";

  let data: any = [];

  pg.live.query("SELECT * FROM foo ORDER BY id", [], (res) => {
    console.log(res.rows);

    data = res.rows;
  });
</script>

<div
  class="bg-slate-800 text-slate-200 h-full w-full flex items-center justify-center"
>
  {#each data as foo}
    <button
      on:click={() => incrementFoo(foo.id, foo.value)}
      class="bg-slate-700 text-slate-200 p-4 m-4 rounded-lg"
    >
      {foo.name}
      {foo.value}
    </button>
  {/each}
</div>
