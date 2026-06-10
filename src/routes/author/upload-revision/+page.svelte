<script>
	import RevisionUploadForm from '$lib/components/author/upload-revision/RevisionUploadForm.svelte';

	let { data } = $props();
</script>

<RevisionUploadForm manuscript={data.manuscript} />