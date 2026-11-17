import { Book } from '../types/library';

export const DDC_CATEGORIES = [
  '000 - Karya Umum, Komputer & Informasi',
  '200 - Agama & Teologi Klasik',
  '300 - Ilmu Sosial, Ekonomi & Hukum',
  '600 - Teknologi & Rekayasa Terapan',
  '700 - Arsitektur, Seni & Desain',
  '800 - Sastra Nusantara & Klasik Dunia',
];

export const SHELF_LOCATIONS = [
  'Rak R-04 (Lt. 2, Sayap Sains Barat)',
  'Rak A-02 (Lt. 1, Seksi Arsitektur)',
  'Rak B-02 (Lt. 2, Sayap Sains Komputer)',
  'Rak E-01 (Lt. 3, Ruang Ekonomi)',
  'Rak S-03 (Lt. 2, Seksi Statistika)',
];

export const SEED_BOOKS: Book[] = [
  {
    id: 'book-1',
    isbn: '978-602-03-8821-4',
    title: 'Struktur Data & Algoritma Modern',
    subtitle: 'Pendekatan Komprehensif Berorientasi Desain Rekursif dan Kompleksitas Komputasi',
    authors: [
      { id: 'a-1', name: 'Dr. Kafabihi, M.Kom.', role: 'Penulis Utama' },
      { id: 'a-2', name: 'Dr. Ir. Hendrawan', role: 'Penyunting' },
    ],
    publisher: 'Pustaka Sains Bandung',
    year: 2024,
    pages: 524,
    dimensions: '17.6 x 25 cm (B5 Royal)',
    language: 'Indonesia',
    edition: 'Edisi 3 Revisi',
    ddcCategory: '000 - Karya Umum, Komputer & Informasi',
    ddcCode: '005.133',
    cutterCode: 'KAF s',
    shelfLocation: 'Rak R-04 (Lt. 2)',
    totalCopies: 6,
    availableCopies: 5,
    borrowedCopies: 1,
    statusNote: 'Tersedia 5 • Dipinjam 1',
    needsDdcValidation: false,
    coverTheme: 'navy',
    abstract:
      'Kajian komprehensif mengenai struktur graf, pohon hierarkis terindeks, dan algoritma amortisasi waktu. Dilengkapi studi kasus optimasi memori untuk pengarsipan data skala besar dan indeks bibliografi modern.',
    tocPreview: [
      'Bab I — Analisis Asimtotik & Notasi Kompleksitas Ruang',
      'Bab II — Pohon B-Tree & Struktur Pengindeksan Rekaman MARC21',
      'Bab III — Graf Berarah, Lintasan Terpendek, dan Jaringan Sitasi',
      'Bab IV — Tabel Hash Kriptografis & Validasi Checksum ISBN-13',
    ],
    tags: ['Edisi 3 Revisi', 'Bahasa Indonesia'],
    addedThisWeek: false,
    createdAt: '2024-10-12T08:30:00.000Z',
  },
  {
    id: 'book-2',
    isbn: '978-602-424-812-3',
    title: 'Arsitektur Nusantara: Kajian Vernakular Tropis',
    subtitle: 'Tektonika Kayu, Konstruksi Tanggam, dan Iklim Mikro Bangunan Tradisional',
    authors: [
      { id: 'a-3', name: 'Ir. Purbasari, MT', role: 'Penulis Utama' },
    ],
    publisher: 'ITB Press',
    year: 2023,
    pages: 412,
    dimensions: '21 x 28 cm (Folio)',
    language: 'Indonesia',
    edition: 'Koleksi Referensi Khusus',
    ddcCategory: '700 - Arsitektur, Seni & Desain',
    ddcCode: '720.959',
    cutterCode: 'PUR a',
    shelfLocation: 'Rak A-02 (Lt. 1)',
    totalCopies: 3,
    availableCopies: 3,
    borrowedCopies: 0,
    statusNote: 'Tersedia 3 di Rak',
    needsDdcValidation: false,
    coverTheme: 'terracotta',
    abstract:
      'Dokumentasi arsitektural terperinci mengenai proporsi geometris, sambungan kayu tanpa paku, serta adaptasi termal pasif pada rumah adat Nusantara dari Sumatera hingga kepulauan Maluku.',
    tocPreview: [
      'Bagian 01 — Tipologi Atap & Sistem Struktur Umpak Batu',
      'Bagian 02 — Poros Kosmologi dan Orientasi Angin Muson',
      'Bagian 03 — Konservasi Material Kayu Ulin & Jati Lawas',
    ],
    tags: ['Koleksi Referensi Khusus', 'Monograf Terikat Kain'],
    addedThisWeek: false,
    createdAt: '2024-09-18T10:15:00.000Z',
  },
  {
    id: 'book-3',
    isbn: '978-602-123-990-1',
    title: 'Interaksi Manusia & Komputer: Prinsip Desain Kognitif',
    subtitle: 'Prinsip Desain Pengalaman Pengguna Berbasis Ergonomi Kognitif',
    authors: [
      { id: 'a-4', name: 'Dr. Budi Santoso', role: 'Penulis Utama' },
      { id: 'a-5', name: 'Rina Wijaya, M.Kom', role: 'Penulis Kedua' },
    ],
    publisher: 'Penerbit Andi',
    year: 2026,
    pages: 384,
    dimensions: '17.6 x 25 cm (B5 Royal)',
    language: 'Indonesia',
    edition: 'Edisi Lux Revisi Kedua',
    ddcCategory: '000 - Karya Umum, Komputer & Informasi',
    ddcCode: '004.019',
    cutterCode: 'SAN i',
    shelfLocation: 'Rak B-02 (Lt. 2)',
    totalCopies: 3,
    availableCopies: 3,
    borrowedCopies: 0,
    statusNote: 'Koleksi Baru (Karantina)',
    needsDdcValidation: true,
    coverTheme: 'navy',
    abstract:
      'Eksplorasi mendalam tentang model mental pengguna, beban kognitif antarmuka, dan arsitektur informasi pada sistem katalog perpustakaan digital maupun instrumen kerja kuratorial.',
    tocPreview: [
      'Bab 1 — Psikologi Persepsi Visual & Hirarki Tipografi',
      'Bab 2 — Struktur Dialog, Pencegahan Galat, dan Umpan Balik Sistem',
      'Bab 3 — Evaluasi Heuristik pada Sistem Informasi Perpustakaan',
    ],
    tags: ['Menunggu Validasi DDC', 'Aksesi Baru'],
    addedThisWeek: true,
    createdAt: '2025-02-20T09:00:00.000Z',
  },
  {
    id: 'book-4',
    isbn: '978-602-550-109-8',
    title: 'Ekonomi Sirkular & Keberlanjutan Pangan',
    subtitle: 'Rantai Pasok Regeneratif dan Kebijakan Ekologi Industri di Asia Tenggara',
    authors: [
      { id: 'a-6', name: 'Prof. H. Pratama', role: 'Penulis Utama' },
    ],
    publisher: 'Pustaka Manajemen Lingkungan',
    year: 2024,
    pages: 348,
    dimensions: '15.5 x 23 cm (UNESCO)',
    language: 'Indonesia',
    edition: 'Cetakan Pertama',
    ddcCategory: '300 - Ilmu Sosial, Ekonomi & Hukum',
    ddcCode: '330.122',
    cutterCode: 'PRA e',
    shelfLocation: 'Rak E-01 (Lt. 3)',
    totalCopies: 4,
    availableCopies: 2,
    borrowedCopies: 0,
    reservedCopies: 2,
    statusNote: 'Tersedia 2 • Reservasi 2',
    needsDdcValidation: false,
    coverTheme: 'forest',
    abstract:
      'Analisis empiris mengenai transisi metabolisme industri menuju siklus tertutup, pengurangan residu organik pertanian, serta tata kelola lumbung pangan komunitas berkelanjutan.',
    tocPreview: [
      'Bab I — Paradigma Ekonomi Linier vs Metabolisme Sirkular',
      'Bab II — Neraca Material dan Audit Jejak Karbon Pangan',
      'Bab III — Insentif Fiskal Hijau & Koperasi Distribusi Lokal',
    ],
    tags: ['Cetakan Pertama', 'Pustaka Terbuka'],
    addedThisWeek: false,
    createdAt: '2024-11-04T14:20:00.000Z',
  },
  {
    id: 'book-5',
    isbn: '978-979-29-3388-7',
    title: 'Metode Statistika Multivariat Terapan',
    subtitle: 'Analisis Komponen Utama, Klasterisasi Hierarkis, dan Pemodelan Struktural',
    authors: [
      { id: 'a-7', name: 'Dra. Widyaningsih', role: 'Penulis Utama' },
    ],
    publisher: 'Andi Offset',
    year: 2024,
    pages: 468,
    dimensions: '17.6 x 25 cm (B5 Royal)',
    language: 'Indonesia',
    edition: 'Disertai Dataset CD-ROM',
    ddcCategory: '000 - Karya Umum, Komputer & Informasi',
    ddcCode: '519.53',
    cutterCode: 'WID m',
    shelfLocation: 'Rak S-03 (Lt. 2)',
    totalCopies: 5,
    availableCopies: 5,
    borrowedCopies: 0,
    statusNote: 'Tersedia 5 di Rak',
    needsDdcValidation: false,
    coverTheme: 'espresso',
    abstract:
      'Pedoman komprehensif pengolahan matriks kovariansi, reduksi dimensi data menggunakan Principal Component Analysis (PCA), dan pengujian hipotesis multivariat untuk riset akademik.',
    tocPreview: [
      'Bab 1 — Aljabar Matriks & Distribusi Normal Multivariat',
      'Bab 2 — Analisis Faktor Eksploratori & Konfirmatori',
      'Bab 3 — Regresi Kanonik dan Analisis Diskriminan Linier',
    ],
    tags: ['Disertai Dataset CD-ROM', 'Kurikulum Nasional'],
    addedThisWeek: false,
    createdAt: '2024-08-11T11:45:00.000Z',
  },
];

