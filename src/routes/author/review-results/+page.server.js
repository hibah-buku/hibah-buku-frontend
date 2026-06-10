export async function load() {
	return {
		reviews: [
			{
				id: 1,
				reviewer: 'Reviewer A',
				score: 85,
				comment:
					'Struktur buku sudah baik, perlu perbaikan referensi.'
			},
			{
				id: 2,
				reviewer: 'Reviewer B',
				score: 90,
				comment:
					'Materi lengkap dan sesuai kebutuhan pembelajaran.'
			}
		]
	};
}