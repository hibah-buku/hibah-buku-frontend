<script>
	import Icon from "@iconify/svelte";
	import DeleteModal from './DeleteModal.svelte';

	let { users = [], meta = {} } = $props();

	let selectedDeleteUser = $state(null);

	const lastPage = $derived(
		meta.last_page ?? (Math.ceil((meta.total ?? 0) / (meta.per_page ?? 10)) || 1)
	);

	const from = $derived(
		meta.from ?? ((meta.current_page ?? 1) - 1) * (meta.per_page ?? 10) + 1
	);

	const to = $derived(
		meta.to ?? Math.min((meta.current_page ?? 1) * (meta.per_page ?? 10), meta.total ?? 0)
	);

	function getUserStatus(user) {
		if (user?.deleted_at) return 'inactive';
		if (user?.is_active === false) return 'inactive';
		if (user?.status) return user.status.toLowerCase();

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

	function getRoleClass(role) {
		if (role === 'admin') return 'bg-purple-100 text-purple-800';
		if (role === 'reviewer') return 'bg-orange-100 text-orange-800';
		if (role === 'penerbit') return 'bg-green-100 text-green-800';

		return 'bg-blue-100 text-blue-800';
	}

	function openDeleteModal(user) {
		selectedDeleteUser = user;
	}

	function closeDeleteModal() {
		selectedDeleteUser = null;
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm text-gray-600">
			<thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
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
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4 font-medium text-gray-900">
								{user.name}
							</td>

							<td class="px-6 py-4">
								{user.email}
							</td>

							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleClass(user.role)}`}
								>
									{user.role}
								</span>
							</td>

							<td class="px-6 py-4">
								<span
									class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(user)}`}
								>
									{getStatusLabel(user)}
								</span>
							</td>

							<td class="px-6 py-4 text-right">
								<div class="flex items-center justify-end gap-2">
									<a
										href="/admin/users/{user.id}"
										class="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-800 duration-150 transition-colors font-medium text-sm cursor-pointer"
									>
										<Icon icon="bxs:user-detail" class="w-5 h-5" />
										Detail
									</a>

									<a
										href="/admin/users/{user.id}/edit"
										class="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 duration-150 transition-colors font-medium text-sm cursor-pointer"
									>
										<Icon icon="mdi:pencil" class="w-5 h-5" />
										Edit
									</a>

									{#if getUserStatus(user) === 'inactive'}
										<button
											type="button"
											disabled
											class="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-white bg-gray-400 font-medium text-sm cursor-not-allowed"
										>
											<Icon icon="mdi:account-off" class="w-5 h-5" />
											Inactive
										</button>
									{:else}
										<button
											type="button"
											onclick={() => openDeleteModal(user)}
											class="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 duration-150 transition-colors font-medium text-sm cursor-pointer"
										>
											<Icon icon="mdi:trash-can" class="w-5 h-5" />
											Delete
										</button>
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
		<div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
			<p class="text-xs text-gray-500">
				Menampilkan {from} - {to} dari {meta.total} data
			</p>
			<!-- TODO: tombol prev/next dengan ?page= -->
		</div>
	{/if}
</div>

<DeleteModal
	user={selectedDeleteUser}
	action="/admin/users"
	onClose={closeDeleteModal}
/>