<script>
	import Icon from '@iconify/svelte';

	let { manuscripts = [] } = $props();
</script>

<div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h2 class="text-lg font-semibold text-gray-800">Tinjau naskah pra-cetak</h2>
		</div>
		<a href="/publisher/manuscripts" class="text-sm font-medium text-blue-600 hover:underline">Lihat semua</a>
	</div>

	<div class="max-h-150 space-y-4 overflow-y-auto">
		{#if manuscripts.length > 0}
			{#each manuscripts as manuscript (manuscript.id)}
				<a href={`/publisher/manuscripts/${manuscript.id}`} class="block">
					<div class="flex items-start gap-4 rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100">
						<div class="shrink-0 rounded-full bg-blue-100 p-2 text-blue-600">
							<Icon icon="heroicons:document-text" class="h-8 w-8" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-base font-medium text-gray-800">{manuscript.title ?? 'Tanpa Judul'}</p>
							<p class="mt-1 text-sm text-gray-500">{manuscript.author_name ?? '-'} • {manuscript.author_email ?? '-'}</p>
						</div>
					</div>
				</a>
			{/each}
		{:else}
			<div class="py-8 text-center text-gray-500">Belum ada naskah pra-cetak.</div>
		{/if}
	</div>
</div>
