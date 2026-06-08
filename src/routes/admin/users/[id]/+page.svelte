<script>
	import Icon from '@iconify/svelte';

	let { data } = $props();

	const user = $derived(data?.user ?? null);
	const error = $derived(data?.error ?? null);

	function formatDate(date) {
		if (!date) return '-';

		return new Date(date).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Detail User | Hibah Buku AEP</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Detail User</h1>
			<p class="mt-1 text-sm text-gray-500">Informasi lengkap data user sistem hibah buku.</p>
		</div>

		<a
			href="/admin/users"
			class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
		>
			<Icon icon="mdi:arrow-left" class="h-5 w-5" />
			Kembali
		</a>
	</div>

	{#if error}
		<div class="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
			{error}
		</div>
	{:else if user}
		<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
			<div class="border-b border-gray-100 px-6 py-5">
				<div class="flex items-center gap-4">
					<div
						class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700"
					>
						{user.name ? user.name.charAt(0).toUpperCase() : 'U'}
					</div>

					<div>
						<h2 class="text-lg font-semibold text-gray-900">
							{user.name ?? '-'}
						</h2>
						<p class="text-sm text-gray-500">
							{user.email ?? '-'}
						</p>
					</div>
				</div>
			</div>

			<div class="grid gap-6 p-6 md:grid-cols-2">
				<div>
					<p class="text-xs font-semibold text-gray-400 uppercase">ID User</p>
					<p class="mt-1 text-sm font-medium text-gray-900">{user.id ?? '-'}</p>
				</div>

				<div>
					<p class="text-xs font-semibold text-gray-400 uppercase">Nama</p>
					<p class="mt-1 text-sm font-medium text-gray-900">{user.name ?? '-'}</p>
				</div>

				<div>
					<p class="text-xs font-semibold text-gray-400 uppercase">Email</p>
					<p class="mt-1 text-sm font-medium text-gray-900">{user.email ?? '-'}</p>
				</div>

				<div>
					<p class="text-xs font-semibold text-gray-400 uppercase">Role</p>
					<span
						class={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize
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
						{user.role ?? '-'}
					</span>
				</div>

				<div>
					<p class="text-xs font-semibold text-gray-400 uppercase">Tanggal Dibuat</p>
					<p class="mt-1 text-sm font-medium text-gray-900">
						{formatDate(user.created_at)}
					</p>
				</div>

				<div>
					<p class="text-xs font-semibold text-gray-400 uppercase">Terakhir Diperbarui</p>
					<p class="mt-1 text-sm font-medium text-gray-900">
						{formatDate(user.updated_at)}
					</p>
				</div>
			</div>

			<div class="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
				<a
					href="/admin/users/{user.id}/edit"
					class="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-600"
				>
					<Icon icon="mdi:pencil" class="h-5 w-5" />
					Edit User
				</a>
			</div>
		</div>
	{:else}
		<div class="rounded-xl border border-gray-100 bg-white p-6 text-center text-gray-500 shadow-sm">
			Data user tidak ditemukan.
		</div>
	{/if}
</div>
