<script>
	let { data } = $props();
</script>

<div class="space-y-6">

	<!-- Ringkasan -->
	<div class="grid gap-4 md:grid-cols-3">
		<div class="rounded-2xl bg-white p-5 shadow-sm">
			<p class="text-sm text-gray-500">
				Jumlah Reviewer
			</p>

			<p class="mt-2 text-3xl font-bold text-gray-800">
				2
			</p>
		</div>

		<div class="rounded-2xl bg-white p-5 shadow-sm">
			<p class="text-sm text-gray-500">
				Rata-rata Nilai
			</p>

			<p class="mt-2 text-3xl font-bold text-blue-700">
				87.5
			</p>
		</div>

		<div class="rounded-2xl bg-white p-5 shadow-sm">
			<p class="text-sm text-gray-500">
				Status
			</p>

			<p class="mt-2 font-semibold text-amber-600">
				Perlu Revisi
			</p>
		</div>
	</div>

	<!-- Daftar Review -->
	{#each data.reviews as review}
		<div
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
		>
			<div class="flex items-center justify-between">
				<h3 class="font-semibold text-gray-800">
					{review.reviewer}
				</h3>

				<span
					class="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
				>
					Skor: {review.score}
				</span>
			</div>

			<div class="mt-4 rounded-xl bg-gray-50 p-4">
				<p class="text-gray-700">
					{review.comment}
				</p>
			</div>
		</div>
	{/each}

	<!-- Tombol Download -->
	<div class="pt-2">
		<button
			class="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
		>
			Download Hasil Review
		</button>
	</div>
</div>