<script>
	import '/src/routes/layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import PublisherSidebar from '$lib/components/layouts/PublisherSidebar.svelte';
	import PublisherTopbar from '$lib/components/layouts/PublisherTopbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Dashboard Penerbit | Hibah Buku</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50">
	<aside class="w-72">
		<PublisherSidebar />
	</aside>

	<div class="flex min-w-0 flex-1 flex-col">
		<PublisherTopbar />
		<main class="flex-1 overflow-y-auto bg-gray-50 p-4">
			{@render children()}
		</main>
	</div>
</div>
