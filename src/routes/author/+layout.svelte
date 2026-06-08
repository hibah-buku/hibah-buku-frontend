<script>
	import '/src/routes/layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AuthorSidebar from '$lib/components/layouts/AuthorSidebar.svelte';
	import AuthorTopbar from '$lib/components/layouts/AuthorTopbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Dashboard Penulis | Hibah Buku</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50">
	<!-- Sidebar Area (Lebar Tetap 72) -->
	<aside class="w-72 shrink-0">
		<AuthorSidebar />
	</aside>

	<!-- Main Content Area -->
	<div class="flex-1 flex flex-col min-w-0">
		<AuthorTopbar />
		<main class="flex-1 p-6 overflow-y-auto bg-gray-50">
			{@render children()}
		</main>
	</div>
</div>