export const DEMO_SCAN_PRESETS: Array<{
  isbn: string;
  title: string;
  subtitle: string;
  authors: Book['authors'];
  publisher: string;
  year: number;
  pages: number;
  language: Book['language'];
  ddcCategory: string;
  ddcCode: string;
  shelfLocation: string;
  totalCopies: number;
  coverTheme: Book['coverTheme'];
}> = [
  {
    isbn: '978-602-291-774-8',
    title: 'Filologi Nusantara & Konservasi Naskah Lontar',
    subtitle: 'Metode Kodikologi, Transliterasi Aksara Kawi, dan Preservasi Serat Alami',
    authors: [
      { id: 'scan-1', name: 'Prof. Dr. Sastroamidjojo', role: 'Penulis Utama' },
      { id: 'scan-2', name: 'M. Kartodirdjo, M.Hum.', role: 'Penyunting' },
    ],
    publisher: 'Kepustakaan Populer Gramedia',
    year: 2025,
    pages: 440,
    language: 'Indonesia',
    ddcCategory: '800 - Sastra Nusantara & Klasik Dunia',
    ddcCode: '899.221',
    shelfLocation: 'Rak A-02 (Lt. 1, Seksi Arsitektur)',
    totalCopies: 4,
    coverTheme: 'terracotta',
  },
  {
    isbn: '978-602-06-5192-7',
    title: 'Kriptografi Kuantum & Keamanan Jaringan Terdistribusi',
    subtitle: 'Protokol Pertukaran Kunci, Kurva Eliptik, dan Ketahanan Pasca-Kuantum',
    authors: [
      { id: 'scan-3', name: 'Dr. Ir. Gunawan Wibisono', role: 'Penulis Utama' },
    ],
    publisher: 'Pustaka Sains Bandung',
    year: 2025,
    pages: 512,
    language: 'Indonesia',
    ddcCategory: '000 - Karya Umum, Komputer & Informasi',
    ddcCode: '005.824',
    shelfLocation: 'Rak R-04 (Lt. 2, Sayap Sains Barat)',
    totalCopies: 5,
    coverTheme: 'navy',
  },
  {
    isbn: '978-979-709-881-0',
    title: 'Tipografi Editorial & Sejarah Percetakan Buku Modern',
    subtitle: 'Anatomi Huruf Serif, Sistem Grid Proporsional, dan Penjilidan Benang Rami',
    authors: [
      { id: 'scan-4', name: 'Suryo Adi Nugroho, M.Sn.', role: 'Penulis Utama' },
    ],
    publisher: 'Penerbit Buku Kompas',
    year: 2024,
    pages: 328,
    language: 'Indonesia',
    ddcCategory: '700 - Arsitektur, Seni & Desain',
    ddcCode: '741.652',
    shelfLocation: 'Rak A-02 (Lt. 1, Seksi Arsitektur)',
    totalCopies: 3,
    coverTheme: 'espresso',
  },
];
