<script>
	import api, { setAuthToken } from '$lib/api';
	import { onMount } from 'svelte';

	// --- State Management (Svelte 5 Runes) ---
	let rubrics = $state([]);
	let newRubricName = $state('');
	let newRubricMaxScore = $state(25);
	let message = $state('');
	let messageClass = $state('');
	let isLoading = $state(false);

	onMount(() => {
		const token = localStorage.getItem('jwt_token');
		setAuthToken(token);
		loadRubrics();
	});

	async function loadRubrics() {
		isLoading = true;
		try {
			const res = await api.get('/rubrics');
			if (res.data.status === 'success') {
				rubrics = res.data.data;
			}
		} catch (e) {
			console.error('Failed to load rubrics', e);
			rubrics = [];
		} finally {
			isLoading = false;
		}
	}

	async function addRubric(e) {
		e.preventDefault();
		message = '';
		messageClass = '';

		if (!newRubricName || !newRubricMaxScore) {
			message = '✗ Gagal: Semua kolom wajib diisi!';
			messageClass = 'bg-red-50 text-red-800 border-red-200';
			return;
		}

		try {
			const payload = {
				criteria_name: newRubricName,
				max_score: Number(newRubricMaxScore)
			};
			const res = await api.post('/rubrics', payload);
			if (res.data.status === 'success') {
				message = '✓ Sukses: Rubrik baru berhasil ditambahkan ke sistem';
				messageClass = 'bg-green-50 text-green-800 border-green-200';
				newRubricName = '';
				newRubricMaxScore = 25;
				loadRubrics();
			} else {
				message = '✗ Gagal: ' + (res.data.message || 'Tidak dapat menyimpan data rubrik.');
				messageClass = 'bg-red-50 text-red-800 border-red-200';
			}

			// Hilangkan notifikasi dalam 5 detik
			setTimeout(() => {
				message = '';
			}, 5000);
		} catch (e) {
			message = '✗ Gagal: Tidak dapat menyimpan data rubrik.';
			messageClass = 'bg-red-50 text-red-800 border-red-200';
		}
	}
</script>

<div class="min-h-screen bg-gray-50 pb-12">
	<div class="bg-gradient-to-r from-indigo-700 to-indigo-900 px-6 py-8 text-white shadow-inner">
		<div class="mx-auto max-w-5xl">
			<h1 class="text-3xl font-bold tracking-tight">Admin - Kelola Rubrik Penilaian</h1>
			<p class="mt-2 text-sm text-indigo-200 md:text-base">
				Atur kriteria penilaian dan batas skor maksimal untuk naskah hibah buku.
			</p>
		</div>
	</div>

	<div class="mx-auto -mt-6 max-w-5xl p-4 md:p-6">
		<div class="grid grid-cols-1 gap-6">
			<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
				<div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
					<h2 class="text-lg font-bold text-gray-800">Tambah Kriteria Baru</h2>
				</div>

				<form onsubmit={addRubric} class="space-y-4 p-6">
					<div class="flex flex-col items-end gap-4 md:flex-row">
						<div class="w-full flex-1">
							<label
								for="criteria_name"
								class="mb-15 block text-xs font-semibold tracking-wider text-gray-600 uppercase"
								>Nama Kriteria / Deskripsi</label
							>
							<input
								id="criteria_name"
								bind:value={newRubricName}
								type="text"
								class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
								placeholder="Contoh: Orisinalitas Naskah & Kebaruan..."
							/>
						</div>

						<div class="w-full md:w-40">
							<label
								for="max_score"
								class="mb-15 block text-xs font-semibold tracking-wider text-gray-600 uppercase"
								>Skor Maksimal</label
							>
							<input
								id="max_score"
								bind:value={newRubricMaxScore}
								type="number"
								min="1"
								class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
							/>
						</div>

						<button
							type="submit"
							class="flex w-full items-center justify-center gap-1 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] md:w-auto"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
								><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg
							>
							Tambah
						</button>
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
					<button
						onclick={loadRubrics}
						disabled={isLoading}
						class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18"
							/>
						</svg>
						{isLoading ? 'Memuat...' : 'Segarkan Data'}
					</button>
				</div>

				{#if rubrics.length === 0}
					<div
						class="flex flex-col items-center justify-center bg-gray-50/50 px-4 py-12 text-center"
					>
						<div
							class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
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
									<th
										class="w-16 p-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase"
										>ID</th
									>
									<th class="p-4 text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Nama Kriteria</th
									>
									<th
										class="w-32 p-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Skor Maks</th
									>
									<th
										class="w-44 p-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase"
										>Tanggal Dibuat</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100">
								{#each rubrics as r (r.id)}
									<tr class="transition-colors hover:bg-indigo-50/20">
										<td class="p-4 text-center font-mono text-sm text-gray-400">#{r.id}</td>
										<td class="p-4 text-sm font-medium text-gray-800">{r.criteria_name}</td>
										<td class="p-4 text-center">
											<span
												class="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700"
											>
												{r.max_score} Poin
											</span>
										</td>
										<td class="p-4 text-center text-xs text-gray-500">{r.created_at || '—'}</td>
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
	/* Animasi halus saat alert muncul */
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
