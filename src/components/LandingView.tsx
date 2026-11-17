import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Printer,
  RefreshCw,
  Network,
} from 'lucide-react';
import { Book } from '../types/library';
import {
  filterBooks,
  calculateKpiMetrics,
  formatIsbn13,
  validateIsbn13,
} from '../utils/catalogLogic';
import { DDC_CATEGORIES } from '../data/seedBooks';
import { BookCoverArt } from './BookCoverArt';

interface LandingViewProps {
  books: Book[];
  onOpenAuthModal: () => void;
  onSelectBook: (book: Book) => void;
  onOpenFormDirect: () => void;
  onOpenPrintModal: (book: Book) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  books,
  onOpenAuthModal,
  onSelectBook,
  onOpenFormDirect,
  onOpenPrintModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<
    'ALL' | 'TITLE' | 'AUTHOR' | 'DDC'
  >('ALL');
  const [shelfPage, setShelfPage] = useState(0);

  // Interactive Atelier (Meja Konservasi) Sandbox State
  const [atelierIsbn, setAtelierIsbn] = useState('978-602-03-8821-4');
  const [atelierTitle, setAtelierTitle] = useState(
    'Struktur Data & Algoritma Modern'
  );
  const [atelierDdcClass, setAtelierDdcClass] = useState(DDC_CATEGORIES[0]);
  const [atelierSubDdc, setAtelierSubDdc] = useState('005.133');

  const metrics = calculateKpiMetrics(books);
  const filteredBooks = filterBooks(books, searchQuery);

  // Display 4 books at a time on the wooden shelf
  const visibleShelfBooks =
    filteredBooks.length <= 4
      ? filteredBooks
      : filteredBooks.slice(shelfPage, shelfPage + 4);

