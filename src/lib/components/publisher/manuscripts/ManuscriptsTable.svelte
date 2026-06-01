<script>
	import Icon from '@iconify/svelte';

	let { manuscripts = [], meta = {} } = $props();

	function normalizeStatusKey(value) {
		return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '_');
	}

	function statusMeta(value) {
		const statusKey = normalizeStatusKey(value);
		if (statusKey === 'to_print') return { label: 'Siap cetak', className: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: 'heroicons:check-badge' };
		if (statusKey === 'publisher_revised' || statusKey === 'revised') return { label: 'Revisi', className: 'bg-amber-100 text-amber-800 border-amber-200', icon: 'heroicons:exclamation-circle' };
		if (statusKey === 'preprint' || statusKey === 'pra_cetak' || statusKey === 'pre_print' || statusKey === 'pre-cetak') return { label: 'Pra-cetak', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'heroicons:document-text' };
		return { label: statusKey.replace(/_/g, ' ') || 'Tidak diketahui', className: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'heroicons:question-mark-circle' };
	}
</script>

<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm text-gray-600">
			<thead class="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
				<tr>
					<th class="px-6 py-4">Naskah</th>
					<th class="px-6 py-4">Penulis</th>
					<th class="px-6 py-4">Status</th>
					<th class="px-6 py-4 text-right">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#if manuscripts.length > 0}
					{#each manuscripts as manuscript (manuscript.id)}
						{@const status = statusMeta(manuscript.status)}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900">{manuscript.title ?? 'Tanpa Judul'}</div>
								{#if manuscript.author_email}
									<div class="mt-1 text-xs text-gray-500">{manuscript.author_email}</div>
								{/if}
							</td>
							<td class="px-6 py-4">{manuscript.author_name ?? '-'}</td>
							<td class="px-6 py-4">
								<span class={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium capitalize ${status.className}`}>
									<Icon icon={status.icon} class="h-5 w-5" />
									{status.label}
								</span>
							</td>
							<td class="px-6 py-4 text-right">
								<a href={`/publisher/manuscripts/${manuscript.id}`} class="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700">
									<Icon icon="heroicons:document-text" class="h-4 w-4" />
									Review
								</a>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="4" class="px-6 py-8 text-center text-gray-500">Tidak ada naskah ditemukan.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	{#if meta.total ?? meta.last_page}
		<div class="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
			<p>Menampilkan {manuscripts.length} naskah</p>
		</div>
	{/if}
</div>
