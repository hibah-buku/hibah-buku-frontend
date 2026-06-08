<script>
	import Icon from '@iconify/svelte';

	let {
		user = null,
		action = '/admin/users',
		onClose = () => {}
	} = $props();

	function handleOverlayKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			onClose();
		}
	}
</script>

{#if user}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
		onclick={(event) => {
			if (event.target === event.currentTarget) onClose();
		}}
		onkeydown={handleOverlayKeydown}
		role="button"
		tabindex="0"
		aria-label="Close modal"
	>
		<div
			class="w-full max-w-md rounded-2xl bg-white shadow-xl"
		>
			<div class="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
				<div class="flex h-12 w-12 items-center justify-center text-red-600">
					<Icon icon="mingcute:alert-line" class="h-14 w-114" />
				</div>

				<div>
					<h2 class="text-2xl font-semibold text-gray-900">
						Nonaktifkan User
					</h2>
					<p class="text-sm text-gray-500">
						Konfirmasi tindakan nonaktif user.
					</p>
				</div>
			</div>

			<div class="px-6 py-5">
				<p class="text-lg text-gray-600">
					Apakah kamu yakin ingin menonaktifkan user
					<span class="font-semibold text-gray-900">
						{user.name}
					</span>?
				</p>

				<p class="mt-3 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
					User tidak akan hilang permanen dari sistem. Status user akan berubah menjadi
					<span class="font-semibold">Inactive</span>.
				</p>
			</div>

			<div class="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
				<button
					type="button"
					onclick={onClose}
					class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
				>
					Batal
				</button>

				<form method="POST" action={action}>
					<input type="hidden" name="id" value={user.id} />

					<button
						type="submit"
						class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
					>
						<Icon icon="mdi:trash-can" class="h-5 w-5" />
						Ya, Nonaktifkan
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}