  const featuredBook = books[0];
  const atelierIsbnCheck = validateIsbn13(atelierIsbn);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F2ECE1] text-[#2C1E16]">
      {/* TOP NAVIGATION BAR (Reference Image 1) */}
      <header className="sticky top-0 z-30 border-b border-[#DFD5C5] bg-[#FAF7F2]/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
          {/* Left Monogram & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded border border-[#2C1E16] bg-[#FAF7F2] font-serif-editorial text-lg font-bold text-[#2C1E16]">
              §
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif-editorial text-lg font-bold tracking-tight text-[#2C1E16]">
                  BIBLIOTEKA
                </span>
                <span className="font-serif-editorial text-sm italic text-[#6E5D4F]">
                  arsip
                </span>
              </div>
              <div className="font-mono-code text-[8px] tracking-widest uppercase text-[#6E5D4F]">
                EST. MCMXXIV • SIRKULASI &amp; PRESERVASI
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden items-center gap-7 font-mono-code text-[11px] tracking-wider uppercase md:flex"
          >
            <button
              type="button"
              onClick={() => scrollToSection('opac-hero')}
              className="border-b-2 border-[#B85042] pb-1 font-semibold text-[#B85042]"
            >
              01. Katalog OPAC
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('koleksi-rak')}
              className="pb-1 text-[#6E5D4F] transition-colors hover:text-[#2C1E16]"
            >
              02. Koleksi Baru
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('atelier-konservasi')}
              className="pb-1 text-[#6E5D4F] transition-colors hover:text-[#2C1E16]"
            >
              03. Atelier
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('kolofon-footer')}
              className="pb-1 text-[#6E5D4F] transition-colors hover:text-[#2C1E16]"
            >
              04. Kolofon
            </button>
          </nav>

          {/* Right Status + Masuk Kurator Outline Button */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 font-mono-code text-[10px] text-[#4D7C5B] sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#4D7C5B]" />
              <span>Ruang Baca Buka</span>
            </div>

            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-2 rounded-md border border-[#2C1E16] bg-[#FAF7F2] px-3.5 py-2 font-mono-code text-xs font-semibold text-[#2C1E16] transition-colors hover:bg-[#2C1E16] hover:text-[#FAF7F2]"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Masuk Kurator</span>
            </button>
          </div>
        </div>
      </header>

      {/* EDITORIAL HERO & OPAC SEARCH BAR */}
      <section
        id="opac-hero"
        className="mx-auto max-w-5xl px-4 pt-12 pb-14 text-center sm:px-8"
      >
        {/* Top Archival Tag */}
        <div className="mx-auto inline-flex items-center gap-2 rounded border border-[#DFD5C5] bg-[#FAF7F2] px-3.5 py-1 font-mono-code text-[10px] tracking-widest uppercase text-[#6E5D4F]">
          <span className="font-serif-editorial italic text-[#B85042]">
            Ex Libris
          </span>
          <span>/</span>
          <span>STANDAR MARC21-ID • PRESERVASI ARSIP FISIK</span>
        </div>

        {/* Display Headline */}
        <h1 className="mt-6 font-serif-editorial text-4xl leading-[1.12] font-normal tracking-tight text-[#2C1E16] sm:text-6xl">
          Ruang Teduh Penjaga Aksara
          <span className="block font-serif-editorial italic text-[#B85042]">
            &amp; Memori Kolektif.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl font-serif-editorial text-base italic leading-relaxed text-[#6E5D4F] sm:text-lg">
          Repositori bibliografi klasik, preservasi jilid kain pusaka, dan
          katalogisasi presisi standar internasional bagi peneliti, arsiparis,
          dan penikmat wacana lintas masa.
        </p>

        {/* Interactive OPAC Search Box */}
        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-3 shadow-sm">
          {/* Search Scope Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-4 border-b border-[#DFD5C5] pb-2.5 font-mono-code text-[10px] uppercase">
            {[
              { id: 'ALL', label: 'Semua Naskah' },
              { id: 'TITLE', label: 'Judul & Leksikon' },
              { id: 'AUTHOR', label: 'Pengarang' },
              { id: 'DDC', label: 'Klasifikasi DDC' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setSearchScope(
                    tab.id as 'ALL' | 'TITLE' | 'AUTHOR' | 'DDC'
                  )
                }
                className={`px-2 py-0.5 transition-colors ${
                  searchScope === tab.id
                    ? 'border-b-2 border-[#B85042] font-bold text-[#B85042]'
                    : 'text-[#6E5D4F] hover:text-[#2C1E16]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input & Button */}
          <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E5D4F]" />
              <input
                type="search"
                aria-label="Telusuri katalog OPAC berdasarkan judul, penulis, atau ISBN"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShelfPage(0);
                }}
                placeholder="Telusuri karya, manuskrip, atau nomor panggil (misal: 005.133, Arsitektur, 978-...)..."
                className="w-full rounded-[8px] border border-[#DFD5C5] bg-white py-2.5 pl-10 pr-4 font-serif-editorial text-sm text-[#2C1E16] outline-none focus:border-[#B85042]"
              />
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('koleksi-rak')}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#B85042] px-5 py-2.5 font-mono-code text-xs font-semibold tracking-wider uppercase text-white transition-colors hover:bg-[#9E3F32]"
            >
              <span>• BUKA PETI NASKAH</span>
            </button>
          </div>
        </div>

        {/* Sub-search Quick Link */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 font-serif-editorial text-xs italic text-[#6E5D4F]">
          <span>
            Koleksi Terverifikasi:{' '}
            {metrics.totalPhysicalCopies.toLocaleString('id-ID')} Bundel
          </span>
          <span>•</span>
          <button
            type="button"
            onClick={onOpenFormDirect}
            className="font-semibold text-[#B85042] underline decoration-[#B85042]/50 underline-offset-4 hover:text-[#9E3F32]"
          >
            Meja Pencatatan Baru (MARC21) →
          </button>
        </div>

        {/* 3-CARD ARCHIVAL SHOWCASE (Reference Image 1) */}
        <div className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          {/* Left Arched Heritage Card */}
          <div className="md:col-span-3 flex justify-center">
            <div className="relative flex h-72 w-52 flex-col justify-between overflow-hidden rounded-t-full rounded-b-xl border border-[#C5B49E] bg-gradient-to-b from-[#DFD3C3] via-[#BAA68E] to-[#6E5844] p-4 shadow-md">
              <div className="mx-auto mt-3 rounded border border-[#2C1E16]/25 bg-[#FAF7F2]/90 px-2.5 py-1 font-mono-code text-[8px] tracking-widest uppercase text-[#2C1E16]">
                RUANG PRESERVASI
              </div>
              <div className="rounded-lg border border-[#DFD5C5] bg-[#FAF7F2] p-2.5 text-center shadow-xs">
                <div className="font-serif-editorial text-xs italic font-semibold text-[#2C1E16]">
                  Jilid Kulit &amp; Linen 1924
                </div>
                <div className="mt-0.5 font-mono-code text-[8px] tracking-wider uppercase text-[#6E5D4F]">
                  SERI HERITAGE NUSANTARA
                </div>
              </div>
            </div>
          </div>

          {/* Center Interactive Index Card #8821 */}
          <div className="md:col-span-6">
            <div
              onClick={() => featuredBook && onSelectBook(featuredBook)}
              className="relative cursor-pointer rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 text-left shadow-md transition-transform hover:-translate-y-0.5"
            >
              {/* Wax Seal Badge */}
              <div className="absolute -top-3.5 -right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#B85042] font-serif-editorial text-xs font-bold text-white shadow-sm">
                §
              </div>

              <div className="flex items-center justify-between border-b border-dashed border-[#DFD5C5] pb-3">
                <span className="font-mono-code text-[10px] tracking-widest uppercase text-[#6E5D4F]">
                  KARTU INDEKS KATALOG #8821
                </span>
                <span className="rounded border border-[#B85042]/40 bg-[#FDF4F3] px-2 py-0.5 font-mono-code text-[9px] font-semibold text-[#B85042]">
                  MARC21 LEADER
                </span>
              </div>

              <div className="mt-4 rounded-lg border border-[#DFD5C5] bg-[#F2ECE1]/70 px-4 py-2.5">
                <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                  NOMOR PANGGIL KLASIFIKASI DDC:
                </div>
                <div className="mt-0.5 font-mono-code text-base font-bold tracking-wider text-[#2C1E16]">
                  005.133 / KAF / 2024
                </div>
              </div>

              <div className="mt-4">
                <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                  JUDUL TERDAFTAR:
                </div>
                <div className="mt-0.5 font-serif-editorial text-xl italic font-bold text-[#2C1E16]">
                  Struktur Data &amp; Algoritma Modern
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                    PENULIS:
                  </div>
                  <div className="font-semibold text-[#2C1E16]">
                    Dr. Kafabihi, M.Kom.
                  </div>
                </div>
                <div>
                  <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                    PENERBIT:
                  </div>
                  <div className="font-semibold text-[#2C1E16]">
                    Pustaka Sains Bandung
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                  FISIK BUKU:
                </div>
                <div className="font-mono-code text-[11px] text-[#2C1E16]">
                  xxiv + 524 hlm. ; Kertas Bookpaper 72gsm ; 25 cm
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#DFD5C5] pt-3">
                <span className="font-mono-code text-[10px] text-[#6E5D4F]">
                  ISBN: 978-602-03-8821-4
                </span>
                <span className="inline-flex items-center gap-1.5 rounded border border-[#C6DBC9] bg-[#EFF5F0] px-2.5 py-0.5 font-mono-code text-[9.5px] font-semibold text-[#4D7C5B]">
                  • Rak Utama Lantai II
                </span>
              </div>
            </div>
          </div>

          {/* Right Arched Linen Spine Card */}
          <div className="md:col-span-3 flex justify-center">
            <div className="relative flex h-72 w-52 flex-col justify-between rounded-t-full rounded-b-xl border border-[#4A372B] bg-[#2C1E16] p-5 text-center text-[#FAF7F2] shadow-md">
              <div className="mt-4">
                <div className="font-mono-code text-[8px] tracking-widest uppercase text-[#D5C5B3]">
                  JILIDAN KHUSUS
                </div>
                <div className="mt-1 font-serif-editorial text-xs italic text-[#FAF7F2]">
                  Kain Linen Cokelat
                </div>
              </div>

              <div className="my-auto px-2">
                <div className="font-serif-editorial text-sm text-[#B85042]">
                  • § •
                </div>
                <p className="mt-2 font-serif-editorial text-xs italic leading-relaxed text-[#E8DDD1]">
                  &ldquo;Buku adalah bejana abadi bagi jiwa yang
                  merenung.&rdquo;
                </p>
              </div>

              <div className="border-t border-white/15 pt-2 font-mono-code text-[8px] tracking-widest uppercase text-[#D5C5B3]">
                ARSIP NO. 04 / BBP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC STRIP (4-Column Grid with 1px Hairline Dividers - Reference Image 1) */}
      <section className="border-y border-[#DFD5C5] bg-[#FAF7F2]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-[#DFD5C5] sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          <div className="px-6 py-6">
            <div className="font-mono-code text-[9.5px] tracking-wider uppercase text-[#6E5D4F]">
              01 / TOTAL MANUSKRIP
            </div>
            <div className="mt-2 font-serif-editorial text-3xl font-bold text-[#2C1E16] font-mono-code">
              {metrics.totalPhysicalCopies.toLocaleString('id-ID')}+
            </div>
            <div className="mt-1 font-serif-editorial text-xs italic text-[#6E5D4F]">
              Judul Terkatalog dalam format MARC21
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="font-mono-code text-[9.5px] tracking-wider uppercase text-[#6E5D4F]">
              02 / AKUISIS MINGGU INI
            </div>
            <div className="mt-2 font-serif-editorial text-3xl font-bold text-[#B85042] font-mono-code">
              +{metrics.weeklyAdditions}
            </div>
            <div className="mt-1 font-serif-editorial text-xs italic text-[#6E5D4F]">
              Input Minggu Ini telah divalidasi kurator
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="font-mono-code text-[9.5px] tracking-wider uppercase text-[#6E5D4F]">
              03 / PRESERVASI FISIK
            </div>
            <div className="mt-2 font-serif-editorial text-3xl font-bold text-[#2C1E16] font-mono-code">
              {metrics.catalogAccuracy}
            </div>
            <div className="mt-1 font-serif-editorial text-xs italic text-[#6E5D4F]">
              Akurasi Data bebas asam &amp; deasidifikasi
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="font-mono-code text-[9.5px] tracking-wider uppercase text-[#6E5D4F]">
              04 / EFISIENSI PENCATATAN
            </div>
            <div className="mt-2 font-serif-editorial text-3xl font-bold text-[#B85042] font-mono-code">
              &lt; 15 dtk
            </div>
            <div className="mt-1 font-serif-editorial text-xs italic text-[#6E5D4F]">
              Kecepatan Input terindeks per borang buku
            </div>
          </div>
        </div>
      </section>

      {/* KOLEKSI BUKU DI ATAS RAK KAYU (Reference Image 1) */}
      <section
        id="koleksi-rak"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-8"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono-code text-[10px] font-semibold tracking-widest uppercase text-[#B85042]">
              • PAMERAN RAK UTAMA BULAN INI
            </div>
            <h2 className="mt-1.5 font-serif-editorial text-3xl font-bold text-[#2C1E16]">
              Koleksi Buku di Atas Rak Kayu
            </h2>
            <p className="mt-1 font-serif-editorial text-sm italic text-[#6E5D4F]">
              Ditampilkan di atas ambalan ek padat dengan kartu buku pustaka
              tempo dulu. Klik buku untuk rincian OPAC.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-code text-[10px] tracking-wider uppercase text-[#6E5D4F]">
              RAK A-02 • SEKSI ILMU SOSIAL &amp; TEKNOLOGI
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Geser rak ke kiri"
                onClick={() => setShelfPage((p) => Math.max(0, p - 1))}
                disabled={shelfPage === 0}
                className="flex h-8 w-8 items-center justify-center rounded border border-[#DFD5C5] bg-[#FAF7F2] text-[#2C1E16] hover:bg-white disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Geser rak ke kanan"
                onClick={() =>
                  setShelfPage((p) =>
                    p + 4 < filteredBooks.length ? p + 1 : 0
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded border border-[#DFD5C5] bg-[#FAF7F2] text-[#2C1E16] hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Card Book Grid + Solid Teak Wood Shelf Ledge */}
        {visibleShelfBooks.length === 0 ? (
          <div className="mt-8 rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-10 text-center">
            <p className="font-serif-editorial text-base italic text-[#6E5D4F]">
              Tidak ditemukan koleksi yang cocok dengan kata kunci &ldquo;
              {searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 rounded-lg bg-[#B85042] px-4 py-2 text-xs font-semibold text-white"
            >
              Tampilkan Semua Koleksi
            </button>
          </div>
        ) : (
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {visibleShelfBooks.map((book) => {
                const isReservedOnly =
                  (book.reservedCopies || 0) > 0 && book.availableCopies <= 2;
                return (
                  <article
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="group flex cursor-pointer flex-col justify-between"
                  >
                    {/* Book Cover Art */}
                    <div className="mx-auto w-full max-w-[235px] transition-transform duration-200 group-hover:-translate-y-1.5">
                      <BookCoverArt book={book} size="md" />
                    </div>

                    {/* Vintage Index Card Below Book */}
                    <div className="mt-3 rounded-lg border border-[#DFD5C5] bg-[#FAF7F2] p-4 shadow-xs transition-colors group-hover:border-[#B85042]">
                      <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-2 font-mono-code text-[9.5px]">
                        <span className="font-bold text-[#B85042]">
                          {book.ddcCode} {book.cutterCode.split(' ')[0]} •
                        </span>
                        <span
                          className={`font-semibold ${
                            isReservedOnly
                              ? 'text-[#B85042]'
                              : 'text-[#4D7C5B]'
                          }`}
                        >
                          {isReservedOnly
                            ? '• DIPINJAM (24 OKT)'
                            : '• TERSEDIA'}
                        </span>
                      </div>

                      <h3 className="mt-2.5 line-clamp-1 font-serif-editorial text-base font-bold text-[#2C1E16]">
                        {book.title}
                      </h3>
                      <p className="font-serif-editorial text-xs italic text-[#6E5D4F]">
                        {book.publisher}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-[#DFD5C5] pt-2.5 font-mono-code text-[10px]">
                        <span className="text-[#6E5D4F]">
                          {book.availableCopies} Eksemplar
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#B85042] group-hover:translate-x-0.5 transition-transform">
                          <span>
                            {isReservedOnly ? 'Pesan' : 'Telusuri'}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Teak Wood Shelf Ledge Bar */}
            <div className="mt-2 flex items-center justify-between rounded-sm bg-[#5B3E29] px-5 py-2 font-mono-code text-[9px] tracking-widest uppercase text-[#E6D7C3] shadow-md">
              <span>AMBALAN KAYU JATI • SEKSI 02/B</span>
              <span>ARSIP RESMI SIP INDONESIA</span>
            </div>
          </div>
        )}
      </section>

      {/* ATELIER / MEJA KONSERVASI PREVIEW SECTION (Reference Image 1) */}
      <section
        id="atelier-konservasi"
        className="border-t border-[#DFD5C5] bg-[#F2ECE1] py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div>
            <div className="font-mono-code text-[10px] font-semibold tracking-widest uppercase text-[#B85042]">
              BENGKEL PRESERVASI &amp; KATALOGISASI
            </div>
            <h2 className="mt-1 font-serif-editorial text-3xl font-bold text-[#2C1E16]">
              Atelier / Meja Konservasi
            </h2>
            <p className="mt-1 max-w-xl font-serif-editorial text-sm italic text-[#6E5D4F]">
              Di balik keheningan perpustakaan, terdapat dedikasi pencatatan
              manuskrip: standardisasi MARC21, penjilidan manual benang rami,
              dan pemetaan Dewey Decimal.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left 7 Cols: 01 / Borang Induk Inventarisasi (MARC21) */}
            <div className="lg:col-span-7 rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 tactile-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFD5C5] pb-4">
                <div className="flex items-center gap-2 font-mono-code text-xs font-bold text-[#2C1E16]">
                  <span className="h-2.5 w-2.5 bg-[#B85042]" />
                  <span>01 / BORANG INDUK INVENTARISASI (MARC21)</span>
                </div>
                <span className="rounded border border-[#C6DBC9] bg-[#EFF5F0] px-2.5 py-0.5 font-mono-code text-[9.5px] font-semibold text-[#4D7C5B]">
                  API PERPUSNAS RI TERHUBUNG
                </span>
              </div>

              <p className="mt-3 font-serif-editorial text-xs italic text-[#6E5D4F]">
                Penginputan cepat data bibliografis naskah baru. Sesuai prinsip
                ketukan tuts typewriter, validasi checksum ISBN dilakukan
                seketika tanpa perlu mengangkat tangan dari keyboard.
              </p>

              <div className="mt-5 space-y-4 rounded-xl border border-[#DFD5C5] bg-[#F2ECE1]/50 p-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="atelier-isbn"
                      className="font-mono-code text-[10px] font-semibold uppercase text-[#2C1E16]"
                    >
                      NOMOR BUKU INTERNASIONAL (ISBN-13) *
                    </label>
                    <span
                      className={`inline-flex items-center gap-1 font-mono-code text-[10px] ${
                        atelierIsbnCheck.isValid
                          ? 'text-[#4D7C5B]'
                          : 'text-[#B85042]'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>
                        {atelierIsbnCheck.isValid
                          ? 'Checksum Sesuai Standar ISO'
                          : `${atelierIsbnCheck.digitCount}/13 Digit`}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                    <input
                      id="atelier-isbn"
                      type="text"
                      value={atelierIsbn}
                      onChange={(e) =>
                        setAtelierIsbn(formatIsbn13(e.target.value))
                      }
                      className="flex-1 rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2 font-mono-code text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAtelierIsbn('978-602-424-812-3');
                        setAtelierTitle(
                          'Arsitektur Nusantara: Kajian Vernakular Tropis'
                        );
                        setAtelierDdcClass(DDC_CATEGORIES[4]);
                        setAtelierSubDdc('720.959');
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[#B85042] px-4 py-2 font-mono-code text-[10.5px] font-semibold uppercase text-white hover:bg-[#9E3F32]"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>AUTO-SINKRON</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="atelier-title"
                    className="block font-mono-code text-[10px] font-semibold uppercase text-[#2C1E16]"
                  >
                    JUDUL LENGKAP NASKAH / MONOGRAF *
                  </label>
                  <input
                    id="atelier-title"
                    type="text"
                    value={atelierTitle}
                    onChange={(e) => setAtelierTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2 font-serif-editorial text-sm font-semibold text-[#2C1E16] outline-none focus:border-[#B85042]"
                  />
                </div>

                <div>
                  <div className="font-mono-code text-[10px] font-semibold uppercase text-[#2C1E16]">
                    PENULIS, EDITOR &amp; DEWAN KURATOR
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-2 rounded-[8px] border border-[#DFD5C5] bg-white p-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded border border-[#DFD5C5] bg-[#FAF7F2] px-2.5 py-1 font-mono-code text-[10px] text-[#2C1E16]">
                      Dr. Kafabihi, M.Kom. (Penulis Utama)
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded border border-[#DFD5C5] bg-[#FAF7F2] px-2.5 py-1 font-mono-code text-[10px] text-[#2C1E16]">
                      Dr. Ir. Hendrawan (Penyunting)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#DFD5C5] pt-4">
                <span className="font-mono-code text-[10px] text-[#6E5D4F]">
                  Pintasan Simpan Cepat: [Ctrl + Enter]
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAtelierIsbn('978-602-03-8821-4');
                      setAtelierTitle('Struktur Data & Algoritma Modern');
                    }}
                    className="rounded-md border border-[#DFD5C5] bg-white px-3 py-2 font-mono-code text-[10px] font-semibold uppercase text-[#6E5D4F] hover:text-[#2C1E16]"
                  >
                    BATAL / TUNDA
                  </button>
                  <button
                    type="button"
                    onClick={onOpenFormDirect}
                    className="rounded-md bg-[#2C1E16] px-4 py-2 font-mono-code text-[10px] font-semibold uppercase text-white transition-colors hover:bg-[#3E2B20]"
                  >
                    CAP &amp; DAFTARKAN KE BUKU INDUK
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: 02 / Pohon Taksonomi DDC & 03 / Tiket Punggung Buku */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 02: Pohon Taksonomi Dewey Decimal */}
              <div className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-5 tactile-card">
                <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-3">
                  <span className="font-mono-code text-[10.5px] font-bold uppercase text-[#2C1E16]">
                    02 / POHON TAKSONOMI DEWEY DECIMAL
                  </span>
                  <Network className="h-4 w-4 text-[#6E5D4F]" />
                </div>

                <h3 className="mt-3 font-serif-editorial text-lg font-bold text-[#2C1E16]">
                  Klasifikasi Presisi Desimal (DDC)
                </h3>
                <p className="mt-0.5 font-serif-editorial text-xs italic text-[#6E5D4F]">
                  Peta pengelompokan subjek berjenjang dari kelas induk hingga
                  laci sub-disiplin ilmiah.
                </p>

                <div className="mt-3 space-y-2">
                  <select
                    aria-label="Pilih Kelas Induk DDC"
                    value={atelierDdcClass}
                    onChange={(e) => {
                      setAtelierDdcClass(e.target.value);
                      const code = e.target.value.slice(0, 3);
                      setAtelierSubDdc(
                        code === '000'
                          ? '005.133'
                          : code === '700'
                          ? '720.959'
                          : `${code}.102`
                      );
                    }}
                    className="w-full rounded-lg border border-[#DFD5C5] bg-white px-3 py-2 font-mono-code text-xs text-[#2C1E16]"
                  >
                    {DDC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <div className="rounded-lg border border-[#B85042]/50 bg-white px-3 py-2 flex items-center justify-between font-mono-code text-xs">
                    <span>• 005 - Pemrograman &amp; Data</span>
                    <span className="text-[10px] font-semibold text-[#B85042]">
                      Terpilih
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#DFD5C5] bg-[#F2ECE1] px-3 py-2 flex items-center justify-between font-mono-code text-xs font-semibold text-[#2C1E16]">
                    <span>• {atelierSubDdc} - Algoritma Khusus</span>
                    <span className="text-[#4D7C5B]">✓</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#DFD5C5] pt-2.5 font-mono-code text-[10px]">
                  <span className="text-[#6E5D4F]">Notasi Pengarang: KAF</span>
                  <span className="font-semibold text-[#B85042]">
                    Tabel Cutter Terisi
                  </span>
                </div>
              </div>

              {/* Card 03: Tiket Punggung Buku & Ex-Libris */}
              <div className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-5 tactile-card">
                <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-3">
                  <span className="font-mono-code text-[10.5px] font-bold uppercase text-[#2C1E16]">
                    03 / TIKET PUNGGUNG BUKU &amp; EX-LIBRIS
                  </span>
                  <Printer className="h-4 w-4 text-[#6E5D4F]" />
                </div>

                <h3 className="mt-3 font-serif-editorial text-lg font-bold text-[#2C1E16]">
                  Cetak Label Punggung &amp; Ex-Libris
                </h3>
                <p className="mt-0.5 font-serif-editorial text-xs italic text-[#6E5D4F]">
                  Label kertas serat tebal berperekat tahan lembap untuk
                  perlindungan jangka panjang.
                </p>

                <div className="mt-3 flex justify-center rounded-lg border border-dashed border-[#C7B9A5] bg-[#F2ECE1]/70 p-4">
                  <div className="w-44 rounded border border-[#2C1E16] bg-white p-3 text-center shadow-xs">
                    <div className="border-b border-[#DFD5C5] pb-1 font-mono-code text-[7.5px] tracking-widest uppercase text-[#6E5D4F]">
                      EX-LIBRIS • BIBLIOTEKA
                    </div>
                    <div className="mt-1.5 font-mono-code text-sm font-bold text-[#2C1E16]">
                      {atelierSubDdc}
                    </div>
                    <div className="font-mono-code text-[10px] font-semibold text-[#6E5D4F]">
                      KAF / 2024
                    </div>
                    <div className="mt-2 h-2 w-full bg-[#2C1E16]/85" />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between font-mono-code text-[10px]">
                  <span className="text-[#6E5D4F]">
                    Ukuran Standar: 30 × 50 mm
                  </span>
                  <button
                    type="button"
                    onClick={() => featuredBook && onOpenPrintModal(featuredBook)}
                    className="font-bold text-[#B85042] hover:underline"
                  >
                    CETAK PROTOTIPE →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KOLOFON INSTITUTIONAL FOOTER (Reference Image 1) */}
      <footer
        id="kolofon-footer"
        className="border-t border-[#DFD5C5] bg-[#E8DFD1] text-[#2C1E16]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-8 md:grid-cols-12">
          {/* Col 1 */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-[#2C1E16] bg-[#FAF7F2] font-serif-editorial text-sm font-bold">
                B
              </div>
              <div>
                <div className="font-serif-editorial text-base font-bold">
                  BIBLIOTEKA
                </div>
                <div className="font-mono-code text-[8px] tracking-widest uppercase text-[#6E5D4F]">
                  RUMAH PRESERVASI &amp; SISTEM INFORMASI
                </div>
              </div>
            </div>
            <p className="mt-3 font-serif-editorial text-xs italic leading-relaxed text-[#6E5D4F]">
              Didedikasikan untuk menjaga keutuhan khazanah literatur, manuskrip
              nusantara, dan sirkulasi keilmuan dengan kehormatan tradisi
              percetakan dan kecermatan teknologi informasi.
            </p>
            <div className="mt-4 font-mono-code text-[10px] text-[#2C1E16]">
              <div className="font-bold text-[#B85042]">
                • JAM KUNJUNGAN RUANG BACA TENANG:
              </div>
              <div className="mt-1 text-[#6E5D4F]">
                Senin – Jumat: 08.00 – 17.00 WIB
              </div>
              <div className="text-[#6E5D4F]">
                Sabtu: 09.00 – 15.00 WIB (Hening Khusus)
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="md:col-span-3">
            <div className="font-mono-code text-[10px] font-bold tracking-wider uppercase text-[#2C1E16]">
              GEDUNG &amp; LOKASI ARSIP
            </div>
            <div className="mt-3 text-xs leading-relaxed text-[#6E5D4F]">
              <p className="font-semibold text-[#2C1E16]">
                Graha Pustaka Utama, Lantai 1–4
              </p>
              <p>Kampus Terpadu Ilmu Pengetahuan</p>
              <p>Jl. Perpustakaan No. 12, Jawa Barat 40132</p>
              <p className="mt-2 font-mono-code text-[10.5px]">
                Surel: kurator@sip-biblioteka.ac.id
              </p>
              <p className="font-mono-code text-[10.5px]">
                Telepon Konservasi: (022) 876-9021
              </p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="md:col-span-2">
            <div className="font-mono-code text-[10px] font-bold tracking-wider uppercase text-[#2C1E16]">
              LEKSIKON ARSIP
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-[#6E5D4F]">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('opac-hero')}
                  className="hover:text-[#2C1E16]"
                >
                  Katalog OPAC
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('koleksi-rak')}
                  className="hover:text-[#2C1E16]"
                >
                  Pameran Rak Kayu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFormDirect}
                  className="hover:text-[#2C1E16]"
                >
                  Standar MARC21
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="hover:text-[#2C1E16]"
                >
                  Meja Kerja Kurator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="md:col-span-3">
            <div className="font-mono-code text-[10px] font-bold tracking-wider uppercase text-[#2C1E16]">
              INTEGRITAS NODE &amp; REPOSITORI
            </div>
            <div className="mt-3 rounded-lg border border-[#DFD5C5] bg-[#FAF7F2] p-3.5 font-mono-code text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-[#6E5D4F]">Status Node:</span>
                <span className="font-semibold text-[#4D7C5B]">
                  • Operasional Normal
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[#6E5D4F]">Z39.50 Portal:</span>
                <span className="text-[#2C1E16]">Aktif (Port 210)</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[#6E5D4F]">Indeks Integritas:</span>
                <span className="text-[#2C1E16]">99.8% Tersinkron</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DFD5C5] px-4 py-4 font-mono-code text-[10px] text-[#6E5D4F] sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
            <span>
              § © MCMXXIV – MMXXVI BIBLIOTEKA SIP. SELURUH HAK CIPTA DILINDUNGI
              PENERBIT.
            </span>
            <span>
              STANDAR METADATA MARC21 &amp; ISO 2709 COMPLIANT • PERPUSTAKAAN
              NASIONAL RI
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
