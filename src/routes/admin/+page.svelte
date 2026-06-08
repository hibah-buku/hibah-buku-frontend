<script>
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let { data, form } = $props();

	let reviewers = $derived(data.reviewers || []);
	let unassignedManuscripts = $state([]);
	let message = $state('');
	let messageType = $state('');

	$effect(() => {
		unassignedManuscripts = (data.unassigned || []).map(m => ({
			...m,
			selectedReviewerId: '',
			deadline_review: ''
		}));
	});

	$effect(() => {
		if (form?.message) {
			message = form.message;
			messageType = form.success ? 'success' : 'error';
			if (form.success) {
				invalidateAll();
			}
			setTimeout(() => { message = ''; }, 5000);
		}
	});

	function formatToSqlDatetime(value) {
		if (!value) return '';
		return value.replace('T', ' ') + (value.length === 16 ? ':00' : '');
	}

	function getReviewerById(id) {
		return reviewers.find(r => r.reviewer_id === parseInt(id, 10));
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

	{#if data.error}
		<div class="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
			{data.error}
		</div>
	{/if}

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
							{@const selectedReviewer = getReviewerById(m.selectedReviewerId)}
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
									<form method="POST" action="?/assign" use:enhance={() => {
										return async ({ result }) => {
											await applyAction(result);
										};
									}}>
										<input type="hidden" name="manuscript_id" value={m.manuscript_id} />
										<input type="hidden" name="book_title" value={m.book_title} />
										<input type="hidden" name="author_id" value={m.author_id} />
										<input type="hidden" name="author_email" value={m.author_email} />
										<input type="hidden" name="manuscript_file_url" value={m.manuscript_file_url || ''} />
										<input type="hidden" name="reviewer_id" value={selectedReviewer?.reviewer_id || ''} />
										<input type="hidden" name="reviewer_name" value={selectedReviewer?.reviewer_name || ''} />
										<input type="hidden" name="reviewer_email" value={selectedReviewer?.reviewer_email || ''} />
										<input type="hidden" name="deadline_review" value={formatToSqlDatetime(m.deadline_review)} />
										<button
											type="submit"
											disabled={!m.selectedReviewerId || !m.deadline_review}
											class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition active:scale-95 whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
										>
											Plot & Tugaskan
										</button>
									</form>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
