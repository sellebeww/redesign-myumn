import { useState, type FormEvent } from 'react';
import { ArrowRight, BookOpen, CalendarDays, Eye, EyeOff, GraduationCap, Check, ChevronLeft, ChevronRight, LockKeyhole } from 'lucide-react';
import { validateLogin } from '../lib/login';
import { usePrefs } from '../lib/preferences';
import { LanguageSwitch, ThemeToggle } from './PreferenceToggles';

const SLIDES = [
  {
    label: { id: 'MISI UMN', en: 'UMN MISSION' },
    title: { id: 'Pendidikan untuk masa depan bangsa.', en: "Education for the nation's future." },
    body: {
      id: 'Turut serta mencerdaskan kehidupan bangsa dan memajukan kesejahteraan bangsa melalui upaya penyelenggaraan pendidikan tinggi dengan melaksanakan Tridharma Perguruan Tinggi (Pendidikan, Penelitian dan Pengabdian pada Masyarakat), untuk meningkatkan kualitas sumber daya manusia Indonesia.',
      en: "Contributing to the nation's education and prosperity through higher education built on the Three Pillars of Higher Education (Teaching, Research, and Community Service) to raise the quality of Indonesia's human resources."
    },
    icon: GraduationCap,
    note: { id: 'Pendidikan · Penelitian · Pengabdian', en: 'Teaching · Research · Community Service' }
  },
  {
    label: { id: 'RUANG AKADEMIK', en: 'ACADEMIC SPACE' },
    title: { id: 'Rencana tertata. Langkah lebih terarah.', en: 'Organised plans. Clearer steps.' },
    body: {
      id: 'Mulai dari jadwal kuliah hingga hasil studi, temukan kebutuhan akademikmu dalam satu tempat. Susun rencana studi dan pantau setiap pencapaian sepanjang perjalanan perkuliahan.',
      en: 'From class schedules to grades, find everything you need for your studies in one place. Build your study plan and track every achievement along the way.'
    },
    icon: CalendarDays,
    note: { id: 'Jadwal · Rencana studi · Hasil akademik', en: 'Schedule · Study plan · Results' }
  },
  {
    label: { id: 'TUMBUH BERSAMA', en: 'GROW TOGETHER' },
    title: { id: 'Lebih dari sekadar ruang kelas.', en: 'More than a classroom.' },
    body: {
      id: 'Perluas pengalaman melalui kegiatan mahasiswa, bangun keterampilan baru, dan catat kontribusimu. Setiap pengalaman menjadi bagian berharga dari perjalanan menuju masa depan.',
      en: 'Broaden your experience through student activities, build new skills, and record your contributions. Every experience is a valuable part of your journey.'
    },
    icon: BookOpen,
    note: { id: 'Kegiatan · Pengalaman · Pencapaian', en: 'Activities · Experience · Achievements' }
  }
];

