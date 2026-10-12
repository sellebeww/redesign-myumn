import { ArrowUpRight, ArrowRight, BookOpen, CalendarDays, GraduationCap, Award, Clock3, MapPin, Megaphone, ChevronRight, type LucideIcon } from 'lucide-react';
import { dummyStudent, dummyAnnouncementList, dummySkkmEvents } from '../data';
import type { Course } from '../types';
import { readSaved } from '../lib/storage';
import { formatDate } from '../lib/format';
import { usePrefs } from '../lib/preferences';

export default function Dashboard({ courses, navigate }: { courses: Course[]; navigate: (id: string) => void }) {
  const { tr, tx, lang, locale } = usePrefs();
  const today = new Date();
  const day = today.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Jakarta' });
  const todaysCourses = courses.filter(c => c.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
  const credits = courses.reduce((s,c) => s+c.sks,0);
  const events = readSaved('myumn_skkm', dummySkkmEvents);
  const points = events.filter(e=>e.status === 'Approved').reduce((s,e)=>s+e.points,0);
  const stats = [
    { label: tr('Indeks prestasi kumulatif', 'Cumulative GPA'), value: dummyStudent.gpa, suffix: '/ 4.00', note: tr('Capaian akademik', 'Academic achievement'), icon: GraduationCap, color: 'blue' },
    { label: tr('Beban studi aktif', 'Current study load'), value: credits, suffix: 'SKS', note: tr(`${courses.length} mata kuliah terdaftar`, `${courses.length} courses enrolled`), icon: BookOpen, color: 'purple' },
    { label: tr('SKS diselesaikan', 'Credits completed'), value: dummyStudent.totalSks, suffix: '/ 144', note: tr('Selangkah lebih dekat ke wisuda', 'One step closer to graduation'), icon: CalendarDays, color: 'orange' },
    { label: tr('Poin kegiatan', 'Activity points'), value: points, suffix: 'SKKM', note: points >= 100 ? tr('Target 100 poin tercapai', '100-point target reached') : tr(`${100-points} poin menuju target`, `${100-points} points to target`), icon: Award, color: 'green' },
  ];
  const quickLinks: [string, string, string, LucideIcon][] = [
    ['enrollment/shopping-cart', tr('Rencana studi', 'Study plan'), tr('Susun mata kuliah semester depan', "Plan next semester's courses"), BookOpen],
    ['student-information/grades', tr('Hasil studi', 'Grades'), tr('Lihat nilai dan perkembanganmu', 'See your grades and progress'), GraduationCap],
    ['student-information/finance', tr('Keuangan', 'Finance'), tr('Rincian tagihan dan pembayaran', 'Bills and payment details'), CalendarDays],
    ['enrollment/skkm-points', tr('Kegiatan mahasiswa', 'Student activities'), tr('Catat pengalaman di luar kelas', 'Log experiences outside class'), Award]
  ];
  return <div className="dashboard space-y-6 animate-fade-in">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="eyebrow">{tr('RUANG AKADEMIK KAMU', 'YOUR ACADEMIC SPACE')}</p><h2 className="page-title text-3xl">Dashboard</h2></div>
      <div className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={16}/>{today.toLocaleDateString(locale,{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'})}</div>
    </div>
    <section className="welcome-card">
      <div className="relative z-10 max-w-xl"><span className="term-pill"><span/> Semester {dummyStudent.semester} · {tx(dummyStudent.major)}</span>
        <h3>{tr('Halo', 'Hello')}, {dummyStudent.name.split(' ')[0]}<span className="text-amber-300">.</span><br/>{tr('Siap untuk langkah berikutnya?', 'Ready for your next step?')}</h3>
        <p>{tr('Jadwal, rencana studi, dan pencapaianmu. Semua yang kamu perlukan untuk menjalani hari perkuliahan ada di sini.', 'Your schedule, study plan, and achievements. Everything you need for your day on campus is right here.')}</p>
        <button className="hero-button" onClick={()=>navigate('enrollment/weekly-schedule')}>{tr('Lihat jadwal kuliah', 'View class schedule')} <ArrowUpRight size={17}/></button>
      </div>
      <div className="welcome-art" aria-hidden="true"><div className="orb orb-one"/><div className="orb orb-two"/><div className="art-book"><img src="/myumn-mark.png" alt=""/><span>{tr('BAB BERIKUTNYA', 'YOUR NEXT CHAPTER')}</span></div></div>
    </section>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">{stats.map(({label,value,suffix,note,icon:Icon,color})=><div className="stat-card" key={color}><div className={`stat-icon ${color}`}><Icon size={19}/></div><p className="text-xs text-slate-500 mt-4">{label}</p><p className="text-3xl font-display font-bold mt-1 text-slate-800">{value}<span className="text-xs text-slate-400 font-sans font-medium ml-2">{suffix}</span></p><p className="text-[11px] text-slate-500 mt-2">{note}</p></div>)}</div>
    <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-6">
      <section className="portal-card"><div className="section-heading"><div><span className="eyebrow">{tr('AGENDA KULIAH', 'CLASS AGENDA')}</span><h3>{tr('Jadwal hari ini', "Today's schedule")}</h3></div><button aria-label={tr('Lihat semua jadwal', 'View full schedule')} onClick={()=>navigate('enrollment/weekly-schedule')} className="icon-link"><ArrowUpRight size={20}/></button></div>
        {todaysCourses.length ? <div className="divide-y divide-slate-100">{todaysCourses.map((c,i)=><div key={c.id} className="schedule-row"><div className="time-column"><strong>{c.startTime}</strong><span>{c.endTime}</span></div><div className={`schedule-line line-${i%3}`}/><div className="min-w-0 flex-1"><p className="text-[10px] font-bold tracking-wider text-umn-blue-600">{c.code} · {c.classSection}</p><h4 className="font-semibold text-sm my-1 text-slate-800">{c.name}</h4><p className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={12}/>{c.room}<span className="mx-1">·</span>{c.sks} SKS</p></div><Clock3 size={17} className="text-slate-300"/></div>)}</div>:<div className="py-10 text-center"><CalendarDays className="mx-auto text-umn-blue-500 mb-3" size={32}/><p className="font-semibold text-sm text-slate-800">{tr('Tidak ada kuliah hari ini', 'No classes today')}</p><p className="text-xs text-slate-500 mt-2">{tr('Waktu yang tepat untuk merencanakan minggu berikutnya.', 'A good time to plan next week.')}</p></div>}
        <button className="card-footer-link" onClick={()=>navigate('enrollment/weekly-schedule')}>{tr('Buka jadwal mingguan', 'Open weekly schedule')} <ArrowRight size={15}/></button>
      </section>
      <section className="portal-card"><div className="section-heading"><div><span className="eyebrow">{tr('LEBIH MUDAH, LEBIH CEPAT', 'EASIER, FASTER')}</span><h3>{tr('Akses cepat', 'Quick access')}</h3></div></div><div className="space-y-2">{quickLinks.map(([id,title,desc,Icon])=><button className="quick-row" key={id} onClick={()=>navigate(id)}><span className="quick-icon"><Icon size={18}/></span><span className="flex-1 text-left"><strong>{title}</strong><small>{desc}</small></span><ChevronRight size={15} className="text-slate-400"/></button>)}</div></section>
    </div>
    <section className="portal-card"><div className="section-heading"><div><span className="eyebrow">{tr('KABAR DARI KAMPUS', 'CAMPUS NEWS')}</span><h3>{tr('Pengumuman', 'Announcements')}</h3></div><Megaphone size={20} className="text-slate-400"/></div><div className="grid md:grid-cols-3 gap-4">{dummyAnnouncementList.map(a=><article className="announcement-card" key={a.id}><span className={a.isImportant?'announcement-tag important':'announcement-tag'}>{tx(a.category)}</span><h4>{tx(a.title)}</h4><p>{tx(a.content)}</p><time dateTime={a.date}>{formatDate(a.date, lang)}</time></article>)}</div></section>
    <footer className="text-xs text-slate-400 flex flex-wrap justify-between gap-2 py-2"><span>MyUMN · {tr('Ruang untuk tumbuh.', 'Room to grow.')}</span><span>{tr('Perubahan tersimpan di perangkat ini', 'Changes are saved on this device')}</span></footer>
  </div>;
}
