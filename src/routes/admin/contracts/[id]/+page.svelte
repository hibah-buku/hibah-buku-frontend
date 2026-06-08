<script>
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    
    let { data } = $props();
    let contractId = $derived(data?.id || '');

    let pdfData = $state(null);
    let isLoading = $state(true);
    let errorMessage = $state(null);
    let currentPage = $state(1);
    let totalPages = $state(0);
    let zoom = $state(100);
    let pdfFileName = $state('document.pdf');
    let pdfBlobUrl = $state(null);

    // Fungsi render yang melooping semua halaman
    const renderAllPages = async (pdf) => {
        try {
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const scale = zoom / 100;
                const viewport = page.getViewport({ scale });
                
                const canvas = document.getElementById(`pdf-canvas-${i}`);
                if (!canvas) continue;

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                const context = canvas.getContext('2d');
                await page.render({ canvasContext: context, viewport }).promise;
            }
        } catch (error) {
            console.error('Error rendering pages:', error);
        }
    };

    // Trigger render ulang jika zoom berubah
    $effect(() => {
        if (pdfData) renderAllPages(pdfData);
    });

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfBlobUrl;
        link.download = pdfFileName;
        link.click();
    };

    const handlePrint = () => window.print();

    onMount(async () => {
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

            const response = await fetch(`http://127.0.0.1:8000/api/contracts/${contractId}/download`, {
                method: 'GET',
                headers: { 'Accept': 'application/pdf' }
            });

            if (!response.ok) throw new Error("Gagal mengambil file.");

            const blob = await response.blob();
            pdfBlobUrl = URL.createObjectURL(blob);
            
            const pdf = await window.pdfjsLib.getDocument(pdfBlobUrl).promise;
            pdfData = pdf;
            totalPages = pdf.numPages;
            
            // Tunggu DOM terbentuk sebelum render
            setTimeout(() => renderAllPages(pdf), 500);

        } catch (error) {
            errorMessage = error.message;
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="flex flex-col h-screen bg-white">
    <!-- Header dengan judul dan kontrol -->
    <div class="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div class="flex items-center gap-4">
            <button class="hover:bg-gray-700 p-2 rounded transition-colors" title="Menu">
                <Icon icon="material-symbols:menu" class="w-6 h-6" />
            </button>
            <span class="font-medium text-sm">{pdfFileName}</span>
        </div>
        
        <div class="flex items-center gap-4">
            <div class="bg-gray-700 px-3 py-1 rounded text-sm font-medium">
                {currentPage} / {totalPages}
            </div>
        </div>

        <div class="flex items-center gap-2">
            <!-- Zoom Out -->
            <button 
                onclick={zoomOut} 
                disabled={zoom <= 50}
                class="hover:bg-gray-700 disabled:opacity-50 p-2 rounded transition-colors"
                title="Zoom Out"
            >
                <Icon icon="material-symbols:remove" class="w-5 h-5" />
            </button>

            <!-- Zoom Display -->
            <span class="bg-gray-700 px-2 py-1 rounded text-xs font-medium w-12 text-center">
                {zoom}%
            </span>

            <!-- Zoom In -->
            <button 
                onclick={zoomIn}
                disabled={zoom >= 300}
                class="hover:bg-gray-700 disabled:opacity-50 p-2 rounded transition-colors"
                title="Zoom In"
            >
                <Icon icon="material-symbols:add" class="w-5 h-5" />
            </button>

            <!-- Divider -->
            <div class="w-px h-6 bg-gray-600 mx-1"></div>

            <!-- Previous Page -->
            <button 
                onclick={prevPage}
                disabled={currentPage <= 1}
                class="hover:bg-gray-700 disabled:opacity-50 p-2 rounded transition-colors"
                title="Previous Page"
            >
                <Icon icon="material-symbols:arrow-back" class="w-5 h-5" />
            </button>

            <!-- Next Page -->
            <button 
                onclick={nextPage}
                disabled={currentPage >= totalPages}
                class="hover:bg-gray-700 disabled:opacity-50 p-2 rounded transition-colors"
                title="Next Page"
            >
                <Icon icon="material-symbols:arrow-forward" class="w-5 h-5" />
            </button>

            <!-- Divider -->
            <div class="w-px h-6 bg-gray-600 mx-1"></div>

            <!-- Download -->
            <button 
                onclick={handleDownload}
                class="hover:bg-gray-700 p-2 rounded transition-colors"
                title="Download PDF"
            >
                <Icon icon="material-symbols:download" class="w-5 h-5" />
            </button>

            <!-- Print -->
            <button 
                onclick={handlePrint}
                class="hover:bg-gray-700 p-2 rounded transition-colors"
                title="Print"
            >
                <Icon icon="material-symbols:print" class="w-5 h-5" />
            </button>

            <!-- More Options -->
            <button class="hover:bg-gray-700 p-2 rounded transition-colors" title="More">
                <Icon icon="material-symbols:more-vert" class="w-5 h-5" />
            </button>
        </div>
    </div>

    <!-- PDF Viewer Content -->
    <div class="flex-1 overflow-auto flex items-center justify-center bg-gray-900 p-4">
        {#if isLoading}
            <div class="text-gray-300 flex flex-col items-center gap-3">
                <Icon icon="line-md:loading-twotone-loop" class="w-12 h-12 text-blue-400" />
                <p class="text-lg">Memuat dan mendekripsi file...</p>
            </div>
        {:else if errorMessage}
            <div class="text-red-400 bg-red-900/20 px-8 py-6 rounded-lg border border-red-700 flex flex-col items-center gap-3 max-w-md">
                <Icon icon="material-symbols:error-outline" class="w-8 h-8" />
                <p class="text-center font-semibold">Error Loading PDF</p>
                <p class="text-center text-sm">{errorMessage}</p>
                <a href="/admin/contracts" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                    Kembali
                </a>
            </div>
            {:else if pdfData}
        <div class="flex flex-col items-center gap-4 py-4">
            {#each Array(totalPages) as _, i}
                <div class="bg-white shadow-2xl">
                    <canvas 
                        id="pdf-canvas-{i + 1}" 
                        class="block"
                    />
                </div>
            {/each}
        </div>
    {/if}
    </div>

    <!-- Footer Navigation -->
    <div class="bg-gray-200 px-6 py-3 flex justify-between items-center border-t border-gray-300">
        <a href="/admin/contracts" class="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2">
            <Icon icon="material-symbols:arrow-back" class="w-4 h-4" />
            Kembali ke Daftar Kontrak
        </a>
        <span class="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
        </span>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>