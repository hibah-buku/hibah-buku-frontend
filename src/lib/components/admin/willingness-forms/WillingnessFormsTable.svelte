<script>
	import Icon from "@iconify/svelte";

    let { forms = [], meta = {} } = $props();

    // Helper untuk warna badge status
    function getStatusStyle(status) {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    function getIconStyle(status) {
        switch(status?.toLowerCase()) {
            case 'approved':
                return 'heroicons:check-circle';
            case 'rejected':
                return 'material-symbols:cancel-rounded';
            case 'pending':
                return 'material-symbols:pending-actions'
        }
    }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                    <th class="px-6 py-4">Judul Buku</th>
                    <th class="px-6 py-4">Penulis Utama</th>
                    <th class="px-6 py-4">Institusi</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                {#if forms.length > 0}
                    {#each forms as form (form.id)}
                    {@const bookTitle = form.book?.title ?? 'Tanpa Judul'}
                    {@const authorName = form.main_author?.name ?? 'Tanpa Nama'}
                    {@const institution = form.main_author?.institution ?? '-'}
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-medium text-gray-900">{bookTitle}</div>
                                {#if form.book?.abstract}
                                <div class="text-xs text-gray-500 truncate max-w-[200px] mt-1">
                                    {form.book.abstract.substring(0, 50)}...
                                </div>
                                {/if}
                            </td>
                            <td class="px-6 py-4">
                                {authorName}
                            </td>
                            <td class="px-6 py-4">
                                {institution}
                            </td>
                            <td class="px-6 py-4">
                                <span class={`inline-flex items-center px-3 py-2 gap-2 rounded-full text-xs font-medium capitalize border ${getStatusStyle(form.status)}`}>
                                    <Icon icon={getIconStyle(form.status)} class="w-5 h-5"/>
                                    {form.status}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <!-- Tombol Detail -->
                                <a href="/admin/willingness-form/{form.id}" class="inline-flex items-center gap-1 bg-blue-600 text-blue-50 hover:bg-blue-800 px-3 py-2 rounded-sm font-medium text-xs transition-colors cursor-pointer">
                                    <Icon icon="boxicons:form" class="w-5 h-5"/>
                                    Detail
                                </a>
                                
                                <!-- Tombol Aksi Cepat -->
                                {#if form.status === 'pending'}
                                    <button class="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-green-50 hover:bg-green-800 rounded-sm font-medium text-xs transition-colors cursor-pointer">
                                        <Icon icon="material-symbols:check-circle-outline" class="w-5 h-5"/>
                                        Setuju
                                    </button>
                                    <button class="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-red-50 hover:bg-red-800 rounded-sm font-medium text-xs transition-colors cursor-pointer">
                                        <Icon icon="material-symbols:cancel-outline-rounded" class="w-5 h-5"/>
                                        Tolak
                                    </button>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                            Tidak ada data formulir ditemukan.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    <!-- Pagination (Sama seperti User Table) -->
    {#if meta.last_page && meta.last_page > 1}
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p class="text-xs text-gray-500">
                Menampilkan {meta.from} - {meta.to} dari {meta.total} data
            </p>
            <!-- Tombol Prev/Next bisa ditambahkan di sini -->
        </div>
    {/if}
</div>