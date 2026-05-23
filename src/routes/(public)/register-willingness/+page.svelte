<script>
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { mapErrorMessage } from '$lib/utils/errorMapper';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-md">
		<!-- Header -->
		<div class="bg-blue-700 px-6 py-4">
			<h1 class="text-3xl font-semibold text-gray-100">Form Konfirmasi Kesediaan Menulis Buku</h1>
			<p class="mt-1 text-sm text-blue-100">
				Lengkapi data penulis utama, rekan penulis (jika ada), dan informasi buku.
			</p>
		</div>

		<!-- Form Content -->
		<div class="space-y-8 p-6">
			<!-- Pesan Sukses/Error -->
			{#if form?.success}
				<div class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
					<div class="mb-2 flex items-center gap-2">
						<Icon icon="lucide:circle-check" class="h-8 w-8" />
						<strong class="text-xl">Berhasil!</strong>
					</div>
					Data kesediaan Anda telah dikirim. Tim admin akan segera memproses formulir Anda.
				</div>
			{:else if form?.errors}
				<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
					<div class="mb-2 flex items-center gap-2">
						<Icon icon="tdesign:error-triangle" class="h-8 w-8" />
						<strong>Gagal!</strong>
					</div>
					Mohon perbaiki kesalahan berikut:
					<ul class="mt-2 list-inside list-disc text-sm">
						{#each Object.entries(form.errors) as [field, messages] (field)}
							{#if Array.isArray(messages)}
								{#each messages as message (message)}
									<span class="font-semibold capitalize">{mapErrorMessage(field, message)}</span>
								{/each}
							{:else}
								<!-- Fallback jika messages bukan array -->
								<li>
									<span class="font-semibold capitalize">{mapErrorMessage(field, messages)}</span>
									{messages}
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			{/if}

			<form
				method="POST"
				class="space-y-8"
				use:enhance={() => {
					loading = true;

					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
			>
				<!-- SECTION 1: Main Author & Co-author 1 -->
				<div class=" pb-6">
					<h2 class="mb-4 flex items-center text-lg font-medium text-gray-900">
                        <div class="flex items-center gap-2">
							<Icon icon="boxicons:user" class="h-8 w-8 text-blue-700" />
                            Data Penulis Utama
						</div>	
					</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<!-- Nama Penulis Utama -->
						<div>
							<label for="main_author_name" class="mb-1 block text-sm font-medium text-gray-700"
								>Nama Lengkap <span class="text-lg text-red-600">*</span></label
							>
							<input
								type="text"
								id="main_author_name"
								name="main_author_name"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Contoh: Dr. Aldho Wiratama, M.Kom."
							/>
						</div>

						<!-- Email Penulis Utama -->
						<div>
							<label for="main_author_email" class="mb-1 block text-sm font-medium text-gray-700">
								<div class="flex items-center gap-2">
									<Icon icon="ic:outline-email" class="h-5 w-5 text-blue-400" />
									Email Aktif<span class="text-lg text-red-600">*</span>
								</div>
							</label>
							<input
								type="email"
								id="main_author_email"
								name="main_author_email"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Contoh: aldho@uny.ac.id"
							/>
						</div>

						<!-- Institusi Penulis Utama -->
						<div>
							<label
								for="main_author_institution"
								class="mb-1 block text-sm font-medium text-gray-700"
							>
								<div class="flex items-center gap-2">
									<Icon icon="uil:university" class="h-5 w-5 text-gray-400" />
									Institusi / Universitas<span class="text-lg text-red-600">*</span>
								</div>
							</label>
							<input
								type="text"
								id="main_author_institution"
								name="main_author_institution"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Contoh: Universitas Negeri Yogyakarta"
							/>
						</div>

						<!-- No HP Penulis Utama -->
						<div>
							<label for="main_author_phone" class="mb-1 block text-sm font-medium text-gray-700">
								<div class="flex items-center gap-2">
									<Icon icon="ic:baseline-whatsapp" class="h-5 w-5 text-green-700" />
									Nomor Telepon (WhatsApp)<span class="text-lg text-red-600">*</span>
								</div>
							</label>
							<input
								type="tel"
								id="main_author_phone"
								name="main_author_phone"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Contoh: 08123456789"
							/>
						</div>
					</div>
				</div>

				<!-- Co-Author 1 (Wajib diisi) -->
				<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
					<h3 class="mb-3 text-lg font-medium text-gray-700">
                        <div class="flex items-center gap-2">
							<Icon icon="radix-icons:people" class="h-8 w-8 text-blue-700" />
                            Rekan Penulis 1
						</div>	
					</h3>
                    <p class="text-xs text-gray-500 font-normal mb-2">Catatan: Wajib ada 1 rekan penulis</p>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label for="co_author_1_name" class="mb-1 block text-sm font-medium text-gray-700">
								Nama Lengkap<span class="text-lg text-red-600">*</span>
							</label>
							<input
								type="text"
								name="co_author_1_name"
								id="co_author_1_name"
								placeholder="Nama Lengkap"
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label for="co_author_1_email" class="mb-1 block text-sm font-medium text-gray-700">
								<div class="flex items-center gap-2">
									<Icon icon="ic:outline-email" class="h-5 w-5 text-blue-400" />
									Email Aktif<span class="text-lg text-red-600">*</span>
								</div>
							</label>
							<input
								type="email"
								name="co_author_1_email"
								id="co_author_1_email"
								placeholder="Email"
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label
								for="co_author_1_institution"
								class="mb-1 block text-sm font-medium text-gray-700"
							>
								<div class="flex items-center gap-2">
									<Icon icon="uil:university" class="h-5 w-5 text-gray-400" />
									Institusi / Universitas<span class="text-lg text-red-600">*</span>
								</div>
							</label>
							<input
								type="text"
								name="co_author_1_institution"
								id="co_author_1_institution"
								placeholder="Institusi"
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				<div class="border-b border-gray-200"></div>

				<!-- SECTION 2: Data Co-Authors 2 - 4 (OPSIONAL) -->
				<div class="border-b border-gray-200 pb-6">
					<h2 class="mb-4 flex items-center text-lg font-medium text-gray-900">
						<div class="flex items-center gap-2">
							<Icon icon="formkit:people" class="h-8 w-8 text-blue-700" />
                            Data Rekan Penulis Lainnya (Maksimal 3 Orang)
						</div>
					</h2>

					<!-- Co-Author 2 -->
					<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
						<h3 class="mb-3 text-sm font-semibold text-gray-700">
							Rekan Penulis 2 <span class="text-gray-400">(Opsional)</span>
						</h3>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
							<input
								type="text"
								name="co_author_2_name"
								placeholder="Nama Lengkap"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
							<input
								type="email"
								name="co_author_2_email"
								placeholder="Email"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
							<input
								type="text"
								name="co_author_2_institution"
								placeholder="Institusi"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- Co-Author 3 -->
					<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
						<h3 class="mb-3 text-sm font-semibold text-gray-700">
							Rekan Penulis 3 <span class="text-gray-400">(Opsional)</span>
						</h3>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
							<input
								type="text"
								name="co_author_3_name"
								placeholder="Nama Lengkap"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
							<input
								type="email"
								name="co_author_3_email"
								placeholder="Email"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
							<input
								type="text"
								name="co_author_3_institution"
								placeholder="Institusi"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- Co-Author 4 -->
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
						<h3 class="mb-3 text-sm font-semibold text-gray-700">
							Rekan Penulis 4 <span class="text-gray-400">(Opsional)</span>
						</h3>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
							<input
								type="text"
								name="co_author_4_name"
								placeholder="Nama Lengkap"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
							<input
								type="email"
								name="co_author_4_email"
								placeholder="Email"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
							<input
								type="text"
								name="co_author_4_institution"
								placeholder="Institusi"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				<!-- SECTION 3: DATA BUKU -->
				<div class="border-b border-gray-200 pb-6">
					<h2 class="mb-4 flex items-center text-lg font-medium text-gray-900">
                        <div class="flex items-center gap-2">
							<Icon icon="bytesize:book" class="h-8 w-8 text-blue-700" />
                            Informasi Buku
						</div>
                    </h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<!-- Judul Buku -->
						<div class="md:col-span-2">
							<label for="book_title" class="mb-1 block text-sm font-medium text-gray-700"
								>Judul Buku <span class="text-lg text-red-600">*</span></label
							>
							<input
								type="text"
								id="book_title"
								name="book_title"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Pengantar Pemrograman Web Modern"
							/>
						</div>

						<!-- Jenis Buku -->
						<div>
							<label for="book_type" class="mb-1 block text-sm font-medium text-gray-700"
								>Jenis Buku <span class="text-lg text-red-600">*</span></label
							>
							<select
								id="book_type"
								name="book_type"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							>
								<option value="" disabled selected>Pilih jenis buku</option>
								<option value="bukuajar">Buku Ajar</option>
								<option value="bukureferensi">Buku Referensi</option>
							</select>
						</div>

						<!-- Bidang Ilmu -->
						<div>
							<label for="field_of_study" class="mb-1 block text-sm font-medium text-gray-700"
								>Bidang Ilmu <span class="text-lg text-red-600">*</span></label
							>
							<input
								type="text"
								id="field_of_study"
								name="field_of_study"
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Teknik Informatika"
							/>
						</div>

						<!-- Target Pembaca -->
						<div class="md:col-span-2">
							<label for="target_audience" class="mb-1 block text-sm font-medium text-gray-700"
								>Target Pembaca <span class="text-gray-400">(Opsional)</span></label
							>
							<input
								type="text"
								id="target_audience"
								name="target_audience"
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Mahasiswa S1, Dosen, Praktisi"
							/>
						</div>

						<!-- Abstrak -->
						<div class="md:col-span-2">
							<label for="book_abstract" class="mb-1 block text-sm font-medium text-gray-700"
								>Abstrak Buku <span class="text-gray-400">(Opsional)</span></label
							>
							<textarea
								id="book_abstract"
								name="book_abstract"
								rows="4"
								class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="Deskripsi singkat mengenai isi buku..."
							></textarea>
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="pt-4">
					<button
						type="submit"
						disabled={loading}
						class="w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-medium text-gray-100 transition-colors duration-200 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
					>
						{#if loading}
							<div class="flex items-center justify-center gap-2">
								<Icon icon="svg-spinners:ring-resize" class="h-5 w-5 animate-spin" />
								<span>Mengirim...</span>
							</div>
						{:else}
							<span class="flex items-center justify-center gap-2">
                                Kirim Form Kesediaan <Icon icon="fa:send" class="w-6 h-6" />
                            </span>
						{/if}
					</button>
				</div>
			</form>
		</div>

		<!-- Footer -->
		<div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
			<p class="text-center text-sm text-gray-500">
			<span class="text-lg text-red-600">*</span>
				Menandakan wajib diisi
			</p>
			<p class="text-center text-sm text-gray-500">
				Dengan mengirim formulir ini, Anda menyetujui syarat dan ketentuan program hibah buku AEP
			</p>
		</div>
	</div>
</div>
