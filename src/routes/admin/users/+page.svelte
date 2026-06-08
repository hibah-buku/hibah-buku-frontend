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
	let includeDeleted = $state(false);

	$effect(() => {
		searchQuery = data?.filters?.search ?? '';
		roleFilter = data?.filters?.role ?? '';
		includeDeleted = data?.filters?.includeDeleted === '1';
	});

	function buildParams() {
		const params = new SvelteURLSearchParams();

		if (searchQuery.trim()) {
			params.set('search', searchQuery.trim());
		}

		if (roleFilter) {
			params.set('role', roleFilter);
		}

		if (includeDeleted) {
			params.set('include_deleted', '1');
		}

		return params;
	}

	function filtersMatchUrl() {
		return (
			(searchQuery.trim() || '') === (data?.filters?.search ?? '') &&
			(roleFilter || '') === (data?.filters?.role ?? '') &&
			(includeDeleted ? '1' : '') === (data?.filters?.includeDeleted ?? '')
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
		const deleted = includeDeleted;

		const timer = setTimeout(() => {
			const params = new SvelteURLSearchParams();

			if (query.trim()) {
				params.set('search', query.trim());
			}

			if (role) {
				params.set('role', role);
			}

			if (deleted) {
				params.set('include_deleted', '1');
			}

			const next = `${query.trim() || ''}|${role || ''}|${deleted ? '1' : ''}`;
			const current = `${data?.filters?.search ?? ''}|${data?.filters?.role ?? ''}|${data?.filters?.includeDeleted ?? ''}`;

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
<div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
	<div>
		<a
			href="/admin/users/create"
			class="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
		>
			<Icon icon="heroicons:plus" class="w-5 h-5" />
			Tambah User
		</a>

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
			<option value="reviewer">Reviewer</option>
			<option value="penerbit">Penerbit</option>
		</select>

		<label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600">
			<input
				type="checkbox"
				bind:checked={includeDeleted}
				onchange={navigateToFilters}
				class="rounded border-gray-300 text-blue-700 focus:ring-blue-500"
			/>
			<span>Tampilkan user inactive</span>
		</label>

		<div class="relative">
			<input
				type="text"
				name="search"
				bind:value={searchQuery}
				placeholder="Cari nama atau email..."
				class="pl-10 pr-9 py-2 rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 w-64"
			/>

			<Icon
				icon="heroicons:magnifying-glass"
				class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
			/>

			{#if searchQuery}
				<button
					type="button"
					onclick={clearSearch}
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