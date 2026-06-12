<script>
    import Icon from '@iconify/svelte';
    import { enhance } from '$app/forms';

    let { data, form } = $props();

    const documents = $derived(data?.documents ?? []);
    let isSubmitting = $state(null); // Menyimpan tipe dokumen yang sedang diunggah

    const documentSpecs = [
        {
            type: 'surat_pernyataan',
            title: 'Surat Pernyataan Penulis',
            desc: 'Surat pernyataan keaslian karya yang telah ditandatangani oleh penulis utama.',
            icon: 'heroicons:document-check',
            color: 'blue'
        },
        {
            type: 'scan_bermeterai',
            title: 'Scan Bermeterai',
            desc: 'Scan dokumen kesepakatan atau pernyataan bermeterai Rp 10.000.',
            icon: 'heroicons:check-badge',
            color: 'purple'
        },
        {
            type: 'dokumen_pendukung',
            title: 'Dokumen Pendukung Lain',
            desc: 'Dokumen pendukung administrasi tambahan (seperti CV, atau berkas pendukung lainnya).',
            icon: 'heroicons:paper-clip',
            color: 'emerald'
        }
    ];

    // Helper untuk mencari dokumen yang sudah diunggah berdasarkan tipe
    function getUploadedDoc(type) {
        return documents.find(d => d.document_type === type);
    }

    function formatSize(kb) {
        if (!kb) return '-';
        if (kb >= 1024) {
            return (kb / 1024).toFixed(2) + ' MB';
        }
        return kb + ' KB';
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';
    }

    // Mendapatkan URL proxy untuk mengunduh berkas
    function getDownloadUrl(doc) {
        if (!doc) return '#';
        const fileExt = doc.file_path.split('.').pop();
        return `/author/documents/download?path=${encodeURIComponent('/manuscripts/me/documents/' + doc.document_type + '/download')}&name=${encodeURIComponent(doc.document_type.toUpperCase() + '.' + fileExt)}`;
    }
</script>

<svelte:head>
    <title>Upload Dokumen Administrasi | Hibah Buku</title>
</svelte:head>

<div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-bold text-gray-800">Upload Dokumen Administrasi</h1>
        <p class="text-sm text-gray-500 mt-1">
            Unggah dokumen kelengkapan administrasi Anda di sini untuk mempermudah proses verifikasi kontrak dan dana hibah.
        </p>
    </div>

    <!-- Alert dari aksi form -->
    {#if form?.message}
        <div class={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all duration-200
            ${form.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'}`}
        >
            <Icon icon={form.success ? 'heroicons:check-circle' : 'heroicons:exclamation-circle'} class="w-5 h-5 shrink-0" />
            <span>{form.message}</span>
        </div>
    {/if}

    {#if data?.error}
        <div class="flex items-center gap-3 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
            <Icon icon="heroicons:exclamation-triangle" class="w-5 h-5 shrink-0" />
            <span>{data.error}</span>
        </div>
    {/if}

    <!-- Grid Dokumen -->
    <div class="grid grid-cols-1 gap-6">
        {#each documentSpecs as spec (spec.type)}
            {@const doc = getUploadedDoc(spec.type)}
            <div class="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300">
                
                <!-- Kiri: Detail Dokumen -->
                <div class="flex items-start gap-4">
                    <div class={`p-4 rounded-xl shrink-0
                        ${spec.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                        ${spec.color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
                        ${spec.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                    `}>
                        <Icon icon={spec.icon} class="w-7 h-7" />
                    </div>
                    <div class="space-y-1">
                        <h3 class="text-base font-bold text-gray-800">{spec.title}</h3>
                        <p class="text-xs text-gray-500 leading-relaxed max-w-lg">{spec.desc}</p>
                        
                        {#if doc}
                            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-gray-400 mt-2 font-medium">
                                <span class="flex items-center gap-1">
                                    <Icon icon="heroicons:document-text" class="w-3.5 h-3.5" />
                                    {formatSize(doc.file_size_kb)}
                                </span>
                                <span class="flex items-center gap-1">
                                    <Icon icon="heroicons:calendar" class="w-3.5 h-3.5" />
                                    {formatDate(doc.uploaded_at)}
                                </span>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Kanan: Status & Form Upload/Aksi -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    {#if doc}
                        <!-- Badge Status -->
                        <span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border justify-center
                            ${doc.is_verified 
                                ? 'bg-green-50 border-green-200 text-green-700' 
                                : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}
                        >
                            <Icon icon={doc.is_verified ? 'heroicons:check-circle' : 'heroicons:clock'} class="w-4 h-4" />
                            {doc.is_verified ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                        </span>

                        <!-- Aksi Unduh -->
                        <a 
                            href={getDownloadUrl(doc)}
                            target="_blank"
                            class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                            <Icon icon="heroicons:arrow-down-tray" class="w-4 h-4" />
                            Unduh
                        </a>

                        <!-- Aksi Hapus (Jika Belum Diverifikasi) -->
                        {#if !doc.is_verified}
                            <form 
                                method="POST" 
                                action="?/delete" 
                                use:enhance={() => {
                                    isSubmitting = `delete-${spec.type}`;
                                    return async ({ update }) => {
                                        await update();
                                        isSubmitting = null;
                                    };
                                }}
                            >
                                <input type="hidden" name="document_type" value={spec.type} />
                                <button 
                                    type="submit"
                                    disabled={isSubmitting === `delete-${spec.type}`}
                                    onclick={(e) => {
                                        if(!confirm(`Apakah Anda yakin ingin menghapus ${spec.title}?`)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    <Icon icon="heroicons:trash" class="w-4 h-4" />
                                    {isSubmitting === `delete-${spec.type}` ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </form>
                        {/if}
                    {:else}
                        <!-- Form Upload -->
                        <form 
                            method="POST" 
                            action="?/upload" 
                            enctype="multipart/form-data" 
                            use:enhance={() => {
                                isSubmitting = `upload-${spec.type}`;
                                return async ({ update }) => {
                                    await update();
                                    isSubmitting = null;
                                };
                            }}
                            class="flex flex-col sm:flex-row gap-2 w-full"
                        >
                            <input type="hidden" name="document_type" value={spec.type} />
                            
                            <div class="relative flex-1">
                                <input 
                                    type="file" 
                                    name="document_file" 
                                    id={`file-${spec.type}`}
                                    required
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    class="hidden"
                                    onchange={(e) => {
                                        const file = e.target.files[0];
                                        const label = document.getElementById(`label-${spec.type}`);
                                        if (file && label) {
                                            label.textContent = file.name;
                                        }
                                    }}
                                />
                                <label 
                                    for={`file-${spec.type}`}
                                    id={`label-${spec.type}`}
                                    class="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer select-none truncate max-w-[200px]"
                                >
                                    <Icon icon="heroicons:document-arrow-up" class="w-4 h-4 text-gray-400 shrink-0" />
                                    Pilih Berkas...
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting != null}
                                class="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                            >
                                {#if isSubmitting === `upload-${spec.type}`}
                                    <Icon icon="line-md:loading-twotone-loop" class="w-4 h-4" />
                                    Mengunggah...
                                {:else}
                                    <Icon icon="heroicons:arrow-up-tray" class="w-4 h-4" />
                                    Unggah
                                {/if}
                            </button>
                        </form>
                    {/if}
                </div>

            </div>
        {/each}
    </div>
</div>
