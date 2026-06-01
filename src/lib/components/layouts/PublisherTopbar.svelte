<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	function getPageTitle(pathname) {
		if (pathname.includes('/manuscripts')) return 'Naskah Pra-cetak';
		if (pathname.includes('/dashboard')) return 'Dashboard Penerbit';
		return 'Dashboard Penerbit';
	}

	let pageTitle = $derived(getPageTitle($page.url.pathname));
</script>

<header class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 shadow-sm">
	<div>
		<h1 class="text-2xl font-bold text-gray-800">{pageTitle}</h1>
	</div>

	<div class="flex items-center gap-4">
		<button class="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
			<Icon icon="heroicons:bell" class="h-6 w-6" />
			<span class="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"></span>
		</button>

		<div class="h-8 w-px bg-gray-200"></div>

		<div class="flex items-center gap-3 group">
			<div class="hidden text-right sm:block">
				<p class="text-sm font-semibold text-gray-800">Penerbit</p>
				<p class="text-xs text-gray-500">Publisher</p>
			</div>
			<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-2 ring-white transition-colors group-hover:ring-blue-200">
				P
			</div>
		</div>
	</div>
</header>
