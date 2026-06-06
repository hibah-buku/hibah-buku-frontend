<script>
	import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
	let { data, form } = $props();
	let selectedFile = $state(null);
	let loading = $state(false);

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
	<div class="bg-white rounded-2xl shadow-md border p-8">

		<h1 class="text-2xl font-bold mb-2">Upload Kontrak</h1>
		<p class="text-gray-500 mb-6">Unggah kontrak dalam format PDF.</p>

		{#if form?.success}
			<div class="flex flex-col items-center text-center py-8 gap-4">
				<div class="text-6xl">✅</div>
				<h2 class="text-xl font-semibold text-green-700">Upload Berhasil!</h2>
				<p class="text-gray-600">{form.message}</p>

				<div class="mt-2 w-full p-4 border rounded-xl bg-green-50 text-left">
					<h3 class="font-semibold text-green-700 mb-1">Status Kontrak</h3>
					<p class="text-sm text-gray-600">
						🕐 File Anda sedang dalam antrian dan akan divalidasi oleh admin.
						Anda akan mendapat pemberitahuan setelah proses selesai.
					</p>
				</div>

				<button
					type="button"
					onclick={resetForm}
					class="mt-2 px-6 py-2 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50"
				>
					Upload File Lain
				</button>
			</div>

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
							<div class="text-5xl mb-3">📄</div>
							<p class="font-medium">Klik untuk memilih PDF</p>
							<p class="text-sm text-gray-500 mt-1">PDF • Maksimal 5 MB</p>
						</div>
					{:else if clientError()}
						<div class="text-center px-4">
							<div class="text-5xl mb-3">❌</div>
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
					<div class="mt-3 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
						⚠️ {clientError()}
					</div>
				{/if}

				{#if form?.message && !form?.success}
					<div class="mt-3 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
						⚠️ {form.message}
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
							<span>Upload Kontrak</span>
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
