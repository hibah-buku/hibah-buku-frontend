<script>
	import api from '$lib/api';
	import { onMount } from 'svelte';

	let reviewers = $state([]);
	let unassignedManuscripts = $state([]);
	let loading = $state(true);
	let message = $state('');
	let messageType = $state('');

	onMount(() => {
		loadData();
	});

	async function loadData() {
		loading = true;
		try {
			const [revRes, tasksRes] = await Promise.all([
				api.get('/reviewers'),
				api.get('/admin/tasks')
			]);
			
			reviewers = revRes.data?.data || [];
			// Initialize each manuscript with a selectedReviewerId and deadline field for the form
			unassignedManuscripts = (tasksRes.data?.data?.unassigned || []).map(m => ({
				...m,
				selectedReviewerId: '',
				deadline_review: ''
			}));
		} catch (e) {
			showMessage('Gagal memuat data: ' + (e.response?.data?.message || e.message), 'error');
		} finally {
			loading = false;
		}
	}

	function showMessage(msg, type) {
		message = msg;
		messageType = type;
		setTimeout(() => {
			message = '';
		}, 5000);
	}

	function formatToSqlDatetime(value) {
		if (!value) return '';
		return value.replace('T', ' ') + (value.length === 16 ? ':00' : '');
	}

	async function assignReviewer(m) {
		if (!m.selectedReviewerId) {
			showMessage('Pilih reviewer terlebih dahulu untuk naskah ini!', 'error');
			return;
		}
		if (!m.deadline_review) {
			showMessage('Tentukan tenggat waktu penilaian (deadline)!', 'error');
			return;
		}

		const revId = parseInt(m.selectedReviewerId, 10);
		const reviewer = reviewers.find(r => r.reviewer_id === revId);

		const payload = {
			manuscript_id: m.manuscript_id,
			book_title: m.book_title,
			author_id: m.author_id,
			author_email: m.author_email,
			manuscript_file_url: m.manuscript_file_url,
			reviewer_id: reviewer.reviewer_id,
			reviewer_name: reviewer.reviewer_name,
			reviewer_email: reviewer.reviewer_email,
			deadline_review: formatToSqlDatetime(m.deadline_review)
		};

		try {
			const res = await api.post('/assignments', payload);
			if (res.data.status === 'success') {
				showMessage(`Naskah "${m.book_title}" berhasil di-plot ke ${reviewer.reviewer_name}`, 'success');
				// Automatically send notification
				await api.post(`/assignments/${res.data.data.id}/notify`, {
					to_email: reviewer.reviewer_email
				}).catch(e => console.log('Notifikasi gagal dikirim'));
				
				// Remove from the unassigned list
				unassignedManuscripts = unassignedManuscripts.filter(item => item.manuscript_id !== m.manuscript_id);
			} else {
				showMessage('Gagal plot naskah: ' + res.data.message, 'error');
			}
		} catch (e) {
			showMessage('Error: ' + (e.response?.data?.message || e.message), 'error');
		}
	}
</script>

<div class="p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-800">Plotting Naskah</h1>
		<p class="text-gray-600 mt-1">Assign naskah baru yang belum di-plot kepada reviewer.</p>
	</div>

	{#if message}
		<div class="mb-6 p-4 rounded-lg {messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}">
			{message}
		</div>
	{/if}

	{#if loading}
		<div class="py-12 text-center text-gray-500">Memuat data naskah...</div>
	{:else}
		<div class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-gray-600">
					<thead class="bg-gray-50 border-b border-gray-100 text-gray-700">
						<tr>
							<th class="px-6 py-4 font-semibold">ID Naskah</th>
							<th class="px-6 py-4 font-semibold">Data Buku & Penulis</th>
							<th class="px-6 py-4 font-semibold">Plot Reviewer</th>
							<th class="px-6 py-4 font-semibold">Deadline</th>
							<th class="px-6 py-4 font-semibold text-right">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						{#if unassignedManuscripts.length === 0}
							<tr>
								<td colspan="5" class="px-6 py-8 text-center text-gray-500 italic">
									Tidak ada naskah yang belum di-plot saat ini.
								</td>
							</tr>
						{:else}
							{#each unassignedManuscripts as m (m.manuscript_id)}
								<tr class="hover:bg-gray-50/50 transition">
									<td class="px-6 py-4 font-mono font-medium text-gray-700">#{m.manuscript_id}</td>
									<td class="px-6 py-4">
										<p class="font-bold text-gray-800 text-base">{m.book_title}</p>
										<p class="text-xs text-gray-500 mt-1">
											ID Penulis: {m.author_id} | Email: {m.author_email}
										</p>
									</td>
									<td class="px-6 py-4 min-w-[200px]">
										<select
											bind:value={m.selectedReviewerId}
											class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
										>
											<option value="" disabled>-- Pilih Reviewer --</option>
											{#each reviewers as r}
												<option value={r.reviewer_id}>{r.reviewer_name}</option>
											{/each}
										</select>
									</td>
									<td class="px-6 py-4 min-w-[200px]">
										<input
											bind:value={m.deadline_review}
											type="datetime-local"
											class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm"
										/>
									</td>
									<td class="px-6 py-4 text-right">
										<button
											onclick={() => assignReviewer(m)}
											class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition active:scale-95 whitespace-nowrap"
										>
											Plot & Tugaskan
										</button>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
