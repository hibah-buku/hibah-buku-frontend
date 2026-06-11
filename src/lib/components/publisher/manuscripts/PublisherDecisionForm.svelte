<script>
  import { onMount, tick } from 'svelte';
  import { applyAction, deserialize, enhance } from '$app/forms';
  import Icon from '@iconify/svelte';

  let {
    manuscript,
    checklistForm = $bindable({ cover_design_ok: false, page_count_ok: false, admin_docs_ok: false, check_notes: '' }),
    decisionChoice = $bindable('approved'),
    decisionNotes = $bindable('')
  } = $props();

  let decisionSubmitting = $state(false);
  let showPdfPreview = $state(false);
  let pdfData = $state(null);
  let pdfBlobUrl = $state(null);
  let isLoadingPdf = $state(false);
  let pdfError = $state('');
  let zoom = $state(100);
  let totalPages = $state(0);
  let isDownloading = $state(false);

  const isApproved = $derived(manuscript?.status === 'to_print');
  const isRevised = $derived(manuscript?.status === 'publisher_revised');
  const isDecisionMade = $derived(isApproved || isRevised);

  const checklistComplete = $derived(
    checklistForm?.cover_design_ok && checklistForm?.page_count_ok && checklistForm?.admin_docs_ok
  );

  const isSubmitDisabled = $derived(
    decisionSubmitting || (decisionChoice === 'revised' && !decisionNotes?.trim()) || (decisionChoice === 'approved' && !checklistComplete)
  );

  function openPdfPreview() {
    if (!manuscript?.id) return;
    showPdfPreview = true;
    loadPdfPreview();
  }

  // ✨ FIX: PDF preview lewat server action agar token ikut terkirim
  async function loadPdfPreview() {
    if (!manuscript?.id) return;
    isLoadingPdf = true;
    pdfError = '';

    try {
      if (!window.pdfjsLib) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve();
          };
          document.head.appendChild(script);
        });
      }

      // Kirim request ke server SvelteKit (bukan langsung ke BE)
      // Server akan forward dengan token dari cookie
      const formData = new FormData();
      const response = await fetch(`?/downloadManuscript`, {
        method: 'POST',
        body: formData
      });

      const resultText = await response.text();
      const actionResult = deserialize(resultText);
      const downloadData = actionResult?.data?.downloadData ?? actionResult?.downloadData;

      if (!downloadData) {
        const message = actionResult?.data?.message || actionResult?.message || 'Gagal memuat file PDF naskah.';
        throw new Error(message);
      }

      const { base64, contentType } = downloadData;
      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: contentType });

      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      pdfBlobUrl = URL.createObjectURL(blob);

      pdfData = await window.pdfjsLib.getDocument(pdfBlobUrl).promise;
      totalPages = pdfData.numPages;

      await tick();
      await renderAllPages(pdfData);
    } catch (error) {
      pdfError = error.message || 'Tidak dapat menampilkan PDF.';
    } finally {
      isLoadingPdf = false;
    }
  }

  // ✨ FIX: Download naskah lewat server action agar token ikut terkirim
  async function handleDownload() {
    if (!manuscript?.id || isDownloading) return;
    isDownloading = true;

    try {
      const formData = new FormData();
      const response = await fetch(`?/downloadManuscript`, {
        method: 'POST',
        body: formData
      });

      const resultText = await response.text();
      const actionResult = deserialize(resultText);
      const downloadData = actionResult?.data?.downloadData ?? actionResult?.downloadData;

      if (!downloadData) {
        const message = actionResult?.data?.message || actionResult?.message || 'Gagal mengunduh file.';
        throw new Error(message);
      }

      const { base64, contentType, filename } = downloadData;
      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: contentType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message || 'Gagal mengunduh file.');
    } finally {
      isDownloading = false;
    }
  }

  async function renderAllPages(pdf) {
    try {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: zoom / 100 });
        const canvas = document.getElementById(`publisher-pdf-${i}`);
        if (!canvas) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      }
    } catch (error) {
      console.error('Gagal merender PDF', error);
    }
  }

  async function zoomIn() {
    if (zoom < 300) {
      zoom += 10;
      if (pdfData) { await tick(); await renderAllPages(pdfData); }
    }
  }

  async function zoomOut() {
    if (zoom > 50) {
      zoom -= 10;
      if (pdfData) { await tick(); await renderAllPages(pdfData); }
    }
  }

  function closePdfPreview() {
    showPdfPreview = false;
    pdfError = '';
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    pdfBlobUrl = null;
    pdfData = null;
    totalPages = 0;
  }

  onMount(() => {
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  });
</script>

