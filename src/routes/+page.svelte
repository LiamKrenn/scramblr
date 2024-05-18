<script lang="ts">
	import { onMount } from 'svelte';
	import ScrambleSelector from '$lib/components/scramble-selector.svelte';
	import { new_scramble, scramble, type } from '$lib/scramble';
	import { getSelectedText } from '$lib/utils';
	import ScramblePreview from '$lib/components/scramble-preview.svelte';

	onMount(async () => {
		await click();
	});

	async function click() {
		await new_scramble($type);
    resize_to_fit();
	}

	async function textClick() {
		if (getSelectedText() == '') {
			click();
		}
	}

  async function onKeyDown(e: KeyboardEvent) {
    if (e.keyCode == 32) {
      await click()
    }
  }

  function resize_to_fit(first = true) {

    let output = document.getElementById('scramble');
    let outputContainer = document.getElementById('scrambleContainer');
    if (output == null || outputContainer == null) return;
    if (first) {
      setTimeout(resize_to_fit, 100);
      output.style.fontSize = "3rem";
      output.style.lineHeight = '150%';
    }
    let fontSize = window.getComputedStyle(output).fontSize;
    if(output.clientHeight >= outputContainer.clientHeight){
      output.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
      resize_to_fit(false);
    } else {
    }
}

</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<div class="relative flex h-full w-full items-center justify-center">
	<ScrambleSelector />
	<ScramblePreview />
	<button
		on:click={click}
		class="absolute flex h-full w-full cursor-pointer flex-col items-center justify-center"
	/>
	<button
    id="scrambleContainer"
		on:click={textClick}
		class="absolute mx-[8%] select-text max-h-[40%] h-[40%]  text-balance text-center !leading-[125%] text-5xl"
	>
		<p class="w-full px-4 cursor-text " id="scramble">
			{$scramble}
		</p>
	</button>
</div>
