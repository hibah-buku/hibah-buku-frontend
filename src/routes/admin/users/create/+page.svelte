<script>
	import Icon from '@iconify/svelte';

	let { form } = $props();

	const error = $derived(form?.error ?? null);

	const nameValue = $derived(form?.values?.name ?? '');
	const emailValue = $derived(form?.values?.email ?? '');
	const roleValue = $derived(form?.values?.role ?? '');
</script>

<svelte:head>
	<title>Tambah User | Hibah Buku AEP</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Tambah User</h1>
			<p class="mt-1 text-sm text-gray-500">Tambahkan user baru ke sistem Hibah Buku AEP.</p>
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
	{/if}

	<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
		<div class="border-b border-gray-100 px-6 py-5">
			<h2 class="text-lg font-semibold text-gray-900">Form Tambah User</h2>
			<p class="mt-1 text-sm text-gray-500">Isi data user dengan benar sebelum disimpan.</p>
		</div>

		<form method="POST" action="?/create" class="space-y-5 p-6">
			<div>
				<label for="name" class="mb-2 block text-sm font-medium text-gray-700"> Nama </label>
				<input
					id="name"
					name="name"
					type="text"
					value={nameValue}
					placeholder="Masukkan nama user"
					class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
					required
				/>
			</div>

			<div>
				<label for="email" class="mb-2 block text-sm font-medium text-gray-700"> Email </label>
				<input
					id="email"
					name="email"
					type="email"
					value={emailValue}
					placeholder="Masukkan email user"
					class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
					required
				/>
			</div>

			<div>
				<label for="role" class="mb-2 block text-sm font-medium text-gray-700"> Role </label>
				<select
					id="role"
					name="role"
					value={roleValue}
					class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
					required
				>
					<option value="" disabled>Pilih role user</option>
					<option value="admin">Admin</option>
					<option value="reviewer">Reviewer</option>
					<option value="penerbit">Penerbit</option>
				</select>
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					placeholder="Masukkan password"
					class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
					required
				/>
			</div>

			<div>
				<label for="password_confirmation" class="mb-2 block text-sm font-medium text-gray-700">
					Konfirmasi Password
				</label>
				<input
					id="password_confirmation"
					name="password_confirmation"
					type="password"
					placeholder="Ulangi password"
					class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
					required
				/>
			</div>

			<div class="flex justify-end gap-2 border-t border-gray-100 pt-5">
				<a
					href="/admin/users"
					class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
				>
					Batal
				</a>

				<button
					type="submit"
					class="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
				>
					<Icon icon="mdi:content-save" class="h-5 w-5" />
					Simpan User
				</button>
			</div>
		</form>
	</div>
</div>
