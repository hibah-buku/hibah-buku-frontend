<script>
    import Icon from '@iconify/svelte';

    const actions = [
        {
            key: 'upload_draft',
            href: '/author/upload-draft',
            title: 'Upload Draft Baru',
            description: 'Usulkan naskah buku baru',
            color: 'blue',
            icon: 'heroicons:document-plus'
        },
        {
            key: 'upload_revision',
            href: '/author/upload-revision',
            title: 'Upload Revisi Naskah',
            description: 'Kirim naskah perbaikan',
            color: 'yellow',
            icon: 'heroicons:arrow-path'
        },
        {
            key: 'upload_document',
            href: '/author/upload-document',
            title: 'Kelola Dokumen',
            description: 'Scan KTP, Pernyataan, Rekening',
            color: 'green',
            icon: 'heroicons:identification'
        }
    ];

    const colorClasses = {
        blue: { bg: 'bg-blue-50 hover:bg-blue-100', iconBg: 'bg-blue-200 text-blue-800', text: 'text-blue-900', subtext: 'text-blue-700' },
        green: { bg: 'bg-green-50 hover:bg-green-100', iconBg: 'bg-green-200 text-green-800', text: 'text-green-900', subtext: 'text-green-700' },
        yellow: { bg: 'bg-yellow-50 hover:bg-yellow-100', iconBg: 'bg-yellow-200 text-yellow-800', text: 'text-yellow-900', subtext: 'text-yellow-700' },
        red: { bg: 'bg-red-50 hover:bg-red-100', iconBg: 'bg-red-200 text-red-800', text: 'text-red-900', subtext: 'text-red-700' },
    };
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-6">Aksi Cepat</h2>

    <div class="space-y-3">
        {#each actions as action (action.key)}
            {@const style = colorClasses[action.color] || colorClasses.blue}
            <a href={action.href} class="block w-full p-4 rounded-lg transition-colors group {style.bg}">
                <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg transition-colors {style.iconBg}">
                        <Icon icon={action.icon} class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="font-medium text-sm {style.text}">
                            {action.title}
                        </p>
                        <p class={`text-xs ${style.subtext}`}>
                            {action.description}
                        </p>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>
