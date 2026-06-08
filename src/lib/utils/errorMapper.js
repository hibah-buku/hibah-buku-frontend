export function mapErrorMessage(field, message) {
  const translations = {
    'main_author_email': {
      'has already been taken': 'Email Penulis Utama sudah terdaftar dalam form kesediaan yang masih menunggu persetujuan admin.',
      'is invalid': 'tidak valid formatnya.',
    },
    'main_author_name': {
      'is required': 'wajib diisi.',
    },
    'main_author_institution': {
      'is required': 'wajib diisi.',
    },
    'main_author_phone': {
      'is required': 'wajib diisi.',
    },
    'co_author_1_name': {
      'is required': 'wajib diisi.',
    },
    'co_author_1_email': {
      'is required': 'wajib diisi.',
      'is invalid': 'tidak valid formatnya.',
    },
    'co_author_1_institution': {
      'is required': 'wajib diisi.',
    },
    'book_title': {
      'is required': 'wajib diisi.',
    },
    'book_type': {
      'must be one of': 'harus dipilih antara Buku Ajar atau Buku Referensi.',
    },
    'field_of_study': {
      'is required': 'wajib diisi.',
    },
  };

  // Cek apakah ada terjemahan khusus untuk field ini
  if (translations[field]) {
    for (const [englishPhrase, indoPhrase] of Object.entries(translations[field])) {
      if (message.toLowerCase().includes(englishPhrase.toLowerCase())) {
        const fieldNameIndo = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${fieldNameIndo}: ${indoPhrase}`;
      }
    }
  }

  // Jika tidak ada mapping, kembalikan pesan asli 
  return message;
}