import type { Course } from '../types';
import type { Lang } from './preferences';
import { dayLabel } from './format';

export function validateEnrollment(current: Course[], draft: Course[], lang: Lang = 'id'): string | null {
  const en = lang === 'en';
  if (!draft.length) return en ? 'Add a course to the cart first.' : 'Tambahkan mata kuliah ke keranjang terlebih dahulu.';
  const all = [...current, ...draft];
  if (new Set(all.map(c => c.code)).size !== all.length) return en ? 'The same course cannot be taken twice.' : 'Mata kuliah yang sama tidak dapat diambil dua kali.';
  if (all.reduce((sum,c) => sum+c.sks,0) > 24) return en ? 'Study load exceeds the 24 SKS limit. Adjust your course selection.' : 'Beban studi melebihi batas 24 SKS. Sesuaikan pilihan mata kuliah.';
  for (let i=0; i<all.length; i++) for (let j=i+1; j<all.length; j++) {
    const a=all[i], b=all[j];
    if (a.day === b.day && a.startTime < b.endTime && b.startTime < a.endTime)
      return en ? `Schedule conflict: ${a.name} and ${b.name} (${a.day}).` : `Jadwal bentrok: ${a.name} dan ${b.name} (${dayLabel(a.day)}).`;
  }
  return null;
}
