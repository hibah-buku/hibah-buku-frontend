<script>
	import api from '$lib/api';
	import { onMount } from 'svelte';

	let loading = $state(true);
	let error = $state('');
	
	let unassigned = $state([]);
	let assigned = $state([]);
	let completed = $state([]);
	
	let activeTab = $state('belum_assign'); // 'belum_assign', 'belum_selesai', 'selesai'

	// Hasil Penilaian state
	let viewingResultFor = $state(null);
	let resultData = $state(null);
	let resultLoading = $state(false);
	let resultError = $state('');

	onMount(() => {
		loadTasks();
	});

	async function loadTasks() {
		loading = true;
		error = '';
		try {
			const res = await api.get('/admin/tasks');
			if (res.data?.status === 'success') {
				unassigned = res.data.data.unassigned || [];
				assigned = res.data.data.assigned || [];
				completed = res.data.data.completed || [];
			} else {
				error = res.data?.message || 'Gagal memuat tugas';
			}
		} catch (e) {
			error = e.response?.data?.message || e.message || 'Terjadi kesalahan';
		} finally {
			loading = false;
		}
	}

	function formatDate(dateStr) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleString('id-ID', {
			year: 'numeric', month: 'short', day: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}

	async function viewResult(taskId) {
		viewingResultFor = taskId;
		resultLoading = true;
		resultError = '';
		resultData = null;
		try {
			const res = await api.get(`/assignments/${encodeURIComponent(taskId)}/results`);
			if (res.data.status === 'success') {
				resultData = res.data.data;
			} else {
				resultError = res.data.message || 'Data tidak ditemukan';
			}
		} catch (e) {
			resultError = 'Gagal mengambil data: ' + (e.message || 'Terjadi kesalahan sistem');
		} finally {
			resultLoading = false;
		}
	}

	function closeResult() {
		viewingResultFor = null;
		resultData = null;
		resultError = '';
	}
</script>

<div class="p-6">
	<div class="mb-6 flex justify-between items-end">
		<div>
			<h1 class="text-2xl font-bold text-gray-800">Semua Tugas</h1>
			<p class="text-gray-600 mt-1">Pantau status seluruh naskah dan penugasan reviewer.</p>
		</div>
		<button onclick={loadTasks} class="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
			</svg>
			Refresh
		</button>
	</div>

	{#if error}
		<div class="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
			{error}
		</div>
	{/if}

	<!-- Tabs -->
	<div class="mb-6 flex gap-2 border-b border-gray-200">
		<button
			class="px-6 py-3 font-medium transition-colors border-b-2 {activeTab === 'belum_assign' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
			onclick={() => activeTab = 'belum_assign'}
		>
			Belum Assign 
			<span class="ml-2 inline-flex items-center justify-center bg-gray-100 text-gray-600 text-xs rounded-full h-5 w-5">{unassigned.length}</span>
		</button>
		<button
			class="px-6 py-3 font-medium transition-colors border-b-2 {activeTab === 'belum_selesai' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
			onclick={() => activeTab = 'belum_selesai'}
		>
			Belum Selesai 
			<span class="ml-2 inline-flex items-center justify-center bg-yellow-100 text-yellow-700 text-xs rounded-full h-5 w-5">{assigned.length}</span>
		</button>
		<button
			class="px-6 py-3 font-medium transition-colors border-b-2 {activeTab === 'selesai' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
			onclick={() => activeTab = 'selesai'}
		>
			Selesai
			<span class="ml-2 inline-flex items-center justify-center bg-green-100 text-green-700 text-xs rounded-full h-5 w-5">{completed.length}</span>
		</button>
	</div>

	{#if loading}
		<div class="py-12 text-center text-gray-500">Memuat data tugas...</div>
	{:else}
		<div class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
			<!-- Tab Content: Belum Assign -->
			{#if activeTab === 'belum_assign'}
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm text-gray-600">
						<thead class="bg-gray-50 border-b border-gray-100 text-gray-700">
							<tr>
								<th class="px-6 py-4 font-semibold">ID Naskah</th>
								<th class="px-6 py-4 font-semibold">Judul Buku</th>
								<th class="px-6 py-4 font-semibold">Email Penulis</th>
								<th class="px-6 py-4 font-semibold text-right">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each unassigned as task}
								<tr class="hover:bg-gray-50 transition">
									<td class="px-6 py-4 font-mono font-medium">#{task.manuscript_id}</td>
									<td class="px-6 py-4 font-bold text-gray-800">{task.book_title}</td>
									<td class="px-6 py-4">{task.author_email || '-'}</td>
									<td class="px-6 py-4 text-right">
										<span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Belum di-plot</span>
									</td>
								</tr>
							{:else}
								<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500 italic">Tidak ada naskah yang belum di-assign.</td></tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Tab Content: Belum Selesai -->
			{#if activeTab === 'belum_selesai'}
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm text-gray-600">
						<thead class="bg-gray-50 border-b border-gray-100 text-gray-700">
							<tr>
								<th class="px-6 py-4 font-semibold">ID Penugasan</th>
								<th class="px-6 py-4 font-semibold">Judul Buku</th>
								<th class="px-6 py-4 font-semibold">Reviewer</th>
								<th class="px-6 py-4 font-semibold">Deadline</th>
								<th class="px-6 py-4 font-semibold text-right">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each assigned as task}
								<tr class="hover:bg-yellow-50/30 transition">
									<td class="px-6 py-4 font-mono font-medium">#{task.id}</td>
									<td class="px-6 py-4 font-bold text-gray-800">{task.book_title}</td>
									<td class="px-6 py-4">{task.reviewer_name || '-'}</td>
									<td class="px-6 py-4 text-red-600 font-medium">{formatDate(task.deadline_review)}</td>
									<td class="px-6 py-4 text-right">
										<span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
											{task.status === 'under_review' ? 'Sedang Dinilai' : 'Baru Ditugaskan'}
										</span>
									</td>
								</tr>
							{:else}
								<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500 italic">Tidak ada naskah yang sedang dinilai.</td></tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Tab Content: Selesai -->
			{#if activeTab === 'selesai'}
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm text-gray-600">
						<thead class="bg-gray-50 border-b border-gray-100 text-gray-700">
							<tr>
								<th class="px-6 py-4 font-semibold">ID Penugasan</th>
								<th class="px-6 py-4 font-semibold">Judul Buku</th>
								<th class="px-6 py-4 font-semibold">Reviewer</th>
								<th class="px-6 py-4 font-semibold">Skor Akhir</th>
								<th class="px-6 py-4 font-semibold text-right">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each completed as task}
								<tr class="hover:bg-green-50/30 transition">
									<td class="px-6 py-4 font-mono font-medium">#{task.id}</td>
									<td class="px-6 py-4 font-bold text-gray-800">{task.book_title}</td>
									<td class="px-6 py-4">{task.reviewer_name || '-'}</td>
									<td class="px-6 py-4">
										<span class="font-bold text-lg text-green-600">{task.final_score}%</span>
									</td>
									<td class="px-6 py-4 text-right">
										<button onclick={() => viewResult(task.id)} class="text-indigo-600 hover:text-indigo-800 font-medium text-sm underline">Lihat Detail</button>
									</td>
								</tr>
							{:else}
								<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500 italic">Tidak ada naskah yang telah selesai dinilai.</td></tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/if}
</div>

{#if viewingResultFor}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-2xl">
			<div class="flex justify-between items-center mb-6 border-b pb-4">
				<h2 class="text-3xl font-bold text-gray-800">Detail Hasil Penilaian</h2>
				<button onclick={closeResult} class="text-gray-500 hover:text-gray-800">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			{#if resultLoading}
				<div class="py-12 text-center text-gray-500">Memuat detail hasil...</div>
			{:else if resultError}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{resultError}</div>
			{:else if resultData}
				<div class="mb-8 grid gap-6 md:grid-cols-3">
					<div class="rounded-xl bg-blue-50 p-6 text-center shadow-sm">
						<p class="text-sm text-blue-700">Skor Akhir</p>
						<p class="mt-2 text-3xl font-bold text-blue-800">{resultData.total}</p>
					</div>
					<div class="rounded-xl bg-gray-50 p-6 text-center shadow-sm">
						<p class="text-sm text-gray-600">Skor Maksimal</p>
						<p class="mt-2 text-3xl font-bold">{resultData.max_total}</p>
					</div>
					<div class="rounded-xl bg-green-50 p-6 text-center shadow-sm">
						<p class="text-sm text-green-700">Persentase</p>
						<p class="mt-2 text-3xl font-bold text-green-800">{resultData.percent}%</p>
					</div>
				</div>

				<div class="space-y-4">
					{#each resultData.scores as score}
						<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
							<div class="flex items-center justify-between mb-2">
								<h3 class="text-lg font-semibold text-gray-800">{score.criteria_name}</h3>
								<div class="text-xl font-bold text-blue-700">
									{((score.score / score.max_score) * 100).toFixed(0)}%
								</div>
							</div>
							<p class="text-gray-500 text-sm mb-3">Skor: <span class="font-bold text-gray-700">{score.score}</span> / {score.max_score}</p>
							<div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic">
								"{score.comment || 'Tidak ada catatan'}"
							</div>
						</div>
					{/each}
				</div>
			{/if}
			
			<div class="mt-8 flex justify-end">
				<button onclick={closeResult} class="rounded-lg bg-gray-600 px-6 py-2 font-medium text-white hover:bg-gray-700">Tutup</button>
			</div>
		</div>
	</div>
{/if}
