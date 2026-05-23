<script>
    import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';

    let { form } = $props();
    let loading = $state(false);
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md bg-white rounded-xl shadow-2xl">
        
        <!-- Header -->
        <div class="flex flex-col justify-center items-center bg-blue-700 py-4 rounded-t-xl">
            <Icon icon="streamline-cyber-color:book-open" class="w-10 h-10"/>
            <h2 class="text-2xl font-semibold text-gray-100 tracking-tight">Masuk ke Sistem Hibah Buku</h2>
            <p class="mt-2 text-sm text-gray-200">
                Silakan masukkan email dan password Anda.
            </p>
        </div>

        <!-- Error Message -->
        {#if form?.message}
            <div class="rounded-md bg-red-50 p-4 border border-red-200">
                <div class="flex flex-col justify-center items-center">
                    <div class="flex gap-2 items-center">
                        <Icon icon="tdesign:error-triangle" class="h-8 w-8 text-red-700" />
                        <h3 class="text-xl font-medium text-red-800">Gagal Masuk</h3>
                    </div>
                    <div class="mt-1">
                        <div class="mt-2 text-sm text-red-600">
                            <ul class="list-disc space-y-1">
                                <p>{form.message}</p>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
        
        <div class="p-6">

            <!-- Form Login -->
            <form method="POST" use:enhance={() => {
                loading = true;
                return async ({ update }) => {
                    loading = false;
                    await update();
                };
            }} class="mt-2 space-y-6">
                <div class="-space-y-px rounded-md mb-16">
                    <div class="mb-4">
                        <label for="email-address" class="mb-1 block text-sm font-medium text-gray-700">Email address</label>
                        <input 
                            id="email-address" 
                            name="email" 
                            type="email" 
                            autocomplete="email" 
                            required 
                            disabled={loading}
                            class="w-full block rounded-lg border border-gray-300 transition-color py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:border-blue-500 focus:ring-blue-500 sm:text-sm sm:leading-6" 
                            placeholder="Email Address" 
                        />
                    </div>
                    <div>
                        <label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            autocomplete="current-password" 
                            required 
                            disabled={loading}
                            class="w-full block rounded-lg border border-gray-300 transition-color py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:border-blue-500 focus:ring-blue-500 sm:text-sm sm:leading-6" 
                            placeholder="Password" 
                        />
                        
                    </div>
                </div>
    
                <div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        class="group flex w-full justify-center rounded-md bg-blue-700 px-3 py-3 text-base font-semibold text-gray-100 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {#if loading}
                            <span class="flex items-center pl-3">
                                <Icon icon="svg-spinners:ring-resize" class="h-5 w-5 text-blue-100 animate-spin" />
                                Memproses...
                            </span>
                        {:else}
                         <span class="flex items-center gap-2 ">
                            <Icon icon="material-symbols:login-rounded" class="w-6 h-6"/>
                             Masuk
                         </span>    
                        {/if}
                    </button>
                </div>
            </form>
        </div>
        
        <div class="text-center mt-0 mb-4">
             <a href="/register-willingness" class="text-sm text-blue-gray-700">
                Belum punya akun? <span class="hover:text-blue-700 hover:underline transition-colors duration-150">Daftar sebagai Penulis</span>
             </a>
        </div>
    </div>
</div>