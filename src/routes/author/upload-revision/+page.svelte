<script>
    let { data } = $props();
    let { allManuscripts } = data;

    let selectedId = $state('');
    let file = $state(null);
    let loading = $state(false);
    let message = $state('');
    let messageType = $state('');

    function handleFileChange(e) {
        file = e.target.files[0];
    }

    async function handleSubmit() {
        if (!selectedId) {
            message = 'Pilih naskah terlebih dahulu.';
            messageType = 'error';
            return;
        }
        if (!file) {
            message = 'Pilih file revisi terlebih dahulu.';
            messageType = 'error';
            return;
        }

        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            message = 'Format file tidak valid. Hanya PDF, DOC, atau DOCX.';
            messageType = 'error';
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            message = 'Ukuran file maksimal 10MB.';
            messageType = 'error';
            return;
        }

        loading = true;
        message = '';

        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = document.cookie.match(/auth_token=([^;]+)/)?.[1] ?? '';
            const res = await fetch(`http://localhost:8000/api/manuscripts/${selectedId}/upload-revision`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const result = await res.json();

            if (res.ok) {
                message = 'Revisi berhasil diunggah!';
                messageType = 'success';
                file = null;
                selectedId = '';
            } else {
                message = result.message ?? 'Gagal mengunggah revisi.';
                messageType = 'error';
            }
        } catch (err) {
            message = 'Terjadi kesalahan. Coba lagi.';
            messageType = 'error';
        } finally {
            loading = false;
        }
    }
</script>

<div class="p-6">
    <!-- Notifikasi -->
    {#if message}
        <div class="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
            {messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}">
            <span>{messageType === 'success' ? '✅' : '⚠️'}</span>
            {message}
        </div>
    {/if}

    <!-- Info Box -->
    <div class="mb-5 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <span class="text-blue-500 text-lg mt-0.5">ℹ️</span>
        <div class="text-sm text-blue-700">
            <p class="font-medium">Panduan Upload Revisi</p>
            <p class="mt-0.5 text-blue-600">Pastikan file revisi sudah sesuai dengan catatan reviewer. Format yang diterima: PDF, DOC, atau DOCX dengan ukuran maksimal 10MB.</p>
        </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5 max-w-2xl">

        <!-- Pilih Naskah -->
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                Pilih Naskah <span class="text-red-500">*</span>
            </label>
            <select
                bind:value={selectedId}
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
                <option value="">-- Pilih naskah yang akan direvisi --</option>
                {#each allManuscripts as manuscript}
                    <option value={manuscript.id}>
                        {manuscript.title} — {manuscript.status.label}
                    </option>
                {/each}
            </select>
        </div>

        <!-- Upload File -->
        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                File Revisi <span class="text-red-500">*</span>
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <div class="text-3xl mb-2">📄</div>
                <p class="text-sm text-gray-500 mb-3">Klik untuk memilih file atau drag & drop</p>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onchange={handleFileChange}
                    class="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {#if file}
                    <p class="mt-2 text-sm text-green-600 font-medium">✅ {file.name}</p>
                {/if}
            </div>
            <p class="text-xs text-gray-400 mt-1.5">Format: PDF, DOC, DOCX. Maksimal 10MB.</p>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-100"></div>

        <!-- Tombol -->
        <button
            onclick={handleSubmit}
            disabled={loading}
            class="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {#if loading}
                <span class="animate-spin">⏳</span> Mengunggah...
            {:else}
                Upload Revisi Naskah
            {/if}
        </button>
    </div>
</div>