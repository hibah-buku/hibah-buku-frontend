<script>
    let { data } = $props();
    const { documents } = data;

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
</script>

<div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Riwayat Dokumen</h1>
    <p class="text-gray-500 mb-6">Daftar dokumen administrasi yang telah Anda unggah.</p>

    {#if documents.length === 0}
        <div class="flex flex-col items-center justify-center py-16 text-center">
            <div class="text-6xl mb-4">📂</div>
            <h2 class="text-lg font-semibold text-gray-700">Belum Ada Dokumen</h2>
            <p class="text-gray-400 mt-1">Anda belum mengunggah dokumen administrasi apapun.</p>
        </div>
    {:else}
        <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th class="px-6 py-3">No</th>
                        <th class="px-6 py-3">Jenis Dokumen</th>
                        <th class="px-6 py-3">Tanggal Upload</th>
                        <th class="px-6 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    {#each documents as doc, i}
                        <tr class="bg-white hover:bg-gray-50">
                            <td class="px-6 py-4 text-gray-500">{i + 1}</td>
                            <td class="px-6 py-4 font-medium text-gray-800">{doc.document_type}</td>
                            <td class="px-6 py-4 text-gray-500">{formatDate(doc.created_at)}</td>
                            <td class="px-6 py-4">
                                <a href="http://localhost:8000/api/manuscripts/me/documents/{doc.document_type}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                                    Download
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>