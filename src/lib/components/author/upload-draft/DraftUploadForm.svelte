<script>
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';

	let props = $props();
	let willingness = $derived(props.willingness);
	let contract = $derived(props.contract);
	let form = $derived(props.form);

	let loading = $state(false);
	let fileName = $state('');
	let fileInput = $state(null);

	// Pre-fill form inputs dinamis
	let title = $state('');
	let category = $state('');
	let abstract = $state('');
	let pageCount = $state(100);
	let fieldOfStudy = $state('');
	let institution = $state('');

	// Memicu sinkronisasi state secara reaktif dari props.willingness
	$effect(() => {
		if (props.willingness) {
			title = props.willingness.book_title || '';
			fieldOfStudy = props.willingness.field_of_study || '';
			institution = props.willingness.main_author_institution || '';
			console.log('[DEBUG FORM] Berhasil mensinkronkan willingness:', props.willingness);
		}
	});

	function handleFileChange(event) {
		const files = event.target.files;
		if (files.length > 0) {
			fileName = files[0].name;
		}
	}

	function handleDragOver(event) {
		event.preventDefault();
	}

	function handleDrop(event) {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files.length > 0) {
			fileName = files[0].name;
			if (fileInput) {
				fileInput.files = files;
			}
		}
	}
</script>

