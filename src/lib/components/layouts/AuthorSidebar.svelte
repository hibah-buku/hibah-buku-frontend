<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	const menuItems = [
		{
			name: 'Dashboard Penulis',
			href: '/author/dashboard',
			iconActive: 'material-symbols:dashboard-outline'
		},
		{
			name: 'Upload draft',
			href: '/author/upload-draft',
			iconActive: 'material-symbols:upload-file-outline'
		},
		{
			name: 'Hasil Review',
			href: '/author/review-results',
			iconActive: 'material-symbols:rate-review-outline'
		},
		{
			name: 'Upload Revision',
			href: '/author/upload-revision',
			iconActive: 'material-symbols:edit-document-outline'
		},
		{
			name: 'Upload author document',
			href: '/author/upload-document',
			iconActive: 'material-symbols:contact-page-outline'
		},
		{
			name: 'Riwayat Dokumen',
			href: '/author/documents',
			iconActive: 'material-symbols:history'
		}
	];

	// Mengambil data user yang sedang login dari layout loader
	let user = $derived($page.data.user || { name: 'Penulis Hibah', email: 'penulis@example.com' });
	
	// Menghitung inisial dari nama lengkap penulis
	let initials = $derived(
		user.name
			? user.name
					.split(' ')
					.filter(Boolean)
					.map((n) => n[0])
					.join('')
					.substring(0, 2)
					.toUpperCase()
			: 'P'
	);
</script>

<div class="flex h-screen w-72 flex-col border-r border-gray-200 bg-gray-50 fixed">
	<!-- Logo Area -->
	<div class="border-b border-gray-100 p-6">
		<h1 class="flex items-center gap-2 text-xl font-bold text-blue-700">
			<Icon icon="heroicons:book-open" class="h-6 w-6" />
			Hibah Buku AEP
		</h1>
		<p class="mt-1 text-xs text-gray-500">Ruang Kerja Penulis</p>
	</div>

	<!-- Profile Singkat Penulis -->
	<div class="border-b border-gray-100 bg-gray-50 p-4">
		<div class="flex items-center gap-3">
			<div
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 border border-blue-200"
			>
				{initials}
			</div>
			<div class="min-w-0">
				<p class="text-sm font-semibold text-gray-800 truncate" title={user.name}>{user.name}</p>
				<p class="text-xs text-gray-500 truncate">Penulis / Author</p>
			</div>
		</div>
	</div>

	<!-- Navigation Menu -->
	<nav class="flex-1 space-y-1 overflow-y-auto p-4">
		{#each menuItems as item (item.name)}
			{@const isActive = $page.url.pathname === item.href || $page.url.pathname.startsWith(item.href + '/')}
			<a
				href={item.href}
				data-sveltekit-preload-data="hover"
				class={`
					group relative flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out
					${isActive
						? 'border-blue-700 bg-blue-100 text-blue-700 shadow-md font-semibold'
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
		<form method="POST" action="/author/logout?/logout"> 
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
