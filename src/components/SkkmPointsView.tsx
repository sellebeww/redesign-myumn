import { useState } from "react";
import { Lightbulb, Palette, Users, Sprout, Plus, X, CheckCircle2, type LucideIcon } from "lucide-react";
import { useSavedState } from "../lib/storage";
import { formatDate } from "../lib/format";
import { usePrefs, type Bilingual } from "../lib/preferences";
import { SKKMEvent } from "../types";
import PageHeader from "./PageHeader";

interface SkkmPointsViewProps {
  initialEvents: SKKMEvent[];
  studentName: string;
  onTriggerToast: (msg: string) => void;
}

type Category = SKKMEvent["category"];

const TARGET_POINTS = 100;

const CATEGORIES: { id: Category; label: Bilingual; short: Bilingual; minimum: number; description: Bilingual; icon: LucideIcon; tone: string }[] = [
  { id: "Scientific and Reasoning", label: { id: "Penalaran dan Keilmuan", en: "Scientific Reasoning" }, short: { id: "Keilmuan", en: "Scientific" }, minimum: 15, description: { id: "Seminar, workshop teknologi, hackathon, dan pemrograman.", en: "Seminars, tech workshops, hackathons, and programming." }, icon: Lightbulb, tone: "#4c6ef5" },
  { id: "Talents and Interests", label: { id: "Minat dan Bakat", en: "Talents and Interests" }, short: { id: "Minat & Bakat", en: "Talents" }, minimum: 10, description: { id: "Fotografi, musik, esports, game, dan pameran desain.", en: "Photography, music, esports, games, and design shows." }, icon: Palette, tone: "#33947c" },
  { id: "Organization and Personality Development", label: { id: "Organisasi dan Kepribadian", en: "Organization and Personality" }, short: { id: "Organisasi", en: "Organization" }, minimum: 10, description: { id: "Kepanitiaan, kepemimpinan, HMIF, dan forum mahasiswa.", en: "Committees, leadership, HMIF, and student forums." }, icon: Users, tone: "#8761cf" },
  { id: "Community Development", label: { id: "Pengabdian Masyarakat", en: "Community Service" }, short: { id: "Pengabdian", en: "Community" }, minimum: 10, description: { id: "Pengabdian, relawan, kegiatan amal, dan kebersihan lingkungan.", en: "Community service, volunteering, charity, and clean-ups." }, icon: Sprout, tone: "#ee7543" }
];

const emptyForm = { activityName: "", category: CATEGORIES[0].id as Category, role: "", points: 10, date: "", certificateNumber: "" };

