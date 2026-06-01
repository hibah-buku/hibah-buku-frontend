<script>
    let { data } = $props();
    const { manuscripts } = data;

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    function getStatusLabel(status) {
        const labels = {
            'initial_draft_uploaded': 'Draft Diunggah',
            'reviewer_assigned': 'Menunggu Review',
            'review_completed': 'Selesai Direview',
            'revision_requested': 'Perlu Revisi',
            'revision_uploaded': 'Revisi Diunggah',
            'preprint': 'Pra-Cetak'
        };
        return labels[status] ?? status;
    }

    function getStatusColor(status) {
        const colors = {
            'initial_draft_uploaded': 'bg-blue-100 text-blue-700',
            'reviewer_assigned': 'bg-yellow-100 text-yellow-700',
            'review_completed': 'bg-purple-100 text-purple-700',
            'revision_requested': 'bg-red-100 text-red-700',
            'revision_uploaded': 'bg-orange-100 text-orange-700',
            'preprint': 'bg-green-100 text-green-700'
        };
        return colors[status] ?? 'bg-gray-100 text-gray-700';
    }
</script>

<div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Riwayat Upload Draft</h1>
    <p class="text-gray-500 mb-6">Histori draft naskah yang pernah Anda unggah.</p>

    {#if manuscripts.length === 0}
        <div class="flex flex-col items-center justify-center py-16 text-center">
            <div class="text-6xl mb-4">📄</div>
            <h2 class="text-lg font-semibold text-gray-700">Belum Ada Draft</h2>
            <p class="text-gray-400 mt-1">Anda belum pernah mengunggah draft naskah apapun.</p>
        </div>
    {:else}
        <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th class="px-6 py-3">No</th>
                        <th class="px-6 py-3">Judul Naskah</th>
                        <th class="px-6 py-3">Tanggal Upload</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    {#each manuscripts as manuscript, i}
                        <tr class="bg-white hover:bg-gray-50">
                            <td class="px-6 py-4 text-gray-500">{i + 1}</td>
                            <td class="px-6 py-4 font-medium text-gray-800">{manuscript.title ?? '-'}</td>
                            <td class="px-6 py-4 text-gray-500">{formatDate(manuscript.created_at)}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 rounded-full text-xs font-medium {getStatusColor(manuscript.status)}">
                                    {manuscript.status.label}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <a href="http://localhost:8000/api/manuscripts/{manuscript.id}/download" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
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