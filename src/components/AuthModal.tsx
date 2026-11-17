import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CuratorProfile } from '../types/library';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (profile: CuratorProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password inline state
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmailOrNip, setResetEmailOrNip] = useState(
    'kurator@bibliotheka.id'
  );
  const [resetSentConfirmation, setResetSentConfirmation] = useState(false);

  // Login State (pre-filled with realistic curator credentials for frictionless evaluation)
  const [loginIdentity, setLoginIdentity] = useState('kurator@bibliotheka.id');
  const [loginPassword, setLoginPassword] = useState('pustaka1924');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState('');
  const [regNip, setRegNip] = useState('19940817-202303-1-009');
  const [regDivision, setRegDivision] = useState('Pengolahan Bahan Pustaka');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFillDemoAccount = () => {
    setActiveTab('login');
    setIsResetMode(false);
    setLoginIdentity('kurator@bibliotheka.id');
    setLoginPassword('pustaka1924');
    setLoginError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentity.trim() || !loginPassword.trim()) {
      setLoginError('Mohon masukkan Email Institusi / NIP dan Kata Sandi.');
      return;
    }
    setLoginError(null);
    onAuthenticated({
      name: loginIdentity.includes('kaffqa') ? 'Kaffqa T.' : 'Kaffqa T.',
      role: 'Kurator Utama',
      nip: '19940817-202203-1-004',
      email: loginIdentity.trim(),
      division: 'Pengolahan Bahan Pustaka',
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Nama Lengkap, Email, dan Kata Sandi wajib diisi.');
      return;
    }
    setRegError(null);
    onAuthenticated({
      name: regName.trim(),
      role: 'Kurator Madya',
      nip: regNip.trim() || '19960412-202401-2-001',
      email: regEmail.trim(),
      division: regDivision,
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmailOrNip.trim()) return;
    setResetSentConfirmation(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E16]/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#DFD5C5] bg-[#FAF7F2] p-7 shadow-xl">
        {/* Top Tab Header + Close Button */}
        <div className="flex items-center justify-between border-b border-[#DFD5C5] pb-3.5">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setIsResetMode(false);
                setResetSentConfirmation(false);
                setLoginError(null);
              }}
              className={`relative pb-3.5 -mb-3.5 text-sm font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'border-b-2 border-[#B85042] text-[#2C1E16]'
                  : 'text-[#6E5D4F] hover:text-[#2C1E16]'
              }`}
            >
              Masuk Kurator
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setIsResetMode(false);
                setResetSentConfirmation(false);
                setRegError(null);
              }}
              className={`relative pb-3.5 -mb-3.5 text-sm font-semibold transition-colors ${
                activeTab === 'register'
                  ? 'border-b-2 border-[#B85042] text-[#2C1E16]'
                  : 'text-[#6E5D4F] hover:text-[#2C1E16]'
              }`}
            >
              Registrasi Petugas
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal autentikasi"
            className="rounded-lg p-1.5 text-[#6E5D4F] transition-colors hover:bg-[#F2ECE1] hover:text-[#2C1E16]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {activeTab === 'login' ? (
          isResetMode ? (
            <form onSubmit={handleResetPasswordSubmit} className="mt-6">
              <div className="inline-flex items-center gap-1.5 rounded bg-[#FDF4F3] px-2.5 py-0.5 font-mono-code text-[10px] font-semibold text-[#B85042]">
                <KeyRound className="h-3 w-3" />
                <span>PEMULIHAN AKSES KURATOR</span>
              </div>
              <h2
                id="auth-modal-title"
                className="mt-2 font-serif-editorial text-2xl font-bold text-[#2C1E16]"
              >
                Atur Ulang Kata Sandi
              </h2>
              <p className="mt-1 text-xs text-[#6E5D4F]">
                Masukkan NIP atau Email Institusi Anda. Tautan otorisasi sandi
                sementara akan dikirimkan melalui peladen internal.
              </p>

              <div className="mt-4">
                <label
                  htmlFor="reset-identity-input"
                  className="block font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                >
                  EMAIL INSTITUSI ATAU NIP TERDAFTAR
                </label>
                <input
                  id="reset-identity-input"
                  type="text"
                  value={resetEmailOrNip}
                  onChange={(e) => setResetEmailOrNip(e.target.value)}
                  placeholder="kurator@bibliotheka.id"
                  className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 font-mono-code text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                />
              </div>

              {resetSentConfirmation && (
                <div
                  role="status"
                  className="mt-3.5 flex items-start gap-2 rounded-lg border border-[#4D7C5B] bg-[#EFF5F0] p-3 text-xs text-[#2C1E16]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4D7C5B]" />
                  <div>
                    <strong>Tautan Pemulihan Terkirim:</strong> Sandi sementara
                    untuk <span className="font-mono-code">{resetEmailOrNip}</span>{' '}
                    telah disinkronkan (Gunakan sandi demo:{' '}
                    <span className="font-mono-code font-bold">pustaka1924</span>).
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(false);
                    setResetSentConfirmation(false);
                  }}
                  className="rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#2C1E16] hover:bg-[#F2ECE1]"
                >
                  Kembali Masuk
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#B85042] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#9E3F32]"
                >
                  <span>Kirim Instruksi Reset</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="mt-6">
              <h2
                id="auth-modal-title"
                className="font-serif-editorial text-2xl font-bold text-[#2C1E16]"
              >
                Akses Meja Kurator
              </h2>
              <p className="mt-1 text-xs text-[#6E5D4F]">
                Masuk untuk mengelola katalog dan mencatat koleksi buku baru.
              </p>

              {loginError && (
                <div className="mt-4 rounded-lg border border-[#B85042] bg-[#FDF4F3] px-3 py-2 text-xs text-[#B85042]">
                  {loginError}
                </div>
              )}

              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="login-identity"
                    className="block font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    EMAIL INSTITUSI ATAU NIP
                  </label>
                  <input
                    id="login-identity"
                    type="text"
                    value={loginIdentity}
                    onChange={(e) => setLoginIdentity(e.target.value)}
                    placeholder="kurator@bibliotheka.id"
                    className="mt-1.5 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 font-mono-code text-xs text-[#2C1E16] outline-none transition-colors focus:border-[#B85042]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                    >
                      KATA SANDI
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setResetSentConfirmation(false);
                      }}
                      className="text-[11px] font-medium text-[#B85042] hover:underline"
                    >
                      Lupa sandi?
                    </button>
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2.5 pr-10 font-mono-code text-xs text-[#2C1E16] outline-none transition-colors focus:border-[#B85042]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword
                          ? 'Sembunyikan kata sandi'
                          : 'Tampilkan kata sandi'
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E5D4F] hover:text-[#2C1E16]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#B85042] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9E3F32]"
              >
                <span>Masuk ke Ruang Kerja</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* 1-Click Demo Curator Helper Pill */}
              <div className="mt-3.5 flex justify-center">
                <button
                  type="button"
                  onClick={handleFillDemoAccount}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#DFD5C5] bg-[#F2ECE1]/80 px-3 py-1 font-mono-code text-[10px] font-semibold text-[#2C1E16] transition-colors hover:border-[#B85042] hover:bg-white"
                >
                  <Sparkles className="h-3 w-3 text-[#B85042]" />
                  <span>Isi Otomatis Akun Demo Kurator</span>
                </button>
              </div>

              <div className="mt-4 border-t border-[#DFD5C5] pt-3.5 text-center text-xs text-[#6E5D4F]">
                Belum punya akun kurator?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-semibold text-[#2C1E16] underline decoration-[#B85042] underline-offset-2 hover:text-[#B85042]"
                >
                  Klik tab Registrasi Petugas di atas.
                </button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleRegisterSubmit} className="mt-6">
            <h2
              id="auth-modal-title"
              className="font-serif-editorial text-2xl font-bold text-[#2C1E16]"
            >
              Registrasi Petugas Katalog
            </h2>
            <p className="mt-1 text-xs text-[#6E5D4F]">
              Daftarkan kredensial pustakawan untuk hak akses borang MARC21.
            </p>

            {regError && (
              <div className="mt-4 rounded-lg border border-[#B85042] bg-[#FDF4F3] px-3 py-2 text-xs text-[#B85042]">
                {regError}
              </div>
            )}

            <div className="mt-4 space-y-3.5">
              <div>
                <label
                  htmlFor="reg-name"
                  className="block font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                >
                  NAMA LENGKAP &amp; GELAR
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Rina Wijaya, S.I.Pust."
                  className="mt-1 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2 text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-nip"
                    className="block font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    NOMOR INDUK (NIP)
                  </label>
                  <input
                    id="reg-nip"
                    type="text"
                    value={regNip}
                    onChange={(e) => setRegNip(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3 py-2 font-mono-code text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-division"
                    className="block font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                  >
                    DIVISI PERPUSTAKAAN
                  </label>
                  <select
                    id="reg-division"
                    value={regDivision}
                    onChange={(e) => setRegDivision(e.target.value)}
                    className="mt-1 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3 py-2 text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                  >
                    <option value="Pengolahan Bahan Pustaka">
                      Pengolahan Bahan Pustaka
                    </option>
                    <option value="Konservasi & Naskah Kuno">
                      Konservasi &amp; Naskah Kuno
                    </option>
                    <option value="Layanan Sirkulasi & Referensi">
                      Layanan Sirkulasi &amp; Referensi
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                >
                  EMAIL INSTITUSI
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama.petugas@bibliotheka.id"
                  className="mt-1 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2 font-mono-code text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block font-mono-code text-[10px] font-semibold tracking-wider uppercase text-[#6E5D4F]"
                >
                  KATA SANDI BARU
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="mt-1 w-full rounded-[8px] border border-[#DFD5C5] bg-white px-3.5 py-2 font-mono-code text-xs text-[#2C1E16] outline-none focus:border-[#B85042]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#B85042] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9E3F32]"
            >
              <span>Daftarkan &amp; Buka Meja Kerja</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
