<script>
    import Icon from '@iconify/svelte';
    import { ADMIN_ROUTE_MAP } from '$lib/api/config/adminRoutes';

    let { links = [] } = $props();

    function getIconForLink(key) {
        if (key.includes('user')) return 'heroicons:users';
        if (key.includes('willingness')) return 'heroicons:document-text';
        if (key.includes('contract')) return 'heroicons:clipboard-document-check';
        return 'heroicons:arrow-right-circle'; // Default
    }

    function getColorForLink(key) {
        if (key.includes('user')) return 'blue';
        if (key.includes('willingness')) return 'yellow';
        if (key.includes('contract')) return 'green';
        return 'blue';
    }

    function getUiHref(key) {
        return ADMIN_ROUTE_MAP[key] || ADMIN_ROUTE_MAP['default'];
    }

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
        {#each Object.entries(links) as [key, linkData] (key)}
            {#if key !== 'self' && linkData.href}
            {@const style = colorClasses[getColorForLink(key)] || colorClasses.blue}
            <a href={getUiHref(key)} class="block w-full p-4 rounded-lg transition-colors group {style.bg}">
                <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg transition-colors {style.iconBg}">
                        <Icon icon={getIconForLink(key, linkData.message)} class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="font-medium {style.text}">
                            {linkData.message || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p class={`text-xs ${style.subtext}`}>
                            Kelola Data Terkait
                        </p>
                    </div>
                </div>
            </a>
            {/if}
        {/each}
    </div>
</div>
