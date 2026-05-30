export const ENDPOINTS = {
	// --- KELOMPOK 1 ---

	// --- AUTH MODULE ---
	AUTH: {
		LOGIN: '/auth/login',
		LOGOUT: '/auth/logout',
		ME: '/auth/me' // Untuk cek profil user yang sedang login
	},

	// --- USER MANAGEMENT (ADMIN) ---
	USERS: {
		INDEX: '/users', // GET: List all users
		STORE: '/users', // POST: Create new user (Reviewer/Publisher)
		SHOW: (id) => `/users/${id}`, // GET: Detail user
		UPDATE: (id) => `/users/${id}`, // PATCH: Update user
		DESTROY: (id) => `/users/${id}` // DELETE: Soft delete user
	},

	// --- WILLINGNESS ---
	WILLINGNESS: {
		SUBMIT: '/auth/register-willingness', // POST: Submit form kesediaan (PUBLIC)
        INDEX: '/willingness-forms', // GET: List semua submission (Admin)
        APPROVE: (id) => `/willingness/${id}/approve`, // PATCH: Approve submission (ADMIN)
        REJECT: (id) => `/willingness/${id}/reject` // PATCH: Reject submission (ADMIN)
	},

	// --- CONTRACT MODULE ---
	CONTRACTS: {
		INDEX: '/contracts', // GET: List Kontrak (ADMIN)
		MY_CONTRACT: '/contracts/me', // GET: Kontrak dari author yang login (PENULIS)
		STORE: '/contracts', // POST: Upload Kontrak (PENULIS)
		VALIDATE: (id) => `/contracts/${id}/validate`, // PATCH: Admin validate/reject (ADMIN)
		REJECT: (id) => `/contracts/${id}/reject`, // PATCH: Admin validate/reject (ADMIN)
		DOWNLOAD: (id) => `/contracts/${id}/download` // GET: Download PDF (ADMIN/PENULIS)
	},

	// --- DASHBOARD ADMIN ---
	DASHBOARD: {
		SUMMARY: '/dashboard', // GET: Stats for admin dashboard
		ACTIVITIES: '/dashboard/activities' // GET: Semua Aktivitas terbaru dari 3 operasi (User baru (role penulis), kontrak baru (pending), Formulir baru (pending)) (ADMIN)
	},

	// --- TIM AUTHOR / PENULIS ---
	MANUSCRIPTS: {
		DASHBOARD: '/manuscripts/dashboard', // GET: Data dashboard ringkasan penulis
		MY_MANUSCRIPT: '/manuscripts/me', // GET: Daftar naskah milik penulis yang login
		UPLOAD_DRAFT: '/manuscripts/upload-draft', // POST: Unggah draft awal naskah
		SHOW: (id) => `/manuscripts/${id}`, // GET: Detail lengkap naskah beserta riwayat file
		UPLOAD_REVISION: (id) => `/manuscripts/${id}/upload-revision`, // POST: Unggah file revisi draft
		STATUS: (id) => `/manuscripts/${id}/status`, // GET: Data stepper status naskah
		DOWNLOAD: (id) => `/manuscripts/${id}/download` // GET: Unduh file naskah
	},
	AUTHOR_DOCUMENTS: {
		INDEX: '/manuscripts/me/documents', // GET: Daftar dokumen kelengkapan terunggah
		UPLOAD: '/manuscripts/me/documents', // POST: Unggah dokumen (KTP, CV, dll)
		DESTROY: (type) => `/manuscripts/me/documents/${type}` // DELETE: Hapus dokumen kelengkapan
	}
};
