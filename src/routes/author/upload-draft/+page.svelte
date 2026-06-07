<script>
	import DraftUploadForm from '$lib/components/author/upload-draft/DraftUploadForm.svelte';

	let { data, form } = $props();
</script>

<DraftUploadForm {form} willingness={data?.willingness} contract={data?.contract} />
