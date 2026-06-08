<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { setAuthToken } from '$lib/api';

	let user = $state(null);
	let loading = $state(true);
	let { children } = $props();

	onMount(() => {
		const token = localStorage.getItem('jwt_token');
		const userStr = localStorage.getItem('jwt_user');
		if (token && userStr) {
			try {
				const parsedUser = JSON.parse(userStr);
				if (parsedUser.role !== 'admin') {
					goto('/');
				} else {
					user = parsedUser;
					setAuthToken(token);
					loading = false;
				}
			} catch (e) {
				goto('/');
			}
		} else {
			goto('/');
		}
	});

	function logout() {
		localStorage.removeItem('jwt_token');
		localStorage.removeItem('jwt_user');
		setAuthToken(null);
		goto('/');
	}
</script>

{#if loading}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<p class="text-gray-500">Memuat...</p>
	</div>
{:else}
	<div class="flex min-h-screen bg-gray-50">
		<!-- Sidebar -->
		<aside class="w-64 bg-indigo-900 text-white shadow-xl flex-shrink-0 flex flex-col">
			<div class="p-6 border-b border-indigo-800">
				<h2 class="text-2xl font-bold tracking-tight">Admin Panel</h2>
				<p class="text-indigo-300 text-sm mt-1">Sistem Hibah Buku</p>
			</div>

			<nav class="flex-1 px-4 py-6 space-y-2">
				<a
					href="/admin"
					class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname === '/admin' ? 'bg-indigo-700 font-semibold' : 'hover:bg-indigo-800'}"
				>
					Plotting Naskah
				</a>
				<a
					href="/admin/tasks"
					class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname === '/admin/tasks' ? 'bg-indigo-700 font-semibold' : 'hover:bg-indigo-800'}"
				>
					Semua Tugas
				</a>
				<a
					href="/admin/rubrics"
					class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname.includes('/rubrics') ? 'bg-indigo-700 font-semibold' : 'hover:bg-indigo-800'}"
				>
					Kelola Rubrik
				</a>
			</nav>

			<div class="p-4 border-t border-indigo-800">
				<div class="flex items-center gap-3 mb-4 px-2">
					<div class="w-8 h-8 rounded-full bg-white text-indigo-900 flex items-center justify-center font-bold">
						{user?.username?.charAt(0).toUpperCase()}
					</div>
					<div class="overflow-hidden">
						<p class="text-sm font-semibold truncate">{user?.username}</p>
						<p class="text-xs text-indigo-300">Administrator</p>
					</div>
				</div>
				<button
					onclick={logout}
					class="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition flex justify-center items-center gap-2"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					Logout
				</button>
			</div>
		</aside>

		<!-- Main Content Area -->
		<main class="flex-1 flex flex-col h-screen overflow-y-auto">
			{@render children()}
		</main>
	</div>
{/if}
