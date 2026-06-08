<script>
	import Icon from '@iconify/svelte';

	let { data } = $props();

	const form = data.form;

	let showRejectModal = $state(false);

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

			default:
				return 'material-symbols:info-outline';
		}
	}

	function getBookType(type) {
		switch (type) {
			case 'bukuajar':
				return 'Buku Ajar';

			case 'bukureferensi':
				return 'Buku Referensi';

			default:
				return '-';
		}
	}
</script>

<div class="space-y-6">

	<!-- HEADER -->
	<div class="flex items-center justify-between">

		<div>
			<h1 class="text-2xl font-bold text-gray-900">
				Detail Formulir Kesediaan
			</h1>

			<p class="text-sm text-gray-500 mt-1">
				Informasi lengkap pengajuan hibah buku.
			</p>
		</div>

	</div>

	<!-- INFORMASI BUKU -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-100">

		<div class="p-6 border-b border-gray-100">

			<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

				<div>

					<h2 class="text-xl font-bold text-gray-900">
						{form.book?.title}
					</h2>

					<p class="text-sm text-gray-500 mt-1">
						ID Formulir #{form.id}
					</p>

				</div>

				<span
					class={`inline-flex items-center px-3 py-2 gap-2 rounded-full text-xs font-medium capitalize border ${getStatusStyle(form.status)}`}
				>
					<Icon
						icon={getIconStyle(form.status)}
						class="w-5 h-5"
					/>

					{form.status}
				</span>

			</div>

		</div>

		<div class="grid md:grid-cols-2 gap-6 p-6">

			<div>
				<label class="text-xs text-gray-500">
					Jenis Buku
				</label>

				<div class="mt-1 font-medium text-gray-900">
					{getBookType(form.book?.type)}
				</div>
			</div>

			<div>
				<label class="text-xs text-gray-500">
					Bidang Ilmu
				</label>

				<div class="mt-1 font-medium text-gray-900">
					{form.book?.field_of_study || '-'}
				</div>
			</div>

			<div class="md:col-span-2">
				<label class="text-xs text-gray-500">
					Target Pembaca
				</label>

				<div class="mt-1 font-medium text-gray-900">
					{form.book?.target_audience || '-'}
				</div>
			</div>

			<div class="md:col-span-2">
				<label class="text-xs text-gray-500">
					Abstrak Buku
				</label>

				<div
					class="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed"
				>
					{form.book?.abstract || 'Tidak ada abstrak'}
				</div>
			</div>

		</div>

	</div>

	<!-- PENULIS UTAMA -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-100">

		<div class="px-6 py-4 border-b border-gray-100">

			<h3 class="font-semibold text-gray-900 flex items-center gap-2">
				<Icon
					icon="mdi:account"
					class="w-5 h-5 text-blue-600"
				/>

				Data Penulis Utama
			</h3>

		</div>

		<div class="grid md:grid-cols-2 gap-6 p-6">

			<div>
				<label class="text-xs text-gray-500">
					Nama Lengkap
				</label>

				<div class="mt-1 font-medium text-gray-900">
					{form.main_author?.name || '-'}
				</div>
			</div>

			<div>
				<label class="text-xs text-gray-500">
					Email
				</label>

				<div class="mt-1 font-medium text-gray-900">
					{form.main_author?.email || '-'}
				</div>
			</div>

			<div>
				<label class="text-xs text-gray-500">
					Institusi
				</label>

				<div class="mt-1 font-medium text-gray-900">
					{form.main_author?.institution || '-'}
				</div>
			</div>

			<div>
				<label class="text-xs text-gray-500">
					Nomor Telepon
				</label>

				<div class="mt-1 font-medium text-gray-900">
					{form.main_author?.phone || '-'}
				</div>
			</div>

		</div>

	</div>

	<!-- REKAN PENULIS -->
	{#if form.co_authors?.length > 0}

		<div class="bg-white rounded-xl shadow-sm border border-gray-100">

			<div class="px-6 py-4 border-b border-gray-100">

				<h3 class="font-semibold text-gray-900 flex items-center gap-2">
					<Icon
						icon="mdi:account-group"
						class="w-5 h-5 text-blue-600"
					/>

					Data Rekan Penulis
				</h3>

			</div>

			<div class="p-6 space-y-5">

				{#each form.co_authors as author, index}

					<div class="border border-gray-200 rounded-lg p-5">

						<h4 class="font-semibold text-gray-800 mb-4">
							Rekan Penulis {index + 1}
						</h4>

						<div class="grid md:grid-cols-3 gap-6">

							<div>
								<label class="text-xs text-gray-500">
									Nama Lengkap
								</label>

								<div class="mt-1 font-medium text-gray-900">
									{author.name || '-'}
								</div>
							</div>

							<div>
								<label class="text-xs text-gray-500">
									Email
								</label>

								<div class="mt-1 font-medium text-gray-900">
									{author.email || '-'}
								</div>
							</div>

							<div>
								<label class="text-xs text-gray-500">
									Institusi
								</label>

								<div class="mt-1 font-medium text-gray-900">
									{author.institution || '-'}
								</div>
							</div>

						</div>

					</div>

				{/each}

			</div>

		</div>

	{/if}

	<!-- CATATAN ADMIN -->
	{#if form.admin_notes}

		<div class="bg-blue-50 border border-blue-200 rounded-xl p-6">

			<h3 class="font-semibold text-blue-700 mb-2">
				Catatan Admin
			</h3>

			<p class="text-blue-700">
				{form.admin_notes}
			</p>

		</div>

	{/if}

	<!-- ALASAN PENOLAKAN -->
	{#if form.rejection_reason}

		<div class="bg-red-50 border border-red-200 rounded-xl p-6">

			<h3 class="font-semibold text-red-700 mb-2">
				Alasan Penolakan
			</h3>

			<p class="text-red-700">
				{form.rejection_reason}
			</p>

		</div>

	{/if}

	<!-- AKSI -->
	<div class="flex justify-end gap-3">

    <a
        href="/admin/willingness-form" 
        class="inline-flex items-center gap-1 px-3 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-sm font-medium text-xs transition-colors cursor-pointer">
        Kembali
    </a>

    {#if form.status === 'pending'}

		<form method="POST" action="?/approve" class="inline">
			<input type="hidden" name="id" value={form.id} />

			<button
				type="submit"
				class="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-green-50 hover:bg-green-800 rounded-sm font-medium text-xs transition-colors cursor-pointer"
			>
				<Icon
					icon="material-symbols:check-circle-outline"
					class="w-5 h-5"
				/>
				Setuju
			</button>
		</form>

		<button
			type="button"
			onclick={() => (showRejectModal = true)}
			class="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-red-50 hover:bg-red-800 rounded-sm font-medium text-xs transition-colors cursor-pointer"
		>
			<Icon
				icon="material-symbols:cancel-outline-rounded"
				class="w-5 h-5"
			/>
			Tolak
		</button>

	{/if}

    </div>

	{#if showRejectModal}

	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	>

		<div
			class="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200"
		>

			<div class="px-6 py-4 border-b border-gray-100">

				<h3 class="text-lg font-semibold text-gray-900">
					Konfirmasi Penolakan
				</h3>

				<p class="text-sm text-gray-500 mt-1">
					Formulir akan ditolak dan alasan penolakan akan disimpan.
				</p>

			</div>

			<form method="POST" action="?/reject">

				<div class="p-6 space-y-4">

					<div class="bg-red-50 border border-red-200 rounded-lg p-4">

						<p class="text-sm text-red-700">
							Anda akan menolak formulir:
						</p>

						<p class="font-semibold text-red-800 mt-1">
							{form.book?.title}
						</p>

					</div>

					<div>

						<label
							for="rejection_reason"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Alasan Penolakan
						</label>

						<textarea
							id="rejection_reason"
							name="rejection_reason"
							rows="5"
							required
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
							placeholder="Masukkan alasan penolakan..."
						></textarea>

					</div>

				</div>

				<div
					class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100"
				>

					<button
						type="button"
						onclick={() => (showRejectModal = false)}
						class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
					>
						Batal
					</button>

					<button
						type="submit"
						class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
					>
						Tolak Formulir
					</button>

				</div>

			</form>

		</div>

	</div>

	{/if}

</div>