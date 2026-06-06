import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async (event) => {
    let administrativeDocuments = [];
    let contracts = [];
    let manuscriptFilesList = [];

    // 1. Ambil Dokumen Administrasi
    try {
        const response = await apiGet(ENDPOINTS.AUTHOR_DOCUMENTS.INDEX, {}, event);
        administrativeDocuments = response?.data ?? [];
    } catch (err) {
        if (err.status !== 404) {
            console.error('Gagal mengambil dokumen administrasi:', err);
        }
    }

    // 2. Ambil Kontrak Kerja Sama
    try {
        const response = await apiGet(ENDPOINTS.CONTRACTS.MY_CONTRACT, {}, event);
        if (response?.data) {
            contracts = [response.data]; // Bungkus ke array
        }
    } catch (err) {
        if (err.status !== 404) {
            console.error('Gagal mengambil kontrak:', err);
        }
    }

    // 3. Ambil Naskah Draft Awal & Revisi
    try {
        const response = await apiGet(ENDPOINTS.MANUSCRIPTS.MY_MANUSCRIPT, {}, event);
        const manuscriptsData = response?.data?.data ?? response?.data ?? [];
        const manuscriptList = Array.isArray(manuscriptsData) ? manuscriptsData : (manuscriptsData ? [manuscriptsData] : []);
        
        for (const m of manuscriptList) {
            try {
                const detailResponse = await apiGet(ENDPOINTS.MANUSCRIPTS.SHOW(m.id), {}, event);
                const fullManuscript = detailResponse?.data;
                if (fullManuscript && Array.isArray(fullManuscript.all_files)) {
                    manuscriptFilesList.push(...fullManuscript.all_files.map(file => ({
                        ...file,
                        manuscript_id: fullManuscript.id,
                        manuscript_title: fullManuscript.title
                    })));
                } else if (fullManuscript && fullManuscript.latest_file) {
                    manuscriptFilesList.push({
                        ...fullManuscript.latest_file,
                        manuscript_id: fullManuscript.id,
                        manuscript_title: fullManuscript.title
                    });
                }
            } catch (detailErr) {
                console.error(`Gagal mengambil detail naskah ${m.id}:`, detailErr);
            }
        }
    } catch (err) {
        if (err.status !== 404) {
            console.error('Gagal mengambil naskah:', err);
        }
    }

    // 4. Gabungkan semua berkas ke dalam satu riwayat terpadu
    const unifiedHistory = [];

    // Tambahkan dokumen administrasi
    administrativeDocuments.forEach(doc => {
        unifiedHistory.push({
            id: `doc-${doc.id || doc.document_type}`,
            name: `${doc.document_type.toUpperCase()}_TERUNGGAH`,
            category: 'Dokumen Administrasi',
            subCategory: getDocTypeLabel(doc.document_type),
            uploaded_at: doc.uploaded_at || doc.created_at,
            size_kb: doc.file_size_kb,
            status: doc.is_verified ? 'Terverifikasi' : 'Menunggu Verifikasi',
            statusColor: doc.is_verified ? 'green' : 'yellow',
            download_url: `http://localhost:8000/storage/${doc.file_path}`
        });
    });

    // Tambahkan berkas kontrak
    contracts.forEach(contract => {
        const contractStatusLabels = {
            contract_uploaded: 'Menunggu Validasi',
            contract_validated: 'Disetujui',
            contract_rejected: 'Ditolak'
        };
        const contractStatusColors = {
            contract_uploaded: 'yellow',
            contract_validated: 'green',
            contract_rejected: 'rose'
        };
        unifiedHistory.push({
            id: `contract-${contract.id}`,
            name: contract.original_name,
            category: 'Kontrak Kerja Sama',
            subCategory: 'Kontrak Hibah Buku',
            uploaded_at: contract.validated_at || contract.created_at,
            size_kb: null,
            status: contractStatusLabels[contract.status] || 'Menunggu Validasi',
            statusColor: contractStatusColors[contract.status] || 'yellow',
            download_url: `http://localhost:8000/api/contracts/${contract.id}/download`
        });
    });

    // Tambahkan berkas naskah draft & revisi
    manuscriptFilesList.forEach(file => {
        const isDraft = file.file_type === 'draft_awal';
        unifiedHistory.push({
            id: `manuscript-file-${file.id}`,
            name: file.original_name,
            category: 'Naskah Buku',
            subCategory: isDraft ? 'Draft Awal' : `Revisi (${file.file_type.replace('revisi_', '')})`,
            uploaded_at: file.uploaded_at,
            size_kb: file.file_size_kb,
            status: isDraft ? 'Draft Terkirim' : 'Revisi Terkirim',
            statusColor: 'blue',
            download_url: `http://localhost:8000/api/manuscripts/${file.manuscript_id}/download${!isDraft ? `?file_id=${file.id}` : ''}`
        });
    });

    // Urutkan berdasarkan tanggal upload terbaru
    unifiedHistory.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

    return {
        history: unifiedHistory
    };
};

function getDocTypeLabel(type) {
    const labels = {
        ktp: 'Kartu Tanda Penduduk (KTP)',
        surat_pernyataan: 'Surat Pernyataan Keaslian',
        rekening: 'Scan Buku Rekening'
    };
    return labels[type] || type;
}