{#if !contract || contract.status !== 'contract_validated'}
	<div class="rounded-2xl border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
		<div class="h-16 w-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
			<Icon icon="heroicons:lock-closed" class="h-8 w-8 text-amber-600" />
		</div>
		<h4 class="text-xl font-bold text-gray-800">Unggah Draft Belum Diizinkan</h4>
		<p class="text-sm text-gray-600 max-w-md leading-relaxed">
			Anda belum dapat mengunggah atau mengisi draft naskah sebelum berkas kontrak kerja sama Anda 
			diunggah dan disetujui/divalidasi oleh pihak admin.
		</p>
		<div class="pt-2">
			<a 
				href="/author/dashboard" 
				class="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow"
			>
				<Icon icon="heroicons:arrow-left" class="h-4 w-4" />
				Kembali ke Dashboard
			</a>
		</div>
	</div>
{:else}
<div class="space-y-6">
	<!-- Info Blind Review -->
	<div class="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800 flex gap-3 shadow-sm">
		<Icon icon="heroicons:information-circle-20-solid" class="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
		<div class="text-sm">
			<span class="font-bold">Kebijakan Blind Review:</span> Demi kelancaran proses evaluasi secara objektif, mohon pastikan berkas naskah (*draft*) yang diunggah **tidak mencantumkan nama penulis**, identitas lembaga, atau afiliasi apa pun di dalam halaman naskah.
		</div>
	</div>

	<!-- Error Alert dari Laravel -->
	{#if form?.message}
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 flex flex-col gap-2 shadow-sm">
			<div class="flex gap-2 items-center font-bold">
				<Icon icon="heroicons:exclamation-triangle" class="h-5 w-5 text-red-600" />
				Gagal Mengunggah Usulan Naskah
			</div>
			<p class="text-sm text-red-600">{form.message}</p>
			{#if form.errors}
				<ul class="list-disc pl-5 text-xs text-red-600 space-y-0.5">
					{#each Object.entries(form.errors) as [field, msgs] (field)}
						{#each msgs as msg (msg)}
							<li><strong>{field}:</strong> {msg}</li>
						{/each}
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	<!-- Form Card -->
	<div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
		<!-- Card Header -->
		<div class="border-b border-gray-100 bg-gray-50/50 p-6">
			<h3 class="text-lg font-bold text-gray-800">Formulir Pengusulan Draft Buku</h3>
			<p class="text-xs text-gray-500 mt-1">Lengkapi berkas identitas usulan buku dan lampirkan naskah lengkap Anda.</p>
		</div>

		<!-- Success State Notification (Upload draft sudah terkirim) -->
		{#if form?.success}
			<div class="p-8 text-center flex flex-col items-center justify-center space-y-4">
				<div class="h-16 w-16 rounded-full bg-green-150 text-green-600 flex items-center justify-center border border-green-200">
					<Icon icon="heroicons:check-circle" class="h-12 w-12 animate-bounce text-green-600" />
				</div>
				<h4 class="text-2xl font-extrabold text-green-700">Upload draft sudah terkirim! 🚀</h4>
				<p class="text-sm text-gray-600 max-w-md leading-relaxed">
					Naskah usulan draft buku Anda <strong>"{form.manuscript?.title}"</strong> telah berhasil kami terima 
					dan masuk ke antrean penilaian oleh tim reviewer ahli.
				</p>
				<div class="flex gap-2">
					<a 
						href="/author/dashboard"
						class="rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 text-sm font-semibold transition-colors duration-150 cursor-pointer shadow"
					>
						Kembali ke Dashboard
					</a>
				</div>
			</div>
		{:else}
			<!-- Main Form -->
			<form 
				method="POST" 
				enctype="multipart/form-data"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}} 
				class="p-6 space-y-6"
			>
				<!-- Grid input untuk judul & Jenis Buku -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="book-title" class="text-sm font-semibold text-gray-700 block">Judul Buku Usulan</label>
						<input 
							id="book-title" 
							name="title"
							type="text" 
							required
							bind:value={title}
							disabled={loading}
							placeholder="Masukkan judul naskah lengkap..." 
							class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium"
						/>
					</div>

					<div class="space-y-2">
						<label for="book-type" class="text-sm font-semibold text-gray-700 block">Jenis Buku</label>
						<input type="hidden" name="book_type" value={willingness?.book_type || ''} />
						<input 
							id="book-type" 
							type="text" 
							disabled
							value={willingness?.book_type === 'bukuajar' ? 'Buku Ajar' : willingness?.book_type === 'bukureferensi' ? 'Buku Referensi' : 'Ditentukan dari Kesediaan'} 
							class="w-full rounded-lg border border-gray-300 p-2.5 text-sm bg-gray-100 text-gray-600 focus:outline-none cursor-not-allowed font-semibold"
						/>
					</div>
				</div>

				<!-- Grid input untuk kategori, Halaman, Prodi, Institusi -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="book-category" class="text-sm font-semibold text-gray-700 block">Kategori / Kluster Keilmuan</label>
						<select 
							id="book-category" 
							name="category"
							required
							bind:value={category}
							disabled={loading}
							class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
						>
							<option value="">Pilih Kluster Keilmuan...</option>
							<option value="saintek">Sains & Teknologi (Saintek)</option>
							<option value="soshum">Sosial & Humaniora (Soshum)</option>
						</select>
					</div>

					<div class="space-y-2">
						<label for="page-count" class="text-sm font-semibold text-gray-700 block">Jumlah Halaman (Estimasi)</label>
						<input 
							id="page-count" 
							name="page_count"
							type="number" 
							min="1"
							required
							bind:value={pageCount}
							disabled={loading}
							class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<label for="field-study" class="text-sm font-semibold text-gray-700 block">Program Studi / Bidang Kajian</label>
						<input 
							id="field-study" 
							name="field_of_study"
							type="text" 
							bind:value={fieldOfStudy}
							disabled={loading}
							placeholder="Misal: Teknik Informatika" 
							class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
						/>
					</div>

					<div class="space-y-2">
						<label for="institution" class="text-sm font-semibold text-gray-700 block">Nama Institusi / Afiliasi</label>
						<input 
							id="institution" 
							name="institution"
							type="text" 
							required
							bind:value={institution}
							disabled={loading}
							placeholder="Misal: Universitas Indonesia" 
							class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
						/>
					</div>
				</div>

				<!-- Sinopsis / Abstrak Singkat -->
				<div class="space-y-2">
					<label for="book-synopsis" class="text-sm font-semibold text-gray-700 block">Sinopsis / Abstrak Singkat</label>
					<textarea 
						id="book-synopsis" 
						name="abstract"
						rows="4" 
						required
						bind:value={abstract}
						disabled={loading}
						placeholder="Tuliskan ringkasan materi usulan naskah Anda yang menggambarkan pokok pikiran tulisan secara komprehensif..." 
						class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
					></textarea>
				</div>

				<!-- File Upload Area -->
				<div class="space-y-2">
					<label class="text-sm font-semibold text-gray-700 block">Unggah Berkas Naskah (Draft Utama)</label>
					<div 
						role="button"
						tabindex="0"
						ondragover={handleDragOver}
						ondrop={handleDrop}
						onclick={() => fileInput && fileInput.click()}
						onkeydown={(e) => e.key === 'Enter' && fileInput && fileInput.click()}
						class={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors duration-150 cursor-pointer
							${fileName ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}
						`}
					>
						<input 
							type="file" 
							name="manuscript_file"
							required
							accept=".pdf,.doc,.docx"
							bind:this={fileInput}
							onchange={handleFileChange}
							class="hidden"
						/>
						
						<div class={`h-12 w-12 rounded-full flex items-center justify-center border
							${fileName ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-gray-100 border-gray-200 text-gray-400'}
						`}>
							<Icon icon={fileName ? 'material-symbols:file-present-outline' : 'material-symbols:cloud-upload-outline'} class="h-6 w-6" />
						</div>

						<div class="text-center space-y-1">
							{#if fileName}
								<p class="text-sm font-semibold text-blue-700">{fileName}</p>
								<p class="text-xs text-gray-500">Berkas terpilih. Klik untuk ganti berkas.</p>
							{:else}
								<p class="text-sm font-semibold text-gray-700">Tarik berkas naskah ke sini, atau <span class="text-blue-700">Pilih File</span></p>
								<p class="text-xs text-gray-400">Menerima format *.PDF, *.DOC, atau *.DOCX dengan ukuran maksimal 20MB.</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="flex justify-end pt-4 border-t border-gray-100">
					<button 
						type="submit" 
						disabled={loading}
						class="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
					>
						{#if loading}
							<Icon icon="svg-spinners:ring-resize" class="h-5 w-5 text-blue-100 animate-spin" />
							Mengirim Draft...
						{:else}
							<Icon icon="material-symbols:send-outline" class="h-5 w-5" />
							Kirim Naskah Usulan
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
{/if}
