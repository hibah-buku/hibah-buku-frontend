<script>
    import RecentActivityItem from './RecentActivityItem.svelte';

    let { activities = [] } = $props();

    // Mapping Ikon & Warna berdasarkan 'type' dari backend
    function getActivityStyle(type) {
        switch (type) {
            case 'user_registered':
                return { icon: 'heroicons:user-plus', color: 'blue' };
            case 'willingness_submitted':
                return { icon: 'material-symbols:pending-actions', color: 'yellow' };
            case 'willingness_approved':
                return { icon: 'heroicons:check-circle', color: 'green' };
            case 'willingness_rejected':
                return { icon: 'material-symbols:cancel-rounded', color: 'red' };
            case 'contract_uploaded':
                return { icon: 'clarity:contract-line', color: 'yellow' };
            case 'contract_approved':
                return { icon: 'ri:contract-line', color: 'green' };
            case 'contract_rejected':
                return { icon: 'material-symbols:contract-delete-outline-rounded', color: 'red' };
            default:
                return { icon: 'heroicons:bell', color: 'gray' };
        }
    }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
    </div>
    
    <div class="space-y-4 flex-1 max-h-[600px] overflow-y-auto">
        {#if activities.length > 0}
            {#each activities as activity, i (`${activity.type}-${activity.link ?? activity.id}-${activity.created_at}-${i}`)}
                {@const style = getActivityStyle(activity.type)}
                
                <RecentActivityItem 
                    icon={style.icon}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time_ago}
                    color={style.color}
                    link={activity.link}
                />
            {/each}
        {:else}
            <div class="text-center py-8 text-gray-500">
                <p>Belum ada aktivitas terbaru.</p>
            </div>
        {/if}
    </div>
</div>