<script>
  import PublisherDecisionForm from '$lib/components/publisher/manuscripts/PublisherDecisionForm.svelte';

  let { data, form } = $props();

  const toBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

  const manuscript = $derived(data.selectedManuscript);
    
  let checklistForm = $state({
    cover_design_ok: false,
    page_count_ok: false,
    admin_docs_ok: false,
    check_notes: ''
  });

  let decisionChoice = $state('approved');
  let decisionNotes = $state('');

  $effect(() => {
    if (!manuscript) {
      checklistForm = {
        cover_design_ok: false,
        page_count_ok: false,
        admin_docs_ok: false,
        check_notes: ''
      };
      decisionNotes = '';
      return;
    }

    checklistForm = {
      cover_design_ok: toBoolean(manuscript?.checklist?.cover_design_ok ?? manuscript?.cover_design_ok),
      page_count_ok: toBoolean(manuscript?.checklist?.page_count_ok ?? manuscript?.page_count_ok),
      admin_docs_ok: toBoolean(manuscript?.checklist?.admin_docs_ok ?? manuscript?.admin_docs_ok),
      check_notes: manuscript?.checklist?.check_notes ?? manuscript?.check_notes ?? ''
    };
    decisionNotes = manuscript?.revision_notes ?? '';
  });
</script>

<div class="space-y-6 max-w-4xl mx-auto">
  {#if form?.success}
    <div class="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 border border-green-200">
      {form.message}
    </div>
  {/if}
  
  {#if form?.message && !form?.success}
    <div class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 border border-red-200">
      {form.message}
    </div>
  {/if}

  <PublisherDecisionForm
    manuscript={manuscript}
    bind:checklistForm
    bind:decisionChoice
    bind:decisionNotes
  />
</div>