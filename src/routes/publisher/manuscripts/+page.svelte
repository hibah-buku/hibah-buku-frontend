<script>
  import Icon from '@iconify/svelte';
  import ManuscriptsTable from '$lib/components/publisher/manuscripts/ManuscriptsTable.svelte';

  let { data } = $props();
  const manuscripts = $derived(data.manuscripts ?? []);

  let searchQuery = $state('');
  let statusFilter = $state('all');

  const visibleStatuses = $derived([...new Set(manuscripts.map((manuscript) => String(manuscript.status ?? '').trim().toLowerCase()))]);

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
          class="w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <select
        bind:value={statusFilter}
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Semua Status</option>
        {#each visibleStatuses as statusKey (statusKey)}
          <option value={statusKey}>{statusKey.replace(/_/g, ' ')}</option>
        {/each}
      </select>
    </div>
  </div>

  {#if data.authRequired}
    <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{data.error ?? 'Silakan login terlebih dahulu.'}</div>
  {:else if data.error}
    <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{data.error}</div>
  {/if}

  {#if filteredManuscripts.length === 0 && !data.authRequired && !data.error}
    <div class="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">Tidak ada naskah yang sesuai dengan pencarian.</div>
  {:else if manuscripts.length > 0}
    <ManuscriptsTable manuscripts={filteredManuscripts} meta={{ total: filteredManuscripts.length }} />
  {/if}
</div>
