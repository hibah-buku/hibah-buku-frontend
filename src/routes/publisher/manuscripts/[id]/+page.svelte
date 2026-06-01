<script>
  let { data, form } = $props();
  
  // --- Helper Functions ---
  function normalizeStatusKey(value) {
    return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '_');
  }

  function statusMeta(value) {
    const statusKey = normalizeStatusKey(value);
    if (statusKey === 'to_print') return { label: 'Siap cetak', className: 'bg-emerald-100 text-emerald-700' };
    if (statusKey === 'publisher_revised' || statusKey === 'revised') return { label: 'Revisi', className: 'bg-amber-100 text-amber-700' };
    if (statusKey === 'preprint' || statusKey === 'pra_cetak' || statusKey === 'pre_print' || statusKey === 'pre-cetak') return { label: 'Pra-cetak', className: 'bg-blue-100 text-blue-700' };
    return { label: statusKey.replace(/_/g, ' ') || 'Tidak diketahui', className: 'bg-gray-100 text-gray-700' };
  }

  const toBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;
  // ------------------------

  const manuscript = $derived(data.selectedManuscript);
  const detailStatus = $derived(manuscript ? statusMeta(manuscript.status) : null);
  const downloadLinks = $derived(manuscript?.links ?? manuscript?.download_links ?? {});
  
  let checklistForm = $state({
    cover_design_ok: false,
    page_count_ok: false,
    admin_docs_ok: false,
    check_notes: ''
  });

  let decisionChoice = $state('approved');
  let decisionNotes = $state('');
  let decisionSubmitting = $state(false);

  $effect(() => {
    if (!manuscript) {
      checklistForm = {
        cover_design_ok: false,
        page_count_ok: false,
        admin_docs_ok: false,
        check_notes: ''
      };
      decisionNotes = '';
      return;
    }

    checklistForm = {
      cover_design_ok: toBoolean(manuscript?.checklist?.cover_design_ok ?? manuscript?.cover_design_ok),
      page_count_ok: toBoolean(manuscript?.checklist?.page_count_ok ?? manuscript?.page_count_ok),
      admin_docs_ok: toBoolean(manuscript?.checklist?.admin_docs_ok ?? manuscript?.admin_docs_ok),
      check_notes: manuscript?.checklist?.check_notes ?? manuscript?.check_notes ?? ''
    };
    decisionNotes = manuscript?.revision_notes ?? '';
  });
</script>

<div class="space-y-6 max-w-4xl mx-auto">
  <div class="flex items-center gap-4">
    <a href="/publisher/manuscripts" class="text-gray-500 hover:text-gray-900">&larr; Kembali</a>
    <h2 class="text-lg font-semibold text-gray-800">Review Naskah</h2>
  </div>

  {#if form?.message}
    <div class={`rounded-lg px-4 py-3 text-sm ${form.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
      {form.message}
    </div>
  {/if}

  {#if data.error}
    <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{data.error}</div>
  {/if}

  {#if manuscript}
    <div class="bg-white rounded-xl shadow-sm border p-6 space-y-6">
      <!-- Info Header -->
      <div class="rounded-xl bg-gray-50 p-4 flex justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">{manuscript.title}</h3>
          <p class="text-sm text-gray-600">Penulis: {manuscript.author_name}</p>
        </div>
        <span class={`rounded-full h-fit px-2.5 py-1 text-xs font-semibold ${detailStatus?.className}`}>
          {detailStatus?.label}
        </span>
      </div>

      <!-- Links Unduhan -->
      <div>
        <h3 class="text-sm font-semibold mb-3">Unduhan Dokumen</h3>
        <ul class="space-y-2">
          {#each Object.entries(downloadLinks) as [label, href] (label)}
            <li class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <span class="text-sm font-medium">{label}</span>
              {#if href} <a class="text-xs bg-blue-600 text-white px-3 py-1 rounded" href={href} target="_blank">Unduh</a> {/if}
            </li>
          {/each}
        </ul>
      </div>

      <!-- Form Keputusan -->
      <form method="POST" onsubmit={() => (decisionSubmitting = true)} class="border-t pt-6">
        <h3 class="text-sm font-semibold mb-4">Checklist & Keputusan</h3>
        
        <div class="space-y-3 mb-6">
          <label class="flex items-center gap-3"><input type="checkbox" name="cover_design_ok" bind:checked={checklistForm.cover_design_ok} /> Desain sampul sesuai</label>
          <label class="flex items-center gap-3"><input type="checkbox" name="page_count_ok" bind:checked={checklistForm.page_count_ok} /> Jumlah halaman benar</label>
          <label class="flex items-center gap-3"><input type="checkbox" name="admin_docs_ok" bind:checked={checklistForm.admin_docs_ok} /> Dokumen lengkap</label>
        </div>

        <textarea name="check_notes" class="w-full border p-2 rounded mb-6 text-sm" placeholder="Catatan checklist..." bind:value={checklistForm.check_notes}></textarea>

        <div class="flex gap-4 mb-4">
          <label><input type="radio" name="decision" value="approved" bind:group={decisionChoice} /> Approved</label>
          <label><input type="radio" name="decision" value="revised" bind:group={decisionChoice} /> Revised</label>
        </div>

        <textarea name="revision_notes" class="w-full border p-2 rounded mb-4 text-sm" placeholder="Catatan keputusan..." bind:value={decisionNotes}></textarea>

        <button type="submit" disabled={decisionSubmitting} class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">
          {decisionSubmitting ? 'Mengirim...' : 'Submit Keputusan'}
        </button>
      </form>
    </div>
  {:else}
    <p>Data naskah tidak ditemukan.</p>
  {/if}
</div>
