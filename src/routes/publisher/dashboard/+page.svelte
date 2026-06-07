<script>
  import StatCard from '$lib/components/admin/dashboard/StatCard.svelte';
  import QuickManuscriptList from '$lib/components/publisher/dashboard/QuickManuscriptList.svelte';
  
  let { data } = $props();
  
  const summary = $derived(data.summary ?? { pre_print: 0, revised: 0, approved: 0 });
</script>

<svelte:head><title>Dashboard Penerbit</title></svelte:head>

<div class="space-y-6">
  <div class="mb-6 flex justify-between items-center">
    <h2 class="text-lg text-gray-800 font-medium">Ringkasan Penerbit</h2>
  </div>

  {#if data.error}
    <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{data.error}</div>
  {/if}

  <!-- Ringkasan statistik -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard title="Pra-cetak" value={summary.pre_print} icon="heroicons:document-text" color="blue" />
    <StatCard title="Menunggu revisi" value={summary.revised} icon="heroicons:exclamation-circle" color="yellow" />
    <StatCard title="Siap cetak" value={summary.approved} icon="heroicons:check-badge" color="green" />
  </div>

  <!-- Daftar naskah Pra Cetak -->
  <div class="grid grid-cols-1 gap-6">
    <div class="w-full">
      <QuickManuscriptList manuscripts={data.quickManuscripts ?? []} />
    </div>
  </div>
</div>