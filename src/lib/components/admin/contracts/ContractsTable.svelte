<script>
    import Icon from "@iconify/svelte";

    let { contracts = [], meta = {} } = $props();

    // Helper untuk warna badge status
    function getStatusStyle(status) {
        const s = status?.toLowerCase();
        if (s === 'contract_validated' || s === 'contract_approved') {
            return 'bg-green-50 text-green-700 border-green-200';
        }
        if (s === 'contract_rejected') {
            return 'bg-red-50 text-red-700 border-red-200';
        }
        if (s === 'contract_uploaded' || s === 'pending_validation') {
            return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        }
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }

    // Helper untuk ikon status
    function getStatusIcon(status) {
        const s = status?.toLowerCase();
        if (s === 'contract_validated' || s === 'contract_approved') {
            return 'heroicons:check-circle';
        }
        if (s === 'contract_rejected') {
            return 'heroicons:x-circle';
        }
        if (s === 'contract_uploaded' || s === 'pending_validation') {
            return 'heroicons:clock';
        }
        return 'heroicons:document';
    }

    // Helper untuk label status yang lebih ramah
    function formatStatus(status) {
        return status?.replace('contract_', '').replace('_', ' ').toUpperCase();
    }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                    <th class="px-6 py-4">Nomor Kontrak</th>
                    <th class="px-6 py-4">Penulis</th>
                    <th class="px-6 py-4">File</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                {#if contracts.length > 0}
                    {#each contracts as contract (contract.id)}
                        {@const authorName = contract.author?.name ?? 'Penulis Tidak Dikenal'}
                        {@const authorEmail = contract.author?.email ?? '-'}
                        {@const fileName = contract.file_info?.original_name ?? 'Tidak ada file'}
                        {@const fileSize = contract.file_info?.size ? (contract.file_info.size / 1024).toFixed(1) + ' KB' : '-'}
                        
                        <!-- Gunakan link download dari _links jika ada, fallback ke konstruksi manual -->
                        {@const downloadUrl = contract._links?.download ?? `/api/contracts/${contract.id}/download`}
                        
                        <tr class="hover:bg-gray-50 transition-colors">
                            <!-- Kolom 1: Nomor Kontrak -->
                            <td class="px-6 py-4">
                                <div class="font-mono text-sm font-medium text-gray-900">
                                    #{contract.id}
                                </div>
                            </td>
                            
                            <!-- Kolom 2: Penulis -->
                            <td class="px-6 py-4">
                                <div class="font-medium text-gray-900">{authorName}</div>
                                <div class="text-xs text-gray-500">{authorEmail}</div>
                            </td>
                            
                            <!-- Kolom 3: Info File -->
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900 truncate max-w-[150px]" title={fileName}>
                                    {fileName}
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    {fileSize}
                                </div>
                            </td>
                            
                            <!-- Kolom 4: Status -->
                            <td class="px-6 py-4">
                                <span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium capitalize border ${getStatusStyle(contract.status)}`}>
                                    <Icon icon={getStatusIcon(contract.status)} class="w-4 h-4 shrink-0" />
                                    {formatStatus(contract.status)}
                                </span>
                            </td>
                            
                            <!-- Kolom 5: Aksi -->
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <!-- Tombol Detail -->
                                    <a 
                                        href="/admin/contracts/{contract.id}" 
                                        class="inline-flex items-center gap-1 bg-blue-600 text-blue-50 hover:bg-blue-800 px-3 py-2 rounded-sm font-medium text-xs transition-colors cursor-pointer"
                                        title="Lihat Detail"
                                    >
                                        <Icon icon="boxicons:form" class="w-5 h-5" />
                                        Detail
                                    </a>
                                    
                                    <!-- Tombol Download File -->
                                    <a 
                                        href={downloadUrl}
                                        target="_blank"
                                        class="inline-flex items-center gap-1 bg-gray-600 text-gray-50 hover:bg-gray-800 px-3 py-2 rounded-sm font-medium text-xs transition-colors cursor-pointer"
                                        title="Download Kontrak"
                                    >
                                        <Icon icon="heroicons:arrow-down-tray" class="w-5 h-5" />
                                        Download
                                    </a>
                                    
                                    <!-- Tombol Validasi/Tolak (Hanya jika status contract_uploaded) -->
                                    {#if contract.status === 'contract_uploaded'}
                                        <form method="POST" action="?/approve" class="inline">
                                            <input type="hidden" name="id" value={contract.id} />
                                            <button  
                                                type="submit"
                                                class="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-green-50 hover:bg-green-800 rounded-sm font-medium text-xs transition-colors cursor-pointer"
                                            >
                                                <Icon icon="material-symbols:check-circle-outline" class="w-5 h-5"/>
                                                Setuju
                                            </button>
                                        </form>

                                        <form method="POST" action="?/reject" class="inline">
                                            <input type="hidden" name="id" value={contract.id} />
                                            <button  
                                                type="submit"
                                                class="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-red-50 hover:bg-red-800 rounded-sm font-medium text-xs transition-colors cursor-pointer"
                                            >
                                                <Icon icon="material-symbols:cancel-outline-rounded" class="w-5 h-5"/>
                                                Tolak
                                            </button>
                                        </form>
                                    {/if}
                                </div>
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                            Tidak ada data kontrak ditemukan.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    {#if meta.last_page && meta.last_page > 1}
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p class="text-xs text-gray-500">
                Menampilkan {meta.from} - {meta.to} dari {meta.total} data
            </p>
        </div>
    {/if}
</div>