<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import api, { setAuthToken } from '$lib/api';

	let login_email = $state('');
	let login_password = $state('');
	let login_error = $state('');
	let loading = $state(true);

	onMount(() => {
		// Periksa jika sudah login
		const token = localStorage.getItem('jwt_token');
		const userStr = localStorage.getItem('jwt_user');
		if (token && userStr) {
			try {
				const user = JSON.parse(userStr);
				if (user.role === 'admin') {
					goto('/admin');
				} else if (user.role === 'reviewer') {
					goto('/reviewer');
				}
			} catch (e) {
				loading = false;
			}
		} else {
			loading = false;
		}
	});

	async function handleLogin(e) {
		e.preventDefault();
		login_error = '';
		try {
			const res = await api.post('/auth/login', {
				email: login_email,
				password: login_password
			});
			if (res.data.status === 'success') {
				const token = res.data.data.token;
				const user = res.data.data.user;
				localStorage.setItem('jwt_token', token);
				localStorage.setItem('jwt_user', JSON.stringify(user));
				setAuthToken(token);

				if (user.role === 'admin') {
					goto('/admin');
				} else {
					goto('/reviewer');
				}
			} else {
				login_error = 'Login gagal: ' + res.data.message;
			}
		} catch (e) {
			login_error = 'Login error: ' + (e.response?.data?.message || e.message);
		}
	}
</script>

{#if loading}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<p class="text-lg font-medium text-gray-500">Memeriksa sesi...</p>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
		<div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
			<!-- Logo atau Icon -->
			<div class="mb-6 flex justify-center">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
			</div>
			
			<h2 class="mb-2 text-center text-3xl font-bold text-gray-800">Sistem Hibah Buku</h2>
			<p class="mb-8 text-center text-sm text-gray-500">Masuk untuk melanjutkan ke dashboard Anda</p>

			<form onsubmit={handleLogin} class="space-y-5">
				<div>
					<label class="mb-1 block text-sm font-semibold text-gray-700">Email</label>
					<input
						bind:value={login_email}
						type="email"
						placeholder="Masukkan email"
						class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
						required
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-semibold text-gray-700">Password</label>
					<input
						bind:value={login_password}
						type="password"
						placeholder="••••••••"
						class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
						required
					/>
				</div>

				{#if login_error}
					<div class="rounded bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
						{login_error}
					</div>
				{/if}

				<button
					type="submit"
					class="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
				>
					Masuk Sistem
				</button>
			</form>
		</div>
	</div>
{/if}
