import { AuthorContributor, Book } from '../types/library';

export interface IsbnValidationResult {
  rawDigits: string;
  formatted: string;
  digitCount: number;
  isValid: boolean;
  isDuplicate: boolean;
  errorMessage: string | null;
}

/**
 * Extracts only numeric digits from an ISBN string, capped at 13 digits.
 */
export function extractIsbnDigits(input: string): string {
  return input.replace(/\D/g, '').slice(0, 13);
}

/**
 * Formats numeric digits into standard Indonesian ISBN-13 hyphenated format:
 * e.g. 978-602-03-8821-4 or progressive partial formatting.
 */
export function formatIsbn13(input: string): string {
  const digits = extractIsbnDigits(input);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 12)}-${digits.slice(12, 13)}`;
}

/**
 * Validates ISBN-13 input for completeness (13 digits) and uniqueness in catalog.
 */
export function validateIsbn13(
  input: string,
  existingBooks: Book[] = [],
  editingBookId?: string
): IsbnValidationResult {
  const rawDigits = extractIsbnDigits(input);
  const formatted = formatIsbn13(rawDigits);
  const digitCount = rawDigits.length;

  if (digitCount === 0) {
    return {
      rawDigits,
      formatted,
      digitCount,
      isValid: false,
      isDuplicate: false,
      errorMessage: 'Format ISBN tidak lengkap. Masukkan 13 digit angka standar.',
    };
  }

  if (digitCount < 13) {
    return {
      rawDigits,
      formatted,
      digitCount,
      isValid: false,
      isDuplicate: false,
      errorMessage: 'Format ISBN tidak lengkap. Masukkan 13 digit angka standar.',
    };
  }

  if (!rawDigits.startsWith('978') && !rawDigits.startsWith('979')) {
    return {
      rawDigits,
      formatted,
      digitCount,
      isValid: false,
      isDuplicate: false,
      errorMessage: 'Prefiks ISBN-13 harus diawali dengan 978 atau 979.',
    };
  }

  const isDuplicate = existingBooks.some(
    (b) => b.id !== editingBookId && extractIsbnDigits(b.isbn) === rawDigits
  );

  if (isDuplicate) {
    return {
      rawDigits,
      formatted,
      digitCount,
      isValid: false,
      isDuplicate: true,
      errorMessage: 'Nomor ISBN-13 ini sudah terdaftar dalam katalog.',
    };
  }

  return {
    rawDigits,
    formatted,
    digitCount,
    isValid: true,
    isDuplicate: false,
    errorMessage: null,
  };
}

const ACADEMIC_TITLES = new Set([
  'dr',
  'ir',
  'prof',
  'drs',
  'dra',
  'h',
  'hj',
  'mkom',
  'mt',
  'mhum',
  'msn',
  'ssi',
  'st',
  'sh',
  'se',
  'ma',
  'msc',
  'phd',
]);

/**
 * Extracts the 3-letter uppercase Cutter-Sanborn author code from the primary author's surname/main name.
 */
export function extractAuthorCode(
  authors?: AuthorContributor[] | unknown,
  fallbackAuthorText = ''
): string {
  const safeAuthors = Array.isArray(authors) ? authors : [];
  const firstEntry = safeAuthors[0];
  const firstAuthorName =
    typeof firstEntry === 'string'
      ? firstEntry
      : firstEntry && typeof firstEntry === 'object' && 'name' in firstEntry
      ? String((firstEntry as { name?: unknown }).name || '')
      : '';
  const rawName = firstAuthorName || fallbackAuthorText || 'ANONIM';
  const beforeComma = rawName.split(',')[0].trim();
  const tokens = beforeComma
    .replace(/\./g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const meaningfulTokens = tokens.filter(
    (t) => !ACADEMIC_TITLES.has(t.toLowerCase())
  );

  const chosenToken =
    meaningfulTokens.length > 0
      ? meaningfulTokens[meaningfulTokens.length - 1]
      : tokens[0] || 'ANO';

  const lettersOnly = chosenToken
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .padEnd(3, 'X')
    .slice(0, 3);

  return lettersOnly;
}

/**
 * Generates full Cutter code e.g. "SAN i" from primary author and book title.
 */
export function generateCutterCode(
  authors: AuthorContributor[] | unknown,
  title: string,
  fallbackAuthorText = ''
): string {
  const authorThree = extractAuthorCode(authors, fallbackAuthorText);
  const firstTitleChar =
    String(title || '')
      .trim()
      .replace(/[^a-zA-Z]/g, '')
      .charAt(0)
      .toLowerCase() || 'a';
  return `${authorThree} ${firstTitleChar}`;
}

/**
 * Normalizes any persisted or legacy Book record from localStorage so all required fields and coverTheme are valid.
 */
export function normalizeBookRecord(raw: Record<string, unknown>, index = 0): Book {
  const rawTheme = String(raw.coverTheme || raw.coverColor || 'navy').toLowerCase();
  const coverTheme: Book['coverTheme'] =
    rawTheme === 'terracotta' ||
    rawTheme.includes('burgundy') ||
    rawTheme.includes('red') ||
    rawTheme.includes('maroon')
      ? 'terracotta'
      : rawTheme === 'forest' ||
        rawTheme.includes('green') ||
        rawTheme.includes('olive') ||
        rawTheme.includes('sage')
      ? 'forest'
      : rawTheme === 'espresso' ||
        rawTheme.includes('brown') ||
        rawTheme.includes('umber') ||
        rawTheme.includes('coffee')
      ? 'espresso'
      : 'navy';

  const rawAuthors = Array.isArray(raw.authors) ? raw.authors : [];
  const normalizedAuthors: AuthorContributor[] =
    rawAuthors.length > 0
      ? rawAuthors.map((a, idx) => {
          if (typeof a === 'string') {
            return {
              id: `auth-${index}-${idx}`,
              name: a,
              role: idx === 0 ? 'Penulis Utama' : 'Kontributor',
            };
          }
          const obj = (a || {}) as Record<string, unknown>;
          return {
            id: String(obj.id || `auth-${index}-${idx}`),
            name: String(obj.name || 'Anonim'),
            role: (obj.role as AuthorContributor['role']) || 'Penulis Utama',
          };
        })
      : [
          {
            id: `auth-${index}-0`,
            name: String(raw.author || 'Anonim'),
            role: 'Penulis Utama',
          },
        ];

  const title = String(raw.title || 'Naskah Terkatalog');
  const ddcCode = String(raw.ddcCode || raw.callNumber || '005.133').split(' ')[0];
  const cutterCode = String(
    raw.cutterCode || generateCutterCode(normalizedAuthors, title)
  );
  const totalCopies = Math.max(1, Number(raw.totalCopies ?? raw.copies ?? 3));
  const availableCopies = Math.max(
    0,
    Math.min(totalCopies, Number(raw.availableCopies ?? raw.tersedia ?? totalCopies))
  );
  const borrowedCopies = Math.max(
    0,
    Number(raw.borrowedCopies ?? raw.dipinjam ?? 0)
  );
  const reservedCopies = Math.max(
    0,
    Number(raw.reservedCopies ?? raw.reservasi ?? 0)
  );

  return {
    id: String(raw.id || `book-${index}-${Date.now()}`),
    isbn: formatIsbn13(String(raw.isbn || '978-602-03-8821-4')),
    title,
    subtitle: raw.subtitle ? String(raw.subtitle) : undefined,
    authors: normalizedAuthors,
    publisher: String(raw.publisher || 'Pustaka Sains Bandung'),
    year: Number(raw.year) || 2024,
    pages: Number(raw.pages) || 320,
    dimensions: raw.dimensions ? String(raw.dimensions) : '17.6 x 25 cm (B5 Royal)',
    language:
      raw.language === 'Inggris' ||
      raw.language === 'Arab' ||
      raw.language === 'Lainnya'
        ? raw.language
        : 'Indonesia',
    edition: raw.edition ? String(raw.edition) : 'Edisi Standar',
    ddcCategory: String(
      raw.ddcCategory || '000 - Karya Umum, Komputer & Informasi'
    ),
    ddcCode,
    cutterCode,
    shelfLocation: String(raw.shelfLocation || 'Rak R-04 (Lt. 2)'),
    totalCopies,
    availableCopies,
    borrowedCopies,
    reservedCopies,
    statusNote: raw.statusNote
      ? String(raw.statusNote)
      : `Tersedia ${availableCopies} di Rak`,
    needsDdcValidation: Boolean(raw.needsDdcValidation),
    coverTheme,
    customCoverUrl: raw.customCoverUrl ? String(raw.customCoverUrl) : undefined,
    abstract: raw.abstract ? String(raw.abstract) : undefined,
    tocPreview: Array.isArray(raw.tocPreview)
      ? raw.tocPreview.map(String)
      : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : undefined,
    addedThisWeek: Boolean(raw.addedThisWeek),
    createdAt: String(raw.createdAt || new Date().toISOString()),
  };
}

/**
 * Generates full DDC Call Number string: e.g. "004.019 / SAN / 2026"
 */
export function formatFullCallNumber(
  ddcCode: string,
  authors: AuthorContributor[],
  year: number | string,
  fallbackAuthorText = ''
): string {
  const cleanDdc = ddcCode.trim() || '000.000';
  const authorCode = extractAuthorCode(authors, fallbackAuthorText);
  const cleanYear = String(year || new Date().getFullYear()).trim();
  return `${cleanDdc} / ${authorCode} / ${cleanYear}`;
}

export interface BookFormInput {
  isbn: string;
  title: string;
  authors: AuthorContributor[];
  draftAuthorInput?: string;
  publisher: string;
  year: number | string;
  pages: number | string;
  language: string;
  ddcCategory: string;
  ddcCode: string;
  shelfLocation: string;
  totalCopies: number;
}

export interface BookFormValidation {
  isValid: boolean;
  isbnValidation: IsbnValidationResult;
  titleValid: boolean;
  authorsValid: boolean;
  yearValid: boolean;
  pagesValid: boolean;
  ddcValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates all required fields in the Cataloging Form (View 4).
 */
export function validateBookForm(
  form: BookFormInput,
  existingBooks: Book[] = [],
  editingBookId?: string
): BookFormValidation {
  const isbnValidation = validateIsbn13(
    form.isbn,
    existingBooks,
    editingBookId
  );
  const titleValid = form.title.trim().length >= 3;
  const authorsValid =
    form.authors.length > 0 ||
    Boolean(form.draftAuthorInput && form.draftAuthorInput.trim().length >= 2);
  const numericYear = Number(form.year);
  const yearValid =
    Number.isInteger(numericYear) && numericYear >= 1900 && numericYear <= 2026;
  const numericPages = Number(form.pages);
  const pagesValid = Number.isInteger(numericPages) && numericPages >= 1;
  const ddcValid = form.ddcCode.trim().length >= 3;

  const errors: Record<string, string> = {};
  if (!isbnValidation.isValid && isbnValidation.errorMessage) {
    errors.isbn = isbnValidation.errorMessage;
  }
  if (!titleValid) {
    errors.title = 'Judul lengkap buku wajib diisi (minimal 3 karakter).';
  }
  if (!authorsValid) {
    errors.authors = 'Minimal satu penulis atau kontributor wajib dicantumkan.';
  }
  if (!yearValid) {
    errors.year = 'Tahun terbit harus berada dalam rentang 1900 hingga 2026.';
  }
  if (!pagesValid) {
    errors.pages = 'Jumlah halaman harus berupa angka positif (>= 1).';
  }
  if (!ddcValid) {
    errors.ddcCode = 'Nomor panggil DDC wajib diisi.';
  }

  return {
    isValid:
      isbnValidation.isValid &&
      titleValid &&
      authorsValid &&
      yearValid &&
      pagesValid &&
      ddcValid,
    isbnValidation,
    titleValid,
    authorsValid,
    yearValid,
    pagesValid,
    ddcValid,
    errors,
  };
}

/**
 * Filters books by search query (Title, Author, ISBN, DDC) and optional DDC category / Shelf filter.
 */
export function filterBooks(
  books: Book[],
  query: string,
  ddcCategoryFilter = 'ALL',
  shelfFilter = 'ALL'
): Book[] {
  const q = query.trim().toLowerCase();
  const qDigits = query.replace(/\D/g, '');

  return books.filter((book) => {
    if (
      ddcCategoryFilter !== 'ALL' &&
      !book.ddcCategory.startsWith(ddcCategoryFilter.slice(0, 3))
    ) {
      return false;
    }

    if (
      shelfFilter !== 'ALL' &&
      !book.shelfLocation.toLowerCase().includes(shelfFilter.toLowerCase())
    ) {
      return false;
    }

    if (!q) return true;

    const titleMatch = book.title.toLowerCase().includes(q);
    const subtitleMatch = book.subtitle?.toLowerCase().includes(q) ?? false;
    const authorMatch = book.authors.some((a) =>
      a.name.toLowerCase().includes(q)
    );
    const isbnTextMatch = book.isbn.toLowerCase().includes(q);
    const isbnDigitMatch =
      qDigits.length > 0 && extractIsbnDigits(book.isbn).includes(qDigits);
    const ddcMatch =
      book.ddcCode.toLowerCase().includes(q) ||
      book.cutterCode.toLowerCase().includes(q);
    const publisherMatch = book.publisher.toLowerCase().includes(q);

    return (
      titleMatch ||
      subtitleMatch ||
      authorMatch ||
      isbnTextMatch ||
      isbnDigitMatch ||
      ddcMatch ||
      publisherMatch
    );
  });
}

/**
 * Calculates live KPI metrics for the Landing Page and Curator Workspace.
 */
export function calculateKpiMetrics(books: Book[]) {
  const baseCatalogCopies = 14259; // Base archive + seed 21 copies = 14.280
  const currentCopies = books.reduce((sum, b) => sum + (b.totalCopies || 0), 0);
  const totalPhysicalCopies = baseCatalogCopies + currentCopies;

  const baseWeeklyAdditions = 41; // Base 41 + 1 seed addedThisWeek = +42
  const currentWeekly = books.filter((b) => b.addedThisWeek).length;
  const weeklyAdditions = baseWeeklyAdditions + currentWeekly;

  const needsDdcCount = books.filter((b) => b.needsDdcValidation).length;

  return {
    totalPhysicalCopies,
    weeklyAdditions,
    needsDdcCount,
    catalogAccuracy: '99,4%',
  };
}

/**
 * Decrements availableCopies by 1 and increments borrowedCopies by 1 for a book reservation.
 */
export function reserveBookCopy(books: Book[], bookId: string): Book[] {
  return books.map((b) => {
    if (b.id !== bookId || b.availableCopies <= 0) return b;
    const nextAvailable = b.availableCopies - 1;
    const nextBorrowed = (b.borrowedCopies ?? 0) + 1;
    const reserved = b.reservedCopies ?? 0;
    const activeLoanCount = nextBorrowed + reserved;
    return {
      ...b,
      availableCopies: nextAvailable,
      borrowedCopies: nextBorrowed,
      statusNote:
        activeLoanCount > 0
          ? `Tersedia ${nextAvailable} • Dipinjam ${activeLoanCount}`
          : `Tersedia ${nextAvailable} di Rak`,
    };
  });
}

/**
 * Increments availableCopies by 1 and decrements borrowedCopies (or reservedCopies) by 1 when returning a copy.
 */
export function returnBookCopy(books: Book[], bookId: string): Book[] {
  return books.map((b) => {
    if (b.id !== bookId) return b;
    const borrowed = b.borrowedCopies ?? 0;
    const reserved = b.reservedCopies ?? 0;
    if (borrowed <= 0 && reserved <= 0) return b;

    const nextAvailable = Math.min(b.totalCopies, b.availableCopies + 1);
    const nextBorrowed = borrowed > 0 ? borrowed - 1 : 0;
    const nextReserved = borrowed === 0 && reserved > 0 ? reserved - 1 : reserved;
    const remainingOut = nextBorrowed + nextReserved;

    return {
      ...b,
      availableCopies: nextAvailable,
      borrowedCopies: nextBorrowed,
      reservedCopies: nextReserved,
      statusNote:
        remainingOut > 0
          ? `Tersedia ${nextAvailable} • Dipinjam ${remainingOut}`
          : `Tersedia ${nextAvailable} di Rak`,
    };
  });
}

/**
 * Clones a book entry with a unique new ISBN-13 and edition note for rapid cataloging of new editions.
 */
export function duplicateBookEntry(book: Book, existingBooks: Book[]): Book {
  const basePrefix = extractIsbnDigits(book.isbn).slice(0, 9) || '978602038';
  let suffix = Math.floor(1000 + Math.random() * 8999);
  let candidateIsbn = formatIsbn13(`${basePrefix}${suffix}`);
  let guard = 0;
  while (
    existingBooks.some(
      (b) => extractIsbnDigits(b.isbn) === extractIsbnDigits(candidateIsbn)
    ) &&
    guard < 50
  ) {
    suffix = Math.floor(1000 + Math.random() * 8999);
    candidateIsbn = formatIsbn13(`${basePrefix}${suffix}`);
    guard++;
  }

  return {
    ...book,
    id: `book-dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    isbn: candidateIsbn,
    title: `${book.title} (Edisi Baru)`,
    edition: 'Cetakan Pembaruan',
    availableCopies: book.totalCopies,
    borrowedCopies: 0,
    reservedCopies: 0,
    statusNote: `Tersedia ${book.totalCopies} di Rak`,
    addedThisWeek: true,
    createdAt: new Date().toISOString(),
  };
}

