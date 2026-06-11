<script>
	import Icon from '@iconify/svelte';

	let { manuscript } = $props();

	let fileName = $state('');
	let fileInput = $state(null);

	function handleFileChange(event) {
		console.log('FILE CHANGE');

		const files = event.target.files;

		if (files.length > 0) {
			fileName = files[0].name;

			console.log('FILE:', fileName);
		}
	}
</script>

{#if !manuscript}
	<div class="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
		<h3 class="font-bold text-yellow-700">
			Data Naskah Tidak Ditemukan
		</h3>

		<p class="mt-2 text-sm text-yellow-600">
			Sistem tidak menemukan data naskah untuk direvisi.
		</p>
	</div>

{:else if manuscript.current_status?.code !== 'revision_needed'}
	<div class="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
		<h3 class="font-bold text-blue-700">
			Belum Ada Permintaan Revisi
		</h3>

		<p class="mt-2 text-sm text-blue-600">
			Saat ini naskah Anda belum memerlukan revisi dari reviewer.
		</p>
	</div>

{:else}

	<div class="space-y-6">

		<!-- Alert Informasi -->
		<div class="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
			<div class="flex items-start gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
					<Icon
						icon="heroicons:pencil-square"
						class="h-6 w-6 text-amber-600"
					/>
				</div>

				<div>
					<h3 class="text-lg font-bold text-amber-700">
						Upload Revisi Naskah
					</h3>

					<p class="mt-1 text-sm text-amber-600">
						Silakan unggah file revisi berdasarkan hasil review
						dan catatan reviewer.
					</p>
				</div>
			</div>
		</div>

		<!-- Card Form -->
		<div
			class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
		>
			<!-- Header -->
			<div class="border-b border-gray-100 bg-gray-50 p-6">
				<h3 class="text-lg font-bold text-gray-800">
					Form Upload Revisi
				</h3>

				<p class="mt-1 text-sm text-gray-500">
					Unggah versi revisi terbaru untuk melanjutkan proses
					penilaian reviewer.
				</p>
			</div>

			<!-- Body -->
            <form
                method="POST"
                enctype="multipart/form-data"
                class="space-y-6 p-6"
            >

                <input
                    type="hidden"
                    name="manuscript_id"
                    value={manuscript.id}
                />

				<!-- Judul -->
				<div>
					<label class="mb-2 block text-sm font-semibold text-gray-700">
						Judul Naskah
					</label>

					<input
						type="text"
						value={manuscript.title}
						disabled
						class="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-gray-700 font-medium"
					/>
				</div>

				<!-- Status -->
				<div>
					<label class="mb-2 block text-sm font-semibold text-gray-700">
						Status Saat Ini
					</label>

					<div
						class="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700"
					>
						{manuscript.current_status?.label}
					</div>
				</div>

				<!-- Upload Area -->
                <div>
                    <label class="mb-3 block text-sm font-semibold text-gray-700">
                        File Revisi
                    </label>

                    <div
                        role="button"
                        tabindex="0"
                        onclick={() => fileInput?.click()}
                        class="cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-white p-8 text-center transition-all hover:border-blue-500 hover:shadow-md"
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

                        <div class="flex flex-col items-center gap-3">

                            <Icon
                                icon="material-symbols:cloud-upload-outline"
                                class="h-14 w-14 text-blue-600"
                            />

                            {#if fileName}
                                <div>
                                    <p class="text-base font-semibold text-green-700">
                                        {fileName}
                                    </p>

                                    <p class="text-sm text-gray-500">
                                        File siap diunggah
                                    </p>
                                </div>
                            {:else}
                                <div>
                                    <p class="font-semibold text-gray-700">
                                        Klik untuk memilih file revisi
                                    </p>

                                    <p class="text-sm text-gray-500">
                                        PDF, DOC, DOCX • Maksimal 20 MB
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>

				<!-- Tombol -->
				<div class="border-t border-gray-100 pt-4">
					<button
                        type="submit"
                        class="w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
                    >
                        Upload Revisi
                    </button>
				</div>

			</form>
		</div>

	</div>

{/if}