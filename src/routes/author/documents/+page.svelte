<script>
    import Icon from '@iconify/svelte';

    let { data } = $props();
    const history = $derived(data?.history ?? []);

    // Filter Tab State
    let activeTab = $state('all');

    // Filtered list berdasarkan tab aktif
    const filteredHistory = $derived(
        activeTab === 'all' 
            ? history 
            : activeTab === 'manuscripts' 
                ? history.filter(h => h.category === 'Naskah Buku')
                : activeTab === 'admin_docs'
                    ? history.filter(h => h.category === 'Dokumen Administrasi')
                    : history.filter(h => h.category === 'Kontrak Kerja Sama')
    );

    function formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';
    }

    function formatSize(kb) {
        if (kb === null || kb === undefined) return '-';
        if (kb >= 1024) {
            return (kb / 1024).toFixed(2) + ' MB';
        }
        return kb + ' KB';
    }

    // Peta warna status pill
    const statusColors = {
        green: 'bg-green-50 border-green-200 text-green-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        blue: 'bg-blue-50 border-blue-200 text-blue-700'
    };

    // Peta ikon berdasarkan kategori berkas
    function getFileIcon(category, subCategory) {
        if (category === 'Naskah Buku') {
            return 'heroicons:document-text';
        }
        if (category === 'Kontrak Kerja Sama') {
            return 'heroicons:pencil-square';
        }
        if (subCategory.includes('KTP')) {
            return 'heroicons:identification';
        }
        if (subCategory.includes('Rekening')) {
            return 'heroicons:credit-card';
        }
        return 'heroicons:folder-open';
    }
</script>

<svelte:head>
    <title>Riwayat Berkas & Dokumen | Hibah Buku</title>
</svelte:head>

<div class="space-y-6">
    <!-- Header Area -->
    <div>
        <h1 class="text-2xl font-bold text-gray-800">Riwayat Berkas & Dokumen</h1>
        <p class="text-sm text-gray-500 mt-1">
            Lihat dan kelola seluruh riwayat naskah, draft, dokumen administrasi, serta kontrak kerja sama yang telah Anda unggah di sistem.
        </p>
    </div>

    <!-- Filter Tabs (Premium styling dengan micro-animations) -->
    <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <button 
            onclick={() => activeTab = 'all'} 
            class={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer
                ${activeTab === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
        >
            Semua Berkas ({history.length})
        </button>
        <button 
            onclick={() => activeTab = 'manuscripts'} 
            class={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer
                ${activeTab === 'manuscripts' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
        >
            Draft & Naskah Buku ({history.filter(h => h.category === 'Naskah Buku').length})
        </button>
        <button 
            onclick={() => activeTab = 'admin_docs'} 
            class={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer
                ${activeTab === 'admin_docs' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
        >
            Dokumen Administrasi ({history.filter(h => h.category === 'Dokumen Administrasi').length})
        </button>
        <button 
            onclick={() => activeTab = 'contracts'} 
            class={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer
                ${activeTab === 'contracts' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
        >
            Kontrak Kerja Sama ({history.filter(h => h.category === 'Kontrak Kerja Sama').length})
        </button>
    </div>

    <!-- Main Table Area -->
    {#if filteredHistory.length === 0}
        <div class="bg-white rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
                <Icon icon="heroicons:folder" class="w-8 h-8" />
            </div>
            <h3 class="text-base font-bold text-gray-800">Tidak ada berkas ditemukan</h3>
            <p class="text-sm text-gray-500 mt-1 max-w-sm">
                Belum ada dokumen yang sesuai dengan kategori filter yang Anda pilih saat ini.
            </p>
        </div>
    {:else}
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left border-collapse">
                    <thead class="bg-gray-50/50 text-gray-600 uppercase text-2xs font-bold border-b border-gray-150">
                        <tr>
                            <th class="px-6 py-4">Nama Berkas</th>
                            <th class="px-6 py-4">Kategori Berkas</th>
                            <th class="px-6 py-4">Tanggal Diunggah</th>
                            <th class="px-6 py-4 text-center">Ukuran Berkas</th>
                            <th class="px-6 py-4 text-center">Status Validasi</th>
                            <th class="px-6 py-4 text-end">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        {#each filteredHistory as item (item.id)}
                            <tr class="bg-white hover:bg-gray-50/50 transition-colors">
                                <!-- Nama Berkas (Dengan Icon) -->
                                <td class="px-6 py-4 max-w-xs sm:max-w-md">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                            <Icon icon={getFileIcon(item.category, item.subCategory)} class="w-5 h-5" />
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-sm font-semibold text-gray-800 truncate" title={item.name}>
                                                {item.name}
                                            </p>
                                            <p class="text-xs text-gray-500 mt-0.5 truncate">
                                                {item.subCategory}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <!-- Kategori Berkas (Badge) -->
                                <td class="px-6 py-4">
                                    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold
                                        ${item.category === 'Naskah Buku' ? 'bg-blue-50 text-blue-700' : ''}
                                        ${item.category === 'Dokumen Administrasi' ? 'bg-emerald-50 text-emerald-700' : ''}
                                        ${item.category === 'Kontrak Kerja Sama' ? 'bg-purple-50 text-purple-700' : ''}
                                    `}>
                                        {item.category}
                                    </span>
                                </td>

                                <!-- Tanggal Upload -->
                                <td class="px-6 py-4 text-gray-600 text-xs">
                                    {formatDate(item.uploaded_at)}
                                </td>

                                <!-- Ukuran Berkas -->
                                <td class="px-6 py-4 text-center text-xs font-semibold text-gray-600">
                                    {formatSize(item.size_kb)}
                                </td>

                                <!-- Status Badge -->
                                <td class="px-6 py-4">
                                    <div class="flex items-center justify-center">
                                        <span class={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-bold border
                                            ${statusColors[item.statusColor] || 'bg-gray-50 border-gray-200 text-gray-600'}
                                        `}>
                                            {#if item.statusColor === 'green'}
                                                <Icon icon="heroicons:check-circle" class="w-3.5 h-3.5" />
                                            {:else if item.statusColor === 'yellow'}
                                                <Icon icon="heroicons:clock" class="w-3.5 h-3.5" />
                                            {:else if item.statusColor === 'rose'}
                                                <Icon icon="heroicons:x-circle" class="w-3.5 h-3.5" />
                                            {:else}
                                                <Icon icon="heroicons:document" class="w-3.5 h-3.5" />
                                            {/if}
                                            {item.status}
                                        </span>
                                    </div>
                                </td>

                                <!-- Aksi Unduh -->
                                <td class="px-6 py-4 text-end">
                                    <a 
                                        href={item.download_url} 
                                        target="_blank" 
                                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 hover:shadow shadow-sm transition-all cursor-pointer"
                                    >
                                        <Icon icon="heroicons:arrow-down-tray" class="w-3.5 h-3.5" />
                                        Unduh
                                    </a>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>