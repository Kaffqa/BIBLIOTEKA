import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Bookmark,
  Printer,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { Book } from '../types/library';
import { BookCoverArt } from './BookCoverArt';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onOpenPrintModal: (book: Book) => void;
  onReserveBook?: (bookId: string) => void;
  onNavigateToShelf?: (shelfLocation: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onOpenPrintModal,
  onReserveBook,
  onNavigateToShelf,
}) => {
  const [copiedCallNumber, setCopiedCallNumber] = useState(false);
  const [reservedBookId, setReservedBookId] = useState<string | null>(null);
  const [showToc, setShowToc] = useState(false);

  if (!book) return null;

  const fullCallNumber = `${book.ddcCode} / ${book.cutterCode}`;
  const isReserved = reservedBookId === book.id;

  const handleCopyCallNumber = () => {
    navigator.clipboard?.writeText(fullCallNumber);
    setCopiedCallNumber(true);
    setTimeout(() => setCopiedCallNumber(false), 2000);
  };

  const handleReserveClick = () => {
    if (isReserved || book.availableCopies <= 0) return;
    setReservedBookId(book.id);
    if (onReserveBook) {
      onReserveBook(book.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E16]/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-detail-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 sm:p-8 shadow-2xl">
        {/* Top Breadcrumb & Close Button */}
        <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-4">
          <div className="flex items-center gap-2 font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#B85042]">
            <span>• KATALOG OPAC // REPOSITORI ILMU KOMPUTER &amp; TEKNOLOGI</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail buku"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DFD5C5] bg-white text-[#6E5D4F] transition-colors hover:text-[#2C1E16]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main 2-Column Content */}
        <div className="mt-6 grid grid-cols-1 gap-7 sm:grid-cols-12">
          {/* Left Column: Cover Art & Edition / TOC Pill */}
          <div className="sm:col-span-4 flex flex-col items-center">
            <div className="w-full max-w-[190px]">
              <BookCoverArt book={book} size="lg" />
            </div>

            <div className="mt-3 w-full rounded-lg border border-[#DFD5C5] bg-[#F2ECE1]/70 px-3 py-2 text-center font-mono-code text-[10px] text-[#6E5D4F]">
              {book.edition || 'Edisi Standar'} • Bhs. {book.language}
            </div>

            <button
              type="button"
              onClick={() => setShowToc((prev) => !prev)}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#DFD5C5] bg-white px-3 py-2 text-xs font-medium text-[#2C1E16] transition-colors hover:bg-[#F2ECE1]"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#B85042]" />
              <span>
                {showToc ? 'Sembunyikan Daftar Isi' : 'Pratinjau Daftar Isi'}
              </span>
            </button>
          </div>

          {/* Right Column: Bibliographic Metadata */}
          <div className="sm:col-span-8">
            <h2
              id="book-detail-title"
              className="font-serif-editorial text-2xl sm:text-3xl font-bold leading-tight text-[#2C1E16]"
            >
              {book.title}
            </h2>
            <p className="mt-1.5 font-serif-editorial text-sm italic text-[#6E5D4F]">
              {book.authors.map((a) => `${a.name} (${a.role})`).join(' • ')} •{' '}
              {book.publisher}
            </p>

            {/* Availability Pill */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#C6DBC9] bg-[#EFF5F0] px-3.5 py-2 text-xs text-[#2C1E16]">
              <span className="h-2 w-2 rounded-full bg-[#4D7C5B]" />
              <span className="font-semibold text-[#4D7C5B]">Tersedia</span>
              <span className="text-[#6E5D4F]">•</span>
              <span className="font-mono-code text-[11px]">
                {book.availableCopies} Eksemplar di {book.shelfLocation} (Sayap
                Sains Komputer)
              </span>
            </div>

            {/* Reservation Confirmation Banner */}
            {isReserved && (
              <div
                role="status"
                className="mt-3 flex items-center gap-2 rounded-lg border border-[#4D7C5B] bg-[#EFF5F0] px-3.5 py-2.5 text-xs font-medium text-[#2C1E16]"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4D7C5B]" />
                <span>
                  Eksemplar berhasil direservasi untuk pengambilan di Meja
                  Sirkulasi
                </span>
              </div>
            )}

            {/* DDC Call Number + ISBN Box */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DFD5C5] bg-white p-4">
              <div>
                <div className="font-mono-code text-[9px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                  NOMOR PANGGIL DDC / CUTTER
                </div>
                <div className="mt-0.5 font-mono-code text-base font-bold text-[#B85042]">
                  {fullCallNumber}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCallNumber}
                  className="mt-1.5 inline-flex items-center gap-1 rounded border border-[#DFD5C5] bg-[#FAF7F2] px-2 py-0.5 font-mono-code text-[10px] text-[#2C1E16] hover:bg-[#F2ECE1]"
                >
                  {copiedCallNumber ? (
                    <>
                      <Check className="h-3 w-3 text-[#4D7C5B]" />
                      <span className="text-[#4D7C5B]">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-[#6E5D4F]" />
                      <span>Salin No. Panggil</span>
                    </>
                  )}
                </button>
              </div>

              <div className="border-l border-[#DFD5C5] pl-4">
                <div className="font-mono-code text-[9px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                  ISBN-13 TERDAFTAR
                </div>
                <div className="mt-1 font-mono-code text-xs font-semibold text-[#2C1E16]">
                  {book.isbn}
                </div>
              </div>
            </div>

            {/* 4-Grid Metadata Specs */}
            <div className="mt-3.5 grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-[#DFD5C5] bg-white px-3 py-2">
                <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                  PENERBIT
                </div>
                <div className="mt-0.5 text-xs font-semibold text-[#2C1E16]">
                  {book.publisher}
                </div>
              </div>
              <div className="rounded-lg border border-[#DFD5C5] bg-white px-3 py-2">
                <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                  TAHUN TERBIT
                </div>
                <div className="mt-0.5 font-mono-code text-xs font-semibold text-[#2C1E16]">
                  {book.year} (Cetakan ke-3)
                </div>
              </div>
              <div className="rounded-lg border border-[#DFD5C5] bg-white px-3 py-2">
                <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                  JUMLAH HALAMAN
                </div>
                <div className="mt-0.5 font-mono-code text-xs font-semibold text-[#2C1E16]">
                  {book.pages} hlm. + xxiv (B5 Royal)
                </div>
              </div>
              <div className="rounded-lg border border-[#DFD5C5] bg-white px-3 py-2">
                <div className="font-mono-code text-[9px] uppercase text-[#6E5D4F]">
                  KLASIFIKASI DDC
                </div>
                <div className="mt-0.5 text-xs font-semibold text-[#2C1E16] truncate">
                  {book.ddcCategory.split(' - ')[1] || book.ddcCategory}
                </div>
              </div>
            </div>

            {/* Optional TOC Preview */}
            {showToc && (
              <div className="mt-3.5 rounded-xl border border-[#DFD5C5] bg-[#F2ECE1]/70 p-3.5">
                <div className="font-mono-code text-[9px] font-semibold uppercase tracking-wider text-[#B85042]">
                  PRATINJAU DAFTAR ISI (KOLOFON):
                </div>
                <ul className="mt-1.5 space-y-1 font-mono-code text-[11px] text-[#2C1E16]">
                  {(
                    book.tocPreview || [
                      'Bab I — Pengantar Metodologi & Konseptualisasi',
                      'Bab II — Struktur Formal & Analisis Rekaman',
                      'Bab III — Studi Kasus & Implementasi Lapangan',
                    ]
                  ).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curatorial Abstract */}
            <div className="mt-3.5">
              <div className="font-mono-code text-[9px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                ABSTRAK KURATORIAL :
              </div>
              <div className="mt-1 rounded-xl border border-[#DFD5C5] bg-white p-3.5 font-serif-editorial text-xs italic leading-relaxed text-[#2C1E16]">
                &ldquo;
                {book.abstract ||
                  'Kajian komprehensif yang disusun sebagai rujukan utama koleksi akademik perpustakaan pusat, dilengkapi indeks silang dan bibliografi beranotasi.'}
                &rdquo;
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={isReserved || book.availableCopies <= 0}
                onClick={handleReserveClick}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  isReserved
                    ? 'border-[#4D7C5B] bg-[#EFF5F0] text-[#4D7C5B]'
                    : 'border-[#DFD5C5] bg-white text-[#2C1E16] hover:bg-[#F2ECE1] disabled:opacity-50'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>
                  {isReserved
                    ? 'Ditandai untuk Dipinjam ✓'
                    : book.availableCopies <= 0
                    ? 'Stok Sedang Dipinjam'
                    : 'Tandai untuk Dipinjam'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrintModal(book);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DFD5C5] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C1E16] transition-colors hover:bg-[#F2ECE1]"
              >
                <Printer className="h-3.5 w-3.5 text-[#6E5D4F]" />
                <span>Cetak Tiket</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigateToShelf) {
                    onNavigateToShelf(book.shelfLocation);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#B85042] px-4 py-2 font-mono-code text-xs font-semibold text-white transition-colors hover:bg-[#9E3F32]"
              >
                <span>ARAHKAN KE RAK</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
