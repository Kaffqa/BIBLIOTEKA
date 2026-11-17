import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractIsbnDigits,
  formatIsbn13,
  validateIsbn13,
  extractAuthorCode,
  generateCutterCode,
  formatFullCallNumber,
  validateBookForm,
  filterBooks,
  calculateKpiMetrics,
  reserveBookCopy,
  returnBookCopy,
  duplicateBookEntry,
  calculateAnalyticsBreakdown,
  normalizeBookRecord,
} from './catalogLogic.ts';
import { SEED_BOOKS } from '../data/seedBooks.ts';

describe('catalogLogic pure functions', () => {
  it('formats and validates 13-digit ISBNs accurately', () => {
    assert.equal(extractIsbnDigits('978-602-03-8821-4'), '9786020388214');
    assert.equal(formatIsbn13('9786020388214'), '978-602-03-8821-4');

    const incomplete = validateIsbn13('978-602-123');
    assert.equal(incomplete.isValid, false);
    assert.equal(incomplete.digitCount, 9);
    assert.equal(
      incomplete.errorMessage,
      'Format ISBN tidak lengkap. Masukkan 13 digit angka standar.'
    );

    const validNew = validateIsbn13('978-602-99-1122-3', SEED_BOOKS);
    assert.equal(validNew.isValid, true);
    assert.equal(validNew.errorMessage, null);

    const duplicate = validateIsbn13('978-602-03-8821-4', SEED_BOOKS);
    assert.equal(duplicate.isValid, false);
    assert.equal(duplicate.isDuplicate, true);
  });

  it('generates Cutter-Sanborn codes and full DDC call numbers from author names', () => {
    const authors = [
      { id: '1', name: 'Dr. Budi Santoso', role: 'Penulis Utama' as const },
    ];
    assert.equal(extractAuthorCode(authors), 'SAN');
    assert.equal(
      generateCutterCode(authors, 'Interaksi Manusia & Komputer'),
      'SAN i'
    );
    assert.equal(
      formatFullCallNumber('004.019', authors, 2026),
      '004.019 / SAN / 2026'
    );
  });

  it('validates complete and incomplete book form submissions', () => {
    const invalidForm = validateBookForm(
      {
        isbn: '978-602-123',
        title: 'Interaksi Manusia & Komputer',
        authors: [
          { id: '1', name: 'Dr. Budi Santoso', role: 'Penulis Utama' },
        ],
        publisher: 'Penerbit Andi',
        year: 2026,
        pages: 384,
        language: 'Indonesia',
        ddcCategory: '000 - Karya Umum, Komputer & Informasi',
        ddcCode: '004.019',
        shelfLocation: 'Rak B-02 (Lt. 2)',
        totalCopies: 3,
      },
      SEED_BOOKS
    );
    assert.equal(invalidForm.isValid, false);

    const validForm = validateBookForm(
      {
        isbn: '978-602-88-9900-1',
        title: 'Interaksi Manusia & Komputer',
        authors: [
          { id: '1', name: 'Dr. Budi Santoso', role: 'Penulis Utama' },
        ],
        publisher: 'Penerbit Andi',
        year: 2026,
        pages: 384,
        language: 'Indonesia',
        ddcCategory: '000 - Karya Umum, Komputer & Informasi',
        ddcCode: '004.019',
        shelfLocation: 'Rak B-02 (Lt. 2)',
        totalCopies: 3,
      },
      SEED_BOOKS
    );
    assert.equal(validForm.isValid, true);
  });

  it('filters catalog books by title, author, ISBN, and DDC class', () => {
    const byTitle = filterBooks(SEED_BOOKS, 'Arsitektur Nusantara');
    assert.equal(byTitle.length, 1);
    assert.equal(byTitle[0].id, 'book-2');

    const byIsbn = filterBooks(SEED_BOOKS, '978-602-550-109-8');
    assert.equal(byIsbn.length, 1);
    assert.equal(byIsbn[0].id, 'book-4');

    const byDdcCategory = filterBooks(
      SEED_BOOKS,
      '',
      '700 - Arsitektur, Seni & Desain'
    );
    assert.equal(byDdcCategory.length, 1);
    assert.equal(byDdcCategory[0].id, 'book-2');
  });

  it('computes initial KPI metrics matching reference image counts', () => {
    const metrics = calculateKpiMetrics(SEED_BOOKS);
    assert.equal(metrics.totalPhysicalCopies, 14280);
    assert.equal(metrics.weeklyAdditions, 42);
    assert.equal(metrics.needsDdcCount, 1);
  });

  it('handles book copy reservation, return, duplication, and analytics breakdown', () => {
    const afterReserve = reserveBookCopy(SEED_BOOKS, 'book-1');
    const reservedBook = afterReserve.find((b) => b.id === 'book-1')!;
    assert.equal(reservedBook.availableCopies, 4);
    assert.equal(reservedBook.borrowedCopies, 2);

    const afterReturn = returnBookCopy(afterReserve, 'book-1');
    const returnedBook = afterReturn.find((b) => b.id === 'book-1')!;
    assert.equal(returnedBook.availableCopies, 5);
    assert.equal(returnedBook.borrowedCopies, 1);

    const cloned = duplicateBookEntry(SEED_BOOKS[0], SEED_BOOKS);
    assert.notEqual(cloned.id, SEED_BOOKS[0].id);
    assert.notEqual(cloned.isbn, SEED_BOOKS[0].isbn);
    assert.ok(cloned.title.includes('(Edisi Baru)'));

    const breakdown = calculateAnalyticsBreakdown(SEED_BOOKS);
    assert.equal(breakdown.totalCopies, 21);
    assert.equal(breakdown.ddcDistribution.length, 5);
    assert.equal(breakdown.quarantineCopies, 3);

    const legacyBook = normalizeBookRecord({
      id: 'legacy-1',
      title: 'Buku Lawas',
      coverTheme: 'burgundy-unknown',
      authors: ['Dr. Sutomo'],
    });
    assert.equal(legacyBook.coverTheme, 'terracotta');
    assert.equal(legacyBook.authors[0].name, 'Dr. Sutomo');
    assert.equal(legacyBook.cutterCode, 'SUT b');
  });
});
