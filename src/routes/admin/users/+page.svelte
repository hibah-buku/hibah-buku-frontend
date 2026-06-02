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

		if (searchQuery.trim()) {
			params.set('search', searchQuery.trim());
		}

		if (roleFilter) {
			params.set('role', roleFilter);
		}

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

		const params = buildParams();
		const query = params.toString();

		goto(query ? `/admin/users?${query}` : '/admin/users', {
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

			if (query.trim()) {
				params.set('search', query.trim());
			}

			if (role) {
				params.set('role', role);
			}

			const next = `${query.trim() || ''}|${role || ''}`;
			const current = `${data?.filters?.search ?? ''}|${data?.filters?.role ?? ''}`;

			if (next === current) return;

			const urlQuery = params.toString();

			goto(urlQuery ? `/admin/users?${urlQuery}` : '/admin/users', {
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

	function clearSearch() {
		searchQuery = '';
	}
</script>

<svelte:head>
	<title>Manajemen User | Hibah Buku AEP</title>
</svelte:head>

<!-- Header Halaman -->
<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
	<div>
		<a
			href="/admin/users/create"
			class="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
		>
			<Icon icon="heroicons:plus" class="h-5 w-5" />
			Tambah User
		</a>

		{#if data?.error}
			<p class="mt-2 text-sm text-red-600">{data.error}</p>
		{/if}
	</div>

	<!-- Filter & Search -->
	<form onsubmit={handleSearch} class="mx-8 flex flex-wrap gap-2">
		<select
			name="role"
			bind:value={roleFilter}
			onchange={navigateToFilters}
			class="rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
		>
			<option value="">Semua Role</option>
			<option value="admin">Admin</option>
			<option value="reviewer">Reviewer</option>
			<option value="penerbit">Penerbit</option>
			<option value="penulis">Penulis</option>
		</select>

		<div class="relative">
			<input
				type="text"
				name="search"
				bind:value={searchQuery}
				placeholder="Cari nama atau email..."
				class="w-64 rounded-lg border-gray-300 py-2 pr-9 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
			/>

			<Icon
				icon="heroicons:magnifying-glass"
				class="absolute top-2.5 left-3 h-5 w-5 text-gray-400"
			/>

			{#if searchQuery}
				<button
					type="button"
					onclick={clearSearch}
					class="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
				>
					<Icon icon="heroicons:x-mark" class="h-4 w-4" />
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
