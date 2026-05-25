<script>
	import UsersTable from '$lib/components/admin/users/UsersTable.svelte';
	import Icon from '@iconify/svelte';
    import { goto } from '$app/navigation';
    import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data } = $props();

	const users = $derived(data?.users ?? []);
	const meta = $derived(data?.meta ?? {});

	let searchQuery = $state('');
	let roleFilter = $state('');

	$effect(() => {
		searchQuery = data?.filters?.search ?? '';
		roleFilter = data?.filters?.role ?? '';
	});

	function buildParams() {
		const params = new SvelteURLSearchParams();
		if (searchQuery.trim()) params.set('search', searchQuery.trim());
		if (roleFilter) params.set('role', roleFilter);
		return params;
	}

	function filtersMatchUrl() {
		return (
			(searchQuery.trim() || '') === (data?.filters?.search ?? '') &&
			(roleFilter || '') === (data?.filters?.role ?? '')
		);
	}

	function navigateToFilters() {
		if (filtersMatchUrl()) return;
		goto(`/admin/users?${buildParams().toString()}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}

	$effect(() => {
		const query = searchQuery;
		const role = roleFilter;

		const timer = setTimeout(() => {

			const params = new SvelteURLSearchParams();
			if (query.trim()) params.set('search', query.trim());
			if (role) params.set('role', role);

			const next =
				(query.trim() || '') + '|' + (role || '');
			const current =
				(data?.filters?.search ?? '') + '|' + (data?.filters?.role ?? '');
			if (next === current) return;

			goto(`/admin/users?${params.toString()}`, {
				replaceState: true,
				keepFocus: true,
				noScroll: true
			});
		}, 500);

		return () => clearTimeout(timer);
	});

	function handleSearch(e) {
		e.preventDefault();
		navigateToFilters();
	}
</script>

<svelte:head>
	<title>Manajemen User | Hibah Buku AEP</title>
</svelte:head>

<!-- Header Halaman -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
	<div>
		{#if data?.error}
			<p class="mt-2 text-sm text-red-600">{data.error}</p>
		{/if}
	</div>

	<!-- Filter & Search -->
	<form onsubmit={handleSearch} class="flex flex-wrap gap-2 mx-8">
		<select
			name="role"
			bind:value={roleFilter}
			onchange={navigateToFilters}
			class="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
		>
			<option value="">Semua Role</option>
			<option value="admin">Admin</option>
			<option value="penulis">Penulis</option>
			<option value="reviewer">Reviewer</option>
			<option value="penerbit">Penerbit</option>
		</select>

		<div class="relative">
			<input
				type="text"
				name="search"
				bind:value={searchQuery}
				placeholder="Cari nama atau email..."
				class="pl-10 pr-4 py-2 rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 w-64"
			/>
			<Icon icon="heroicons:magnifying-glass" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            
            <!-- Tombol Clear X kecil -->
            {#if searchQuery}
                <button 
                    type="button"
                    onclick={() => {
						searchQuery = '';
					}}
                    class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                    <Icon icon="heroicons:x-mark" class="w-4 h-4" />
                </button>
            {/if}
		</div>

		<button
			type="submit"
			class="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
		>
			Cari
		</button>
	</form>
</div>

<UsersTable {users} {meta} />
