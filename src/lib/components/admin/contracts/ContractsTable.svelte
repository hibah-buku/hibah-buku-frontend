<script>
	import Icon from '@iconify/svelte';
	import ApproveModal from './ApproveModal.svelte';
	import RejectModal from './RejectModal.svelte';

	let { contracts = [], meta = {} } = $props();

	let activeContractId = $state(null);
	let modalType = $state(null); // 'approve' | 'reject' | null

	const openModal = (type, id) => {
		activeContractId = id;
		modalType = type;
	};

	const closeModal = () => {
		activeContractId = null;
		modalType = null;
	};

	function getStatusStyle(status) {
		const s = status?.toLowerCase();
		if (s === 'contract_validated' || s === 'contract_approved')
			return 'bg-green-50 text-green-700 border-green-200';
		if (s === 'contract_rejected') return 'bg-red-50 text-red-700 border-red-200';
		if (s === 'contract_uploaded' || s === 'pending_validation')
			return 'bg-yellow-50 text-yellow-700 border-yellow-200';
		return 'bg-gray-50 text-gray-700 border-gray-200';
	}

	function getStatusIcon(status) {
		const s = status?.toLowerCase();
		if (s === 'contract_validated' || s === 'contract_approved') return 'heroicons:check-circle';
		if (s === 'contract_rejected') return 'heroicons:x-circle';
		if (s === 'contract_uploaded' || s === 'pending_validation') return 'heroicons:clock';
		return 'heroicons:document';
	}

	function formatStatus(status) {
		return status?.replace('contract_', '').replace('_', ' ').toUpperCase();
	}
</script>

<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm text-gray-600">
			<thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
				<tr>
					<th class="px-6 py-4">Nomor Kontrak</th>
					<th class="px-6 py-4">Penulis</th>
					<th class="px-6 py-4">File</th>
					<th class="px-6 py-4">Status</th>
					<th class="px-6 py-4 text-center">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#if contracts.length > 0}
					{#each contracts as contract (contract.id)}
						{@const authorName = contract.author?.name ?? 'Penulis Tidak Dikenal'}
						{@const authorEmail = contract.author?.email ?? '-'}
						{@const fileName = contract.file_info?.original_name ?? 'Tidak ada file'}
						{@const fileSize = contract.file_info?.size
							? (contract.file_info.size / 1024).toFixed(1) + ' KB'
							: '-'}
						{@const downloadUrl =
							contract._links?.download ?? `/api/contracts/${contract.id}/download`}

						<tr class="transition-colors hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="font-mono text-sm font-medium text-gray-900">#{contract.id}</div>
							</td>
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900">{authorName}</div>
								<div class="text-xs text-gray-500">{authorEmail}</div>
							</td>
							<td class="px-6 py-4">
								<div class="max-w-[150px] truncate text-sm text-gray-900" title={fileName}>
									{fileName}
								</div>
								<div class="mt-1 text-xs text-gray-500">{fileSize}</div>
							</td>
							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(contract.status)}`}
								>
									<Icon icon={getStatusIcon(contract.status)} class="h-4 w-4 shrink-0" />
									{formatStatus(contract.status)}
								</span>
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center justify-center gap-2">
									<a
										href={`/admin/contracts/${contract.id}`}
										class="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-blue-600 px-3 py-2 text-xs font-medium text-blue-50 transition-colors hover:bg-blue-800"
										title="Lihat Detail"
									>
										<Icon icon="boxicons:form" class="h-5 w-5" /> Detail
									</a>
									<a
										href={downloadUrl}
										target="_blank"
										download={fileName}
										class="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-gray-600 px-3 py-2 text-xs font-medium text-gray-50 transition-colors hover:bg-gray-800"
										title="Download Kontrak"
									>
										<Icon icon="heroicons:arrow-down-tray" class="h-5 w-5" /> Download
									</a>

									{#if contract.status === 'contract_uploaded'}
										<button
											onclick={() => openModal('approve', contract.id)}
											class="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-green-600 px-3 py-2 text-xs font-medium text-green-50 transition-colors hover:bg-green-800"
										>
											<Icon icon="material-symbols:check-circle-outline" class="h-5 w-5" />
											Setuju
										</button>
										<button
											onclick={() => openModal('reject', contract.id)}
											class="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-red-600 px-3 py-2 text-xs font-medium text-red-50 transition-colors hover:bg-red-800"
										>
											<Icon icon="material-symbols:cancel-outline-rounded" class="h-5 w-5" />
											Tolak
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-gray-500"
							>Tidak ada data kontrak ditemukan.</td
						>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
	{#if meta.last_page && meta.last_page > 1}
		<div class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
			<p class="text-xs text-gray-500">
				Menampilkan {meta.from} - {meta.to} dari {meta.total} data
			</p>
		</div>
	{/if}
</div>

<!-- Render Modal di luar tabel -->
<ApproveModal contractId={activeContractId} isOpen={modalType === 'approve'} onClose={closeModal} />
<RejectModal contractId={activeContractId} isOpen={modalType === 'reject'} onClose={closeModal} />
