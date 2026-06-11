<script>
    import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
    import { invalidateAll } from '$app/navigation';

    let { contractId, isOpen, onClose } = $props();
    let loading = $state(false);

    $effect(() => {
        if (!isOpen) loading = false;
    });
</script>

{#if isOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div 
            class="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
            role="dialog" 
            aria-modal="true"
        >
            <!-- Header -->
            <div class="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
                <Icon icon="heroicons:check-circle" class="w-10 h-10 text-green-700" />
                <h3 class="text-lg font-semibold text-gray-800">Validasi Kontrak</h3>
            </div>

            <!-- Body -->
            <div class="p-6">
                <p class="text-gray-600 mb-4 text-sm">
                    Apakah Anda yakin ingin menyetujui kontrak ini? Penulis akan mendapatkan notifikasi dan dapat melanjutkan ke tahap upload naskah.
                </p>
                
                <form method="POST" action="?/approve" use:enhance={() => {
                    loading = true;
                    return async ({ result }) => {
                        loading = false;
                        if (result.type === 'success') {
                            onClose();
                            await invalidateAll();
                        }
                    };
                }}>
                    <input type="hidden" name="id" value={contractId} />
                    
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
                            disabled={loading}
                            class="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {#if loading}
                                <Icon icon="svg-spinners:ring-resize" class="w-5 h-5 animate-spin" />
                                Memproses...
                            {:else}
                                <Icon icon="heroicons:check" class="w-5 h-5" />
                                Ya, Setujui
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}