export interface DdcClassBucket {
  code: string;
  label: string;
  titleCount: number;
  copyCount: number;
  percentage: number;
}

/**
 * Computes DDC class distribution and physical copy status breakdown for the Ringkasan (Analytics) tab.
 */
export function calculateAnalyticsBreakdown(books: Book[]) {
  const totalCopies = Math.max(
    1,
    books.reduce((sum, b) => sum + (b.totalCopies || 0), 0)
  );

  const classes = [
    { code: '000', label: '000 Ilmu Komputer & Sains Data' },
    { code: '300', label: '300 Ilmu Sosial & Ekonomi' },
    { code: '600', label: '600 Teknologi & Rekayasa' },
    { code: '700', label: '700 Arsitektur & Seni' },
    { code: '800', label: '800 Sastra & Filologi' },
  ];

  const ddcDistribution: DdcClassBucket[] = classes.map((cls) => {
    const matching = books.filter((b) => {
      if (cls.code === '000') {
        return (
          b.ddcCategory.startsWith('000') ||
          b.ddcCode.startsWith('0') ||
          b.ddcCode.startsWith('5')
        );
      }
      return (
        b.ddcCategory.startsWith(cls.code) ||
        b.ddcCode.startsWith(cls.code[0])
      );
    });
    const copyCount = matching.reduce((s, b) => s + (b.totalCopies || 0), 0);
    const percentage = Math.round((copyCount / totalCopies) * 100);
    return {
      code: cls.code,
      label: cls.label,
      titleCount: matching.length,
      copyCount,
      percentage,
    };
  });

  const quarantineCopies = books
    .filter((b) => b.needsDdcValidation)
    .reduce((s, b) => s + (b.totalCopies || 0), 0);

  const borrowedOrReservedCopies = books.reduce(
    (s, b) => s + (b.borrowedCopies ?? 0) + (b.reservedCopies ?? 0),
    0
  );

  const availableCopies = books
    .filter((b) => !b.needsDdcValidation)
    .reduce((s, b) => s + (b.availableCopies || 0), 0);

  return {
    ddcDistribution,
    totalCopies,
    availableCopies,
    borrowedOrReservedCopies,
    quarantineCopies,
  };
}
