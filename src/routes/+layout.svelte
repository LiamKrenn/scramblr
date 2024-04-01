<script>
	import { new_scramble, type } from '$lib/scramble';
	import '../app.pcss';
</script>

<title>scramblr</title>

<slot />
<h1
	class="absolute left-0 top-0 ml-4 mt-2 flex cursor-pointer select-none flex-col text-3xl md:text-5xl"
>
	<button
		class="font-semibold"
		on:click={() => {
			new_scramble($type);
		}}>scramblr</button
	>

	<a
		class="text-sm opacity-75 md:mt-1 md:text-base"
		href="https://github.com/LiamKrenn"
		target="_blank"
	>
		by
		<span class="underline"> Liam Krenn </span>
	</a>
</h1>
