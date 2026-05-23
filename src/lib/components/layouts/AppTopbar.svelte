<script>
    import { page } from '$app/stores';
    import Icon from '@Iconify/svelte';

    function getPageTitle(pathname) {
        if (pathname.includes('/users')) return "Manajemen User";
        if (pathname.includes('/contracts')) return "Kontrak Hibah";
        if (pathname.includes('/willingness-form')) return "Formulir Kesediaan";
        if (pathname.includes('/dashboard')) return "Dashboard Admin";
        return "Dashboard";
    }

    let pageTitle = $derived(getPageTitle($page.url.pathname));
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
        <button class="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
            <Icon icon="heroicons:bell" class="w-6 h-6" />
            <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div class="h-8 w-px bg-gray-200"></div>

        <!-- Dropdown Profil -->
        <div class="flex items-center gap-3 group">
            <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-gray-800">Super Admin</p>
                <p class="text-xs text-gray-500">Administrator</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm group-hover:border-blue-200 transition-colors">
                A
            </div>
        </div>
    </div>
</header>
