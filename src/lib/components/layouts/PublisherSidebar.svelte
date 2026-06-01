<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	const menuItems = [
		{
			name: 'Dashboard',
			href: '/publisher/dashboard',
			icon: 'heroicons:home'
		},
		{
			name: 'Naskah',
			href: '/publisher/manuscripts',
			icon: 'heroicons:document-text'
		}
	];
</script>

<div class="flex h-screen w-72 flex-col border-r border-gray-200 bg-gray-50 fixed">
	<div class="border-b border-gray-100 p-6">
		<h1 class="flex items-center gap-2 text-xl font-bold text-blue-700">
			<Icon icon="heroicons:book-open" class="h-6 w-6" />
			Hibah Buku AEP
		</h1>
		<p class="mt-1 text-xs text-gray-500">Penerbit</p>
	</div>

	<nav class="flex-1 space-y-1 overflow-y-auto p-4">
		{#each menuItems as item (item.name)}
			{@const isActive = $page.url.pathname.startsWith(item.href)}
			<a
				href={item.href}
				data-sveltekit-preload-data="hover"
				class={`group relative flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${isActive ? 'border-blue-700 bg-blue-100 text-blue-700 shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
			>
				{#if isActive}
					<span class="absolute right-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-r-full bg-blue-600"></span>
				{/if}
				<Icon
					icon={item.icon}
					class={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110 text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
				/>
				<span class="truncate">{item.name}</span>
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
