<script>
	import Icon from '@iconify/svelte';

	let { data } = $props();

	const reviews = $derived(data?.reviews ?? []);
	const publisherReviews = $derived(data?.publisherReviews ?? null);
	const totalScore = $derived(reviews.reduce((acc, r) => acc + (r.score ?? 0), 0));
	const averageScore = $derived(reviews.length > 0 ? (totalScore / reviews.length).toFixed(1) : '-');
	const manuscriptStatus = $derived(data?.manuscriptStatus ?? '-');
</script>

<div class="space-y-6 pb-12">

	<!-- Ringkasan -->
	<div class="grid gap-4 md:grid-cols-3">
		<div class="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
			<p class="text-sm text-gray-500">
				Jumlah Reviewer
			</p>

			<p class="mt-2 text-3xl font-bold text-gray-800">
				{reviews.length}
			</p>
		</div>

		<div class="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
			<p class="text-sm text-gray-500">
				Rata-rata Nilai
			</p>

			<p class="mt-2 text-3xl font-bold text-blue-700">
				{averageScore}
			</p>
		</div>

		<div class="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
			<p class="text-sm text-gray-500">
				Status
			</p>

			<p class="mt-2 font-semibold text-amber-600">
				{manuscriptStatus}
			</p>
		</div>
	</div>

	<!-- Section: Hasil Review Reviewer -->
	<div class="space-y-4">
		<div class="flex items-center gap-2">
			<Icon icon="material-symbols:rate-review-outline" class="h-5 w-5 text-blue-700" />
			<h2 class="text-lg font-bold text-gray-800">Evaluasi Reviewer (Double-Blind)</h2>
		</div>

		{#if reviews.length === 0}
			<div class="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
				Belum ada hasil review dari reviewer yang dikirimkan untuk naskah Anda.
			</div>
		{:else}
			{#each reviews as review}
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-200">
					<div class="flex items-center justify-between">
						<h3 class="font-semibold text-gray-800 flex items-center gap-2">
							<Icon icon="material-symbols:person-outline" class="h-5 w-5 text-gray-400" />
							{review.reviewer}
						</h3>

						<span class="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
							Skor: {review.score ?? '-'}
						</span>
					</div>

					<div class="mt-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
						<p class="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
							{review.comment || 'Tidak ada komentar umum.'}
						</p>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Divider -->
	<hr class="border-gray-200 my-8" />

	<!-- Section: Hasil Review Penerbit -->
	<div class="space-y-6">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-blue-50 text-blue-700 rounded-xl">
				<Icon icon="material-symbols:menu-book-outline" class="h-6 w-6" />
			</div>
			<div>
				<h2 class="text-xl font-bold text-gray-800">
					Hasil Review Penerbit (Tahap Pra-Cetak)
				</h2>
				<p class="text-xs text-gray-500 mt-0.5">Evaluasi administrasi, kelayakan cover, halaman, dan keputusan pra-cetak</p>
			</div>
		</div>

		{#if !publisherReviews || (!publisherReviews.checks?.length && !publisherReviews.decisions?.length)}
			<div class="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
				<Icon icon="material-symbols:pending-actions" class="mx-auto h-12 w-12 text-gray-300 mb-2" />
				Belum ada hasil review atau keputusan pra-cetak dari Penerbit.
			</div>
		{:else}
			<div class="grid gap-6">
				<!-- Publisher Checks (Checklists) -->
				{#if publisherReviews.checks && publisherReviews.checks.length > 0}
					<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
							<Icon icon="material-symbols:fact-check-outline" class="h-5 w-5 text-blue-600" />
							Pengecekan Kelengkapan Dokumen & Layout
						</h3>

						<div class="space-y-6">
							{#each publisherReviews.checks as check, i}
								<div class="border-b border-gray-100 last:border-b-0 pb-6 mb-6 last:pb-0 last:mb-0">
									{#if publisherReviews.checks.length > 1}
										<span class="inline-block text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full mb-3">
											Pemeriksaan #{publisherReviews.checks.length - i} ({check.created_at})
										</span>
									{/if}
									
									<div class="grid gap-4 md:grid-cols-3">
										<!-- Cover Design Check -->
										<div class="flex items-start gap-3 p-4 rounded-2xl border transition duration-200 {check.cover_design_ok ? 'border-emerald-100 bg-emerald-50/30 text-emerald-900 hover:bg-emerald-50/50' : 'border-amber-100 bg-amber-50/30 text-amber-900 hover:bg-amber-50/50'}">
											<div class="mt-0.5 rounded-full p-1 {check.cover_design_ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-600'}">
												<Icon icon={check.cover_design_ok ? 'material-symbols:check-circle-rounded' : 'material-symbols:hourglass-empty'} class="h-5 w-5" />
											</div>
											<div class="min-w-0">
												<p class="text-xs text-gray-500 font-medium">Desain Cover</p>
												<p class="text-sm font-semibold mt-0.5 truncate">{check.cover_design_ok ? 'Sesuai Standar' : 'Perlu Perbaikan / Belum Dicek'}</p>
											</div>
										</div>

										<!-- Page Count Check -->
										<div class="flex items-start gap-3 p-4 rounded-2xl border transition duration-200 {check.page_count_ok ? 'border-emerald-100 bg-emerald-50/30 text-emerald-900 hover:bg-emerald-50/50' : 'border-amber-100 bg-amber-50/30 text-amber-900 hover:bg-amber-50/50'}">
											<div class="mt-0.5 rounded-full p-1 {check.page_count_ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-600'}">
												<Icon icon={check.page_count_ok ? 'material-symbols:check-circle-rounded' : 'material-symbols:hourglass-empty'} class="h-5 w-5" />
											</div>
											<div class="min-w-0">
												<p class="text-xs text-gray-500 font-medium">Jumlah Halaman</p>
												<p class="text-sm font-semibold mt-0.5 truncate">{check.page_count_ok ? 'Sesuai Ketentuan' : 'Perlu Penyesuaian'}</p>
											</div>
										</div>

										<!-- Admin Docs Check -->
										<div class="flex items-start gap-3 p-4 rounded-2xl border transition duration-200 {check.admin_docs_ok ? 'border-emerald-100 bg-emerald-50/30 text-emerald-900 hover:bg-emerald-50/50' : 'border-amber-100 bg-amber-50/30 text-amber-900 hover:bg-amber-50/50'}">
											<div class="mt-0.5 rounded-full p-1 {check.admin_docs_ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-600'}">
												<Icon icon={check.admin_docs_ok ? 'material-symbols:check-circle-rounded' : 'material-symbols:hourglass-empty'} class="h-5 w-5" />
											</div>
											<div class="min-w-0">
												<p class="text-xs text-gray-500 font-medium">Dokumen Administrasi</p>
												<p class="text-sm font-semibold mt-0.5 truncate">{check.admin_docs_ok ? 'Lengkap & Valid' : 'Belum Lengkap'}</p>
											</div>
										</div>
									</div>

									{#if check.check_notes}
										<div class="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
											<div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
												<Icon icon="material-symbols:notes" class="h-4 w-4 text-gray-400" />
												Catatan Pengecekan
											</div>
											<p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{check.check_notes}</p>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Publisher Decisions -->
				{#if publisherReviews.decisions && publisherReviews.decisions.length > 0}
					<div class="space-y-4">
						<h3 class="text-base font-semibold text-gray-800 flex items-center gap-2 px-1">
							<Icon icon="material-symbols:gavel-outline" class="h-5 w-5 text-amber-600" />
							Riwayat Keputusan Penerbit
						</h3>

						{#each publisherReviews.decisions as dec}
							<div class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden relative transition hover:shadow-md">
								<!-- Vertical colored bar indicator -->
								<div class="absolute left-0 top-0 bottom-0 w-2.5 {dec.decision === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}"></div>
								
								<div class="pl-2">
									<div class="flex items-center justify-between flex-wrap gap-2">
										<div class="flex items-center gap-2.5">
											<span class="inline-flex items-center justify-center p-1.5 rounded-lg {dec.decision === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">
												<Icon icon={dec.decision === 'approved' ? 'material-symbols:verified' : 'material-symbols:published-with-changes'} class="h-5 w-5" />
											</span>
											<div>
												<h4 class="font-bold text-gray-800">
													Keputusan: {dec.decision_label}
												</h4>
												<p class="text-xs text-gray-400 mt-0.5">{dec.decided_at}</p>
											</div>
										</div>
										
										<!-- Status Badge -->
										<span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider {dec.decision === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
											{dec.decision === 'approved' ? 'Approved' : 'Revision Required'}
										</span>
									</div>

									{#if dec.revision_notes}
										<div class="mt-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
											<div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
												<Icon icon="material-symbols:rate-review-outline" class="h-4 w-4 text-gray-400" />
												Catatan Revisi / Masukan Layout
											</div>
											<p class="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
												{dec.revision_notes}
											</p>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Tombol Download -->
	<div class="pt-4">
		<button class="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 flex items-center gap-2">
			<Icon icon="material-symbols:download" class="h-5 w-5" />
			Download Hasil Review
		</button>
	</div>
</div>