<script>
	import WillingnessFormsTable from '$lib/components/admin/willingness-forms/WillingnessFormsTable.svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data } = $props();

	const forms = $derived(data.forms ?? []);
	const meta = $derived(data?.meta ?? {});

    console.log(forms);

	let searchQuery = $state('');
	let statusFilter = $state('');

	$effect(() => {
		searchQuery = data?.filters?.search ?? '';
		statusFilter = data?.filters?.status ?? '';
	});

	function navigateToFilters() {
		const params = new SvelteURLSearchParams();
		if (searchQuery.trim()) params.set('search', searchQuery.trim());
		if (statusFilter) params.set('status', statusFilter);

		const currentSearch = data?.filters?.search ?? '';
		const currentStatus = data?.filters?.status ?? '';

		if (searchQuery.trim() === currentSearch && statusFilter === currentStatus) return;

		goto(`/admin/willingness-form?${params.toString()}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}

	$effect(() => {
		const q = searchQuery;
		const s = statusFilter;

		const timer = setTimeout(() => {
			const currentSearch = data?.filters?.search ?? '';
			const currentStatus = data?.filters?.status ?? '';

			if (q.trim() !== currentSearch || s !== currentStatus) {
				const params = new SvelteURLSearchParams();
				if (q.trim()) params.set('search', q.trim());
				if (s) params.set('status', s);

				goto(`/admin/willingness-form?${params.toString()}`, {
					replaceState: true,
					keepFocus: true,
					noScroll: true
				});
			}
		}, 500);

		return () => clearTimeout(timer);
	});

	function handleManualSearch(e) {
		e.preventDefault();
		navigateToFilters();
	}
</script>

<svelte:head>
	<title>Formulir Kesediaan | Hibah Buku AEP</title>
</svelte:head>

<!-- Header Halaman -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
	<div>
		{#if data?.error}
			<p class="mt-2 text-sm text-red-600">{data.error}</p>
		{/if}
	</div>

	<!-- Filter & Search -->
	<form onsubmit={handleManualSearch} class="flex flex-wrap gap-2 mx-8">
		<select
			name="status"
			bind:value={statusFilter}
			onchange={navigateToFilters}
			class="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
		>
			<option value="">Semua Status</option>
			<option value="pending">Menunggu Validasi</option>
			<option value="approved">Disetujui</option>
			<option value="rejected">Ditolak</option>
		</select>

		<div class="relative">
			<input
				type="text"
				name="search"
				bind:value={searchQuery}
				placeholder="Cari judul buku atau penulis..."
				class="pl-10 pr-10 py-2 rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 w-64"
			/>
			<Icon icon="heroicons:magnifying-glass" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

			{#if searchQuery}
				<button
					type="button"
					onclick={() => {
						searchQuery = '';
					}}
					class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
				>
					<Icon icon="heroicons:x-mark" class="w-4 h-4" />
				</button>
			{/if}
		</div>

		<button
			type="submit"
			class="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 cursor-pointer"
		>
			Cari
		</button>
	</form>
</div>

<WillingnessFormsTable {forms} {meta} />
