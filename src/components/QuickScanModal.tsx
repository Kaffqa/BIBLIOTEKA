import React, { useState } from 'react';
import {
  X,
  ScanBarcode,
  ArrowRight,
  CheckCircle2,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { Book } from '../types/library';
import { extractIsbnDigits, formatIsbn13 } from '../utils/catalogLogic';
import { DEMO_SCAN_PRESETS } from '../data/seedBooks';

interface QuickScanModalProps {
  isOpen: boolean;
  books: Book[];
  onClose: () => void;
  onEditExistingBook: (book: Book) => void;
  onCreateNewWithIsbn: (isbn: string) => void;
}

export const QuickScanModal: React.FC<QuickScanModalProps> = ({
  isOpen,
  books,
  onClose,
  onEditExistingBook,
  onCreateNewWithIsbn,
}) => {
  const [scannedInput, setScannedInput] = useState('978-602-03-8821-4');

  if (!isOpen) return null;

  const digits = extractIsbnDigits(scannedInput);
  const matchedBook =
    digits.length >= 10
      ? books.find((b) => extractIsbnDigits(b.isbn) === digits)
      : undefined;

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchedBook) {
      onClose();
      onEditExistingBook(matchedBook);
    } else {
      const formatted =
        digits.length > 0 ? formatIsbn13(digits) : '978-602-291-774-8';
      onClose();
      onCreateNewWithIsbn(formatted);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E16]/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-scan-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 sm:p-7 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-[#DFD5C5] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded border border-[#B85042]/30 bg-[#FDF4F3] px-2.5 py-0.5 font-mono-code text-[10px] font-semibold uppercase tracking-wider text-[#B85042]">
              <ScanBarcode className="h-3.5 w-3.5" />
              <span>PEMINDAI OPTIK BARCODE // PINTASAN F2</span>
            </div>
            <h2
              id="quick-scan-modal-title"
              className="mt-2 font-serif-editorial text-2xl font-bold text-[#2C1E16]"
            >
              Pindai Cepat Barcode ISBN-13
            </h2>
            <p className="mt-0.5 text-xs text-[#6E5D4F]">
              Arahkan pemindai laser atau ketik 13 digit ISBN untuk memeriksa
              status eksemplar di pangkalan data MARC21.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pemindai barcode"
            className="rounded-lg p-1.5 text-[#6E5D4F] hover:bg-[#F2ECE1] hover:text-[#2C1E16]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleProceed} className="mt-5">
          <label
            htmlFor="quick-scan-isbn-input"
            className="block font-mono-code text-[10px] font-semibold uppercase tracking-wider text-[#6E5D4F]"
          >
            NOMOR BARCODE ISBN-13 :
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id="quick-scan-isbn-input"
              type="text"
              autoFocus
              value={scannedInput}
              onChange={(e) => setScannedInput(formatIsbn13(e.target.value))}
              placeholder="978-602-XXXX-XX-X"
              className="flex-1 rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 font-mono-code text-sm font-semibold text-[#2C1E16] outline-none focus:border-[#B85042]"
            />
          </div>

          {/* Quick Simulation Pills */}
          <div className="mt-3">
            <div className="font-mono-code text-[9.5px] uppercase text-[#6E5D4F]">
              Simulasi Pemindaian Cepat :
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setScannedInput(books[0]?.isbn || '978-602-03-8821-4')}
                className="inline-flex items-center gap-1 rounded border border-[#DFD5C5] bg-white px-2.5 py-1 font-mono-code text-[10px] font-medium text-[#2C1E16] hover:bg-[#F2ECE1]"
              >
                <span>Koleksi Ada ({books[0]?.isbn || '978-602-03-8821-4'})</span>
              </button>
              <button
                type="button"
                onClick={() => setScannedInput(DEMO_SCAN_PRESETS[0].isbn)}
                className="inline-flex items-center gap-1 rounded border border-[#B85042]/40 bg-[#FDF4F3] px-2.5 py-1 font-mono-code text-[10px] font-semibold text-[#B85042] hover:bg-[#B85042] hover:text-white"
              >
                <Sparkles className="h-3 w-3" />
                <span>ISBN Baru ({DEMO_SCAN_PRESETS[0].isbn})</span>
              </button>
            </div>
          </div>

          {/* Live Lookup Status Card */}
          <div className="mt-4 rounded-xl border border-[#DFD5C5] bg-white p-4">
            {matchedBook ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4D7C5B]" />
                <div>
                  <div className="font-mono-code text-[10px] font-bold uppercase text-[#4D7C5B]">
                    TERDAFTAR DALAM KATALOG • SIAP DISUNTING
                  </div>
                  <div className="mt-0.5 font-serif-editorial text-base font-bold text-[#2C1E16]">
                    {matchedBook.title}
                  </div>
                  <div className="mt-0.5 font-mono-code text-[11px] text-[#6E5D4F]">
                    No. Panggil: {matchedBook.ddcCode} / {matchedBook.cutterCode}{' '}
                    • {matchedBook.shelfLocation}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <PlusCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B85042]" />
                <div>
                  <div className="font-mono-code text-[10px] font-bold uppercase text-[#B85042]">
                    BELUM TERDAFTAR • NASKAH BARU TERDETEKSI
                  </div>
                  <div className="mt-0.5 text-xs text-[#2C1E16]">
                    ISBN{' '}
                    <span className="font-mono-code font-bold">
                      {scannedInput || '—'}
                    </span>{' '}
                    belum ditemukan di pangkalan data. Lanjutkan ke Borang Input
                    dengan ISBN terisi otomatis.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="mt-5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] border border-[#DFD5C5] bg-white px-4 py-2 text-xs font-semibold text-[#6E5D4F] hover:text-[#2C1E16]"
            >
              Batal (Esc)
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#B85042] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#9E3F32]"
            >
              <span>
                {matchedBook
                  ? 'Buka & Sunting Rekaman'
                  : 'Buka Borang dengan ISBN Ini'}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
