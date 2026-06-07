<script>
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';

  let isOpen = $state(false);
  
  // Mengambil data terpusat dari layout server secara reaktif
  let notifications = $derived($page.data.notificationLogs || []);
  let unreadCount = $derived(notifications.length);

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function closeDropdown() {
    isOpen = false;
  }
</script>

<div class="relative inline-block text-left">
  <button 
    type="button" 
    class="relative p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors focus:outline-none"
    onclick={toggleDropdown}
  >
    <Icon icon="heroicons:bell" class="w-6 h-6" />
    
    {#if unreadCount > 0}
      <span class="absolute top-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"></span>
    {/if}
  </button>

  {#if isOpen}
    <div class="fixed inset-0 z-10" onclick={closeDropdown}></div>

    <div class="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-20 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
      <div class="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <span class="text-xs font-semibold text-gray-700">Riwayat Email Sistem (Terbaru)</span>
        {#if unreadCount > 0}
          <span class="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{unreadCount} Item</span>
        {/if}
      </div>

      <div class="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {#if notifications.length === 0}
          <div class="p-6 text-center text-xs text-gray-400 italic">
            Tidak ada log email masuk.
          </div>
        {:else}
          {#each notifications.slice(0, 5) as notif}
            <div class="p-3 hover:bg-gray-50/75 transition-colors text-left flex gap-3">
              <div class="mt-0.5 text-base shrink-0">
                {String(notif.subject || '').includes('Disetujui') || String(notif.template_code).includes('approved') ? '✅' : '📧'}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium text-gray-800 line-clamp-2">
                  {notif.subject || String(notif.template_code || 'Email Sistem').replace('_', ' ')}
                </p>
                <p class="text-[11px] text-gray-500 truncate mt-1">
                  Ke: <span class="font-mono text-gray-600 bg-gray-100 px-1 py-0.25 rounded">{notif.recipient_email || notif.email || '-'}</span>
                </p>
                <p class="text-[10px] text-gray-400 mt-1">
                  ID Log: #{notif.id}
                </p>
              </div>
            </div>
          {/each}
        {/if}
      </div>
      
      <div class="p-2 bg-gray-50 text-center border-t border-gray-100">
        <button onclick={closeDropdown} class="text-[11px] text-blue-600 font-medium hover:underline">Tutup</button>
      </div>
    </div>
  {/if}
</div>