<script>
  import Icon from '@iconify/svelte';
  import ManuscriptsTable from '$lib/components/publisher/manuscripts/ManuscriptsTable.svelte';

  let { data } = $props();
  const manuscripts = $derived(data.manuscripts ?? []);

  let searchQuery = $state('');
  let statusFilter = $state('all');

  // Menangkap semua variasi status yang ada dari Backend secara dinamis
  const visibleStatuses = $derived([...new Set(manuscripts.map((manuscript) => String(manuscript.status ?? '').trim().toLowerCase()))]);

  function formatStatusLabel(statusKey) {
    if (!statusKey) return '-';
    
    if (statusKey === 'to_print' || statusKey === 'ready_to_print') return 'Siap Cetak';
    if (statusKey === 'preprint' || statusKey === 'pra_cetak' || statusKey === 'pre_print' || statusKey === 'pre-cetak') return 'Pra-Cetak';
    if (statusKey === 'publisher_revised' || statusKey === 'revised') return 'Revisi';
    
    return statusKey
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Logika pencarian gabungan (Search Bar + Dropdown Filter)
  const filteredManuscripts = $derived(manuscripts.filter((manuscript) => {
    const statusKey = String(manuscript.status ?? '').trim().toLowerCase();
    const matchesStatus = statusFilter === 'all' || statusKey === statusFilter;
    const haystack = `${manuscript.title ?? ''} ${manuscript.author_name ?? ''} ${manuscript.author_email ?? ''} ${statusKey}`.toLowerCase();
    const matchesSearch = haystack.includes(searchQuery.toLowerCase().trim());

    return matchesStatus && matchesSearch;
  }));
</script>

<div class="space-y-6">
  <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h2 class="text-lg font-semibold text-gray-800">Daftar Naskah Pra-cetak</h2>
      <p class="mt-1 text-sm text-gray-500">Kelola naskah dan kirim keputusan review untuk penerbit.</p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="relative">
        <Icon icon="heroicons:magnifying-glass" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari judul, penulis, atau status..."
          class="w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <select
        bind:value={statusFilter}
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
      >
        <option value="all">Semua Status</option>
        {#each visibleStatuses as statusKey (statusKey)}
          <option value={statusKey}>
            {formatStatusLabel(statusKey)}
          </option>
        {/each}
      </select>
    </div>
  </div>

  {#if data.error}
    <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{data.error}</div>
  {/if}

  {#if filteredManuscripts.length === 0 && !data.error}
    <div class="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 bg-white">
      Tidak ada naskah yang sesuai dengan kriteria pencarian.
    </div>
  {:else}
    <ManuscriptsTable manuscripts={filteredManuscripts} meta={{ total: filteredManuscripts.length }} />
  {/if}
</div>