import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Book } from '../types/library';
import { extractAuthorCode, extractIsbnDigits } from '../utils/catalogLogic';
import { BarcodeGraphic } from './BarcodeGraphic';

interface SpineLabelModalProps {
  book: Book | null;
  queuedBooks?: Book[];
  onClose: () => void;
}

export const SpineLabelModal: React.FC<SpineLabelModalProps> = ({
  book,
  queuedBooks,
  onClose,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [paperFormat, setPaperFormat] = useState<'thermal' | 'a4'>('thermal');
  const [activeSlot, setActiveSlot] = useState<number>(1);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  if (!book) return null;

  const activeBook =
    queuedBooks && queuedBooks.length > 0
      ? queuedBooks.find((b) => b.id === selectedBookId) || book
      : book;

  const authorCode = extractAuthorCode(activeBook.authors);
  const cleanIsbnDigits = extractIsbnDigits(activeBook.isbn) || '9786020388214';
  const copySuffix = String(activeSlot).padStart(2, '0');

  const handleDownloadPdf = () => {
    setPrintStatus(
      `Berkas PDF stiker "${activeBook.title}" (Slot #${copySuffix}) berhasil disiapkan.`
    );
    setTimeout(() => setPrintStatus(null), 3500);
  };

  const handlePrintNow = () => {
    setPrintStatus(
      queuedBooks && queuedBooks.length > 1
        ? `Mengirim antrean ${queuedBooks.length} label koleksi (${
            paperFormat === 'thermal' ? 'Thermal 203 DPI' : 'A4 Sheet'
          }) ke antrean cetak...`
        : `Mengirim label ${activeBook.ddcCode} / ${authorCode} (${
            paperFormat === 'thermal' ? 'Thermal 203 DPI' : 'A4 Sheet'
          }) ke antrean cetak...`
    );
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E16]/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spine-modal-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 sm:p-8 shadow-2xl">
        {/* Top Tag & Close */}
        <div className="flex items-start justify-between border-b border-[#DFD5C5] pb-4">
          <div>
            <span className="inline-block rounded bg-[#FDF4F3] px-2.5 py-0.5 font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#B85042] border border-[#B85042]/30">
              UTILITAS PENCETAKAN FISIK // STANDAR ARSIP NASIONAL
            </span>
            <h2
              id="spine-modal-title"
              className="mt-2 font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2C1E16]"
            >
              Pratinjau Tiket Punggung Koleksi
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau cetak label"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DFD5C5] bg-white text-[#6E5D4F] transition-colors hover:text-[#2C1E16]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {printStatus && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#4D7C5B] bg-[#EFF5F0] px-3.5 py-2 text-xs text-[#4D7C5B]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{printStatus}</span>
          </div>
        )}

        {/* 2-Column Body */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left: Physical 1:1 Label Card on warm grid */}
          <div className="md:col-span-6 flex flex-col items-center justify-center rounded-xl border border-[#DFD5C5] bg-[#EDE5D6] p-6">
            <div className="w-full max-w-[235px] rounded-lg border-2 border-[#2C1E16] bg-[#FAF7F2] p-4 text-center shadow-md">
              <div className="border-b border-[#DFD5C5] pb-2 font-mono-code text-[9px] tracking-widest uppercase text-[#2C1E16]">
                <div className="font-bold">BIBLIOTHECA ARSIP PUSAT</div>
                <div className="text-[8px] text-[#6E5D4F]">
                  SIP PERPUSNAS • GRAHA PUSTAKA
                </div>
              </div>

              {/* Call number block */}
              <div className="my-3 rounded border border-[#DFD5C5] bg-[#F2ECE1] px-3 py-3 font-mono-code">
                <div className="text-xl font-bold tracking-wider text-[#2C1E16]">
                  {activeBook.ddcCode}
                </div>
                <div className="mt-0.5 text-sm font-bold tracking-widest text-[#2C1E16]">
                  {authorCode}
                </div>
                <div className="text-xs font-semibold text-[#6E5D4F]">
                  {activeBook.year}
                </div>
                <div className="mt-1.5 inline-block rounded bg-[#FAF7F2] px-2 py-0.5 text-[9px] font-semibold text-[#B85042] border border-[#DFD5C5]">
                  EKSEMPLAR : {copySuffix} /{' '}
                  {String(activeBook.totalCopies || 1).padStart(2, '0')}
                </div>
              </div>

              {/* Crisp SVG Barcode */}
              <div className="mt-2 flex flex-col items-center">
                <BarcodeGraphic
                  value={`${cleanIsbnDigits}${copySuffix}`}
                  height={36}
                />
                <div className="mt-1 font-mono-code text-[9.5px] tracking-wider text-[#2C1E16]">
                  {cleanIsbnDigits}-{copySuffix}
                </div>
              </div>

              <div className="mt-2.5 border-t border-dashed border-[#DFD5C5] pt-2 font-mono-code text-[8px] uppercase tracking-widest text-[#4D7C5B]">
                BEBAS ASAM • KERTAS ARCHIVAL 120GSM
              </div>
            </div>

            <div className="mt-3 font-mono-code text-[10px] text-[#6E5D4F]">
              Skala Pratinjau 1:1 • Dimensi 30 mm × 50 mm
            </div>
          </div>

          {/* Right: Print Controls & Queued Books Selector */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            {/* Parameter Data Koleksi + Optional Queued Book Switcher */}
            <div>
              <div className="flex items-center justify-between">
                <div className="font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                  PARAMETER DATA KOLEKSI
                </div>
                {queuedBooks && queuedBooks.length > 1 && (
                  <span className="rounded bg-[#EDE5D6] px-2 py-0.5 font-mono-code text-[9.5px] font-semibold text-[#B85042]">
                    {queuedBooks.length} Buku dalam Antrean
                  </span>
                )}
              </div>

              {queuedBooks && queuedBooks.length > 1 && (
                <select
                  aria-label="Pilih buku dalam antrean cetak"
                  value={activeBook.id}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#DFD5C5] bg-white px-3 py-1.5 text-xs font-semibold text-[#2C1E16] outline-none focus:border-[#B85042]"
                >
                  {queuedBooks.map((qb, idx) => (
                    <option key={qb.id} value={qb.id}>
                      #{idx + 1} — {qb.title} ({qb.ddcCode})
                    </option>
                  ))}
                </select>
              )}

              <div className="mt-1.5 rounded-xl border border-[#DFD5C5] bg-white p-3.5">
                <div className="font-serif-editorial text-sm font-bold text-[#2C1E16] line-clamp-1">
                  {activeBook.title}
                </div>
                <div className="mt-1 font-mono-code text-[11px] text-[#6E5D4F]">
                  No. Panggil: <strong>{activeBook.ddcCode}</strong> /{' '}
                  {authorCode} / {activeBook.year}
                </div>
                <div className="mt-0.5 font-mono-code text-[10px] text-[#6E5D4F]">
                  Lokasi: {activeBook.shelfLocation}
                </div>
              </div>
            </div>

            {/* Format Kertas Label */}
            <div>
              <div className="font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                FORMAT KERTAS LABEL
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaperFormat('thermal')}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    paperFormat === 'thermal'
                      ? 'border-[#B85042] bg-[#FDF4F3] text-[#2C1E16]'
                      : 'border-[#DFD5C5] bg-white text-[#6E5D4F] hover:text-[#2C1E16]'
                  }`}
                >
                  <div className="font-mono-code text-[11px] font-bold">
                    Thermal Roll
                  </div>
                  <div className="text-[10px] text-[#6E5D4F]">
                    30 × 50 mm (203 DPI)
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaperFormat('a4')}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    paperFormat === 'a4'
                      ? 'border-[#B85042] bg-[#FDF4F3] text-[#2C1E16]'
                      : 'border-[#DFD5C5] bg-white text-[#6E5D4F] hover:text-[#2C1E16]'
                  }`}
                >
                  <div className="font-mono-code text-[11px] font-bold">
                    Kertas A4 (24-up)
                  </div>
                  <div className="text-[10px] text-[#6E5D4F]">
                    Lembar Tom &amp; Jerry #121
                  </div>
                </button>
              </div>
            </div>

            {/* Posisi Cetak / Slot Stiker */}
            <div>
              <div className="font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                POSISI CETAK / SLOT STIKER (A4 SHEET)
              </div>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setActiveSlot(slot)}
                    className={`rounded-lg border py-2 font-mono-code text-xs font-semibold transition-colors ${
                      activeSlot === slot
                        ? 'border-[#B85042] bg-[#B85042] text-white'
                        : 'border-[#DFD5C5] bg-white text-[#2C1E16] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    #{String(slot).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#DFD5C5] bg-white px-3.5 py-2 text-xs font-semibold text-[#6E5D4F] hover:text-[#2C1E16]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DFD5C5] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C1E16] hover:bg-[#F2ECE1]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh PDF</span>
              </button>
              <button
                type="button"
                onClick={handlePrintNow}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#B85042] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9E3F32]"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak Label Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
