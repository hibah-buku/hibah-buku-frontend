<script>
	import '/src/routes/layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import AppSidebar from '$lib/components/layouts/AppSidebar.svelte';
	import AppTopbar from '$lib/components/layouts/AppTopbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Dashboard Admin | Hibah Buku</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50">
    <aside>
        <AppSidebar />
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
        <AppTopbar />
        <main class="flex-1 p-4 overflow-y-auto bg-gray-50">
            {@render children()}
        </main>
    </div>
</div>