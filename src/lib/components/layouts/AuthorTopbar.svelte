<script>
	import { page } from '$app/stores';
	import NotificationBell from './NotificationBell.svelte';

	function getPageTitle(pathname) {
		if (pathname.includes('/upload-kontrak')) return 'Upload Kontrak';
		if (pathname.includes('/upload-draft')) return 'Upload Draft Buku';
		if (pathname.includes('/review-results')) return 'Hasil Review Buku';
		if (pathname.includes('/upload-revision')) return 'Upload Revisi Draft';
		if (pathname.includes('/upload-document')) return 'Upload Dokumen Penulis';
		if (pathname.includes('/dashboard')) return 'Dashboard Penulis';
		return 'Dashboard';
	}

	let pageTitle = $derived(getPageTitle($page.url.pathname));
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

<header class="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
	
	<!-- Bagian Kiri: Judul & Subjudul -->
	<div>
		<h1 class="text-2xl font-bold text-gray-800">{pageTitle}</h1>
		<p class="text-sm text-gray-500 mt-1">
			Selamat datang kembali, kelola draft hibah buku Anda dengan mudah.
		</p>
	</div>

	<!-- Bagian Kanan: Notifikasi & Profil -->
	<div class="flex items-center gap-4">
		<!-- Tombol Notifikasi -->
		<NotificationBell />

		<div class="h-8 w-px bg-gray-200"></div>

		<!-- Dropdown Profil Penulis -->
		<div class="flex items-center gap-3 group">
			<div class="text-right hidden sm:block">
				<p class="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-150">{user.name}</p>
				<p class="text-xs text-gray-500">Penulis / Author</p>
			</div>
			<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm group-hover:border-blue-200 transition-all duration-200">
				{initials}
			</div>
		</div>
	</div>
</header>