<div class="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
  <div class="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
    <div>
      <h3 class="mt-1 text-xl font-semibold text-gray-900">{manuscript?.title ?? 'Review Naskah'}</h3>
      <p class="mt-1 text-sm text-gray-500">Penulis: {manuscript?.author_name ?? '-'}</p>
    </div>
    <span class={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${isApproved ? 'border-green-200 bg-green-50 text-green-700' : isRevised ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
      {isApproved ? 'Approved' : isRevised ? 'Revised' : 'Review'}
    </span>
  </div>

  <div class={isApproved ? "max-w-2xl" : "grid gap-4 xl:grid-cols-[1.05fr_0.95fr]"}>
    
    <section class="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div class="mb-3 flex items-center justify-between">
        <h4 class="text-sm font-semibold text-gray-900">Dokumen Naskah</h4>
        <span class="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Preview PDF</span>
      </div>
      <div class="space-y-3">
        <button type="button" onclick={openPdfPreview} class="flex w-full items-center justify-between rounded-xl border border-blue-100 bg-white px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50">
          <span>
            <span class="block text-sm font-semibold text-gray-800">Lihat Naskah</span>
            <span class="text-xs text-gray-500">Buka preview PDF</span>
          </span>
          <Icon icon="material-symbols:visibility" class="h-5 w-5 text-blue-600" />
        </button>

        <!-- ✨ FIX: Ganti <a href> dengan button yang trigger handleDownload -->
        <button
          type="button"
          onclick={handleDownload}
          disabled={isDownloading}
          class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <span>
            <span class="block text-sm font-semibold text-gray-800">
              {isDownloading ? 'Mengunduh...' : 'Unduh Naskah'}
            </span>
            <span class="text-xs text-gray-500">Unduh PDF</span>
          </span>
          <Icon icon="material-symbols:download-rounded" class="h-5 w-5 text-gray-600" />
        </button>

        {#if manuscript?.links?.cover_url || manuscript?.download_links?.cover_url}
          <a href={manuscript?.links?.cover_url ?? manuscript?.download_links?.cover_url} target="_blank" class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-gray-300 hover:bg-gray-100">
            <span>
              <span class="block text-sm font-semibold text-gray-800">Lihat Cover</span>
              <span class="text-xs text-gray-500">Dokumen desain sampul</span>
            </span>
            <Icon icon="material-symbols:image-outline" class="h-5 w-5 text-gray-600" />
          </a>
        {/if}

        {#if manuscript?.links?.admin_docs_url || manuscript?.download_links?.admin_docs_url}
          <a href={manuscript?.links?.admin_docs_url ?? manuscript?.download_links?.admin_docs_url} target="_blank" class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-gray-300 hover:bg-gray-100">
            <span>
              <span class="block text-sm font-semibold text-gray-800">Dokumen Administrasi</span>
              <span class="text-xs text-gray-500">File pendukung administrasi</span>
            </span>
            <Icon icon="material-symbols:description-outline" class="h-5 w-5 text-gray-600" />
          </a>
        {/if}
      </div>
    </section>

    {#if !isApproved}
    <section class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h4 class="text-sm font-semibold text-gray-900">Checklist Verifikasi</h4>
        <span class="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600">
          {isDecisionMade ? 'Terekam' : 'Pra-cetak'}
        </span>
      </div>

      <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
        {#each [ 
          { key: 'cover_design_ok', label: 'Desain sampul sesuai' },
          { key: 'page_count_ok', label: 'Jumlah halaman terpenuhi' },
          { key: 'admin_docs_ok', label: 'Dokumen administrasi lengkap' }
        ] as item (item.key)}
          
          {#if isDecisionMade}
            <div class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700">
              {#if checklistForm[item.key]}
                <Icon icon="material-symbols:check-circle" class="h-5 w-5 text-green-500" />
              {:else}
                <Icon icon="material-symbols:cancel" class="h-5 w-5 text-red-500" />
              {/if}
              <span class="font-medium">{item.label}</span>
            </div>
          {:else}
            <label class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 transition hover:border-blue-200 hover:bg-blue-50/50">
              <input type="checkbox" bind:checked={checklistForm[item.key]} class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="font-medium">{item.label}</span>
            </label>
          {/if}

        {/each}
      </div>

      <div class="mt-4">
        <label for="check_notes" class="mb-2 block text-sm font-semibold text-gray-700">Catatan Verifikasi</label>
        
        {#if isDecisionMade}
          {#if checklistForm.check_notes?.trim()}
            <div class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
              {checklistForm.check_notes}
            </div>
          {:else}
            <div class="w-full rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm italic text-gray-400">
              (Tidak ada catatan)
            </div>
          {/if}
        {:else}
          <textarea id="check_notes" bind:value={checklistForm.check_notes} rows="3" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Masukkan catatan internal..."></textarea>
        {/if}
      </div>
    </section>
    {/if}
  </div>

  {#if !isDecisionMade}
    <form
      method="POST"
      action="?/submitDecision"
      use:enhance={() => {
        decisionSubmitting = true;
        return async ({ result, update }) => {
          await update();
          await applyAction(result);
          decisionSubmitting = false;
        };
      }}
      class="rounded-2xl border border-gray-100 bg-gray-50 p-5"
    >
      <input type="hidden" name="cover_design_ok" value={checklistForm.cover_design_ok} />
      <input type="hidden" name="page_count_ok" value={checklistForm.page_count_ok} />
      <input type="hidden" name="admin_docs_ok" value={checklistForm.admin_docs_ok} />
      <input type="hidden" name="check_notes" value={checklistForm.check_notes} />

      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h4 class="text-sm font-semibold text-gray-900">Keputusan Akhir</h4>
          <p class="text-xs text-gray-500">Buat keputusan</p>
        </div>
        <span class="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">Publisher</span>
      </div>

      <div class="mb-5 flex flex-wrap gap-3">
        <label class={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${decisionChoice === 'approved' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/60'}`}>
          <input type="radio" name="decision" value="approved" bind:group={decisionChoice} class="text-green-600" />
          <span class="font-semibold text-gray-800">Disetujui (Approved)</span>
        </label>
        <label class={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${decisionChoice === 'revised' ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/60'}`}>
          <input type="radio" name="decision" value="revised" bind:group={decisionChoice} class="text-amber-600" />
          <span class="font-semibold text-gray-800">Perlu Revisi (Revised)</span>
        </label>
      </div>

      {#if decisionChoice === 'revised'}
        <div class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <label for="revision_notes" class="mb-2 block text-sm font-semibold text-amber-900">Catatan Revisi untuk Penulis</label>
          <textarea id="revision_notes" name="revision_notes" bind:value={decisionNotes} rows="4" required class="w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" placeholder="Tuliskan arahan revisi yang jelas..."></textarea>
        </div>
      {/if}

      {#if decisionChoice === 'approved' && !checklistComplete}
        <p class="mb-4 text-xs text-amber-700">⚠️ Lengkapi verifikasi untuk menyetujui naskah</p>
      {/if}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        class="w-full rounded-xl bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {decisionSubmitting ? 'Memproses keputusan...' : 'Submit Keputusan'}
      </button>
    </form>

  {:else}
    <div class={`rounded-2xl border p-8 text-center shadow-sm ${isApproved ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
      {#if isApproved}
        <Icon icon="material-symbols:check-circle-outline-rounded" class="mx-auto mb-3 h-14 w-14 text-green-500" />
        <h4 class="text-xl font-bold text-green-800">Naskah Disetujui untuk Cetak</h4>
        <p class="mt-2 text-sm text-green-700">Keputusan terkirim. Naskah lolos review pra-cetak dan untuk proses cetak.</p>
      {:else}
        <Icon icon="material-symbols:edit-document-outline-rounded" class="mx-auto mb-3 h-14 w-14 text-amber-500" />
        <h4 class="text-xl font-bold text-amber-800">Naskah Perlu Revisi</h4>
        <p class="mt-2 text-sm text-amber-700">Keputusan revisi terkirim. Menunggu penulis mengunggah revisi naskah.</p>
        
        {#if manuscript?.revision_notes}
          <div class="mt-5 rounded-xl bg-white p-4 text-left border border-amber-100 text-sm text-gray-700 shadow-sm">
            <span class="block font-semibold text-amber-900 mb-1">Catatan Revisi:</span>
            <p class="whitespace-pre-wrap">{manuscript.revision_notes}</p>
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</div>

{#if showPdfPreview}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div class="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b border-gray-200 bg-gray-900 px-4 py-3 text-white">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-blue-200">PDF Viewer</p>
          <h3 class="text-sm font-semibold">{manuscript?.title ?? 'Manuscript Preview'}</h3>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick={zoomOut} class="rounded-lg bg-gray-800 p-2 text-gray-100 hover:bg-gray-700" title="Zoom out"><Icon icon="material-symbols:remove" class="h-4 w-4" /></button>
          <span class="min-w-12 rounded-lg bg-gray-800 px-2 py-1 text-center text-xs font-semibold">{zoom}%</span>
          <button type="button" onclick={zoomIn} class="rounded-lg bg-gray-800 p-2 text-gray-100 hover:bg-gray-700" title="Zoom in"><Icon icon="material-symbols:add" class="h-4 w-4" /></button>
          <button type="button" onclick={closePdfPreview} class="rounded-lg bg-red-500/90 p-2 text-white hover:bg-red-600" title="Tutup"><Icon icon="material-symbols:close" class="h-4 w-4" /></button>
        </div>
      </div>

      <div class="flex-1 overflow-auto bg-gray-100 p-4">
        {#if isLoadingPdf}
          <div class="flex h-full items-center justify-center text-gray-600">
            <div class="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-sm">
              <Icon icon="line-md:loading-twotone-loop" class="h-10 w-10 text-blue-500" />
              <p class="text-sm font-medium">Memuat preview PDF...</p>
            </div>
          </div>
        {:else if pdfError}
          <div class="flex h-full items-center justify-center text-red-600">
            <div class="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
              <Icon icon="material-symbols:error-outline" class="mx-auto mb-3 h-8 w-8" />
              <p class="text-sm font-semibold">Tidak dapat menampilkan PDF</p>
              <p class="mt-1 text-xs text-red-700">{pdfError}</p>
            </div>
          </div>
        {:else if pdfData}
          <div class="flex flex-col items-center gap-4 py-2">
            {#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNumber (pageNumber)}
              <canvas id={`publisher-pdf-${pageNumber}`} class="rounded-xl bg-white shadow-xl"></canvas>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
