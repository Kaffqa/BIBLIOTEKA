import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  ScanBarcode,
  Printer,
  Trash2,
  CheckCircle2,
  X,
  LogOut,
  BookOpen,
  LayoutList,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MoreHorizontal,
  RotateCcw,
  Copy,
  CornerDownLeft,
  BarChart3,
  Layers,
} from 'lucide-react';
import { Book, CuratorProfile, ToastBannerState } from '../types/library';
import {
  filterBooks,
  calculateKpiMetrics,
  calculateAnalyticsBreakdown,
} from '../utils/catalogLogic';
import { DDC_CATEGORIES, SHELF_LOCATIONS } from '../data/seedBooks';
import { BookCoverArt } from './BookCoverArt';

interface WorkspaceViewProps {
  books: Book[];
  curator: CuratorProfile;
  toastBanner: ToastBannerState | null;
  onDismissToast: () => void;
  onNavigateToLanding: () => void;
  onOpenAddForm: () => void;
  onOpenEditForm: (book: Book) => void;
  onOpenPrintModal: (book: Book) => void;
  onOpenPrintQueueModal: (queuedBooks: Book[]) => void;
  onOpenQuickScanModal: () => void;
  onSelectBookDetail: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onValidateDdcBook: (bookId: string) => void;
  onReturnBook: (bookId: string) => void;
  onDuplicateBook: (bookId: string) => void;
  onResetDemoData: () => void;
  onLogout: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  books,
  curator,
  toastBanner,
  onDismissToast,
  onNavigateToLanding,
  onOpenAddForm,
  onOpenEditForm,
  onOpenPrintModal,
  onOpenPrintQueueModal,
  onOpenQuickScanModal,
  onSelectBookDetail,
  onDeleteBook,
  onValidateDdcBook,
  onReturnBook,
  onDuplicateBook,
  onResetDemoData,
  onLogout,
}) => {
  const [activeNavTab, setActiveNavTab] = useState<'ringkasan' | 'koleksi'>(
    'koleksi'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [ddcFilter, setDdcFilter] = useState('ALL');
  const [shelfFilter, setShelfFilter] = useState('ALL');
  const [onlyNeedsValidation, setOnlyNeedsValidation] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [openMenuBookId, setOpenMenuBookId] = useState<string | null>(null);
  const [confirmResetDemo, setConfirmResetDemo] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<
    string | null
  >(null);

  const metrics = calculateKpiMetrics(books);
  const analytics = calculateAnalyticsBreakdown(books);

  const baseFiltered = filterBooks(books, searchQuery, ddcFilter, shelfFilter);
  const displayedBooks = onlyNeedsValidation
    ? baseFiltered.filter((b) => b.needsDdcValidation)
    : baseFiltered;

  const toggleSelectBook = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === displayedBooks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedBooks.map((b) => b.id));
    }
  };

  const handleExportMarc = () => {
    const payload = JSON.stringify(books, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biblioteka-marc21-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccessMessage(
      `Berhasil mengekspor ${books.length} rekaman bibliografi dalam standar MARC21.`
    );
    setTimeout(() => setExportSuccessMessage(null), 3500);
  };

  const handleOpenHeaderPrintQueue = () => {
    const queue =
      selectedIds.length > 0
        ? books.filter((b) => selectedIds.includes(b.id))
        : books;
    onOpenPrintQueueModal(queue);
  };

  return (
    <div className="min-h-screen bg-[#F2ECE1] flex flex-col justify-between text-[#2C1E16]">
      <div>
        {/* AUTHENTICATED HEADER (Reference Image 5) */}
        <header className="sticky top-0 z-30 border-b border-[#DFD5C5] bg-[#FAF7F2]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:flex-nowrap">
            {/* Left: Brand & Nav Tabs */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={onNavigateToLanding}
                className="flex items-center gap-2 text-left shrink-0"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded border border-[#2C1E16] bg-[#F2ECE1] font-serif-editorial text-base font-bold text-[#2C1E16]">
                  §
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif-editorial text-base font-bold tracking-tight text-[#2C1E16]">
                      BIBLIOTEKA
                    </span>
                    <span className="rounded border border-[#B85042]/40 bg-[#FDF4F3] px-1 py-0.2 font-mono-code text-[8.5px] font-semibold text-[#B85042]">
                      v.4
                    </span>
                  </div>
                  <div className="font-mono-code text-[7px] tracking-wider uppercase text-[#6E5D4F]">
                    RUANG KERJA KURATOR • MEJA KERJA V.4
                  </div>
                </div>
              </button>

              <nav
                aria-label="Navigasi Ruang Kerja Kurator"
                className="flex items-center gap-3.5 border-l border-[#DFD5C5] pl-4 text-xs font-medium"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveNavTab('ringkasan');
                    setOnlyNeedsValidation(false);
                  }}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeNavTab === 'ringkasan'
                      ? 'border-b-2 border-[#B85042] font-semibold text-[#2C1E16]'
                      : 'text-[#6E5D4F] hover:text-[#2C1E16]'
                  }`}
                >
                  Ringkasan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNavTab('koleksi');
                    setOnlyNeedsValidation(false);
                  }}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeNavTab === 'koleksi'
                      ? 'border-b-2 border-[#B85042] font-semibold text-[#2C1E16]'
                      : 'text-[#6E5D4F] hover:text-[#2C1E16]'
                  }`}
                >
                  Daftar Koleksi
                </button>
                <button
                  type="button"
                  onClick={handleOpenHeaderPrintQueue}
                  className="inline-flex items-center gap-1.5 py-1 text-[#6E5D4F] transition-colors hover:text-[#2C1E16] whitespace-nowrap"
                >
                  <span>Cetak Label</span>
                  <span className="rounded-full bg-[#EDE5D6] px-1.5 py-0.5 font-mono-code text-[8.5px] font-semibold text-[#2C1E16]">
                    {selectedIds.length > 0 ? selectedIds.length : books.length}{' '}
                    antrean
                  </span>
                </button>
              </nav>
            </div>

            {/* Right: Node Status, Curator Profile Pill, Logout & Primary CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden items-center gap-1.5 rounded-md border border-[#DFD5C5] bg-[#F2ECE1]/60 px-2.5 py-1.5 font-mono-code text-[9px] text-[#6E5D4F] xl:flex whitespace-nowrap">
                <span className="h-2 w-2 rounded-full bg-[#4D7C5B] shrink-0" />
                <span>Node Pustaka Online • Sinkronisasi MARC21 Aktif</span>
              </div>

              {/* Curator Profile Pill */}
              <div className="flex items-center gap-1.5 rounded-lg border border-[#DFD5C5] bg-white px-2.5 py-1 shrink-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2C1E16] font-serif-editorial text-xs font-bold text-[#FAF7F2]">
                  {curator.name[0]}
                </div>
                <div className="text-left leading-tight whitespace-nowrap">
                  <div className="text-[11px] font-semibold text-[#2C1E16]">
                    {curator.name} • {curator.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  aria-label="Keluar dari sesi kurator"
                  title="Keluar ke Katalog Publik"
                  className="rounded p-1 text-[#6E5D4F] transition-colors hover:bg-[#F2ECE1] hover:text-[#B85042]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Prominent Terracotta Primary CTA */}
              <button
                type="button"
                onClick={onOpenAddForm}
                className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#B85042] px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#9E3F32] whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Tambah Koleksi Buku</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
          {/* SUCCESS TOAST BANNER IF PRESENT */}
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
                  <span className="font-mono-code">{toastBanner.isbn}</span>)
                  berhasil diperbarui pada{' '}
                  <strong>{toastBanner.shelfLocation}</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={onDismissToast}
                aria-label="Tutup notifikasi sukses"
                className="ml-3 rounded p-1 text-[#6E5D4F] hover:bg-[#DFD5C5]/40 hover:text-[#2C1E16]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {exportSuccessMessage && (
            <div className="mb-5 flex items-center justify-between rounded-lg border border-[#4D7C5B] bg-[#EFF5F0] px-4 py-2.5 text-xs text-[#2C1E16]">
              <span>✓ {exportSuccessMessage}</span>
              <button
                type="button"
                onClick={() => setExportSuccessMessage(null)}
                className="font-mono-code text-[10px] underline"
              >
                Tutup
              </button>
            </div>
          )}

          {/* WORKSPACE TITLE & UTILITY ACTIONS */}
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono-code text-[10px] uppercase tracking-wider text-[#6E5D4F]">
                <span className="rounded border border-[#DFD5C5] bg-[#FAF7F2] px-2.5 py-0.5 font-semibold text-[#2C1E16]">
                  ARSIP REPOSITORI PUSAT // INVENTARISASI AKTIF
                </span>
                <span>• DDC 23RD EDITION READY</span>
              </div>
              <h1 className="mt-2 font-serif-editorial text-3xl md:text-4xl font-bold text-[#2C1E16]">
                {activeNavTab === 'ringkasan'
                  ? 'Ringkasan Analitik & Distribusi Katalog'
                  : 'Meja Kerja & Daftar Koleksi Kurator'}
              </h1>
              <p className="mt-1 max-w-2xl text-xs text-[#6E5D4F]">
                {activeNavTab === 'ringkasan'
                  ? 'Pantau proporsi subjek klasifikasi Dewey Decimal (DDC), status sirkulasi eksemplar fisik di rak terbuka, dan antrean karantina validasi.'
                  : 'Kelola metadata bibliografi naskah, alokasi nomor panggil DDC, pencetakan tiket punggung, dan pantau ketersediaan eksemplar fisik di rak buku.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportMarc}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#DFD5C5] bg-[#FAF7F2] px-3.5 py-2 text-xs font-semibold text-[#2C1E16] transition-colors hover:bg-white"
              >
                <Download className="h-3.5 w-3.5 text-[#6E5D4F]" />
                <span>Ekspor MARC21 (XML/ISO)</span>
              </button>
              <button
                type="button"
                onClick={onOpenQuickScanModal}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#DFD5C5] bg-[#FAF7F2] px-3.5 py-2 text-xs font-semibold text-[#2C1E16] transition-colors hover:bg-white"
              >
                <ScanBarcode className="h-3.5 w-3.5 text-[#B85042]" />
                <span>Pindai Cepat Barcode</span>
                <span className="rounded bg-[#EDE5D6] px-1.5 py-0.5 font-mono-code text-[9.5px] text-[#6E5D4F]">
                  F2
                </span>
              </button>
            </div>
          </div>

          {/* KPI SUMMARY STRIP (3 Tactile Cards - Reference Image 5) */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Card 1: Koleksi Terdaftar */}
            <div className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-5 tactile-card">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                  KOLEKSI TERDAFTAR
                </span>
                <span className="rounded border border-[#C6DBC9] bg-[#EFF5F0] px-2 py-0.5 font-mono-code text-[10px] font-semibold text-[#4D7C5B]">
                  ↗ +12% thn ini
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif-editorial text-4xl font-bold text-[#2C1E16] font-mono-code">
                  {metrics.totalPhysicalCopies.toLocaleString('id-ID')}
                </span>
                <span className="font-mono-code text-xs text-[#6E5D4F]">
                  eksemplar
                </span>
              </div>
              <div className="mt-3 border-t border-[#DFD5C5] pt-2.5 text-xs text-[#6E5D4F]">
                Naskah &amp; monograf terdaftar di pangkalan data terpusat.
              </div>
            </div>

            {/* Card 2: Input Minggu Ini */}
            <div className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-5 tactile-card">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                  INPUT MINGGU INI
                </span>
                <span className="rounded border border-[#DFD5C5] bg-[#F2ECE1] px-2 py-0.5 font-mono-code text-[10px] text-[#6E5D4F]">
                  Target 50 naskah
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif-editorial text-4xl font-bold text-[#B85042] font-mono-code">
                  +{metrics.weeklyAdditions}
                </span>
                <span className="font-mono-code text-xs text-[#6E5D4F]">
                  divalidasi
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#DFD5C5] pt-2.5 text-xs">
                <span className="text-[#6E5D4F]">
                  Koleksi baru telah divalidasi kurator.
                </span>
                <span className="font-mono-code text-[10px] font-semibold text-[#B85042]">
                  {Math.min(
                    100,
                    Math.round((metrics.weeklyAdditions / 50) * 100)
                  )}
                  % Tercapai
                </span>
              </div>
            </div>

            {/* Card 3: Perlu Verifikasi DDC */}
            <div className="rounded-xl border border-[#B85042]/40 bg-[#FAF7F2] p-5 tactile-card">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                  PERLU VERIFIKASI DDC
                </span>
                <span className="rounded border border-[#B85042]/30 bg-[#FDF4F3] px-2 py-0.5 font-mono-code text-[10px] font-semibold text-[#B85042]">
                  Tindakan Kuratorial
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif-editorial text-4xl font-bold text-[#2C1E16] font-mono-code">
                  {Math.max(
                    metrics.needsDdcCount,
                    onlyNeedsValidation ? metrics.needsDdcCount : 3
                  )}
                </span>
                <span className="font-mono-code text-xs text-[#6E5D4F]">
                  antrean mendesak
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#DFD5C5] pt-2.5 text-xs">
                <span className="text-[#6E5D4F]">
                  Naskah masuk menunggu penetapan Cutter-Sanborn.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNavTab('koleksi');
                    setOnlyNeedsValidation((prev) => !prev);
                  }}
                  className="font-mono-code text-[10px] font-bold text-[#B85042] hover:underline whitespace-nowrap"
                >
                  {onlyNeedsValidation ? 'Tampilkan Semua →' : 'Tinjau Antrean →'}
                </button>
              </div>
            </div>
          </div>

          {/* CONDITIONAL VIEW: RINGKASAN (ANALYTICS) VS DAFTAR KOLEKSI (TABLE) */}
          {activeNavTab === 'ringkasan' ? (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left 7 Cols: (a) Distribusi Koleksi per Kelas DDC */}
              <section className="rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 tactile-card lg:col-span-7">
                <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-4">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="h-4 w-4 text-[#B85042]" />
                    <div>
                      <h2 className="font-serif-editorial text-xl font-bold text-[#2C1E16]">
                        Distribusi Koleksi per Kelas DDC
                      </h2>
                      <p className="text-xs text-[#6E5D4F]">
                        Proporsi judul &amp; eksemplar fisik berdasarkan klasifikasi
                        utama Melvil Dewey
                      </p>
                    </div>
                  </div>
                  <span className="rounded border border-[#DFD5C5] bg-white px-2.5 py-1 font-mono-code text-[10px] font-semibold text-[#2C1E16]">
                    TOTAL {analytics.totalCopies} EKSEMPLAR AKTIF
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {analytics.ddcDistribution.map((bucket) => (
                    <div
                      key={bucket.code}
                      className="rounded-lg border border-[#DFD5C5] bg-white p-3.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-[#F2ECE1] px-2 py-0.5 font-mono-code text-[11px] font-bold text-[#B85042]">
                            {bucket.code}
                          </span>
                          <span className="font-semibold text-[#2C1E16]">
                            {bucket.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono-code text-[11px]">
                          <span className="text-[#6E5D4F]">
                            {bucket.titleCount} Judul
                          </span>
                          <span className="font-bold text-[#2C1E16]">
                            {bucket.copyCount} Eks ({bucket.percentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Tactile Progress Bar */}
                      <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F2ECE1]">
                        <div
                          className="h-full rounded-full bg-[#B85042] transition-all duration-300"
                          style={{
                            width: `${Math.max(bucket.percentage, bucket.copyCount > 0 ? 6 : 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Right 5 Cols: (b) Ringkasan Status Fisik Eksemplar */}
              <section className="flex flex-col justify-between rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] p-6 tactile-card lg:col-span-5">
                <div>
                  <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-4">
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-4 w-4 text-[#4D7C5B]" />
                      <div>
                        <h2 className="font-serif-editorial text-xl font-bold text-[#2C1E16]">
                          Ringkasan Status Fisik Eksemplar
                        </h2>
                        <p className="text-xs text-[#6E5D4F]">
                          Ketersediaan riil di rak baca vs sirkulasi peminjaman
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {/* Status 1: Tersedia di Rak */}
                    <div className="rounded-lg border border-[#C6DBC9] bg-[#EFF5F0] p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-code text-[10.5px] font-bold uppercase text-[#4D7C5B]">
                          • TERSEDIA DI RAK TERBUKA
                        </span>
                        <span className="font-mono-code text-lg font-bold text-[#2C1E16]">
                          {analytics.availableCopies} Eks
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#6E5D4F]">
                        Siap diakses pengunjung di Ruang Baca Utama &amp; Rak
                        Referensi.
                      </p>
                    </div>

                    {/* Status 2: Dipinjam / Reservasi */}
                    <div className="rounded-lg border border-[#DFD5C5] bg-white p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-code text-[10.5px] font-bold uppercase text-[#B85042]">
                          • DIPINJAM / RESERVASI SIRKULASI
                        </span>
                        <span className="font-mono-code text-lg font-bold text-[#B85042]">
                          {analytics.borrowedOrReservedCopies} Eks
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#6E5D4F]">
                        Sedang dipinjam anggota atau direservasi melalui OPAC
                        untuk pengambilan di Meja Sirkulasi.
                      </p>
                    </div>

                    {/* Status 3: Karantina Validasi DDC */}
                    <div className="rounded-lg border border-[#B85042]/40 bg-[#FDF4F3] p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-code text-[10.5px] font-bold uppercase text-[#B85042]">
                          • KARANTINA VALIDASI DDC
                        </span>
                        <span className="font-mono-code text-lg font-bold text-[#2C1E16]">
                          {analytics.quarantineCopies} Eks
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#6E5D4F]">
                        Akuisisi baru menunggu verifikasi nomor panggil
                        Cutter-Sanborn sebelum masuk rak.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#DFD5C5] pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('koleksi')}
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#2C1E16] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3E2B20]"
                  >
                    <span>Buka Tabel Daftar Koleksi →</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenHeaderPrintQueue}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2 text-xs font-semibold text-[#2C1E16] hover:bg-[#F2ECE1]"
                  >
                    <Printer className="h-3.5 w-3.5 text-[#B85042]" />
                    <span>Cetak Antrean Label</span>
                  </button>
                </div>
              </section>
            </div>
          ) : (
            /* INTERACTIVE CATALOG TABLE CONTAINER (Reference Image 5) */
            <div className="mt-6 rounded-xl border border-[#DFD5C5] bg-[#FAF7F2] tactile-card">
              {/* Search & Filters Toolbar */}
              <div className="flex flex-col justify-between gap-3 border-b border-[#DFD5C5] p-4 lg:flex-row lg:items-center">
                <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
                  {/* Live Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E5D4F]" />
                    <input
                      type="search"
                      aria-label="Cari judul, penulis, ISBN, atau DDC"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul, penulis, ISBN (978-...), atau DDC..."
                      className="w-full rounded-[8px] border border-[#DFD5C5] bg-white py-2 pl-9 pr-12 text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[#DFD5C5] bg-[#FAF7F2] px-1.5 py-0.5 font-mono-code text-[9px] text-[#6E5D4F]">
                      ⌘K
                    </span>
                  </div>

                  {/* Kategori DDC Dropdown */}
                  <select
                    aria-label="Filter Kategori DDC"
                    value={ddcFilter}
                    onChange={(e) => setDdcFilter(e.target.value)}
                    className="rounded-[8px] border border-[#DFD5C5] bg-white px-3 py-2 text-xs font-medium text-[#2C1E16] outline-none focus:border-[#B85042]"
                  >
                    <option value="ALL">Kategori DDC: Semua Kategori</option>
                    {DDC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Lokasi Rak Dropdown */}
                  <select
                    aria-label="Filter Lokasi Rak"
                    value={shelfFilter}
                    onChange={(e) => setShelfFilter(e.target.value)}
                    className="rounded-[8px] border border-[#DFD5C5] bg-white px-3 py-2 text-xs font-medium text-[#2C1E16] outline-none focus:border-[#B85042]"
                  >
                    <option value="ALL">Lokasi Rak: Semua Rak</option>
                    {SHELF_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc.split(' (')[0]}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Right count & view switcher */}
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="font-mono-code text-[11px] text-[#6E5D4F]">
                    Menampilkan <strong>1–{displayedBooks.length}</strong> dari{' '}
                    <strong>
                      {metrics.totalPhysicalCopies.toLocaleString('id-ID')}
                    </strong>{' '}
                    naskah
                  </span>
                  <div className="flex items-center rounded-md border border-[#DFD5C5] bg-white p-0.5">
                    <button
                      type="button"
                      aria-label="Tampilan Tabel"
                      onClick={() => setViewMode('table')}
                      className={`rounded p-1.5 ${
                        viewMode === 'table'
                          ? 'bg-[#2C1E16] text-white'
                          : 'text-[#6E5D4F] hover:text-[#2C1E16]'
                      }`}
                    >
                      <LayoutList className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Tampilan Grid"
                      onClick={() => setViewMode('grid')}
                      className={`rounded p-1.5 ${
                        viewMode === 'grid'
                          ? 'bg-[#2C1E16] text-white'
                          : 'text-[#6E5D4F] hover:text-[#2C1E16]'
                      }`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Table or Grid View */}
              {displayedBooks.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="font-serif-editorial text-base italic text-[#6E5D4F]">
                    Tidak ada naskah yang sesuai dengan filter pencarian saat
                    ini.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setDdcFilter('ALL');
                      setShelfFilter('ALL');
                      setOnlyNeedsValidation(false);
                    }}
                    className="mt-3 rounded-lg bg-[#B85042] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9E3F32]"
                  >
                    Reset Filter Katalog
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex flex-col justify-between rounded-xl border border-[#DFD5C5] bg-white p-4"
                    >
                      <div className="flex gap-4">
                        <div
                          onClick={() => onSelectBookDetail(book)}
                          className="w-20 shrink-0 cursor-pointer"
                        >
                          <BookCoverArt book={book} size="sm" />
                        </div>
                        <div>
                          <div className="font-mono-code text-[10px] font-bold text-[#B85042]">
                            {book.ddcCode} / {book.cutterCode}
                          </div>
                          <h3
                            onClick={() => onSelectBookDetail(book)}
                            className="mt-1 cursor-pointer font-serif-editorial text-base font-bold text-[#2C1E16] hover:text-[#B85042]"
                          >
                            {book.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-[#6E5D4F]">
                            {book.authors[0]?.name} • {book.year}
                          </p>
                          <div className="mt-2 font-mono-code text-[10px] text-[#6E5D4F]">
                            {book.isbn}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-[#DFD5C5] pt-3">
                        <span className="font-mono-code text-[10px] font-semibold text-[#4D7C5B]">
                          {book.shelfLocation} ({book.totalCopies} Eks)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenEditForm(book)}
                            className="rounded border border-[#DFD5C5] bg-[#FAF7F2] px-2.5 py-1 text-[11px] font-medium text-[#2C1E16] hover:bg-[#F2ECE1]"
                          >
                            Sunting
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenPrintModal(book)}
                            className="rounded border border-[#DFD5C5] bg-[#FAF7F2] px-2.5 py-1 text-[11px] font-medium text-[#2C1E16] hover:bg-[#F2ECE1]"
                          >
                            Cetak Label
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#DFD5C5] bg-[#F2ECE1]/60 font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]">
                        <th className="w-10 px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            aria-label="Pilih semua naskah"
                            checked={
                              displayedBooks.length > 0 &&
                              selectedIds.length === displayedBooks.length
                            }
                            onChange={toggleSelectAll}
                            className="h-3.5 w-3.5 accent-[#B85042]"
                          />
                        </th>
                        <th className="px-4 py-3">SAMPUL &amp; JUDUL BUKU</th>
                        <th className="px-4 py-3">NOMOR PANGGIL (DDC)</th>
                        <th className="px-4 py-3">ISBN-13</th>
                        <th className="px-4 py-3">LOKASI RAK</th>
                        <th className="px-4 py-3">STATUS &amp; STOK</th>
                        <th className="px-4 py-3 text-right">AKSI KURASI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DFD5C5] text-xs">
                      {displayedBooks.map((book) => {
                        const isConfirmingDelete = confirmDeleteId === book.id;
                        const isMenuOpen = openMenuBookId === book.id;
                        const activeLoansCount =
                          (book.borrowedCopies ?? 0) +
                          (book.reservedCopies ?? 0);

                        return (
                          <tr
                            key={book.id}
                            className="transition-colors hover:bg-[#F2ECE1]/40"
                          >
                            {/* Checkbox */}
                            <td className="px-4 py-4 text-center align-middle">
                              <input
                                type="checkbox"
                                aria-label={`Pilih ${book.title}`}
                                checked={selectedIds.includes(book.id)}
                                onChange={() => toggleSelectBook(book.id)}
                                className="h-3.5 w-3.5 accent-[#B85042]"
                              />
                            </td>

                            {/* Cover thumbnail + Title + Author + Edition tags */}
                            <td className="px-4 py-4 align-top">
                              <div className="flex items-start gap-3.5">
                                <div
                                  onClick={() => onSelectBookDetail(book)}
                                  className="cursor-pointer transition-transform hover:scale-105"
                                >
                                  <BookCoverArt book={book} size="xs" />
                                </div>
                                <div className="max-w-xs">
                                  <button
                                    type="button"
                                    onClick={() => onSelectBookDetail(book)}
                                    className="text-left font-serif-editorial text-base font-bold leading-snug text-[#2C1E16] hover:text-[#B85042]"
                                  >
                                    {book.title}
                                  </button>
                                  <div className="mt-0.5 text-[11px] text-[#6E5D4F]">
                                    <strong className="font-medium text-[#2C1E16]">
                                      {book.authors[0]?.name}
                                    </strong>{' '}
                                    ({book.authors[0]?.role || 'Penulis Utama'}{' '}
                                    ) • {book.publisher} ({book.year})
                                  </div>
                                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                    {book.needsDdcValidation ? (
                                      <span className="rounded border border-[#B85042]/40 bg-[#FDF4F3] px-2 py-0.5 font-mono-code text-[9.5px] font-semibold text-[#B85042]">
                                        • Menunggu Validasi DDC
                                      </span>
                                    ) : (
                                      <span className="rounded border border-[#DFD5C5] bg-[#F2ECE1] px-2 py-0.5 font-mono-code text-[9.5px] text-[#6E5D4F]">
                                        {book.edition || 'Edisi Standar'}
                                      </span>
                                    )}
                                    <span className="font-mono-code text-[9.5px] text-[#6E5D4F]">
                                      Bahasa {book.language}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Monospace DDC Call Number Box */}
                            <td className="px-4 py-4 align-middle">
                              <div
                                className={`inline-block rounded-md border px-2.5 py-1.5 font-mono-code ${
                                  book.needsDdcValidation
                                    ? 'border-[#B85042]/50 bg-[#FDF4F3] text-[#B85042]'
                                    : 'border-[#DFD5C5] bg-white text-[#2C1E16]'
                                }`}
                              >
                                <div className="text-xs font-bold">
                                  {book.ddcCode}
                                  {book.needsDdcValidation ? '?' : ''}
                                </div>
                                <div className="text-[10px] text-[#6E5D4F]">
                                  {book.cutterCode}
                                </div>
                              </div>
                            </td>

                            {/* ISBN-13 */}
                            <td className="px-4 py-4 align-middle">
                              <span className="inline-block rounded border border-[#DFD5C5] bg-[#F2ECE1]/70 px-2.5 py-1 font-mono-code text-[11px] font-medium text-[#2C1E16] whitespace-nowrap">
                                {book.isbn}
                              </span>
                            </td>

                            {/* Shelf Location Badge */}
                            <td className="px-4 py-4 align-middle">
                              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#DFD5C5] bg-white px-2.5 py-1 font-mono-code text-[11px] font-medium text-[#2C1E16] whitespace-nowrap">
                                <BookOpen className="h-3 w-3 text-[#6E5D4F]" />
                                <span>{book.shelfLocation}</span>
                              </span>
                            </td>

                            {/* Stock Status */}
                            <td className="px-4 py-4 align-middle">
                              <div className="flex items-center gap-1.5 font-semibold text-[#2C1E16]">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    book.needsDdcValidation
                                      ? 'bg-[#D97706]'
                                      : 'bg-[#4D7C5B]'
                                  }`}
                                />
                                <span>{book.totalCopies} Eksemplar</span>
                              </div>
                              <div
                                className={`mt-0.5 font-mono-code text-[10px] ${
                                  book.needsDdcValidation
                                    ? 'text-[#B85042]'
                                    : 'text-[#4D7C5B]'
                                }`}
                              >
                                {book.statusNote ||
                                  `Tersedia ${book.availableCopies} di Rak`}
                              </div>
                            </td>

                            {/* Row Action Buttons */}
                            <td className="px-4 py-4 text-right align-middle">
                              {isConfirmingDelete ? (
                                <div className="inline-flex items-center gap-1.5 rounded-md border border-[#B85042] bg-[#FDF4F3] p-1">
                                  <span className="px-1.5 font-mono-code text-[10px] font-semibold text-[#B85042]">
                                    Hapus?
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteBook(book.id);
                                      setConfirmDeleteId(null);
                                    }}
                                    className="rounded bg-[#B85042] px-2 py-1 text-[10px] font-semibold text-white hover:bg-[#9E3F32]"
                                  >
                                    Ya, Hapus
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="rounded border border-[#DFD5C5] bg-white px-2 py-1 text-[10px] text-[#2C1E16]"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <div className="relative inline-flex items-center justify-end gap-1.5">
                                  {book.needsDdcValidation ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onValidateDdcBook(book.id)
                                      }
                                      className="rounded-md bg-[#B85042] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#9E3F32] whitespace-nowrap"
                                    >
                                      Validasi DDC
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => onOpenEditForm(book)}
                                      className="inline-flex items-center gap-1 rounded-md border border-[#DFD5C5] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#2C1E16] transition-colors hover:bg-[#F2ECE1] whitespace-nowrap"
                                    >
                                      <Edit3 className="h-3 w-3 text-[#6E5D4F]" />
                                      <span>Sunting</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => onOpenPrintModal(book)}
                                    className="inline-flex items-center gap-1 rounded-md border border-[#DFD5C5] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#2C1E16] transition-colors hover:bg-[#F2ECE1] whitespace-nowrap"
                                  >
                                    <Printer className="h-3.5 w-3.5 text-[#6E5D4F]" />
                                    <span>Cetak Label</span>
                                  </button>

                                  {/* Three-dots row menu trigger (•••) */}
                                  <button
                                    type="button"
                                    aria-label={`Menu aksi lainnya untuk ${book.title}`}
                                    onClick={() =>
                                      setOpenMenuBookId((prev) =>
                                        prev === book.id ? null : book.id
                                      )
                                    }
                                    className="rounded-md border border-[#DFD5C5] bg-white p-1.5 text-[#6E5D4F] transition-colors hover:border-[#2C1E16] hover:bg-[#F2ECE1] hover:text-[#2C1E16]"
                                  >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </button>

                                  {isMenuOpen && (
                                    <div className="absolute right-0 top-9 z-30 w-56 rounded-lg border border-[#DFD5C5] bg-[#FAF7F2] p-1.5 text-left shadow-lg">
                                      <div className="border-b border-[#DFD5C5] px-2.5 py-1 font-mono-code text-[9px] font-semibold uppercase tracking-wider text-[#6E5D4F]">
                                        AKSI SIRKULASI &amp; KATALOG
                                      </div>

                                      <button
                                        type="button"
                                        disabled={activeLoansCount === 0}
                                        onClick={() => {
                                          onReturnBook(book.id);
                                          setOpenMenuBookId(null);
                                        }}
                                        className="mt-1 flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#2C1E16] transition-colors hover:bg-[#EFF5F0] hover:text-[#4D7C5B] disabled:cursor-not-allowed disabled:opacity-45"
                                      >
                                        <CornerDownLeft className="h-3.5 w-3.5 text-[#4D7C5B]" />
                                        <span>Catat Pengembalian (+1 Stok)</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          onDuplicateBook(book.id);
                                          setOpenMenuBookId(null);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#2C1E16] transition-colors hover:bg-[#F2ECE1]"
                                      >
                                        <Copy className="h-3.5 w-3.5 text-[#6E5D4F]" />
                                        <span>Duplikat Entri</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenMenuBookId(null);
                                          setConfirmDeleteId(book.id);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#B85042] transition-colors hover:bg-[#FDF4F3]"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Hapus Koleksi</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DFD5C5] px-4 py-3 font-mono-code text-[11px] text-[#6E5D4F]">
                <div className="flex flex-wrap items-center gap-3">
                  <span>• {selectedIds.length} naskah dipilih</span>
                  <span>•</span>
                  <button
                    type="button"
                    disabled={selectedIds.length === 0}
                    onClick={() => {
                      const selectedBooks = books.filter((b) =>
                        selectedIds.includes(b.id)
                      );
                      if (selectedBooks.length > 0) {
                        onOpenPrintQueueModal(selectedBooks);
                      }
                    }}
                    className="disabled:opacity-50 font-semibold text-[#2C1E16] hover:text-[#B85042]"
                  >
                    Cetak Label Terpilih ({selectedIds.length})
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span>Baris: 25 per halaman</span>
                  <span>Halaman 1 dari 1</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Halaman sebelumnya"
                      className="rounded border border-[#DFD5C5] bg-white p-1 text-[#6E5D4F]"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Halaman berikutnya"
                      className="rounded border border-[#DFD5C5] bg-white p-1 text-[#6E5D4F]"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Institutional Bar with Safe Demo Data Reset Utility */}
      <footer className="mt-12 border-t border-[#DFD5C5] bg-[#E8DFD1] px-4 py-3.5 font-mono-code text-[10px] text-[#6E5D4F] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>
            § Katalog Terpadu Perpustakaan Pusat &amp; Institut Konservasi Naskah
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <span>
              Pangkalan Data MARC21 Versi 4.8.2-RELEASE • Terakhir
              disinkronisasi: Hari ini pukul 14.15 WIB
            </span>

            {confirmResetDemo ? (
              <div className="inline-flex items-center gap-1.5 rounded border border-[#B85042] bg-[#FDF4F3] px-2 py-0.5">
                <span className="font-semibold text-[#B85042]">
                  Pulihkan 5 buku awal?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetDemoData();
                    setConfirmResetDemo(false);
                    setSelectedIds([]);
                  }}
                  className="rounded bg-[#B85042] px-2 py-0.5 font-semibold text-white hover:bg-[#9E3F32]"
                >
                  Ya, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetDemo(false)}
                  className="rounded border border-[#DFD5C5] bg-white px-2 py-0.5 text-[#2C1E16]"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmResetDemo(true)}
                className="inline-flex items-center gap-1 rounded border border-[#DFD5C5] bg-[#FAF7F2] px-2.5 py-1 font-mono-code text-[10px] font-semibold text-[#2C1E16] transition-colors hover:border-[#B85042] hover:text-[#B85042]"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Data Awal</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
