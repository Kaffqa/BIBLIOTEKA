export type AppView = 'landing' | 'workspace' | 'form';

export type CoverTheme = 'navy' | 'terracotta' | 'forest' | 'espresso';

export interface AuthorContributor {
  id: string;
  name: string;
  role: 'Penulis Utama' | 'Penulis Kedua' | 'Editor' | 'Penyunting' | 'Kontributor';
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  subtitle?: string;
  authors: AuthorContributor[];
  publisher: string;
  year: number;
  pages: number;
  dimensions?: string;
  language: 'Indonesia' | 'Inggris' | 'Arab' | 'Lainnya';
  edition?: string;
  ddcCategory: string;
  ddcCode: string;
  cutterCode: string;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies?: number;
  reservedCopies?: number;
  statusNote?: string;
  needsDdcValidation?: boolean;
  coverTheme: CoverTheme;
  customCoverUrl?: string;
  abstract?: string;
  tocPreview?: string[];
  tags?: string[];
  addedThisWeek?: boolean;
  createdAt: string;
}

export interface CuratorProfile {
  name: string;
  role: string;
  nip: string;
  email: string;
  division: string;
}

export interface ToastBannerState {
  visible: boolean;
  title: string;
  isbn: string;
  shelfLocation: string;
}
