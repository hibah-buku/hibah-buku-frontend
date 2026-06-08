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
					if (!document.cookie.includes('auth_token=')) {
						document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}`;
					}
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
		<aside class="flex w-64 flex-shrink-0 flex-col bg-indigo-900 text-white shadow-xl">
			<div class="border-b border-indigo-800 p-6">
				<h2 class="text-2xl font-bold tracking-tight">Admin Panel</h2>
				<p class="mt-1 text-sm text-indigo-300">Sistem Hibah Buku</p>
			</div>

			<nav class="flex-1 space-y-2 px-4 py-6">
				<a
					href="/admin/dashboard"
					class="block rounded-lg px-4 py-3 transition-colors {$page.url.pathname ===
					'/admin/dashboard'
						? 'bg-indigo-700 font-semibold'
						: 'hover:bg-indigo-800'}"
				>
					Dashboard
				</a>
				<a
					href="/admin"
					class="block rounded-lg px-4 py-3 transition-colors {$page.url.pathname === '/admin'
						? 'bg-indigo-700 font-semibold'
						: 'hover:bg-indigo-800'}"
				>
					Plotting Naskah
				</a>
				<a
					href="/admin/tasks"
					class="block rounded-lg px-4 py-3 transition-colors {$page.url.pathname === '/admin/tasks'
						? 'bg-indigo-700 font-semibold'
						: 'hover:bg-indigo-800'}"
				>
					Semua Tugas
				</a>
				<a
					href="/admin/rubrics"
					class="block rounded-lg px-4 py-3 transition-colors {$page.url.pathname.includes(
						'/rubrics'
					)
						? 'bg-indigo-700 font-semibold'
						: 'hover:bg-indigo-800'}"
				>
					Kelola Rubrik
				</a>
			</nav>

			<div class="border-t border-indigo-800 p-4">
				<div class="mb-4 flex items-center gap-3 px-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-indigo-900"
					>
						{user?.username?.charAt(0).toUpperCase()}
					</div>
					<div class="overflow-hidden">
						<p class="truncate text-sm font-semibold">{user?.username}</p>
						<p class="text-xs text-indigo-300">Administrator</p>
					</div>
				</div>
				<button
					onclick={logout}
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
					Logout
				</button>
			</div>
		</aside>

		<!-- Main Content Area -->
		<main class="flex h-screen flex-1 flex-col overflow-y-auto">
			{@render children()}
		</main>
	</div>
{/if}
