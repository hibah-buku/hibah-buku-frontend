<script>
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	
	let { data, form } = $props();
	let selectedFile = $state(null);
	let loading = $state(false);
	let showUploadForm = $state(false); // tambah ini

	let clientError = $derived(() => {
		if (!selectedFile) return null;
		const isPdf =
			selectedFile.type === 'application/pdf' ||
			selectedFile.name.toLowerCase().endsWith('.pdf');
		if (!isPdf) return 'File harus berformat PDF';
		if (selectedFile.size > 5 * 1024 * 1024) return 'Ukuran file maksimal 5 MB';
		return null;
	});

	let fileSizeFormatted = $derived(
		selectedFile
			? selectedFile.size < 1024 * 1024
				? `${(selectedFile.size / 1024).toFixed(1)} KB`
				: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
			: null
	);

	function handleFileChange(event) {
		const file = event.target.files?.[0] ?? null;
		selectedFile = file;
	}

	function resetForm() {
		selectedFile = null;
	}
</script>

<div class="max-w-2xl mx-auto">
	<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
		<!-- <h1 class="text-2xl font-bold mb-2">Upload Kontrak</h1>
		<p class="text-gray-500 mb-6">Unggah kontrak dalam format PDF.</p> -->

		<!-- PENDING: baru upload atau sudah ada kontrak pending di DB -->
		{#if form?.success || data.contract?.status === 'contract_uploaded'}
			<div class="flex flex-col items-center text-center py-8 gap-4">
				<Icon icon="material-symbols:pending-outline" class="w-16 h-16 text-green-500" />
				<h2 class="text-xl font-semibold text-green-700">
					{form?.success ? 'Upload Berhasil!' : 'Kontrak Sedang Diproses'}
				</h2>
				<p class="text-gray-600">
					{form?.message ?? 'Kontrak Anda sedang menunggu validasi dari admin.'}
				</p>

				<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
					<h3 class="font-semibold text-green-700 mb-1">Status Kontrak</h3>
					<div class="flex items-start gap-2 text-sm text-gray-600">
						<Icon icon="carbon:time" class="w-4 h-4 mt-0.5 shrink-0 text-gray-500" />
						<p>
							File Anda sedang dalam antrian dan akan divalidasi oleh admin.
							Anda akan mendapat pemberitahuan setelah proses selesai.
						</p>
					</div>
				</div>
			</div>

		<!-- APPROVED: kontrak disetujui admin -->
		{:else if data.contract?.status === 'contract_validated'}
		<div class="flex flex-col items-center text-center py-10 gap-6 max-w-lg mx-auto">
			<!-- Ikon & Judul Utama -->
			<div class="flex flex-col items-center gap-3">
				<div class="bg-green-100 p-4 rounded-full">
					<Icon icon="carbon:checkmark-outline" class="w-20 h-20 text-green-600" />
				</div>
				<h2 class="text-3xl font-bold text-gray-800">Selamat, Kontrak Disetujui!</h2>
				<p class="text-gray-600 text-lg">
					Kontrak hibah buku Anda telah divalidasi oleh admin. Silakan lanjutkan ke tahap berikutnya.
				</p>
			</div>

			<!-- Kartu Detail Kontrak -->
			<div class="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left space-y-4">
				<h3 class="font-semibold text-gray-700 border-b pb-2 mb-4">Detail Kontrak</h3>
				
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
					<div>
						<p class="text-gray-500">Status</p>
						<p class="font-medium text-green-600 flex items-center gap-2 mt-1">
							<Icon icon="carbon:checkmark-filled" class="w-4 h-4" />
							Disetujui
						</p>
					</div>
					<div>
						<p class="text-gray-500">Tanggal Validasi</p>
						<p class="font-medium text-gray-800 mt-1">
							{data.contract.validated_at ? new Date(data.contract.validated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
						</p>
					</div>
				</div>
			</div>

			<!-- Call to Action Button -->
			<a 
				href="/author/upload-draft" 
				class="mt-4 w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
			>
				<Icon icon="carbon:upload" class="w-5 h-5" />
				Lanjut ke Upload Naskah Draft
			</a>
			
			<p class="text-xs text-gray-400 mt-2">
				Pastikan Anda telah membaca panduan penulisan naskah sebelum mengunggah.
			</p>
		</div>

		<!-- REJECTED: kontrak ditolak admin -->
		{:else if data.contract?.status === 'contract_rejected'  && !showUploadForm }
			<div class="flex flex-col items-center text-center py-8 gap-4">
				<Icon icon="carbon:close-filled" class="w-16 h-16 text-red-500" />
				<h2 class="text-xl font-semibold text-red-700">Kontrak Ditolak</h2>
				<p class="text-gray-600">Kontrak Anda tidak disetujui oleh admin.</p>

				<div class="mt-2 w-full p-4 bg-white rounded-2xl shadow-md border border-gray-200 text-left">
					<h3 class="font-semibold text-red-700 mb-3">Detail Kontrak</h3>
					<div class="flex items-center gap-2 text-sm text-gray-700 mb-2">
					
					
					</div>
					<div class="flex items-center gap-2 text-sm text-red-700 font-medium mb-2">
						<Icon icon="carbon:close-outline" class="w-4 h-4 shrink-0" />
						<span>Status: Ditolak</span>
					</div>
					{#if data.contract.reason ?? data.contract.rejection_reason}
						<div class="mt-2 pt-2 border-t border-red-200">
							<p class="text-sm font-medium text-red-700 mb-1">Alasan Penolakan:</p>
							<p class="text-sm text-red-600">{data.contract.reason ?? data.contract.rejection_reason}</p>
						</div>
					{/if}
				</div>

				 <button
        type="button"
        onclick={() => showUploadForm = true}
        class="mt-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
    >
        Upload Ulang Kontrak
    </button>
			</div>

		<!-- FORM UPLOAD: belum ada kontrak -->
		{:else}
			<form
				method="POST"
				action="?/upload"
				enctype="multipart/form-data"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						if (!form?.success) selectedFile = null;
						await update();
					};
				}}
			>
				<label
					for="contract_file"
					class="flex flex-col items-center justify-center h-52 border-2 border-dashed rounded-xl cursor-pointer transition-colors
						{selectedFile && !clientError()
							? 'border-green-400 bg-green-50'
							: clientError()
								? 'border-red-400 bg-red-50'
								: 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}"
				>
					{#if !selectedFile}
						<div class="text-center">
							<Icon icon="carbon:document" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
							<p class="font-medium">Klik untuk memilih PDF</p>
							<p class="text-sm text-gray-500 mt-1">PDF • Maksimal 5 MB</p>
						</div>
					{:else if clientError()}
						<div class="text-center px-4">
							<Icon icon="carbon:close-outline" class="w-12 h-12 mx-auto mb-3 text-red-500" />
							<p class="font-semibold text-red-600">{selectedFile.name}</p>
							<p class="text-sm text-red-500 mt-1">{clientError()}</p>
						</div>
					{:else}
						<div class="text-center">
							<Icon icon="carbon:checkmark-outline" class="w-12 h-12 mx-auto mb-3 text-green-500" />
							<p class="font-semibold">{selectedFile.name}</p>
							<p class="text-sm text-gray-500 mt-1">{fileSizeFormatted}</p>
						</div>
					{/if}

					<input
						id="contract_file"
						name="contract_file"
						type="file"
						accept=".pdf,application/pdf"
						class="hidden"
						onchange={handleFileChange}
					/>
				</label>

				{#if clientError()}
					<div class="mt-3 p-3 rounded-lg bg-red-100 text-red-700 text-sm flex items-center gap-2">
						<Icon icon="carbon:warning" class="w-4 h-4 shrink-0" />
						<span>{clientError()}</span>
					</div>
				{/if}

				{#if form?.message && !form?.success}
					<div class="mt-3 p-3 rounded-lg bg-red-100 text-red-700 text-sm flex items-center gap-2">
						<Icon icon="carbon:warning" class="w-4 h-4 shrink-0" />
						<span>{form.message}</span>
					</div>
				{/if}

				<div class="mt-8 flex justify-center">
					<button
						type="submit"
						disabled={!selectedFile || !!clientError() || loading}
						class="w-52 h-12 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
					>
						{#if loading}
							<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							<span>Mengunggah...</span>
						{:else}
							<Icon icon="carbon:upload" class="w-5 h-5" />
							<span>Upload Kontrak</span>
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>