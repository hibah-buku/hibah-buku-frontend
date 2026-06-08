<script>
    import { page } from '$app/stores';
    import NotificationBell from './NotificationBell.svelte';

    function getPageTitle(pathname) {
        if (pathname.includes('/users')) return "Manajemen User";
        if (pathname.includes('/contracts')) return "Kontrak Hibah";
        if (pathname.includes('/willingness-form')) return "Formulir Kesediaan";
        if (pathname.includes('/dashboard')) return "Dashboard Admin";
        return "Dashboard";
    }

    let pageTitle = $derived(getPageTitle($page.url.pathname));
    let user = $derived($page.data.user || { name: 'Super Admin', role: 'Administrator', email: 'admin@example.com' });
    let initials = $derived(
        user.name
            ? user.name
                  .split(' ')
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
            : 'A'
    );
</script>

<header class="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
    
    <!-- Bagian Kiri: Judul & Subjudul -->
    <div>
        <h1 class="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        <p class="text-sm text-gray-500 mt-1">
            Selamat datang, pantau aktivitas sistem hibah buku Anda.
        </p>
    </div>

    <!-- Bagian Kanan: Notifikasi & Profil -->
    <div class="flex items-center gap-4">
        <NotificationBell />

        <div class="h-8 w-px bg-gray-200"></div>

        <!-- Dropdown Profil -->
        <div class="flex items-center gap-3 group">
            <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-gray-800">{user.name}</p>
                <p class="text-xs text-gray-500">{user.role || 'Administrator'}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm group-hover:border-blue-200 transition-colors">
                {initials}
            </div>
        </div>
    </div>
</header>
