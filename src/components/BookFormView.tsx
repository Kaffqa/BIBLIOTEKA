import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ScanBarcode,
  AlertTriangle,
  CheckCircle2,
  X,
  RotateCcw,
  Sparkles,
  Printer,
  Info,
  Lock,
  Plus,
  Bookmark,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import {
  AuthorContributor,
  Book,
  CoverTheme,
  ToastBannerState,
} from '../types/library';
import {
  extractIsbnDigits,
  formatIsbn13,
  extractAuthorCode,
  generateCutterCode,
  validateBookForm,
} from '../utils/catalogLogic';
import {
  DDC_CATEGORIES,
  SHELF_LOCATIONS,
  DEMO_SCAN_PRESETS,
} from '../data/seedBooks';
import { BarcodeGraphic } from './BarcodeGraphic';
import { BookCoverArt } from './BookCoverArt';

interface BookFormViewProps {
  existingBooks: Book[];
  editingBook: Book | null;
  initialIsbn?: string | null;
  toastBanner: ToastBannerState | null;
  onDismissToast: () => void;
  onBackToCatalog: () => void;
  onSaveBook: (book: Book, stayOnForm: boolean) => void;
  onOpenPrintModal: (book: Book) => void;
}

export const BookFormView: React.FC<BookFormViewProps> = ({
  existingBooks,
  editingBook,
  initialIsbn,
  toastBanner,
  onDismissToast,
  onBackToCatalog,
  onSaveBook,
  onOpenPrintModal,
}) => {
  // Initialize with editing book, scanned ISBN, or realistic initial values
  const [isbn, setIsbn] = useState(
    editingBook
      ? editingBook.isbn
      : initialIsbn
      ? formatIsbn13(initialIsbn)
      : '978-602-8821-14-5'
  );
  const [isbnTouched, setIsbnTouched] = useState(Boolean(initialIsbn));

  const [title, setTitle] = useState(
    editingBook
      ? editingBook.title
      : 'Interaksi Manusia & Komputer: Prinsip & Praktik'
  );
  const [subtitle, setSubtitle] = useState(
    editingBook
      ? editingBook.subtitle || ''
      : 'Prinsip Desain Pengalaman Pengguna Berbasis Ergonomi Kognitif'
  );

  const [authors, setAuthors] = useState<AuthorContributor[]>(
    editingBook
      ? editingBook.authors
      : [
          { id: 'init-1', name: 'Dr. Budi Santoso', role: 'Penulis Utama' },
          { id: 'init-2', name: 'Rina Wijaya, M.Kom', role: 'Penulis Kedua' },
        ]
  );
  const [authorInput, setAuthorInput] = useState('');
  const [showAuthorInputBox, setShowAuthorInputBox] = useState(false);

  // Card 02 state
  const [publisher, setPublisher] = useState(
    editingBook ? editingBook.publisher : 'Pustaka Sains Bandung'
  );
  const [year, setYear] = useState<string>(
    editingBook ? String(editingBook.year) : '2026'
  );
  const [pages, setPages] = useState<string>(
    editingBook ? String(editingBook.pages) : '384'
  );
  const [dimensions, setDimensions] = useState(
    editingBook
      ? editingBook.dimensions || '17.6 x 25 cm (B5 Royal)'
      : '17.6 x 25 cm (B5 Royal)'
  );
  const [language, setLanguage] = useState<
    'Indonesia' | 'Inggris' | 'Arab' | 'Lainnya'
  >(editingBook ? editingBook.language : 'Indonesia');
  const [edition, setEdition] = useState(
    editingBook
      ? editingBook.edition || 'Edisi Lux Revisi Kedua'
      : 'Edisi Lux Revisi Kedua'
  );

  // Card 03 state
  const [ddcCategory, setDdcCategory] = useState(
    editingBook ? editingBook.ddcCategory : DDC_CATEGORIES[0]
  );
  const [ddcCode, setDdcCode] = useState(
    editingBook ? editingBook.ddcCode : '004.019'
  );
  const [shelfLocation, setShelfLocation] = useState(
    editingBook ? editingBook.shelfLocation : 'Rak B-02 (Lt. 2)'
  );
  const [totalCopies, setTotalCopies] = useState<number>(
    editingBook ? editingBook.totalCopies : 3
  );

  // Right column cover preview state
  const [coverTheme, setCoverTheme] = useState<CoverTheme>(
    editingBook ? editingBook.coverTheme : 'navy'
  );
  const [hasFetchedCover, setHasFetchedCover] = useState<boolean>(
    Boolean(editingBook)
  );
  const [customCoverUrl, setCustomCoverUrl] = useState<string | undefined>(
    editingBook?.customCoverUrl
  );
  const [scanPresetIndex, setScanPresetIndex] = useState(0);
  const [thermalFeedback, setThermalFeedback] = useState<string | null>(null);
  const [isFetchingIsbn, setIsFetchingIsbn] = useState(false);
  const [isbnLookupNotice, setIsbnLookupNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Run validation
  const validation = validateBookForm(
    {
      isbn,
      title,
      authors,
      draftAuthorInput: authorInput,
      publisher,
      year,
      pages,
      language,
      ddcCategory,
      ddcCode,
      shelfLocation,
      totalCopies,
    },
    existingBooks,
    editingBook?.id
  );

  const isbnValidation = validation.isbnValidation;
  const authorThreeCode = extractAuthorCode(authors, authorInput);
  const cutterCode = generateCutterCode(authors, title, authorInput);

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsbnTouched(true);
    const formatted = formatIsbn13(e.target.value);
    setIsbn(formatted);
  };

  const handleQuickScanDemo = () => {
    const preset = DEMO_SCAN_PRESETS[scanPresetIndex % DEMO_SCAN_PRESETS.length];
    setScanPresetIndex((i) => i + 1);
    setIsbn(preset.isbn);
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setAuthors(preset.authors);
    setPublisher(preset.publisher);
    setYear(String(preset.year));
    setPages(String(preset.pages));
    setLanguage(preset.language);
    setDdcCategory(preset.ddcCategory);
    setDdcCode(preset.ddcCode);
    setShelfLocation(preset.shelfLocation);
    setTotalCopies(preset.totalCopies);
    setCoverTheme(preset.coverTheme);
    setHasFetchedCover(true);
    setIsbnTouched(true);
  };

  const commitAuthorChip = (rawValue: string) => {
    const cleaned = rawValue.replace(/,/g, '').trim();
    if (!cleaned) return;
    const role =
      authors.length === 0
        ? 'Penulis Utama'
        : authors.length === 1
        ? 'Penulis Kedua'
        : 'Kontributor';
    setAuthors((prev) => [
      ...prev,
      {
        id: `author-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: cleaned,
        role,
      },
    ]);
    setAuthorInput('');
  };

  const handleAuthorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitAuthorChip(authorInput);
    } else if (
      e.key === 'Backspace' &&
      authorInput === '' &&
      authors.length > 0
    ) {
      setAuthors((prev) => prev.slice(0, -1));
    }
  };

  const removeAuthor = (id: string) => {
    setAuthors((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFileUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomCoverUrl(reader.result);
        setHasFetchedCover(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAutoFetchCover = () => {
    setIsFetchingIsbn(true);
    setIsbnLookupNotice(null);

    setTimeout(() => {
      const digits = extractIsbnDigits(isbn);
      const matchedPreset = DEMO_SCAN_PRESETS.find(
        (p) => extractIsbnDigits(p.isbn) === digits
      );

      if (matchedPreset) {
        setTitle(matchedPreset.title);
        setSubtitle(matchedPreset.subtitle);
        setAuthors(matchedPreset.authors);
        setPublisher(matchedPreset.publisher);
        setYear(String(matchedPreset.year));
        setPages(String(matchedPreset.pages));
        setLanguage(matchedPreset.language);
        setDdcCategory(matchedPreset.ddcCategory);
        setDdcCode(matchedPreset.ddcCode);
        setShelfLocation(matchedPreset.shelfLocation);
        setCoverTheme(matchedPreset.coverTheme);
        setCustomCoverUrl(undefined);
        setHasFetchedCover(true);
        setIsbnLookupNotice(
          `Metadata & sampul "${matchedPreset.title}" berhasil disinkronkan via OpenLibrary.`
        );
      } else {
        const themes: CoverTheme[] = [
          'navy',
          'terracotta',
          'forest',
          'espresso',
        ];
        const nextTheme =
          themes[(digits.charCodeAt(digits.length - 1) || 0) % themes.length];
        if (!title.trim()) {
          setTitle('Ensiklopedia Arsitektur & Konservasi Naskah Nusantara');
          setSubtitle('Kajian Tipologi Material Pustaka Abad ke-20');
          setPublisher('Balai Pustaka Akademik');
          setYear('2025');
          setPages('412');
        }
        setCustomCoverUrl(undefined);
        setCoverTheme(nextTheme);
        setHasFetchedCover(true);
        setIsbnLookupNotice(
          digits.length === 13
            ? `ISBN kustom (${formatIsbn13(digits)}) — metadata standar & sampul berhasil dibuat.`
            : 'ISBN kustom belum 13 digit — pratinjau sampul arsip telah diterapkan.'
        );
      }
      setIsFetchingIsbn(false);
    }, 400);
  };

  const handleResetForm = () => {
    setIsbn('');
    setIsbnTouched(false);
    setTitle('');
    setSubtitle('');
    setAuthors([]);
    setAuthorInput('');
    setPublisher('Pustaka Sains Bandung');
    setYear('2026');
    setPages('320');
    setLanguage('Indonesia');
    setDdcCategory(DDC_CATEGORIES[0]);
    setDdcCode('005.133');
    setShelfLocation(SHELF_LOCATIONS[0]);
    setTotalCopies(1);
    setHasFetchedCover(false);
    setCustomCoverUrl(undefined);
    setIsbnLookupNotice(null);
  };

  const buildBookObject = (): Book => {
    const finalAuthors: AuthorContributor[] =
      authors.length > 0
        ? authors
        : [
            {
              id: `author-${Date.now()}`,
              name: authorInput.trim() || 'Anonim',
              role: 'Penulis Utama',
            },
          ];

    return {
      id: editingBook ? editingBook.id : `book-${Date.now()}`,
      isbn: formatIsbn13(isbn),
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      authors: finalAuthors,
      publisher: publisher.trim() || 'Pustaka Sains Bandung',
      year: Number(year) || 2026,
      pages: Number(pages) || 300,
      dimensions: dimensions.trim(),
      language,
      edition: edition.trim(),
      ddcCategory,
      ddcCode: ddcCode.trim(),
      cutterCode,
      shelfLocation,
      totalCopies,
      availableCopies: totalCopies,
      statusNote: `Tersedia ${totalCopies} di Rak`,
      needsDdcValidation: false,
      coverTheme,
      customCoverUrl,
      addedThisWeek: true,
      createdAt: new Date().toISOString(),
    };
  };

  const handleSave = (stayOnForm: boolean) => {
    setIsbnTouched(true);
    if (!validation.isValid) return;

    const newBook = buildBookObject();
    onSaveBook(newBook, stayOnForm);

    if (stayOnForm) {
      // Reset ISBN & Title for rapid batch entry while showing the toast banner
      const randomTail = String(Math.floor(100 + Math.random() * 899));
      setIsbn(formatIsbn13(`9786028821${randomTail}`));
      setIsbnTouched(false);
      setTitle('');
      setSubtitle('');
      setAuthorInput('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previewBook: Book = {
    id: 'preview',
    isbn: isbn || '978-602-00-0000-0',
    title: title || 'Judul Buku Baru',
    authors:
      authors.length > 0
        ? authors
        : [
            {
              id: 'p1',
              name: authorInput || 'Nama Penulis',
              role: 'Penulis Utama',
            },
          ],
    publisher: publisher || 'Penerbit',
    year: Number(year) || 2026,
    pages: Number(pages) || 300,
    language,
    ddcCategory,
    ddcCode: ddcCode || '005.133',
    cutterCode,
    shelfLocation,
    totalCopies,
    availableCopies: totalCopies,
    coverTheme,
    customCoverUrl,
    createdAt: '',
  };

  const showIsbnError =
    !isbnValidation.isValid && (isbnTouched || isbn.length > 0);

  return (
    <div className="min-h-screen bg-[#F2ECE1] pb-28 text-[#2C1E16]">
      {/* TOP BAR (Reference Images 3 & 4) */}
      <header className="sticky top-0 z-30 border-b border-[#DFD5C5] bg-[#FAF7F2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
          <div className="flex items-center gap-7">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="flex items-center gap-2.5 text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded border border-[#2C1E16] bg-[#FAF7F2] font-serif-editorial text-lg font-bold text-[#2C1E16]">
                §
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif-editorial text-lg font-bold tracking-tight text-[#2C1E16]">
                    Bibliotheca
                  </span>
                  <span className="font-serif-editorial text-sm italic text-[#6E5D4F]">
                    arsip
                  </span>
                </div>
                <div className="font-mono-code text-[8px] tracking-widest uppercase text-[#6E5D4F]">
                  EST. MCMXXIV • SIRKULASI &amp; PRESERVASI
                </div>
              </div>
            </button>

            <nav className="hidden items-center gap-6 border-l border-[#DFD5C5] pl-6 font-mono-code text-xs md:flex">
              <button
                type="button"
                onClick={onBackToCatalog}
                className="py-1 text-[#6E5D4F] transition-colors hover:text-[#2C1E16]"
              >
                Katalog Koleksi
              </button>
              <span className="border-b-2 border-[#B85042] py-1 font-semibold text-[#2C1E16]">
                Tambah Buku Baru
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-[#DFD5C5] bg-[#FAF7F2] px-3 py-1 font-mono-code text-[10px] text-[#2C1E16] sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#4D7C5B]" />
              <span>Ruang Baca Terbuka</span>
            </div>

            <button
              type="button"
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-2 rounded-md border border-[#2C1E16] bg-white px-3.5 py-1.5 font-mono-code text-xs font-medium text-[#2C1E16] transition-colors hover:bg-[#2C1E16] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Katalog</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
        {/* SAGE-OLIVE SUCCESS TOAST BANNER (Reference Image 4) */}
        {toastBanner && toastBanner.visible && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between rounded-lg border border-[#4D7C5B] bg-[#EFF5F0] px-4 py-3 text-xs text-[#2C1E16] shadow-xs"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4D7C5B]" />
              <span className="rounded border border-[#4D7C5B]/40 bg-white px-2 py-0.5 font-mono-code text-[10px] font-bold text-[#4D7C5B]">
                TERSINKRONISASI // SUKSES
              </span>
              <span>
                Tersimpan • Koleksi{' '}
                <strong>&ldquo;{toastBanner.title}&rdquo;</strong> (ISBN{' '}
                <span className="font-mono-code">{toastBanner.isbn}</span>){' '}
                berhasil ditambahkan ke <strong>{toastBanner.shelfLocation}</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={onDismissToast}
              aria-label="Tutup banner sukses"
              className="ml-3 rounded p-1 text-[#6E5D4F] hover:bg-[#DFD5C5]/40 hover:text-[#2C1E16]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* PAGE HEADER & 4-STEP DIALOGUE STRUCTURE */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#DFD5C5] pb-6 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono-code text-[10px] uppercase tracking-wider">
              <span className="rounded bg-[#FDF4F3] px-2.5 py-0.5 font-semibold text-[#B85042] border border-[#B85042]/30">
                BORANG INDUK KATALOGISASI • MARC21 &amp; ISO 2709 COMPLIANT
              </span>
              <span className="text-[#6E5D4F]">• REVISI VERSI 4.2</span>
            </div>
            <h1 className="mt-2 font-serif-editorial text-3xl sm:text-4xl font-bold text-[#2C1E16]">
              {editingBook
                ? 'Sunting Rekaman Koleksi Buku'
                : 'Pencatatan Koleksi Buku Baru'}
            </h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#6E5D4F]">
              Sistem pengarsipan formal repositori perpustakaan pusat. Entri
              metadata akan melalui validasi otomatis standar MARC21,
              klasifikasi Cutter-Sanborn, serta pencetakan label inventaris
              thermal.
            </p>
          </div>

          {/* 4-Step Flow Pill Box */}
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#DFD5C5] bg-[#FAF7F2] px-4 py-2.5 font-mono-code text-[10.5px]">
            <span className="font-bold text-[#B85042]">1. ISBN Lookup</span>
            <span className="text-[#6E5D4F]">→</span>
            <span className="font-semibold text-[#2C1E16]">
              2. Verifikasi Bibliografi
            </span>
            <span className="text-[#6E5D4F]">→</span>
            <span className="text-[#6E5D4F]">3. DDC &amp; Rak</span>
            <span className="text-[#6E5D4F]">→</span>
            <span className="text-[#6E5D4F]">4. Label Indeks</span>
          </div>
        </div>

        {/* 65% LEFT / 35% RIGHT ASYMMETRIC LAYOUT */}
        <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-12">
          {/* LEFT COLUMN (65% -> 8 of 12 cols on lg) */}
          <div className="space-y-6 lg:col-span-8">
            {/* CARD 01 — IDENTITAS UTAMA BUKU */}
            <section className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 tactile-card">
              <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-3.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-code text-xs font-bold text-[#B85042]">
                    01 //
                  </span>
                  <h2 className="font-serif-editorial text-xl font-semibold text-[#2C1E16]">
                    Identitas Utama Buku
                  </h2>
                </div>
                <span className="rounded-full border border-[#B85042]/30 bg-[#FDF4F3] px-3 py-0.5 font-mono-code text-[10px] font-semibold text-[#B85042]">
                  Wajib Diisi
                </span>
              </div>

              <div className="mt-5 space-y-5">
                {/* Kode ISBN-13 */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="isbn-input"
                      className="font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#2C1E16]"
                    >
                      KODE ISBN-13 :
                    </label>
                    {showIsbnError ? (
                      <span className="inline-flex items-center gap-1 rounded border border-[#B85042]/40 bg-[#FDF4F3] px-2 py-0.5 font-mono-code text-[9.5px] font-semibold text-[#B85042]">
                        <span>
                          ⓘ MARC21 INVALID ({isbnValidation.digitCount}/13 DIGIT)
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono-code text-[10px] font-semibold text-[#4D7C5B]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>MARC21 Valid</span>
                      </span>
                    )}
                  </div>

                  <div className="relative mt-1.5">
                    <input
                      id="isbn-input"
                      type="text"
                      value={isbn}
                      onChange={handleIsbnChange}
                      onBlur={() => setIsbnTouched(true)}
                      placeholder="978-602-XXXX-XX-X"
                      aria-invalid={showIsbnError}
                      aria-describedby="isbn-helper-text"
                      className={`w-full rounded-[8px] border px-3.5 py-2.5 pr-28 font-mono-code text-sm transition-colors outline-none ${
                        showIsbnError
                          ? 'border-[#B85042] bg-[#FDF4F3] text-[#B85042]'
                          : 'border-[#DFD5C5] bg-white text-[#2C1E16] focus:border-[#B85042]'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-1.5 flex items-center gap-1.5">
                      {showIsbnError && (
                        <AlertTriangle className="h-4 w-4 text-[#B85042]" />
                      )}
                      <button
                        type="button"
                        onClick={handleQuickScanDemo}
                        className="inline-flex items-center gap-1.5 rounded border border-[#DFD5C5] bg-[#FAF7F2] px-2.5 py-1 font-mono-code text-[10.5px] font-semibold text-[#2C1E16] transition-colors hover:bg-[#F2ECE1]"
                      >
                        <ScanBarcode className="h-3.5 w-3.5 text-[#2C1E16]" />
                        <span>Pindai</span>
                      </button>
                    </div>
                  </div>

                  {showIsbnError ? (
                    <p
                      id="isbn-helper-text"
                      role="alert"
                      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#B85042]"
                    >
                      <span>ⓘ {isbnValidation.errorMessage}</span>
                    </p>
                  ) : (
                    <p
                      id="isbn-helper-text"
                      className="mt-1 text-[11px] text-[#6E5D4F]"
                    >
                      Masukkan 13 digit ISBN tanpa tanda minus untuk auto-fill
                      data katalog Perpusnas.
                    </p>
                  )}
                </div>

                {/* Judul Lengkap Buku */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="book-title-input"
                      className="font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#2C1E16]"
                    >
                      JUDUL LENGKAP BUKU :
                    </label>
                    {validation.titleValid && (
                      <span className="rounded border border-[#C6DBC9] bg-[#EFF5F0] px-2 py-0.5 font-mono-code text-[9.5px] font-semibold text-[#4D7C5B]">
                        ✓ Terverifikasi
                      </span>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      id="book-title-input"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masukkan judul lengkap buku..."
                      className="w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 pr-10 text-sm font-medium text-[#2C1E16] outline-none focus:border-[#B85042]"
                    />
                    {validation.titleValid && (
                      <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D7C5B]" />
                    )}
                  </div>
                  {!validation.titleValid && (
                    <p className="mt-1 text-xs text-[#B85042]">
                      {validation.errors.title}
                    </p>
                  )}
                </div>

                {/* Subjudul / Judul Asli (Opsional) */}
                <div>
                  <label
                    htmlFor="book-subtitle-input"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    SUBJUDUL / JUDUL ASLI (OPSIONAL) :
                  </label>
                  <input
                    id="book-subtitle-input"
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Contoh: Pendekatan Komprehensif Berorientasi Desain Rekursif..."
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2 text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                  />
                </div>

                {/* Nama Penulis & Kontributor (Multi-Tag Chip Input) */}
                <div>
                  <label
                    htmlFor="author-chip-input"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#2C1E16]"
                  >
                    NAMA PENULIS &amp; KONTRIBUTOR :
                  </label>
                  <div className="mt-1.5 rounded-[8px] border border-[#DFD5C5] bg-white p-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {authors.map((author) => (
                        <span
                          key={author.id}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#DFD5C5] bg-[#FAF7F2] px-2.5 py-1 text-xs font-medium text-[#2C1E16]"
                        >
                          <span className="text-[#B85042]">•</span>
                          <span>{author.name}</span>
                          <span className="font-mono-code text-[10px] text-[#6E5D4F]">
                            [{author.role}]
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAuthor(author.id)}
                            aria-label={`Hapus penulis ${author.name}`}
                            className="ml-1 text-[#6E5D4F] hover:text-[#B85042]"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <input
                        id="author-chip-input"
                        type="text"
                        value={authorInput}
                        onChange={(e) => setAuthorInput(e.target.value)}
                        onKeyDown={handleAuthorKeyDown}
                        onBlur={() => {
                          if (authorInput.trim()) commitAuthorChip(authorInput);
                        }}
                        placeholder={
                          authors.length === 0
                            ? 'Ketik nama penulis lalu tekan Enter atau koma (,)...'
                            : 'Tambah penulis (tekan Enter)...'
                        }
                        className="min-w-[190px] flex-1 bg-transparent px-2 py-1 text-xs text-[#2C1E16] outline-none placeholder:text-[#6E5D4F]/70"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (authorInput.trim()) {
                            commitAuthorChip(authorInput);
                          } else {
                            setShowAuthorInputBox(true);
                            document.getElementById('author-chip-input')?.focus();
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-dashed border-[#B85042]/60 bg-[#FDF4F3]/60 px-2.5 py-1 font-mono-code text-[10.5px] font-semibold text-[#B85042] hover:bg-[#FDF4F3]"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Tambah Kontributor</span>
                      </button>
                    </div>
                  </div>
                  {showAuthorInputBox && (
                    <p className="mt-1 font-mono-code text-[10px] text-[#6E5D4F]">
                      Ketik nama lengkap beserta gelar lalu tekan tombol{' '}
                      <strong>Enter</strong> atau tanda koma <strong>(,)</strong>.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* CARD 02 — DETAIL PENERBITAN & FISIK */}
            <section className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 tactile-card">
              <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-3.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-code text-xs font-bold text-[#B85042]">
                    02 //
                  </span>
                  <h2 className="font-serif-editorial text-xl font-semibold text-[#2C1E16]">
                    Detail Penerbitan &amp; Fisik
                  </h2>
                </div>
                <span className="font-mono-code text-[10px] tracking-wider uppercase text-[#6E5D4F]">
                  MARC TAG 260 &amp; 300
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Penerbit */}
                <div>
                  <label
                    htmlFor="publisher-input"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    PENERBIT :
                  </label>
                  <input
                    id="publisher-input"
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 text-xs font-medium text-[#2C1E16] outline-none focus:border-[#B85042]"
                  />
                </div>

                {/* Tahun Terbit */}
                <div>
                  <label
                    htmlFor="year-input"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    TAHUN TERBIT (1900–2026) :
                  </label>
                  <input
                    id="year-input"
                    type="number"
                    min={1900}
                    max={2026}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={`mt-1.5 w-full rounded-[8px] border px-3.5 py-2.5 font-mono-code text-xs font-medium outline-none ${
                      !validation.yearValid
                        ? 'border-[#B85042] bg-[#FDF4F3] text-[#B85042]'
                        : 'border-[#DFD5C5] bg-white text-[#2C1E16] focus:border-[#B85042]'
                    }`}
                  />
                  {!validation.yearValid && (
                    <p className="mt-1 text-[11px] text-[#B85042]">
                      {validation.errors.year}
                    </p>
                  )}
                </div>

                {/* Jumlah Halaman */}
                <div>
                  <label
                    htmlFor="pages-input"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    JUMLAH HALAMAN (KOLOFON) :
                  </label>
                  <input
                    id="pages-input"
                    type="number"
                    min={1}
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className={`mt-1.5 w-full rounded-[8px] border px-3.5 py-2.5 font-mono-code text-xs font-medium outline-none ${
                      !validation.pagesValid
                        ? 'border-[#B85042] bg-[#FDF4F3] text-[#B85042]'
                        : 'border-[#DFD5C5] bg-white text-[#2C1E16] focus:border-[#B85042]'
                    }`}
                  />
                </div>

                {/* Dimensi Buku */}
                <div>
                  <label
                    htmlFor="dimensions-input"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    DIMENSI BUKU (TINGGI X LEBAR) :
                  </label>
                  <input
                    id="dimensions-input"
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 font-mono-code text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                  />
                </div>

                {/* Bahasa Teks */}
                <div>
                  <label
                    htmlFor="language-select"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    BAHASA TEKS :
                  </label>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) =>
                      setLanguage(
                        e.target.value as
                          | 'Indonesia'
                          | 'Inggris'
                          | 'Arab'
                          | 'Lainnya'
                      )
                    }
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 text-xs font-medium text-[#2C1E16] outline-none focus:border-[#B85042]"
                  >
                    <option value="Indonesia">Bahasa Indonesia</option>
                    <option value="Inggris">Bahasa Inggris</option>
                    <option value="Arab">Bahasa Arab</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Edisi / Cetakan */}
                <div>
                  <label
                    htmlFor="edition-input"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    EDISI / CETAKAN :
                  </label>
                  <input
                    id="edition-input"
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                  />
                </div>
              </div>
            </section>

            {/* CARD 03 — KLASIFIKASI DDC & ALOKASI RAK */}
            <section className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 tactile-card">
              <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-3.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-code text-xs font-bold text-[#B85042]">
                    03 //
                  </span>
                  <h2 className="font-serif-editorial text-xl font-semibold text-[#2C1E16]">
                    Klasifikasi DDC &amp; Alokasi Rak
                  </h2>
                </div>
                <span className="font-mono-code text-[10px] tracking-wider uppercase text-[#6E5D4F]">
                  STANDAR MELVIL DEWEY DEC. 23
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Kategori / Subjek DDC */}
                <div>
                  <label
                    htmlFor="ddc-category-select"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    KATEGORI / SUBJEK KLASIK :
                  </label>
                  <select
                    id="ddc-category-select"
                    value={ddcCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDdcCategory(val);
                      const prefix = val.slice(0, 3);
                      if (prefix === '000') setDdcCode('005.133');
                      if (prefix === '200') setDdcCode('297.122');
                      if (prefix === '300') setDdcCode('330.122');
                      if (prefix === '600') setDdcCode('620.105');
                      if (prefix === '700') setDdcCode('720.959');
                      if (prefix === '800') setDdcCode('899.221');
                    }}
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 text-xs font-medium text-[#2C1E16] outline-none focus:border-[#B85042]"
                  >
                    {DDC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nomor Panggil DDC */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="ddc-code-input"
                      className="font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                    >
                      NOMOR PANGGIL DDC :
                    </label>
                    <span className="font-mono-code text-[9.5px] font-semibold text-[#2C1E16]">
                      Cutter-Sanborn Auto
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2 font-mono-code text-xs">
                    <input
                      id="ddc-code-input"
                      type="text"
                      value={ddcCode}
                      onChange={(e) => setDdcCode(e.target.value)}
                      className="w-24 font-bold text-[#2C1E16] outline-none"
                    />
                    <span className="text-[#6E5D4F]">
                      / {authorThreeCode} / {year || '2026'}
                    </span>
                  </div>
                </div>

                {/* Lokasi Rak */}
                <div>
                  <label
                    htmlFor="shelf-location-select"
                    className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    LOKASI RAK / RUANG PENYIMPANAN :
                  </label>
                  <select
                    id="shelf-location-select"
                    value={shelfLocation}
                    onChange={(e) => setShelfLocation(e.target.value)}
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 text-xs font-medium text-[#2C1E16] outline-none focus:border-[#B85042]"
                  >
                    {SHELF_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jumlah Eksemplar Fisik Stepper */}
                <div>
                  <label className="block font-mono-code text-[10.5px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                    JUMLAH EKSEMPLAR FISIK :
                  </label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-[8px] border border-[#DFD5C5] bg-white p-1">
                      <button
                        type="button"
                        aria-label="Kurangi jumlah eksemplar"
                        onClick={() =>
                          setTotalCopies((c) => Math.max(1, c - 1))
                        }
                        className="flex h-7 w-7 items-center justify-center rounded border border-[#DFD5C5] bg-[#FAF7F2] font-mono-code text-sm font-bold text-[#2C1E16] hover:bg-[#F2ECE1]"
                      >
                        -
                      </button>
                      <span className="px-3.5 font-mono-code text-xs font-bold text-[#2C1E16]">
                        {totalCopies} Eksemplar
                      </span>
                      <button
                        type="button"
                        aria-label="Tambah jumlah eksemplar"
                        onClick={() => setTotalCopies((c) => c + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-[#DFD5C5] bg-[#FAF7F2] font-mono-code text-sm font-bold text-[#2C1E16] hover:bg-[#F2ECE1]"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-mono-code text-[10px] leading-tight text-[#6E5D4F]">
                      Barcode otomatis: <strong>EK.01</strong> -{' '}
                      <strong>EK.{String(totalCopies).padStart(2, '0')}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (35% -> 4 of 12 cols on lg) */}
          <div className="space-y-6 lg:col-span-4">
            {/* CARD A — REPOSITORI SAMPUL FISIK */}
            <section className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-5 tactile-card">
              <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-code text-xs font-bold text-[#B85042]">
                    A //
                  </span>
                  <h2 className="font-serif-editorial text-lg font-semibold text-[#2C1E16]">
                    Repositori Sampul Fisik
                  </h2>
                </div>
                <span className="font-mono-code text-[9.5px] uppercase text-[#6E5D4F]">
                  2:3 FORMAT
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                className="hidden"
              />

              {/* Drag and drop 2:3 container */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files?.[0]);
                }}
                className="mt-4 flex flex-col items-center justify-center rounded-t-[80px] rounded-b-xl border border-dashed border-[#B8A996] bg-[#F2ECE1]/60 p-6 text-center"
              >
                {hasFetchedCover ? (
                  <div className="w-40">
                    <BookCoverArt book={previewBook} size="md" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 w-full rounded border border-[#DFD5C5] bg-white px-3 py-1.5 font-mono-code text-[10px] font-semibold text-[#2C1E16] hover:bg-[#FAF7F2]"
                    >
                      Ganti Berkas Sampul
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex h-20 w-16 flex-col items-center justify-center rounded border border-[#DFD5C5] bg-white shadow-2xs">
                      <ImageIcon className="h-6 w-6 text-[#6E5D4F]" />
                      <span className="mt-1 font-mono-code text-[8px] text-[#6E5D4F]">
                        2:3 RATIO
                      </span>
                    </div>
                    <div className="mt-3 text-xs font-semibold text-[#2C1E16]">
                      Unggah Sampul Buku
                    </div>
                    <p className="mt-0.5 text-[10.5px] text-[#6E5D4F]">
                      Format PNG, JPG atau TIFF (maks. 5MB)
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 rounded-md border border-[#DFD5C5] bg-white px-3.5 py-1.5 font-mono-code text-[10.5px] font-semibold text-[#2C1E16] shadow-2xs hover:bg-[#FAF7F2]"
                    >
                      Pilih Berkas Lokal
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                disabled={isFetchingIsbn}
                onClick={handleAutoFetchCover}
                className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#2C1E16] bg-white px-4 py-2.5 font-mono-code text-[11px] font-semibold text-[#2C1E16] transition-colors hover:bg-[#2C1E16] hover:text-white disabled:opacity-60"
              >
                {isFetchingIsbn ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#B85042]" />
                    <span>Menyinkronkan via OpenLibrary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-[#B85042]" />
                    <span>Ambil Otomatis via ISBN (OpenLibrary)</span>
                  </>
                )}
              </button>

              {isbnLookupNotice && (
                <div
                  role="status"
                  className="mt-2.5 rounded-lg border border-[#4D7C5B] bg-[#EFF5F0] px-3 py-2 font-mono-code text-[10px] text-[#2C1E16]"
                >
                  ✓ {isbnLookupNotice}
                </div>
              )}
            </section>

            {/* CARD B — PRATINJAU TIKET PUNGGUNG DDC (LIVE REAL-TIME PREVIEW) */}
            <section className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-5 tactile-card">
              <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-code text-xs font-bold text-[#B85042]">
                    B //
                  </span>
                  <h2 className="font-serif-editorial text-lg font-semibold text-[#2C1E16]">
                    Pratinjau Tiket Punggung (1:1)
                  </h2>
                </div>
                <span className="rounded bg-[#FDF4F3] px-2 py-0.5 font-mono-code text-[9px] font-semibold text-[#B85042]">
                  THERMAL 203 DPI
                </span>
              </div>

              {/* Live Sticker Card */}
              <div className="mt-4 rounded-lg border-2 border-[#2C1E16] bg-white p-4 text-center shadow-xs">
                <div className="border-b border-[#DFD5C5] pb-2 font-mono-code text-[9px] tracking-widest uppercase">
                  <div className="font-bold text-[#2C1E16]">
                    BIBLIOTHECA ARSIP PUSAT
                  </div>
                  <div className="text-[8px] text-[#6E5D4F]">
                    SIP PERPUSNAS • GRAHA PUSTAKA
                  </div>
                </div>

                {/* Call number box */}
                <div className="my-3 rounded border border-[#DFD5C5] bg-[#F2ECE1]/70 px-3 py-2.5 font-mono-code">
                  <div className="text-lg font-bold tracking-wider text-[#2C1E16]">
                    {ddcCode || '000.000'}
                  </div>
                  <div className="text-xs font-bold tracking-widest text-[#2C1E16]">
                    {authorThreeCode} / {year || '2026'}
                  </div>
                  <div className="mt-1 text-[9.5px] font-semibold text-[#B85042]">
                    EKSEMPLAR : 01 / {String(totalCopies).padStart(2, '0')}
                  </div>
                </div>

                {/* Barcode SVG */}
                <div className="flex flex-col items-center pt-1">
                  <BarcodeGraphic value={isbn} height={34} />
                  <div className="mt-1 font-mono-code text-[9.5px] tracking-wider text-[#2C1E16]">
                    {extractIsbnDigits(isbn).padEnd(13, '0')}-01
                  </div>
                </div>

                <div className="mt-2.5 border-t border-dashed border-[#DFD5C5] pt-2 font-mono-code text-[8.5px] tracking-wider uppercase text-[#B85042]">
                  {isbnValidation.isValid
                    ? `TERVERIFIKASI • ${shelfLocation.toUpperCase()}`
                    : 'KOLEKSI BARU • STATUS: MENUNGGU VALIDASI ISBN'}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between font-mono-code text-[10.5px]">
                <span className="text-[#6E5D4F]">Dimensi Fisik Label :</span>
                <span className="font-semibold text-[#2C1E16]">
                  30 mm × 50 mm (Polyart)
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setThermalFeedback('Pratinjau label termal siap dicetak.');
                  onOpenPrintModal(previewBook);
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#DFD5C5] bg-white px-4 py-2 font-mono-code text-[11px] font-semibold text-[#2C1E16] transition-colors hover:bg-[#F2ECE1]"
              >
                <Printer className="h-3.5 w-3.5 text-[#6E5D4F]" />
                <span>Uji Cetak Label Thermal</span>
              </button>
              {thermalFeedback && (
                <div className="mt-1.5 text-center font-mono-code text-[10px] text-[#4D7C5B]">
                  {thermalFeedback}
                </div>
              )}
            </section>

            {/* Conservation Guideline Box */}
            <div className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-4">
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#B85042]" />
                <div>
                  <div className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#2C1E16]">
                    PEDOMAN KONSERVASI
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#6E5D4F]">
                    Koleksi dengan tahun terbit pra-1980 wajib diverifikasi oleh
                    Unit Restorasi Kertas sebelum ditempatkan pada rak terbuka.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STICKY BOTTOM ACTION BAR (Reference Images 3 & 4) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#DFD5C5] bg-[#FAF7F2]/95 px-4 py-3.5 backdrop-blur-xs shadow-lg sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Left: Reset Borang */}
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-mono-code text-xs font-medium text-[#6E5D4F] transition-colors hover:bg-[#F2ECE1] hover:text-[#2C1E16]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Borang</span>
          </button>

          {/* Right: Validation indicator + Batal + Simpan & Tambah Lagi + Simpan ke Katalog */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!isbnValidation.isValid && (
              <span className="hidden items-center gap-1.5 rounded-md border border-[#B85042]/30 bg-[#FDF4F3] px-3 py-1.5 font-mono-code text-[10.5px] font-semibold text-[#B85042] md:inline-flex">
                <Lock className="h-3 w-3" />
                <span>Lengkapi 13 Digit ISBN untuk Menyimpan</span>
              </span>
            )}

            <button
              type="button"
              onClick={onBackToCatalog}
              className="rounded-[8px] border border-[#DFD5C5] bg-white px-4 py-2 text-xs font-semibold text-[#2C1E16] transition-colors hover:bg-[#F2ECE1]"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={!validation.isValid}
              onClick={() => handleSave(true)}
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#2C1E16] bg-white px-4 py-2 text-xs font-semibold text-[#2C1E16] transition-colors hover:bg-[#F2ECE1] disabled:cursor-not-allowed disabled:border-[#DFD5C5] disabled:text-[#6E5D4F]/50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Simpan &amp; Tambah Lagi</span>
            </button>

            <button
              type="button"
              disabled={!validation.isValid}
              onClick={() => handleSave(false)}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#B85042] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#9E3F32] disabled:cursor-not-allowed disabled:bg-[#B85042]/45"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Simpan ke Katalog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
