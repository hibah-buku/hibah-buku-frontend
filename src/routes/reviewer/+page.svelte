<script>
	import { goto } from '$app/navigation';
	import { ENDPOINTS } from '$lib/api/endpoint.js';
	import Icon from '@iconify/svelte';

	let { data } = $props();

	let user = $state(data.user);
	let reviewerId = $state(user ? String(user.reviewer_id) : '');

	let loadError = $state('');
	let formError = $state('');
	let formSuccess = $state('');
	let submitting = $state(false);

	let activeAssignment = $state(null);
	let assignmentDetail = $state(null);

	let formData = $state({
		reviewer_email: '',
		reviewer_name: '',
		author_name: '',
		rekomendasi_akhir: '',
		general_comments: '',
		scores: {}
	});

	let assignments = $state(data.assignments || []);
	let pastScores = $state([]);
	let rubrics = $state([]);

	const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

	function getCookieValue(name) {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? match[2] : '';
	}

	function getHeaders() {
		return {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${getCookieValue('auth_token')}`
		};
	}

	async function apiFetch(endpoint, options = {}) {
		const res = await fetch(`${API_BASE}${endpoint}`, {
			...options,
			headers: { ...getHeaders(), ...options.headers }
		});
		return await res.json();
	}

	function logout() {
		goto('/login');
	}

	function initScores() {
		formData.scores = {};
		rubrics.forEach((r) => {
			formData.scores[r.id] = { score: 0, comment: '' };
		});
	}

	async function fetchAssignments() {
		if (!reviewerId) return;
		loadError = '';
		try {
			const res = await apiFetch(ENDPOINTS.REVIEWERS.ASSIGNMENTS(encodeURIComponent(reviewerId)));
			if (res.status === 'success') {
				assignments = res.data;
			} else {
				loadError = res.message;
				assignments = [];
			}
		} catch (e) {
			loadError = 'Gagal memuat tugas: ' + e.message;
			assignments = [];
		}
	}

	async function openReview(a) {
		activeAssignment = a;
		formError = '';
		formSuccess = '';

		try {
			const queryParam = a.book_type ? '?book_type=' + encodeURIComponent(a.book_type) : '';
			const res = await apiFetch(ENDPOINTS.RUBRICS.INDEX + queryParam);
			if (res.status === 'success') {
				rubrics = res.data;
				initScores();
				if (user?.email) formData.reviewer_email = user.email;
				if (user?.name || user?.username) formData.reviewer_name = user.name || user.username;
				if (a.author_name) formData.author_name = a.author_name;
			}
		} catch (e) {
			formError = 'Gagal memuat rubrik: ' + e.message;
		}

		if (a.status === 'completed') {
			try {
				const [detailRes, resultsRes] = await Promise.all([
					apiFetch(ENDPOINTS.ASSIGNMENTS.SHOW(a.id)),
					apiFetch(ENDPOINTS.ASSIGNMENTS.RESULTS(a.id))
				]);
				if (detailRes?.status === 'success') assignmentDetail = detailRes.data;
				if (resultsRes?.status === 'success') {
					pastScores = resultsRes.data.scores || [];
				} else {
					pastScores = [];
				}
			} catch (err) {
				formError = 'Gagal memuat detail hasil: ' + (err.message || 'Unknown error');
				pastScores = [];
			}
		} else {
			assignmentDetail = null;
			pastScores = [];
		}
	}

	async function previewBook(a) {
		try {
			const res = await apiFetch(ENDPOINTS.ASSIGNMENTS.PREVIEW(a.id));
			const previewData = res?.data || {};
			const targetUrl = previewData.url || previewData.preview_url || `${API_BASE}${ENDPOINTS.ASSIGNMENTS.PREVIEW(a.id)}`;
			const fullUrl = targetUrl.startsWith('/') ? API_BASE.replace(/\/api$/, '') + targetUrl : targetUrl;
			window.open(fullUrl, '_blank', 'noopener');
		} catch (e) {
			loadError = 'Gagal membuka preview: ' + e.message;
		}
	}

	function isFormValid() {
		if (!formData.reviewer_email || !formData.reviewer_name) return false;
		if (!formData.rekomendasi_akhir) return false;
		for (const rid in formData.scores) {
			if (formData.scores[rid].score === 0 || formData.scores[rid].score === '0') return false;
		}
		return true;
	}

	async function submitReview() {
		if (!isFormValid()) return;
		submitting = true;
		formError = '';
		formSuccess = '';

		try {
			const scores = [];
			let total = 0;
			for (const rid in formData.scores) {
				scores.push({
					rubric_id: parseInt(rid),
					score: formData.scores[rid].score,
					comment: formData.scores[rid].comment
				});
				total += formData.scores[rid].score;
			}
			const maxTotal = rubrics.reduce((acc, r) => acc + (r.max_score || 5), 0);
			const finalScore = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;

			const payload = {
				scores,
				final_score: finalScore,
				reviewer_email: formData.reviewer_email,
				rekomendasi_akhir: formData.rekomendasi_akhir,
				general_comments: formData.general_comments
			};

			const res = await apiFetch(ENDPOINTS.ASSIGNMENTS.REVIEWS(activeAssignment.id), {
				method: 'POST',
				body: JSON.stringify(payload)
			});

			if (res.status === 'success') {
				formSuccess = 'Penilaian berhasil dikirim!';
				setTimeout(() => {
					closeReview();
					fetchAssignments();
				}, 1500);
			} else {
				formError = 'Error: ' + res.message;
			}
		} catch (e) {
			formError = 'Gagal mengirim penilaian: ' + e.message;
		} finally {
			submitting = false;
		}
	}

	function closeReview() {
		activeAssignment = null;
		formData = {
			reviewer_email: '',
			reviewer_name: '',
			author_name: '',
			rekomendasi_akhir: '',
			general_comments: '',
			scores: {}
		};
		initScores();
	}

	function statusLabel(status) {
		const labels = { assigned: 'Ditugaskan', under_review: 'Sedang Dinilai', completed: 'Selesai' };
		return labels[status] || status;
	}

	function statusClass(status) {
		const classes = {
			assigned: 'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded',
			under_review: 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded',
			completed: 'text-green-600 bg-green-50 px-2 py-0.5 rounded'
		};
		return classes[status] || '';
	}

	function formatDate(dateString) {
		if (!dateString) return '-';
		return dateString;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- HEADER -->
	<header class="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
		<div class="mx-auto flex w-full max-w-6xl items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-800">Dashboard Reviewer</h1>
				<p class="mt-1 text-sm text-gray-500">Sistem Penilaian Kelayakan Buku Referensi dan Ajar</p>
			</div>
			<div>
				{#if user}
					<div class="flex items-center gap-4 group">
						<div class="text-right hidden sm:block">
							<p class="text-sm font-semibold text-gray-800">{user?.name}</p>
							<p class="text-xs text-gray-500 uppercase">{user?.role}</p>
						</div>
						<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
							{user?.name?.charAt(0).toUpperCase() || 'U'}
						</div>
						<button onclick={logout} class="ml-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-100 active:scale-95">
							Logout
						</button>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<!-- KONTEN UTAMA -->
	<div class="mx-auto max-w-6xl p-4 mt-4">
		{#if !activeAssignment}
			<div class="space-y-6">
				{#if loadError}
					<div class="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">{loadError}</div>
				{/if}

				{#if assignments.length > 0}
					<div class="space-y-4">
						<h3 class="text-lg font-bold text-gray-800">Tugas yang Ditugaskan ({assignments.length})</h3>
						{#each assignments as a (a.id)}
							<div class="rounded-lg border border-l-4 border-blue-600 bg-white p-5 shadow transition hover:shadow-md">
								<div class="mb-3 flex items-start justify-between">
									<div>
										<h4 class="text-lg font-semibold text-gray-800">{a.book_title}</h4>
										<p class="mt-1 text-sm text-gray-600">
											Naskah #{a.manuscript_id}
											| Jenis: <span class="font-medium text-indigo-700">{a.book_type === 'bukuajar' ? 'Buku Ajar' : (a.book_type === 'bukureferensi' ? 'Buku Referensi' : 'Umum')}</span>
											| Status: <span class="font-medium {statusClass(a.status)}">{statusLabel(a.status)}</span>
										</p>
									</div>
									<div class="text-right">
										{#if a.final_score}
											<p class="text-2xl font-bold text-blue-600">{a.final_score}%</p>
										{:else}
											<p class="text-sm text-gray-500 italic">Belum dinilai</p>
										{/if}
									</div>
								</div>

								<p class="mb-4 text-sm font-medium text-gray-700">Deadline: {formatDate(a.deadline_review)}</p>

								<div class="flex flex-wrap gap-2">
									<button onclick={() => previewBook(a)} type="button" class="rounded-lg border border-amber-300 bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-500">
										Preview Buku
									</button>
									{#if a.status !== 'completed'}
										<button onclick={() => openReview(a)} class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
											Mulai Penilaian
										</button>
									{:else}
										<button onclick={() => openReview(a)} class="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700">
											Lihat Detail
										</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4 font-medium text-yellow-800">
						Tidak ada tugas untuk reviewer ini saat ini.
					</div>
				{/if}
			</div>
		{:else}
			<div class="rounded-lg border bg-white shadow">
				<div class="rounded-t-lg bg-gradient-to-r from-indigo-700 to-blue-600 p-6 text-white">
					<h2 class="text-2xl font-bold">{activeAssignment.book_title}</h2>
					<p class="mt-2 text-blue-100">
						Naskah #{activeAssignment.manuscript_id}
						| Jenis: <span class="font-semibold">{activeAssignment.book_type === 'bukuajar' ? 'Buku Ajar' : (activeAssignment.book_type === 'bukureferensi' ? 'Buku Referensi' : 'Umum')}</span>
						| Status: {statusLabel(activeAssignment.status)}
					</p>
				</div>

				{#if activeAssignment.status === 'completed'}
					<div class="space-y-6 p-6">
						<div class="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Judul Buku</label>
								<div class="font-semibold text-gray-800">{assignmentDetail?.book_title || activeAssignment.book_title}</div>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">ID Naskah</label>
								<div class="font-mono text-gray-800">{assignmentDetail?.manuscript_id || activeAssignment.manuscript_id}</div>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">Email Penulis</label>
								<div class="text-gray-800">{assignmentDetail?.author_email || '-'}</div>
							</div>
							<div>
								<label class="mb-1 block text-sm font-medium text-gray-500">File Naskah</label>
								<div>
									<a href={assignmentDetail?.manuscript_file_url || '#'} target="_blank" rel="noopener noreferrer" class="font-medium text-teal-600 underline hover:text-teal-700">Buka file naskah asli</a>
								</div>
							</div>
						</div>
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<h3 class="mb-3 text-lg font-semibold text-gray-800">Riwayat Skor Review</h3>
							{#if pastScores.length === 0}
								<div class="text-sm text-gray-600 italic">Tidak ada skor tersimpan.</div>
							{:else}
								<div class="space-y-3">
									{#each pastScores as s (s.rubric_id)}
										<div class="rounded border bg-white p-3 shadow-sm">
											<div class="flex items-center justify-between">
												<div class="font-medium text-gray-800">{s.criteria_name}</div>
												<div class="rounded border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-bold text-blue-600">{s.score}</div>
											</div>
											<div class="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-600 italic">"{s.comment || '-'}"</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
						<div class="flex gap-3 border-t pt-4">
							<button type="button" onclick={closeReview} class="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition hover:bg-gray-50">Kembali ke Dashboard</button>
						</div>
					</div>
				{:else}
					<form onsubmit={(e) => { e.preventDefault(); submitReview(); }} class="space-y-6 p-6">
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-sm">
							<h3 class="mb-4 text-lg font-semibold text-gray-800">Informasi Penilai</h3>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label class="mb-1 block text-sm font-medium text-gray-700">Email Reviewer *</label>
									<input bind:value={formData.reviewer_email} type="email" required placeholder="reviewer@univ.ac.id" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
								</div>
								<div>
									<label class="mb-1 block text-sm font-medium text-gray-700">Nama Reviewer *</label>
									<input bind:value={formData.reviewer_name} type="text" required placeholder="Dr. Nama Lengkap, M.T." class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
								</div>
								<div class="md:col-span-2">
									<label class="mb-1 block text-sm font-medium text-gray-700">Nama Penulis Pertama</label>
									<input bind:value={formData.author_name} type="text" placeholder="Nama Penulis Buku" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
								</div>
							</div>
						</div>
						<div class="space-y-5">
							<h3 class="text-lg font-semibold text-gray-800">Penilaian Kelayakan Buku (Skala 1-5)</h3>
							<p class="-mt-2 text-xs text-gray-500">Keterangan Skala Nilai: 5 = Sangat Baik, 4 = Baik, 3 = Cukup, 2 = Kurang, 1 = Tidak Baik</p>
							{#each rubrics as r, idx (r.id)}
								<div class="rounded-lg border border-gray-200 bg-gray-50 p-5 transition hover:bg-gray-100/50">
									<div class="mb-3">
										<label class="mb-2 block text-sm font-semibold text-gray-800">{idx + 1}. {r.criteria_name}</label>
										<div class="mb-3 flex gap-2">
											{#each [1, 2, 3, 4, 5] as score}
												<button type="button" onclick={() => { if (formData.scores[r.id]) formData.scores[r.id].score = score; }} class="flex-1 rounded-lg border px-2 py-2 text-sm font-semibold transition {formData.scores[r.id]?.score === score ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'}">
													{score}
												</button>
											{/each}
										</div>
									</div>
									<div>
										<label class="mb-1 block text-xs font-medium text-gray-700">Komentar Catatan Kriteria</label>
										<textarea bind:value={formData.scores[r.id].comment} placeholder="Berikan catatan spesifik mengenai perbaikan atau kelebihan untuk kriteria ini..." rows="2" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
									</div>
								</div>
							{/each}
						</div>
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-5">
							<label class="mb-2 block text-sm font-semibold text-gray-800">Catatan, Saran dan Komentar Keseluruhan</label>
							<textarea bind:value={formData.general_comments} placeholder="Berikan komentar komprehensif yang ringkas, padat, dan dapat ditindaklanjuti oleh penulis buku..." rows="3" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
						</div>
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-5">
							<label class="mb-3 block text-sm font-semibold text-gray-800">Berikan Rekomendasi Akhir Kelayakan *</label>
							<div class="space-y-2">
								<label class="flex cursor-pointer items-center gap-3 rounded p-2 transition hover:bg-white">
									<input bind:group={formData.rekomendasi_akhir} type="radio" value="Tanpa Perbaikan" class="h-4 w-4 text-blue-600" />
									<span class="text-sm font-medium text-gray-700">Tanpa Perbaikan (Dapat langsung diterbitkan)</span>
								</label>
								<label class="flex cursor-pointer items-center gap-3 rounded p-2 transition hover:bg-white">
									<input bind:group={formData.rekomendasi_akhir} type="radio" value="Perbaikan Minor" class="h-4 w-4 text-blue-600" />
									<span class="text-sm font-medium text-gray-700">Perbaikan Minor (Perlu revisi tulisan ringan)</span>
								</label>
								<label class="flex cursor-pointer items-center gap-3 rounded p-2 transition hover:bg-white">
									<input bind:group={formData.rekomendasi_akhir} type="radio" value="Perbaikan Mayor" class="h-4 w-4 text-blue-600" />
									<span class="text-sm font-medium text-gray-700">Perbaikan Mayor (Perlu perombakan substansi secara signifikan)</span>
								</label>
							</div>
						</div>
						<div class="flex gap-3 border-t pt-4">
							<button type="submit" disabled={!isFormValid() || submitting} class="flex-1 rounded-lg px-4 py-3 font-semibold text-white transition {isFormValid() && !submitting ? 'cursor-pointer bg-green-600 hover:bg-green-700' : 'cursor-not-allowed bg-gray-400'}">
								{submitting ? 'Sedang Mengirim Data...' : 'Kirim Form Penilaian Resmi'}
							</button>
							<button type="button" onclick={closeReview} class="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">Batal</button>
						</div>
						{#if formError}
							<p class="mt-2 text-sm font-medium text-red-600">{formError}</p>
						{/if}
						{#if formSuccess}
							<p class="mt-2 text-sm font-medium text-green-600">{formSuccess}</p>
						{/if}
					</form>
				{/if}
			</div>
		{/if}
	</div>
</div>
