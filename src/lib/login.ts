import type { Lang } from './preferences';

export function validateLogin(email: string, password: string, lang: Lang = 'id') {
  const en = lang === 'en';
  const normalized = email.trim().toLowerCase();
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@student\.umn\.ac\.id$/.test(normalized)) {
    return en ? 'Use your student email ending in @student.umn.ac.id.' : 'Gunakan email mahasiswa dengan akhiran @student.umn.ac.id.';
  }
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return en ? 'Password needs at least 8 characters with an uppercase letter, a lowercase letter, and a number.' : 'Password minimal 8 karakter, dengan huruf kapital, huruf kecil, dan angka.';
  }
  return null;
}
