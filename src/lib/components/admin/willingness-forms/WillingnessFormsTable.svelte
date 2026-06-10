<script>
	import Icon from '@iconify/svelte';

	let { forms = [], meta = {} } = $props();

	let showRejectModal = $state(false);

	let selectedForm = $state(null);

	// Helper untuk warna badge status
	function getStatusStyle(status) {
		switch (status?.toLowerCase()) {
			case 'approved':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'rejected':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	function getIconStyle(status) {
		switch (status?.toLowerCase()) {
			case 'approved':
				return 'heroicons:check-circle';
			case 'rejected':
				return 'material-symbols:cancel-rounded';
			case 'pending':
				return 'material-symbols:pending-actions';
		}
	}
</script>

<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm text-gray-600">
			<thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
				<tr>
					<th class="px-6 py-4">Judul Buku</th>
					<th class="px-6 py-4">Penulis Utama</th>
					<th class="px-6 py-4">Email</th>
					<th class="px-6 py-4">Status</th>
					<th class="px-6 py-4 text-right">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#if forms.length > 0}
					{#each forms as form (form.id)}
						{@const bookTitle = form.book?.title ?? 'Tanpa Judul'}
						{@const authorName = form.main_author?.name ?? 'Tanpa Nama'}
						{@const email = form.main_author?.email ?? '-'}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900">{bookTitle}</div>
								{#if form.book?.abstract}
									<div class="mt-1 max-w-[200px] truncate text-xs text-gray-500">
										{form.book.abstract.substring(0, 50)}...
									</div>
								{/if}
							</td>
							<td class="px-6 py-4">
								{authorName}
							</td>
							<td class="px-6 py-4">
								{email}
							</td>
							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium capitalize ${getStatusStyle(form.status)}`}
								>
									<Icon icon={getIconStyle(form.status)} class="h-5 w-5" />
									{form.status}
								</span>
							</td>
							<td class="space-x-2 px-6 py-4 text-right">
								<!-- Tombol Detail -->
								<a
									href="/admin/willingness-form/{form.id}"
									class="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-blue-600 px-3 py-2 text-xs font-medium text-blue-50 transition-colors hover:bg-blue-800"
								>
									<Icon icon="boxicons:form" class="h-5 w-5" />
									Detail
								</a>
								<!-- Tombol Aksi Cepat -->
								{#if form.status === 'pending'}
									<form method="POST" action="?/approve" class="inline">
										<input type="hidden" name="id" value={form.id} />

										<button
											type="submit"
											class="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-green-600 px-3 py-2 text-xs font-medium text-green-50 transition-colors hover:bg-green-800"
										>
											<Icon icon="material-symbols:check-circle-outline" class="h-5 w-5" />
											Setuju
										</button>
									</form>

									<form method="POST" action="?/reject" class="inline">
										<input type="hidden" name="id" value={form.id} />

										<button
											type="button"
											onclick={() => {
												selectedForm = form;
												showRejectModal = true;
											}}
											class="inline-flex cursor-pointer items-center gap-1 rounded-sm bg-red-600 px-3 py-2 text-xs font-medium text-red-50 transition-colors hover:bg-red-800"
										>
											<Icon icon="material-symbols:cancel-outline-rounded" class="h-5 w-5" />
											Tolak
										</button>
									</form>
								{/if}
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-gray-500">
							Tidak ada data formulir ditemukan.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Pagination (Sama seperti User Table) -->
	{#if meta.last_page && meta.last_page > 1}
		<div class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
			<p class="text-xs text-gray-500">
				Menampilkan {meta.from} - {meta.to} dari {meta.total} data
			</p>
			<!-- Tombol Prev/Next bisa ditambahkan di sini -->
		</div>
	{/if}

	{#if showRejectModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="w-full max-w-lg rounded-sm shadow-xl bg-white">
				<div class="border-b rounded-t-sm border-red-500 bg-red-50 px-6 py-4">
					<div class="flex flex-col items-start">
                        <div class="flex items-center gap-2">
                            <Icon icon="heroicons:x-circle" class="w-10 h-10 text-red-600" />
                            <h3 class="text-lg font-semibold">Konfirmasi Penolakan</h3>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">
                            Formulir akan ditolak dan alasan penolakan akan disimpan.
                        </p>
                    </div>
				</div>

				<form method="POST" action="?/reject">
					<input type="hidden" name="id" value={selectedForm?.id} />
					<div class="space-y-4 p-6">
						<div class="rounded-lg border border-red-200 bg-red-50 p-4">
							<p class="text-sm text-red-700">Anda akan menolak formulir:</p>

							<p class="mt-1 font-semibold text-red-800">
								{selectedForm?.book?.title}
							</p>
						</div>

						<div>
							<label for="rejection_reason" class="mb-2 block text-sm font-medium text-gray-700">
								Alasan Penolakan
							</label>

							<textarea
								id="rejection_reason"
								name="rejection_reason"
								rows="5"
								required
								class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none disabled:bg-gray-50"
								placeholder="Masukkan alasan penolakan..."
							></textarea>
						</div>
					</div>

					<div class="flex justify-end gap-3 p-4">
						<button
							type="button"
							onclick={() => {
								showRejectModal = false;
								selectedForm = null;
							}}
							class="rounded-sm border border-gray-300 px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
						>
							Batal
						</button>

						<button type="submit" class="flex gap-2 items-center rounded-sm bg-red-600 px-4 py-2 text-gray-200 cursor-pointer">
                            <Icon icon="heroicons:x-mark" class="w-5 h-5" />
							Tolak
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
