<script>
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';

    let { data } = $props();

    // State UI
    let isLoading = $state(true);
    let pdfFileName = $derived(data?.pdfFileName || 'document.pdf');
    let pdfBlobUrl = $state(null);
    let pdfData = $state(null);
    let errorMessage = $state(null);
    let currentPage = $state(1);
    let totalPages = $state(0);
    let zoom = $state(100);
    let canvasElement = $state();

    const renderCurrentPage = async () => {
        if (!pdfData || !canvasElement || totalPages === 0) return;
        
        try {
            const page = await pdfData.getPage(currentPage);
            const scale = zoom / 100;
            const viewport = page.getViewport({ scale });

            // Set ukuran canvas eksplisit
            canvasElement.width = viewport.width;
            canvasElement.height = viewport.height;

            const context = canvasElement.getContext('2d');
            await page.render({ canvasContext: context, viewport }).promise;
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    };

    onMount(async () => {
        if (data?.error) {
            errorMessage = data.error;
            isLoading = false;
            return;
        }

        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        const token = getCookie('auth_token');
        if (!token) {
            throw new Error('Token autentikasi tidak ditemukan.');
        }

        try {
            const response = await fetch(`/api/contracts/${data.contractId}/preview`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf'
                }
            });

            if (!response.ok) throw new Error(`Server returned ${response.status}`);

            const blob = await response.blob();
            pdfBlobUrl = URL.createObjectURL(blob);

            // Load PDF.js Library
            if (!window.pdfjsLib) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                    script.onload = () => {
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        resolve();
                    };
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }

            const arrayBuffer = await blob.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            pdfData = pdf;
            totalPages = pdf.numPages;

            setTimeout(() => {
                renderCurrentPage();
                isLoading = false;
            }, 50);

        } catch (error) {
            console.error(error);
            errorMessage = error.message || 'Gagal memuat preview PDF.';
            isLoading = false;
        }
    });
    
    $effect(() => {
        if (pdfData && canvasElement) {
            renderCurrentPage();
        }
    });

    // Cleanup Blob URL
    $effect(() => {
        return () => {
            if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
        };
    });

    const zoomIn = () => { zoom = Math.min(300, zoom + 10); };
    const zoomOut = () => { zoom = Math.max(50, zoom - 10); };
    const prevPage = () => { if (currentPage > 1) currentPage -= 1; };
    const nextPage = () => { if (currentPage < totalPages) currentPage += 1; };
    const handleDownload = () => {
        if (!pdfBlobUrl) return;
        const link = document.createElement('a');
        link.href = pdfBlobUrl;
        link.download = pdfFileName;
        link.click();
    };
    const handlePrint = () => window.print();
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
            <div class="bg-white shadow-2xl">
                <canvas
                    bind:this={canvasElement} 
                    id="pdf-canvas"
                    class="block"
                ></canvas>
            </div>
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