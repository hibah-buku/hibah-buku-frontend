<script>
  import { enhance } from '$app/forms'; 
  import { ENDPOINTS } from '$lib/api/endpoint.js';  
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
  
  const fileUrl = $derived(manuscript?.id ? ENDPOINTS.MANUSCRIPTS.DOWNLOAD(manuscript.id) : null);
  
  const coverUrl = $derived(manuscript?.links?.cover_url ?? manuscript?.links?.cover_design_url ?? manuscript?.download_links?.cover_url ?? null);
  const adminDocsUrl = $derived(manuscript?.links?.admin_docs_url ?? manuscript?.download_links?.admin_docs_url ?? null);
  
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
    <div class={`rounded-lg px-4 py-3 text-sm ${form.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
      {form.message}
    </div>
  {/if}

  {#if data.error}
    <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{data.error}</div>
  {/if}

  {#if manuscript}
    <div class="bg-white rounded-xl shadow-sm border p-6 space-y-6">
      <div class="rounded-xl bg-gray-50 p-4 flex justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">{manuscript.title}</h3>
          <p class="text-sm text-gray-600 mt-1">Penulis: <span class="font-medium">{manuscript.author_name}</span></p>
        </div>
        <span class={`rounded-full h-fit px-3 py-1 text-xs font-semibold border ${detailStatus?.className}`}>
          {detailStatus?.label}
        </span>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-3">Unduhan Dokumen</h3>
        <ul class="space-y-2">
          {#if fileUrl}
            <li class="flex items-center justify-between bg-gray-50 border px-4 py-3 rounded-lg">
              <span class="text-sm font-medium text-gray-700">File Naskah (Draft)</span>
              <a class="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow-sm transition-colors" href={fileUrl} target="_blank">Unduh File</a>
            </li>
          {/if}
          
          {#if coverUrl}
            <li class="flex items-center justify-between bg-gray-50 border px-4 py-3 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Desain Sampul (Cover)</span>
              <a class="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow-sm transition-colors" href={coverUrl} target="_blank">Lihat Cover</a>
            </li>
          {/if}
          
          {#if adminDocsUrl}
            <li class="flex items-center justify-between bg-gray-50 border px-4 py-3 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Dokumen Administrasi</span>
              <a class="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow-sm transition-colors" href={adminDocsUrl} target="_blank">Unduh Dokumen</a>
            </li>
          {/if}

          {#if !fileUrl && !coverUrl && !adminDocsUrl}
            <li class="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg text-center border border-dashed">Tidak ada file/dokumen yang dilampirkan oleh penulis.</li>
          {/if}
        </ul>
      </div>

      <form 
        method="POST" 
        use:enhance={() => { 
          decisionSubmitting = true; 
          return async ({ update }) => { 
            await update(); 
            decisionSubmitting = false; 
          }; 
        }} 
        class="border-t pt-6"
      >
        <h3 class="text-sm font-semibold mb-4">Checklist Verifikasi Pra-Cetak</h3>
        
        <div class="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="cover_design_ok" bind:checked={checklistForm.cover_design_ok} class="w-4 h-4 text-blue-600 rounded" /> 
            <span class="text-sm font-medium text-gray-700">Desain sampul sesuai standar</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="page_count_ok" bind:checked={checklistForm.page_count_ok} class="w-4 h-4 text-blue-600 rounded" /> 
            <span class="text-sm font-medium text-gray-700">Jumlah halaman valid</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="admin_docs_ok" bind:checked={checklistForm.admin_docs_ok} class="w-4 h-4 text-blue-600 rounded" /> 
            <span class="text-sm font-medium text-gray-700">Dokumen administrasi lengkap</span>
          </label>
        </div>

        <div class="mb-6">
          <label for="check_notes" class="block text-sm font-semibold mb-2">Catatan Verifikasi (Opsional)</label>
          <textarea id="check_notes" name="check_notes" class="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Masukkan catatan untuk tim internal..." bind:value={checklistForm.check_notes}></textarea>
        </div>

        <div class="border-t pt-6 mb-4">
          <h3 class="text-sm font-semibold mb-3">Keputusan Akhir</h3>
          <div class="flex gap-6 mb-4">
            <label class={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border ${decisionChoice === 'approved' ? 'bg-green-50 border-green-500' : 'bg-gray-50'}`}>
              <input type="radio" name="decision" value="approved" bind:group={decisionChoice} class="text-green-600" /> 
              <span class="font-medium text-sm">Disetujui (Approved)</span>
            </label>
            <label class={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border ${decisionChoice === 'revised' ? 'bg-amber-50 border-amber-500' : 'bg-gray-50'}`}>
              <input type="radio" name="decision" value="revised" bind:group={decisionChoice} class="text-amber-600" /> 
              <span class="font-medium text-sm">Perlu Revisi (Revised)</span>
            </label>
          </div>
        </div>

        <div class="mb-6">
          <label for="revision_notes" class="block text-sm font-semibold mb-2">Catatan Keputusan untuk Penulis</label>
          <textarea id="revision_notes" name="revision_notes" class="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Tulis instruksi revisi atau pesan persetujuan..." bind:value={decisionNotes} required={decisionChoice === 'revised'}></textarea>
          
          {#if decisionChoice === 'revised' && !decisionNotes.trim()}
            <p class="text-xs text-red-600 mt-1.5 font-medium flex items-center gap-1">
              ⚠️ Wajib mengisi catatan revisi di atas agar tombol submit aktif.
            </p>
          {/if}
        </div>

        <button 
          type="submit" 
          disabled={decisionSubmitting || (decisionChoice === 'revised' && !decisionNotes.trim())} 
          class="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {decisionSubmitting ? 'Memproses Keputusan...' : 'Submit Keputusan'}
        </button>
      </form>
    </div>
  {:else}
    <div class="bg-white border rounded-lg p-8 text-center text-gray-500">
      Data naskah tidak ditemukan.
    </div>
  {/if}
</div>