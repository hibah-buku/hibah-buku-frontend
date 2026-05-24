<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	const menuItems = [
		{
			name: 'Dasboard',
			href: '/admin/dashboard',
			iconActive: 'material-symbols:dashboard-outline'
		},
		{
			name: 'Manajemen User',
			href: '/admin/users',
			iconActive: 'flowbite:users-group-outline'
		},
		{
			name: 'Formulir Kesediaan',
			href: '/admin/willingness-form',
			iconActive: 'boxicons:form'
		},
		{
			name: 'Kontrak',
			href: '/admin/contracts',
			iconActive: 'clarity:contract-line'
		}
	];
</script>

<div class="flex h-screen w-72 flex-col border-r border-gray-200 bg-gray-50 fixed">
	<!-- Logo Area -->
	<div class="border-b border-gray-100 p-6">
		<h1 class="flex items-center gap-2 text-xl font-bold text-blue-700">
			<Icon icon="heroicons:book-open" class="h-6 w-6" />
			Hibah Buku AEP
		</h1>
		<p class="mt-1 text-xs text-gray-500">Sistem Administrasi</p>
	</div>

	<!-- Profile Singkat (Opsional, bisa dipindah ke Topbar) -->
	<div class="border-b border-gray-100 bg-gray-50 p-4">
		<div class="flex items-center gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700"
			>
				A
			</div>
			<div>
				<p class="text-base font-semibold text-gray-800">Super Admin</p>
				<p class="text-sm text-gray-500">Administrator</p>
			</div>
		</div>
	</div>

	<!-- Navigation Menu -->
	<nav class="flex-1 space-y-1 overflow-y-auto p-4">
		{#each menuItems as item (item.name)}
			{@const isActive = $page.url.pathname.startsWith(item.href)}
			<a
				href={item.href}
                data-sveltekit-preload-data="hover"
				class={`
                group relative flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out
                ${isActive
					? ' border-blue-700 bg-blue-100 text-blue-700 shadow-md'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
				}
            `}
			>
                {#if isActive}
                    <span class="absolute right-0 top-1/2 -translate-y-1/2 h-full w-1 bg-blue-600 rounded-r-full"></span>
                {/if}
				<Icon
					icon={item.iconActive}
					class={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110 text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
				/>
				<span class="truncate">
                    {item.name}
                </span>
			</a>
		{/each}
	</nav>

	<!-- Logout Button -->
	<div class="border-t border-gray-100 p-4 shrink-0">
        <form method="POST" action="/admin/logout?/logout"> 
            <button 
                type="submit" 
                class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
            >
                <Icon icon="heroicons:arrow-right-on-rectangle" class="h-5 w-5 shrink-0" />
                Keluar
            </button>
        </form>
    </div>
</div>
