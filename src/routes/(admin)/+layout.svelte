<script>
	import '/src/routes/layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} />Dashboard</svelte:head>
{@render children()}