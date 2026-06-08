<script>
    import ContractsTable from '$lib/components/admin/contracts/ContractsTable.svelte';
    import Icon from '@iconify/svelte';
    import { goto } from '$app/navigation';

    let { data } = $props();

    const contracts = $derived(data?.contracts ?? []);
    const meta = $derived(data?.meta ?? {});

    let searchQuery = $state('');
    let statusFilter = $state('');

    // Sinkronisasi State dari URL saat load/navigasi
    $effect(() => {
        searchQuery = data?.filters?.search ?? '';
        statusFilter = data?.filters?.status ?? '';
    });

    // Fungsi navigasi dengan debounce
    function navigateToFilters() {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('search', searchQuery.trim());
        if (statusFilter) params.set('status', statusFilter);

        const currentSearch = data?.filters?.search ?? '';
        const currentStatus = data?.filters?.status ?? '';

        // Mencegah navigasi ulang jika parameter sama
        if (searchQuery.trim() === currentSearch && statusFilter === currentStatus) return;

        goto(`/admin/contracts?${params.toString()}`, {
            replaceState: true,
            keepFocus: true,
            noScroll: true
        });
    }

    // Live Search dengan Debounce (500ms)
    $effect(() => {
        const q = searchQuery;
        const s = statusFilter;

        const timer = setTimeout(() => {
            const currentSearch = data?.filters?.search ?? '';
            const currentStatus = data?.filters?.status ?? '';

            if (q.trim() !== currentSearch || s !== currentStatus) {
                const params = new URLSearchParams();
                if (q.trim()) params.set('search', q.trim());
                if (s) params.set('status', s);

                goto(`/admin/contracts?${params.toString()}`, {
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
    <title>Manajemen Kontrak | Hibah Buku AEP</title>
</svelte:head>

<!-- Header Halaman -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
        <h1 class="text-2xl font-bold text-gray-800">Manajemen Kontrak</h1>
        <p class="text-gray-600">Validasi dan pantau progres kontrak hibah buku.</p>
        {#if data?.error}
            <p class="mt-2 text-sm text-red-600">{data.error}</p>
        {/if}
    </div>

    <!-- Filter & Search -->
    <form onsubmit={handleManualSearch} class="flex flex-wrap gap-2">
        
        <!-- Filter Status Kontrak -->
        <select
            name="status"
            bind:value={statusFilter}
            onchange={navigateToFilters}
            class="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="">Semua Status</option>
            <option value="contract_uploaded">Menunggu Validasi</option>
            <option value="contract_validated">Tervalidasi</option>
            <option value="contract_rejected">Ditolak</option>
        </select>

        <!-- Input Search -->
        <div class="relative">
            <input
                type="text"
                name="search"
                bind:value={searchQuery}
                placeholder="Cari nomor kontrak, judul, atau penulis..."
                class="pl-10 pr-10 py-2 rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 w-72"
            />
            <Icon icon="heroicons:magnifying-glass" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            
            {#if searchQuery}
                <button 
                    type="button"
                    onclick={() => { searchQuery = ''; }} 
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

<ContractsTable {contracts} {meta} />