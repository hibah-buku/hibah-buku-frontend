<script>
    import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
    import { invalidateAll } from '$app/navigation';

    let { contractId, isOpen, onClose } = $props();
    let rejectionReason = $state('');
    let loading = $state(false);
    let error = $state('');

    $effect(() => {
        if (!isOpen) {
            rejectionReason = '';
            error = '';
            loading = false;
        }
    });
</script>

{#if isOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div 
            class="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden"
            role="dialog" 
            aria-modal="true"
        >
            <!-- Header -->
            <div class="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
                <Icon icon="heroicons:x-circle" class="w-10 h-10 text-red-600" />
                <h3 class="text-lg font-semibold text-gray-800">Tolak Kontrak</h3>
            </div>

            <!-- Body -->
            <div class="p-6">
                <p class="text-gray-600 mb-4">
                    Berikan alasan penolakan agar penulis mengetahui apa yang perlu diperbaiki.
                </p>
                
                <form method="POST" action="?/reject" use:enhance={() => {
                    loading = true;
                    error = '';
                    return async ({ result }) => {
                        loading = false;
                        if (result.type === 'success') {
                            onClose();
                            await invalidateAll();
                        } else {
                            error = result.data?.message || 'Terjadi kesalahan saat menolak kontrak.';
                        }
                    };
                }}>
                    <input type="hidden" name="id" value={contractId} />
                    
                    <textarea 
                        name="rejection_reason" 
                        bind:value={rejectionReason}
                        placeholder="Contoh: Tanda tangan tidak jelas, data belum lengkap..."
                        required
                        minlength="5"
                        rows="4"
                        disabled={loading}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none disabled:bg-gray-50"
                    ></textarea>
                    
                    {#if error}
                        <p class="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <Icon icon="heroicons:exclamation-circle" class="w-4 h-4" />
                            {error}
                        </p>
                    {/if}

                    <div class="flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onclick={onClose}
                            disabled={loading}
                            class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || rejectionReason.length < 5}
                            class="px-4 py-2 bg-red-600 text-gray-200 rounded-sm hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                        >
                            {#if loading}
                                <Icon icon="svg-spinners:ring-resize" class="w-5 h-5 animate-spin" />
                                Memproses...
                            {:else}
                                <Icon icon="heroicons:x-mark" class="w-5 h-5" />
                                Tolak Kontrak
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}