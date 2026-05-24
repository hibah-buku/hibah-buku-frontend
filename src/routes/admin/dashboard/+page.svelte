<script>
    import StatCard from '$lib/components/admin/dashboard/StatCard.svelte';
    import RecentActivityList from '$lib/components/admin/dashboard/RecentActivityList.svelte';
	import QuickActionPanel from '$lib/components/admin/dashboard/QuickActionPanel.svelte';

    let { data } = $props();

    const stats = $derived(data?.stats || {});
    const links = $derived(data?.links || {});
    const activities = $derived(data?.activities ?? []);

</script>

<svelte:head>
    <title>Dashboard Admin | Hibah Buku AEP</title>
</svelte:head>

<!-- Header -->
<div class="mb-6">
    <h2 class="text-lg text-gray-800 font-medium">Pantau statistik dan aktivitas terkini.</h2>
</div>

<!-- Grid Statistik -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard 
        title="Total Penulis" 
        value={stats.total_authors || 0} 
        icon="heroicons:users" 
        color="blue" 
    />
    <StatCard 
        title="Formulir Kesediaan Menunggu" 
        value={stats.pending_willingness_forms || 0} 
        icon="boxicons:form" 
        color="yellow" 
    />
    <StatCard 
        title="Kontrak Menunggu" 
        value={stats.contracts_waiting_validation || 0} 
        icon="clarity:contract-line" 
        color="rose" 
    />
    <StatCard 
        title="Total User" 
        value={stats.total_users || 0}  
        icon="heroicons:user-group" 
        color="cyan" 
    />
</div>

<!-- Layout Dua Kolom: Aktivitas & Aksi Cepat -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Kolom Kiri: Aktivitas Terbaru (Lebar 2/3) -->
    <div class="lg:col-span-2">
        <RecentActivityList {activities} />
    </div>
    
    <!-- Kolom Kanan: Quick Actions (Lebar 1/3) -->
    <div class="lg:col-span-1">
        <QuickActionPanel links={links}/>
    </div>
    
</div>