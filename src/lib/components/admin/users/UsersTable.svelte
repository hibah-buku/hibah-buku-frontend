<script>
	import Icon from '@iconify/svelte';

	let { users = [], meta = {} } = $props();

	const lastPage = $derived(
		meta.last_page ?? (Math.ceil((meta.total ?? 0) / (meta.per_page ?? 10)) || 1)
	);

	const from = $derived(meta.from ?? ((meta.current_page ?? 1) - 1) * (meta.per_page ?? 10) + 1);

	const to = $derived(
		meta.to ?? Math.min((meta.current_page ?? 1) * (meta.per_page ?? 10), meta.total ?? 0)
	);

	function getUserStatus(user) {
		if (user?.status) return user.status.toLowerCase();
		if (user?.is_active === false) return 'inactive';
		if (user?.deleted_at) return 'inactive';

		return 'active';
	}

	function getStatusLabel(user) {
		return getUserStatus(user) === 'inactive' ? 'Inactive' : 'Active';
	}

	function getStatusClass(user) {
		return getUserStatus(user) === 'inactive'
			? 'bg-red-100 text-red-700'
			: 'bg-green-100 text-green-700';
	}

	function confirmDelete(event, user) {
		const isConfirmed = confirm(
			`Yakin ingin menonaktifkan user ${user.name}? User tidak akan hilang dari list, hanya menjadi inactive.`
		);

		if (!isConfirmed) {
			event.preventDefault();
		}
	}
</script>

<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm text-gray-600">
			<thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
				<tr>
					<th class="px-6 py-4">Nama</th>
					<th class="px-6 py-4">Email</th>
					<th class="px-6 py-4">Role</th>
					<th class="px-6 py-4">Status</th>
					<th class="px-6 py-4 text-right">Aksi</th>
				</tr>
			</thead>

			<tbody class="divide-y divide-gray-100">
				{#if users.length > 0}
					{#each users as user (user.id)}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="px-6 py-4 font-medium text-gray-900">
								{user.name}
							</td>

							<td class="px-6 py-4">
								{user.email}
							</td>

							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
									${
										user.role === 'admin'
											? 'bg-purple-100 text-purple-800'
											: user.role === 'penulis'
												? 'bg-blue-100 text-blue-800'
												: user.role === 'reviewer'
													? 'bg-orange-100 text-orange-800'
													: 'bg-green-100 text-green-800'
									}`}
								>
									{user.role}
								</span>
							</td>

							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(user)}`}
								>
									{getStatusLabel(user)}
								</span>
							</td>

							<td class="px-6 py-4 text-right">
								<div class="flex items-center justify-end gap-2">
									<a
										href="/admin/users/{user.id}"
										class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-2.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-800"
									>
										<Icon icon="bxs:user-detail" class="h-5 w-5" />
										Detail
									</a>

									<a
										href="/admin/users/{user.id}/edit"
										class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-yellow-500 px-2.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-yellow-600"
									>
										<Icon icon="mdi:pencil" class="h-5 w-5" />
										Edit
									</a>

									{#if getUserStatus(user) === 'inactive'}
										<button
											type="button"
											disabled
											class="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-400 px-2.5 py-2 text-sm font-medium text-white"
										>
											<Icon icon="mdi:account-off" class="h-5 w-5" />
											Inactive
										</button>
									{:else}
										<form
											method="POST"
											action="/admin/users"
											onsubmit={(event) => confirmDelete(event, user)}
										>
											<input type="hidden" name="id" value={user.id} />

											<button
												type="submit"
												class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-2.5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-700"
											>
												<Icon icon="mdi:trash-can" class="h-5 w-5" />
												Delete
											</button>
										</form>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-gray-500">
							Tidak ada data user ditemukan.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	{#if lastPage > 1}
		<div class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
			<p class="text-xs text-gray-500">
				Menampilkan {from} - {to} dari {meta.total} data
			</p>
			<!-- TODO: tombol prev/next dengan ?page= -->
		</div>
	{/if}
</div>