export default function SkkmPointsView({ initialEvents, studentName, onTriggerToast }: SkkmPointsViewProps) {
  const { tr, tx, lang } = usePrefs();
  const [skkmEvents, setSkkmEvents] = useSavedState<SKKMEvent[]>("myumn_skkm", initialEvents);
  const [showAddSkkm, setShowAddSkkm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [form, setForm] = useState(emptyForm);

  const statusLabel = (status: SKKMEvent["status"]) => (status === "Approved" ? tr("Disetujui", "Approved") : tr("Menunggu verifikasi", "Pending review"));
  const approved = skkmEvents.filter(e => e.status === "Approved");
  const approvedPoints = approved.reduce((sum, item) => sum + item.points, 0);
  const percent = Math.round((approvedPoints / TARGET_POINTS) * 100);
  const pointsOf = (category: Category) => approved.filter(e => e.category === category).reduce((sum, item) => sum + item.points, 0);
  const categoriesMet = CATEGORIES.filter(c => pointsOf(c.id) >= c.minimum).length;

  const filteredEvents = skkmEvents.filter(e =>
    (categoryFilter === "All" || e.category === categoryFilter) && (statusFilter === "All" || e.status === statusFilter)
  );

  const handleAddSkkm = (e: React.FormEvent) => {
    e.preventDefault();
    const points = Number(form.points);
    if (!form.activityName.trim() || !form.role.trim() || !Number.isFinite(points) || points <= 0 || points > 30) {
      onTriggerToast(tr("Isi nama kegiatan, peran, dan poin yang valid (1–30).", "Enter an activity name, role, and valid points (1–30)."));
      return;
    }
    const added: SKKMEvent = {
      id: `skkm-${Date.now()}`,
      activityName: form.activityName.trim(),
      category: form.category,
      role: form.role.trim(),
      points,
      date: form.date || new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }),
      status: "Pending",
      certificateNumber: form.certificateNumber.trim() || undefined
    };
    setSkkmEvents([added, ...skkmEvents]);
    setForm(emptyForm);
    setShowAddSkkm(false);
    onTriggerToast(tr("Kegiatan tersimpan sebagai menunggu verifikasi. Verifikasi resmi dilakukan melalui layanan kampus.", "Activity saved as pending. Official verification is done through campus services."));
  };

  const timeline = [
    { title: tr("Kepengurusan HMIF UMN", "HMIF UMN board member"), meta: tr("Semester 3–4 (aktif)", "Semesters 3–4 (active)"), body: tr("Bergabung di Divisi Humas HMIF UMN dan ikut mengoordinasi acara regional.", "Joined the HMIF UMN Public Relations division and helped coordinate regional events."), dot: "bg-umn-blue-600" },
    { title: tr("Juara 2 Infinite Hackathon", "2nd place, Infinite Hackathon"), meta: "Semester 3", body: tr("Mengembangkan konsep aplikasi pendamping belajar dalam kompetisi hackathon regional.", "Built a study companion app concept at a regional hackathon."), dot: "bg-emerald-500" },
    { title: tr("Pemain biola konser orkestra", "Orchestra concert violinist"), meta: "Semester 2", body: tr("Tampil sebagai pemain biola pertama pada konser ulang tahun UMN XI.", "Performed as first violinist at the UMN 11th anniversary concert."), dot: "bg-umn-orange-500" },
    { title: tr("Orientasi Mahasiswa Baru (OMB)", "New Student Orientation (OMB)"), meta: "Semester 1", body: tr("Menyelesaikan pembekalan karakter dan orientasi nilai 5C UMN.", "Completed character training and the UMN 5C values orientation."), dot: "bg-slate-400" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={tr("KEGIATAN MAHASISWA", "STUDENT ACTIVITIES")}
        title={tr("Poin SKKM", "SKKM Points")}
        description={tr(
          `Satuan Kredit Kegiatan Mahasiswa milik ${studentName}. Program Studi Informatika mensyaratkan minimal ${TARGET_POINTS} poin dari seluruh kategori sebagai syarat kelulusan.`,
          `Student activity credits (SKKM) for ${studentName}. The Informatics program requires at least ${TARGET_POINTS} points across all categories to graduate.`
        )}
      >
        {!showAddSkkm && (
          <button type="button" className="btn btn-primary" onClick={() => setShowAddSkkm(true)}>
            <Plus className="w-4 h-4" aria-hidden="true" /> {tr("Catat kegiatan", "Log activity")}
          </button>
        )}
      </PageHeader>

      <section className="welcome-card !min-h-0 !p-7">
        <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <span className="eyebrow !text-blue-200 block">{tr("POIN TERVERIFIKASI", "VERIFIED POINTS")}</span>
            <div className="font-display text-4xl font-bold mt-2 tracking-tight">
              {approvedPoints}<span className="text-base font-medium text-blue-200 ml-2 tracking-normal">/ {TARGET_POINTS} {tr("poin", "points")}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/15 overflow-hidden mt-4 max-w-xl" role="progressbar" aria-valuemin={0} aria-valuemax={TARGET_POINTS} aria-valuenow={Math.min(approvedPoints, TARGET_POINTS)} aria-label={tr("Progres poin SKKM", "SKKM point progress")}>
              <div className="h-full rounded-full bg-gradient-to-r from-umn-orange-500 to-amber-300 transition-all duration-700" style={{ width: `${Math.min(100, percent)}%` }} />
            </div>
            <p className="!text-xs !text-blue-100 !max-w-xl mt-3">
              {approvedPoints >= TARGET_POINTS
                ? tr("Target minimal SKKM untuk kelulusan sudah tercapai.", "The minimum SKKM target for graduation has been reached.")
                : tr(`Kurang ${TARGET_POINTS - approvedPoints} poin lagi untuk mencapai target kelulusan.`, `${TARGET_POINTS - approvedPoints} more points needed to reach the graduation target.`)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-5 text-center min-w-[160px]">
            <div className="font-display text-3xl font-bold text-amber-300">{percent}%</div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-blue-100 mt-1">{tr("Progres target", "Target progress")}</div>
            <div className="text-[11px] text-blue-100 mt-3">{tr(`${categoriesMet} dari ${CATEGORIES.length} kategori memenuhi minimum`, `${categoriesMet} of ${CATEGORIES.length} categories meet the minimum`)}</div>
          </div>
        </div>
      </section>

      <section aria-label={tr("Poin per kategori", "Points per category")} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {CATEGORIES.map(({ id, label, minimum, description, icon: Icon, tone }) => {
          const points = pointsOf(id);
          const met = points >= minimum;
          return (
            <article key={id} className="stat-card flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className="stat-icon" style={{ color: tone, background: `${tone}1f` }}><Icon size={19} aria-hidden="true" /></span>
                <span className="chip chip-gray">{tr("Minimum", "Minimum")} {minimum}</span>
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-slate-800 leading-snug">{tx(label)}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tx(description)}</p>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-end text-xs pb-1.5">
                  <span className="font-semibold text-slate-600">{points} {tr("poin", "points")}</span>
                  {met
                    ? <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />{tr("Terpenuhi", "Met")}</span>
                    : <span className="text-umn-orange-600 font-bold text-[11px]">{tr(`Kurang ${minimum - points}`, `${minimum - points} to go`)}</span>}
                </div>
                <div className="progress">
                  <span style={{ width: `${Math.min(100, (points / minimum) * 100)}%`, background: tone }} />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {showAddSkkm && (
        <form onSubmit={handleAddSkkm} className="panel space-y-5" aria-label={tr("Formulir kegiatan SKKM", "SKKM activity form")}>
          <div className="panel-head mb-0">
            <div>
              <h3 className="panel-title">{tr("Catat kegiatan baru", "Log a new activity")}</h3>
              <p className="panel-sub">{tr("Kegiatan tersimpan di browser ini dengan status menunggu verifikasi. Unggah dokumen belum tersedia.", "Activities are saved in this browser as pending review. Document upload is not available yet.")}</p>
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddSkkm(false)} aria-label={tr("Tutup formulir", "Close form")}>
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="skkm-name" className="field-label">{tr("Nama kegiatan", "Activity name")}</label>
              <input id="skkm-name" className="field" type="text" required placeholder={tr("Contoh: Seminar Keamanan Siber UMN", "e.g. UMN Cyber Security Seminar")} value={form.activityName} onChange={e => setForm({ ...form, activityName: e.target.value })} />
            </div>
            <div>
              <label htmlFor="skkm-role" className="field-label">{tr("Peran", "Role")}</label>
              <input id="skkm-role" className="field" type="text" required placeholder={tr("Peserta / Panitia / Juara", "Participant / Committee / Winner")} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label htmlFor="skkm-category" className="field-label">{tr("Kategori SKKM", "SKKM category")}</label>
              <select id="skkm-category" className="field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{tx(c.label)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="skkm-points" className="field-label">{tr("Poin diajukan", "Points claimed")}</label>
                <input id="skkm-points" className="field" type="number" required min={1} max={30} value={form.points} onChange={e => setForm({ ...form, points: Number(e.target.value) })} />
              </div>
              <div>
                <label htmlFor="skkm-date" className="field-label">{tr("Tanggal kegiatan", "Activity date")}</label>
                <input id="skkm-date" className="field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="skkm-cert" className="field-label">{tr("Nomor sertifikat (opsional)", "Certificate number (optional)")}</label>
              <input id="skkm-cert" className="field" type="text" placeholder={tr("Contoh: UMN-SEM-2026-0012", "e.g. UMN-SEM-2026-0012")} value={form.certificateNumber} onChange={e => setForm({ ...form, certificateNumber: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={() => setShowAddSkkm(false)}>{tr("Batal", "Cancel")}</button>
            <button type="submit" className="btn btn-primary">{tr("Simpan kegiatan", "Save activity")}</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <section className="panel lg:col-span-2">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">{tr("Riwayat kegiatan", "Activity history")}</h3>
              <p className="panel-sub">{tr(`${filteredEvents.length} kegiatan ditampilkan.`, `${filteredEvents.length} activities shown.`)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select aria-label={tr("Filter kategori", "Filter by category")} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="field w-auto py-1.5 text-xs min-h-0">
                <option value="All">{tr("Semua kategori", "All categories")}</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{tx(c.short)}</option>)}
              </select>
              <select aria-label={tr("Filter status", "Filter by status")} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="field w-auto py-1.5 text-xs min-h-0">
                <option value="All">{tr("Semua status", "All statuses")}</option>
                <option value="Approved">{statusLabel("Approved")}</option>
                <option value="Pending">{statusLabel("Pending")}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">{tr("Kegiatan", "Activity")}</th>
                  <th scope="col">{tr("Kategori", "Category")}</th>
                  <th scope="col" className="text-center">{tr("Poin", "Points")}</th>
                  <th scope="col" className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(ev => {
                    const category = CATEGORIES.find(c => c.id === ev.category);
                    return (
                      <tr key={ev.id}>
                        <td className="max-w-xs">
                          <p className="font-semibold text-slate-700 leading-snug">{tx(ev.activityName)}</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {formatDate(ev.date, lang)} · {tx(ev.role)}{ev.certificateNumber ? ` · No. ${ev.certificateNumber}` : ""}
                          </p>
                        </td>
                        <td><span className="chip chip-gray whitespace-nowrap">{category ? tx(category.short) : ev.category}</span></td>
                        <td className="text-center font-bold text-umn-blue-600">{ev.points}</td>
                        <td className="text-center">
                          <span className={`chip whitespace-nowrap ${ev.status === "Approved" ? "chip-green" : "chip-amber"}`}>{statusLabel(ev.status)}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4}><div className="empty-state border-0">{tr("Tidak ada kegiatan yang cocok dengan filter. Coba ubah pilihan filter.", "No activities match these filters. Try changing them.")}</div></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <h3 className="panel-title">{tr("Jejak kegiatan kampus", "Campus activity timeline")}</h3>
          <p className="panel-sub">{tr("Tonggak penting selama masa studi.", "Key milestones during your studies.")}</p>
          <ol className="relative border-l-2 border-slate-100 ml-1.5 pl-5 space-y-5 pt-5 text-xs">
            {timeline.map(item => (
              <li key={item.title} className="relative">
                <span className={`absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${item.dot}`} aria-hidden="true" />
                <p className="font-bold text-slate-700">{item.title}</p>
                <p className="text-[11px] text-umn-blue-600 font-medium mt-0.5">{item.meta}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="notice mt-6">{tr("Kegiatan di DKBM, BEM, bulu tangkis, sepak bola, atau teater dihitung sebagai poin organisasi.", "Activities in DKBM, the student executive board, badminton, football, or theatre count as organization points.")}</p>
        </section>
      </div>
    </div>
  );
}