export default function Login({ onLogin }: { onLogin: (email: string) => void }) {
  const { tr, tx, lang } = usePrefs();
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const SlideIcon = current.icon;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const error = submitted ? validateLogin(email, password, lang) : null;
  const rules = [
    [password.length >= 8, tr('Minimal 8 karakter', 'At least 8 characters')],
    [/[A-Z]/.test(password), tr('Huruf kapital', 'Uppercase letter')],
    [/[a-z]/.test(password), tr('Huruf kecil', 'Lowercase letter')],
    [/[0-9]/.test(password), tr('Angka', 'Number')],
  ] as const;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!validateLogin(email, password)) onLogin(email.trim().toLowerCase());
  };
  return <main className="login-page">
    <div className="login-shell">
      <div className="login-prefs"><LanguageSwitch onDark/><ThemeToggle onDark/></div>
      <div className="login-masthead">
        <div className="university-brand"><span className="university-emblem"><GraduationCap size={25}/></span><div><p>Universitas Multimedia Nusantara</p><span>Excellent Career Begins With Excellent Education</span></div></div>
        <div className="login-brand"><img src="/myumn-mark.png" alt=""/><span>MyUMN<small>STUDENT PORTAL</small></span></div>
      </div>
      <div className="login-surface">
        <section className="login-story" aria-label={tr('Informasi kampus', 'Campus information')}>
          <div className="login-story-top"><span className="eyebrow">{tr('KENALI KAMPUSMU', 'GET TO KNOW YOUR CAMPUS')}</span><span className="slide-count">0{slide + 1} <span>/ 0{SLIDES.length}</span></span></div>
          <div className="login-story-content" aria-live="polite" aria-atomic="true">
            <div className="login-slide-icon"><SlideIcon size={26}/></div>
            <p className="login-slide-label">{tx(current.label)}</p>
            <h1>{tx(current.title)}</h1>
            <p className="login-slide-body">{tx(current.body)}</p>
            <p className="login-slide-note">{tx(current.note)}</p>
          </div>
          <div className="login-carousel-controls"><div className="login-dots">{SLIDES.map((item, index) => <button key={item.label.id} type="button" aria-label={`${tr('Lihat', 'Show')} ${tx(item.label)}`} aria-current={index === slide ? 'true' : undefined} onClick={() => setSlide(index)} className={index === slide ? 'active' : ''}/>)}</div><div className="flex gap-2"><button type="button" aria-label={tr('Informasi sebelumnya', 'Previous')} onClick={() => setSlide((slide + SLIDES.length - 1) % SLIDES.length)}><ChevronLeft size={18}/></button><button type="button" aria-label={tr('Informasi berikutnya', 'Next')} onClick={() => setSlide((slide + 1) % SLIDES.length)}><ChevronRight size={18}/></button></div></div>
          <div className="login-pattern" aria-hidden="true"><span/><span/><span/></div>
        </section>
        <section className="login-form-panel"><div className="login-form-wrap">
          <div className="login-welcome"><span/><p>{tr('AKSES PORTAL MAHASISWA', 'STUDENT PORTAL ACCESS')}</p></div>
          <h2>{tr('Selamat datang', 'Welcome')}<br/>{tr('kembali', 'back')}<span>.</span></h2><p className="login-subtitle">{tr('Masuk dan lanjutkan perjalanan akademikmu.', 'Sign in and continue your academic journey.')}</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <div><label htmlFor="login-email" className="login-label">{tr('Email mahasiswa', 'Student email')}</label><input id="login-email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={email} onChange={e => { setEmail(e.target.value); setSubmitted(false); }} placeholder={tr('nama@student.umn.ac.id', 'name@student.umn.ac.id')} className="login-input" aria-describedby={error ? 'login-error' : undefined}/></div>
        <div><label htmlFor="login-password" className="login-label">Password</label><div className="relative"><input id="login-password" type={visible ? 'text' : 'password'} autoComplete="current-password" required minLength={8} value={password} onChange={e => { setPassword(e.target.value); setSubmitted(false); }} placeholder={tr('Masukkan password', 'Enter your password')} className="login-input pr-12" aria-describedby="password-rules"/><button type="button" className="absolute right-3 top-3 text-slate-400 p-1" aria-label={visible ? tr('Sembunyikan password', 'Hide password') : tr('Tampilkan password', 'Show password')} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>
          <ul id="password-rules" className="grid grid-cols-2 gap-2 mt-3">{rules.map(([valid, label]) => <li key={label} className={`flex items-center gap-1.5 text-[11px] ${valid ? 'text-emerald-600' : 'text-slate-400'}`}><Check size={12}/>{label}</li>)}</ul>
        </div>
        {error && <p id="login-error" role="alert" className="rounded-lg bg-rose-50 px-3 py-2.5 text-xs leading-relaxed text-rose-700">{error}</p>}
        <button type="submit" className="login-submit">{tr('Masuk ke portal', 'Sign in to portal')} <ArrowRight size={17}/></button>
      </form><p className="login-account-note"><LockKeyhole size={13}/><span>{tr('Gunakan email', 'Use your')} <strong>@student.umn.ac.id</strong>{tr('', ' email')}</span></p>
        </div></section>
        <footer className="login-footer"><span>© {new Date().getFullYear()} Universitas Multimedia Nusantara</span><span>MyUMN <span className="footer-separator">/</span> {tr('Ruang untuk tumbuh.', 'Room to grow.')}</span></footer>
      </div>
      <p className="login-bottom-note">{tr('Satu portal. Semua langkah akademikmu.', 'One portal. Every step of your studies.')}</p>
    </div>
  </main>;
}
