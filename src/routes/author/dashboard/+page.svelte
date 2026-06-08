<script>
	import AuthorDashboardView from '$lib/components/author/dashboard/AuthorDashboardView.svelte';

	let { data } = $props();
</script>

<AuthorDashboardView dashboardData={data?.dashboardData} error={data?.error} />
