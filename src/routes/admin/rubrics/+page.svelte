<script>
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let { data, form } = $props();

	let rubrics = $derived(data.rubrics || []);

	let newRubricName = $state('');
	let newRubricMaxScore = $state(5);
	let newRubricType = $state('Both');
	let editingRubricId = $state(null);
	let message = $state('');
	let messageClass = $state('');

	$effect(() => {
		if (form?.message) {
			message = form.message;
			messageClass = form.success
				? 'bg-green-50 text-green-800 border-green-200'
				: 'bg-red-50 text-red-800 border-red-200';

			if (form.success) {
				newRubricName = '';
				newRubricMaxScore = 5;
				newRubricType = 'Both';
				editingRubricId = null;
				invalidateAll();
			}

			setTimeout(() => { message = ''; }, 5000);
		}
	});

	function editRubric(r) {
		newRubricName = r.criteria_name;
		newRubricMaxScore = r.max_score;
		newRubricType = r.applicable_book_type || 'Both';
		editingRubricId = r.id;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function cancelEdit() {
		newRubricName = '';
		newRubricMaxScore = 5;
		newRubricType = 'Both';
		editingRubricId = null;
		message = '';
	}
</script>

<div class="min-h-screen bg-transparent pb-12">
	<div class="mx-auto max-w-5xl md:p-2 mt-4">
		<div class="grid grid-cols-1 gap-6">
			<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
				<div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
					<h2 class="text-lg font-bold text-gray-800">
						{editingRubricId ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}
					</h2>
				</div>

				<form
					method="POST"
					action={editingRubricId ? '?/update' : '?/create'}
					use:enhance={() => {
						return async ({ result }) => {
							await applyAction(result);
						};
					}}
					class="space-y-4 p-6"
				>
					{#if editingRubricId}
						<input type="hidden" name="id" value={editingRubricId} />
					{/if}
					<div class="flex flex-col items-end gap-4 md:flex-row">
						<div class="w-full flex-1">
							<label
								for="criteria_name"
								class="mb-15 block text-xs font-semibold tracking-wider text-gray-600 uppercase"
								>Nama Kriteria / Deskripsi</label
							>
							<input
								id="criteria_name"
								name="criteria_name"
								bind:value={newRubricName}
								type="text"
								class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
								placeholder="Contoh: Orisinalitas Naskah & Kebaruan..."
							/>
						</div>

						<div class="w-full md:w-48">
							<label
								for="applicable_book_type"
								class="mb-15 block text-xs font-semibold tracking-wider text-gray-600 uppercase"
								>Jenis Buku</label
							>
							<select
								id="applicable_book_type"
								name="applicable_book_type"
								bind:value={newRubricType}
								class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
							>
								<option value="Both">Keduanya</option>
								<option value="Buku Ajar">Buku Ajar</option>
								<option value="Buku Referensi">Buku Referensi</option>
							</select>
						</div>

						<div class="w-full md:w-32">
							<label
								for="max_score"
								class="mb-15 block text-xs font-semibold tracking-wider text-gray-600 uppercase"
								>Skor Maks</label
							>
							<input
								id="max_score"
								name="max_score"
								bind:value={newRubricMaxScore}
								type="number"
								min="1"
								class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
							/>
						</div>

						<div class="flex w-full gap-2 md:w-auto md:flex-col lg:flex-row mt-4 md:mt-0">
							<button
								type="submit"
								class="flex flex-1 items-center justify-center gap-1 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]"
							>
								{editingRubricId ? 'Simpan' : 'Tambah'}
							</button>
							{#if editingRubricId}
								<button
									type="button"
									onclick={cancelEdit}
									class="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300 active:scale-[0.98]"
								>
									Batal
								</button>
							{/if}
						</div>
					</div>

					{#if message}
						<div
							class={`rounded-lg border p-3.5 text-sm font-medium ${messageClass} animate-fadeIn transition-all`}
						>
							{message}
						</div>
					{/if}
				</form>
			</div>

			<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
				<div
					class="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div>
						<h2 class="text-lg font-bold text-gray-800">Daftar Rubrik Saat Ini</h2>
						<p class="text-xs text-gray-500">
							Seluruh komponen nilai yang akan tampil pada form evaluasi reviewer.
						</p>
					</div>
					<a
						href="/admin/rubrics"
						data-sveltekit-reload
						class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
					>
						<Icon icon="heroicons:arrow-path" class="h-3.5 w-3.5" />
						Segarkan Data
					</a>
				</div>

				{#if rubrics.length === 0}
					<div
						class="flex flex-col items-center justify-center bg-gray-50/50 px-4 py-12 text-center"
					>
						<div
							class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"
						>
							<Icon icon="heroicons:clipboard-document-list" class="h-6 w-6" />
						</div>
						<h3 class="text-sm font-semibold text-gray-700">Belum Ada Data Rubrik</h3>
						<p class="mt-1 max-w-xs text-xs text-gray-400">
							Silakan isi formulir di atas untuk mendaftarkan kriteria penilaian baru.
						</p>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full border-collapse text-left">
							<thead>
								<tr class="border-b border-gray-200 bg-gray-50">
									<th class="w-16 p-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">ID</th>
									<th class="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase">Nama Kriteria</th>
									<th class="w-32 p-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">Jenis Buku</th>
									<th class="w-24 p-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">Skor Maks</th>
									<th class="w-32 p-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">Aksi</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100">
								{#each rubrics as r (r.id)}
									<tr class="transition-colors hover:bg-indigo-50/20">
										<td class="p-4 text-center font-mono text-sm text-gray-400">#{r.id}</td>
										<td class="p-4 text-sm font-medium text-gray-800">{r.criteria_name}</td>
										<td class="p-4 text-center text-xs text-gray-600">
											<span class="inline-block rounded-full bg-blue-50 px-2 py-1 border border-blue-100 text-blue-700 font-medium">
												{r.applicable_book_type || 'Both'}
											</span>
										</td>
										<td class="p-4 text-center">
											<span class="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
												{r.max_score} Poin
											</span>
										</td>
										<td class="p-4 text-center">
											<div class="flex items-center justify-center gap-2">
												<button onclick={() => editRubric(r)} class="text-indigo-600 hover:text-indigo-800" title="Edit">
													<Icon icon="heroicons:pencil-square" class="h-4 w-4" />
												</button>
												<form method="POST" action="?/delete" use:enhance={() => {
													if (!confirm('Apakah Anda yakin ingin menghapus rubrik ini?')) {
														return ({ cancel }) => cancel();
													}
													return async ({ result }) => {
														await applyAction(result);
														invalidateAll();
													};
												}}>
													<input type="hidden" name="id" value={r.id} />
													<button type="submit" class="text-red-500 hover:text-red-700" title="Hapus">
														<Icon icon="heroicons:trash" class="h-4 w-4" />
													</button>
												</form>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	:global(.animate-fadeIn) {
		animation: fadeIn 0.2s ease-out forwards;
	}
</style>
