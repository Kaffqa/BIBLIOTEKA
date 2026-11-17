/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  AppView,
  Book,
  CuratorProfile,
  ToastBannerState,
} from './types/library';
import { SEED_BOOKS } from './data/seedBooks';
import {
  reserveBookCopy,
  returnBookCopy,
  duplicateBookEntry,
  normalizeBookRecord,
} from './utils/catalogLogic';
import { LandingView } from './components/LandingView';
import { AuthModal } from './components/AuthModal';
import { BookDetailModal } from './components/BookDetailModal';
import { SpineLabelModal } from './components/SpineLabelModal';
import { QuickScanModal } from './components/QuickScanModal';
import { WorkspaceView } from './components/WorkspaceView';
import { BookFormView } from './components/BookFormView';

const STORAGE_KEY_BOOKS = 'biblioteka_catalog_books_v1';
const STORAGE_KEY_CURATOR = 'biblioteka_curator_profile_v1';

const DEFAULT_CURATOR: CuratorProfile = {
  name: 'Kaffqa T.',
  role: 'Kurator Utama',
  nip: '19940817-202203-1-004',
  email: 'kurator@bibliotheka.id',
  division: 'Pengolahan Bahan Pustaka',
};

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) =>
            normalizeBookRecord((item || {}) as Record<string, unknown>, idx)
          );
        }
      }
    } catch {
      // Fallback to seed books
    }
    return SEED_BOOKS;
  });

  const [curator, setCurator] = useState<CuratorProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURATOR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name) {
          return {
            name: String(parsed.name || DEFAULT_CURATOR.name),
            role: String(parsed.role || DEFAULT_CURATOR.role),
            nip: String(parsed.nip || DEFAULT_CURATOR.nip),
            email: String(parsed.email || DEFAULT_CURATOR.email),
            division: String(parsed.division || DEFAULT_CURATOR.division),
          };
        }
      }
    } catch {
      // Fallback to default curator
    }
    return DEFAULT_CURATOR;
  });

  // Support ?autostart=1 or ?view=workspace for fast navigation
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('view') === 'workspace' ||
        params.get('autostart') === '1'
      ) {
        return 'workspace';
      }
      if (params.get('view') === 'form') {
        return 'form';
      }
    }
    return 'landing';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuickScanOpen, setIsQuickScanOpen] = useState(false);
  const [selectedBookForDetailId, setSelectedBookForDetailId] = useState<
    string | null
  >(null);
  const [selectedBookForPrint, setSelectedBookForPrint] =
    useState<Book | null>(null);
  const [queuedBooksForPrint, setQueuedBooksForPrint] = useState<
    Book[] | undefined
  >(undefined);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [prefilledIsbn, setPrefilledIsbn] = useState<string | null>(null);
  const [toastBanner, setToastBanner] = useState<ToastBannerState | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
    } catch {
      // Ignore storage quota errors
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURATOR, JSON.stringify(curator));
    } catch {
      // Ignore storage quota errors
    }
  }, [curator]);

  // Global F2 keyboard shortcut listener when logged in as curator (workspace or form view)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2' && (currentView === 'workspace' || currentView === 'form')) {
        e.preventDefault();
        setIsQuickScanOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  const handleAuthenticated = (profile: CuratorProfile) => {
    setCurator(profile);
    setIsAuthModalOpen(false);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBook = (savedBook: Book, stayOnForm: boolean) => {
    setBooks((prev) => {
      const exists = prev.some((b) => b.id === savedBook.id);
      if (exists) {
        return prev.map((b) => (b.id === savedBook.id ? savedBook : b));
      }
      return [savedBook, ...prev];
    });

    setToastBanner({
      visible: true,
      title: savedBook.title,
      isbn: savedBook.isbn,
      shelfLocation: savedBook.shelfLocation.split(' (')[0],
    });

    if (!stayOnForm) {
      setEditingBook(null);
      setPrefilledIsbn(null);
      setCurrentView('workspace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleValidateDdcBook = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              needsDdcValidation: false,
              statusNote: `Tersedia ${b.availableCopies} di Rak`,
              tags: ['DDC Terverifikasi', 'Koleksi Aktif'],
            }
          : b
      )
    );
  };

  const handleReserveBook = (bookId: string) => {
    setBooks((prev) => reserveBookCopy(prev, bookId));
  };

  const handleReturnBook = (bookId: string) => {
    setBooks((prev) => {
      const updated = returnBookCopy(prev, bookId);
      const target = updated.find((b) => b.id === bookId);
      if (target) {
        setToastBanner({
          visible: true,
          title: `${target.title} (+1 Stok Dikembalikan)`,
          isbn: target.isbn,
          shelfLocation: target.shelfLocation.split(' (')[0],
        });
      }
      return updated;
    });
  };

  const handleDuplicateBook = (bookId: string) => {
    const target = books.find((b) => b.id === bookId);
    if (!target) return;
    const cloned = duplicateBookEntry(target, books);
    setBooks((prev) => [cloned, ...prev]);
    setToastBanner({
      visible: true,
      title: cloned.title,
      isbn: cloned.isbn,
      shelfLocation: cloned.shelfLocation.split(' (')[0],
    });
  };

  const handleResetDemoData = () => {
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(SEED_BOOKS));
    setBooks(SEED_BOOKS);
    setToastBanner({
      visible: true,
      title: '5 Koleksi Awal Dipulihkan',
      isbn: '978-602-03-8821-4',
      shelfLocation: 'Repositori Utama',
    });
  };

  const selectedBookForDetail = selectedBookForDetailId
    ? books.find((b) => b.id === selectedBookForDetailId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-[#F2ECE1] text-[#2C1E16]">
      {currentView === 'landing' && (
        <LandingView
          books={books}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onSelectBook={(book) => setSelectedBookForDetailId(book.id)}
          onOpenFormDirect={() => {
            setEditingBook(null);
            setPrefilledIsbn(null);
            setCurrentView('form');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPrintModal={(book) => {
            setQueuedBooksForPrint(undefined);
            setSelectedBookForPrint(book);
          }}
        />
      )}

      {currentView === 'workspace' && (
        <WorkspaceView
          books={books}
          curator={curator}
          toastBanner={toastBanner}
          onDismissToast={() => setToastBanner(null)}
          onNavigateToLanding={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAddForm={() => {
            setEditingBook(null);
            setPrefilledIsbn(null);
            setCurrentView('form');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenEditForm={(book) => {
            setEditingBook(book);
            setPrefilledIsbn(null);
            setCurrentView('form');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPrintModal={(book) => {
            setQueuedBooksForPrint(undefined);
            setSelectedBookForPrint(book);
          }}
          onOpenPrintQueueModal={(queue) => {
            setQueuedBooksForPrint(queue);
            setSelectedBookForPrint(queue[0] ?? books[0] ?? null);
          }}
          onOpenQuickScanModal={() => setIsQuickScanOpen(true)}
          onSelectBookDetail={(book) => setSelectedBookForDetailId(book.id)}
          onDeleteBook={handleDeleteBook}
          onValidateDdcBook={handleValidateDdcBook}
          onReturnBook={handleReturnBook}
          onDuplicateBook={handleDuplicateBook}
          onResetDemoData={handleResetDemoData}
          onLogout={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {currentView === 'form' && (
        <BookFormView
          key={
            editingBook
              ? editingBook.id
              : prefilledIsbn
              ? `new-isbn-${prefilledIsbn}`
              : 'new-book-form'
          }
          existingBooks={books}
          editingBook={editingBook}
          initialIsbn={prefilledIsbn}
          toastBanner={toastBanner}
          onDismissToast={() => setToastBanner(null)}
          onBackToCatalog={() => {
            setEditingBook(null);
            setPrefilledIsbn(null);
            setCurrentView('workspace');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSaveBook={handleSaveBook}
          onOpenPrintModal={(book) => {
            setQueuedBooksForPrint(undefined);
            setSelectedBookForPrint(book);
          }}
        />
      )}

      {/* Authentication Pop-up Modal (View 2 - Reference Image 2) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      {/* Quick Barcode Scanner Modal (F2 Shortcut) */}
      <QuickScanModal
        isOpen={isQuickScanOpen}
        books={books}
        onClose={() => setIsQuickScanOpen(false)}
        onEditExistingBook={(book) => {
          setEditingBook(book);
          setPrefilledIsbn(null);
          setCurrentView('form');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCreateNewWithIsbn={(isbn) => {
          setEditingBook(null);
          setPrefilledIsbn(isbn);
          setCurrentView('form');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Book Detail Modal (Reference Image 6) */}
      <BookDetailModal
        book={selectedBookForDetail}
        onClose={() => setSelectedBookForDetailId(null)}
        onOpenPrintModal={(book) => {
          setQueuedBooksForPrint(undefined);
          setSelectedBookForPrint(book);
        }}
        onReserveBook={handleReserveBook}
        onNavigateToShelf={() => {
          const el = document.getElementById('koleksi-rak');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Spine Label Print Preview Modal (Reference Image 7) */}
      <SpineLabelModal
        book={selectedBookForPrint}
        queuedBooks={queuedBooksForPrint}
        onClose={() => {
          setSelectedBookForPrint(null);
          setQueuedBooksForPrint(undefined);
        }}
      />
    </div>
  );
}
