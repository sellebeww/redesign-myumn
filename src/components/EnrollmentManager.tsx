import { useState } from "react";
import { Printer, Download, Trash2, Briefcase, Check, Plus } from "lucide-react";
import { downloadCsv } from "../lib/download";
import { validateEnrollment } from "../lib/enrollment";
import { useSavedState } from "../lib/storage";
import { dayLabel, formatDate } from "../lib/format";
import { usePrefs, type Bilingual } from "../lib/preferences";
import { PreEnrollmentItem, Course } from "../types";
import { dummyPreEnrollment, dummyStudent, dummyExams } from "../data";
import PageHeader from "./PageHeader";

interface EnrollmentManagerViewProps {
  subViewId: string;
  shoppingCart: Course[];
  setShoppingCart: React.Dispatch<React.SetStateAction<Course[]>>;
  studentClasses: Course[];
  setStudentClasses: React.Dispatch<React.SetStateAction<Course[]>>;
  onTriggerToast: (msg: string) => void;
}

const MAX_SKS = 24;

const SECTIONS = ["A (Reguler)", "BL (Blended)", "C (Reguler)"];

const PHASES: { step: number; label: Bilingual; dates: Bilingual; status: Bilingual; desc: Bilingual }[] = [
  { step: 1, label: { id: "Minat Mata Kuliah", en: "Course Interest" }, dates: { id: "10 – 20 Juni 2026", en: "10 – 20 June 2026" }, status: { id: "Selesai", en: "Done" }, desc: { id: "Tandai mata kuliah pilihan agar kuota kelas dapat dihitung.", en: "Mark preferred electives so class quotas can be calculated." } },
  { step: 2, label: { id: "Perencanaan Keranjang KRS", en: "Cart Planning" }, dates: { id: "22 – 28 Juni 2026", en: "22 – 28 June 2026" }, status: { id: "Sedang dibuka", en: "Open now" }, desc: { id: "Susun draf seksi kelas dan selesaikan jadwal yang bentrok.", en: "Draft class sections and resolve schedule conflicts." } },
  { step: 3, label: { id: "Pengunci KRS Resmi", en: "Official Lock" }, dates: { id: "1 – 5 Juli 2026", en: "1 – 5 July 2026" }, status: { id: "Periode contoh", en: "Sample period" }, desc: { id: "Finalisasi kursi dan kirim rencana studi ke registrar.", en: "Finalize seats and send the study plan to the registrar." } },
  { step: 4, label: { id: "Persetujuan BAA dan Kaprodi", en: "BAA & Program Approval" }, dates: { id: "8 – 12 Juli 2026", en: "8 – 12 July 2026" }, status: { id: "Menunggu", en: "Waiting" }, desc: { id: "Verifikasi pembayaran dan penerbitan KSM.", en: "Payment verification and study card issuance." } }
];

const totalSks = (courses: Course[]) => courses.reduce((sum, c) => sum + c.sks, 0);

function Timeline({ activeStep }: { activeStep: number }) {
  const { tr, tx } = usePrefs();
  return (
    <section className="panel space-y-5" aria-label={tr("Linimasa pengisian KRS", "Enrollment timeline")}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="eyebrow">{tr("SEMESTER GENAP 2025/2026", "EVEN SEMESTER 2025/2026")}</p>
          <h3 className="panel-title mt-1">{tr("Linimasa pengisian KRS", "Enrollment timeline")}</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="subtle-card py-2 px-3.5">
            <span className="mini-label block">{tr("Persetujuan dosen PA", "Advisor approval")}</span>
            <span className="text-xs font-bold text-slate-700">{tr("Wajib", "Required")}</span>
          </div>
          <div className="subtle-card py-2 px-3.5">
            <span className="mini-label block">{tr("Batas beban studi", "Credit limit")}</span>
            <span className="text-xs font-bold text-emerald-600">{MAX_SKS} SKS ({tr("IPK", "GPA")} {dummyStudent.gpa})</span>
          </div>
        </div>
      </div>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PHASES.map(phase => {
          const isActive = phase.step === activeStep;
          const isDone = phase.step < activeStep;
          return (
            <li
              key={phase.step}
              aria-current={isActive ? "step" : undefined}
              className={`p-4 rounded-xl border transition-colors ${isActive ? "bg-umn-blue-50 border-umn-blue-200 ring-2 ring-umn-blue-100" : isDone ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200 opacity-70"}`}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className={`chip ${isActive ? "!bg-umn-blue-600 !text-white" : isDone ? "chip-green" : "chip-gray"}`}>{tr("Tahap", "Step")} 0{phase.step}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-umn-blue-600" : isDone ? "text-emerald-600" : "text-slate-400"}`}>{isDone ? tr("Selesai", "Done") : tx(phase.status)}</span>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-snug">{tx(phase.label)}</p>
              <p className="text-[11px] font-semibold text-umn-blue-600 mt-1">{tx(phase.dates)}</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tx(phase.desc)}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function EnrollmentManagerView({
  subViewId,
  shoppingCart,
  setShoppingCart,
  studentClasses,
  setStudentClasses,
  onTriggerToast
}: EnrollmentManagerViewProps) {
  const { tr, tx, lang } = usePrefs();
  const [preEnrollments, setPreEnrollments] = useSavedState<PreEnrollmentItem[]>("myumn_interests", dummyPreEnrollment);
  const [selectedDropIds, setSelectedDropIds] = useState<string[]>([]);
  const [swapSourceId, setSwapSourceId] = useState("");
  const [swapTargetGroup, setSwapTargetGroup] = useState(SECTIONS[1]);
  const eyebrow = tr("KRS & PENDAFTARAN", "ENROLLMENT");
  const examType = (type: string) => (type === "Midterm Exam" ? tr("UTS", "Midterm") : type === "Final Exam" ? tr("UAS", "Final") : type);

  const togglePreEnrollInterest = (id: string) => {
    const item = preEnrollments.find(c => c.id === id);
    if (!item) return;
    setPreEnrollments(prev => prev.map(c => (c.id === id ? { ...c, selected: !c.selected } : c)));
    onTriggerToast(item.selected
      ? tr(`Minat pada ${item.name} dibatalkan.`, `Interest in ${item.name} removed.`)
      : tr(`Minat pada ${item.name} tercatat.`, `Interest in ${item.name} recorded.`));
  };

  const handleAddCourseToCart = (course: PreEnrollmentItem) => {
    if ([...shoppingCart, ...studentClasses].some(c => c.code === course.code)) {
      onTriggerToast(tr("Mata kuliah ini sudah ada di rencana studi atau keranjang.", "This course is already in your study plan or cart."));
      return;
    }
    if (course.enrolledCount >= course.quota) { onTriggerToast(tr("Kelas sudah penuh.", "This class is full.")); return; }
    const times = course.schedule.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
    if (!times) { onTriggerToast(tr("Jadwal kelas belum tersedia.", "The class schedule is not available yet.")); return; }
    const draft: Course = {
      id: course.id,
      code: course.code,
      name: course.name,
      sks: course.sks,
      classSection: SECTIONS[0],
      lecturerName: course.lecturer,
      day: course.schedule.split(",")[0].trim(),
      startTime: times[1],
      endTime: times[2],
      room: "TBA",
      attendanceCount: 0,
      attendanceTotal: 14
    };
    setShoppingCart([...shoppingCart, draft]);
    onTriggerToast(tr(`${course.name} ditambahkan ke keranjang KRS.`, `${course.name} added to your enrollment cart.`));
  };

  const handleDropClasses = () => {
    if (selectedDropIds.length === 0) {
      onTriggerToast(tr("Pilih mata kuliah yang akan dibatalkan.", "Select the courses to drop."));
      return;
    }
    if (!window.confirm(tr(`Batalkan ${selectedDropIds.length} mata kuliah dari rencana studi?`, `Drop ${selectedDropIds.length} course(s) from your study plan?`))) return;
    setStudentClasses(prev => prev.filter(c => !selectedDropIds.includes(c.id)));
    setSelectedDropIds([]);
    onTriggerToast(tr("Rencana studi diperbarui. Pembatalan tercatat di browser ini.", "Study plan updated. The drop is saved in this browser."));
  };

  const handleSwapClass = () => {
    const source = studentClasses.find(c => c.id === swapSourceId);
    if (!source) { onTriggerToast(tr("Pilih mata kuliah yang seksinya akan ditukar.", "Choose the course whose section you want to swap.")); return; }
    if (source.classSection === swapTargetGroup) { onTriggerToast(tr("Seksi tujuan sama dengan seksi saat ini.", "That is already the current section.")); return; }
    setStudentClasses(prev => prev.map(c => (c.id === swapSourceId ? { ...c, classSection: swapTargetGroup } : c)));
    onTriggerToast(tr(`Seksi ${source.name} diubah ke ${swapTargetGroup}.`, `${source.name} moved to section ${swapTargetGroup}.`));
  };

  const handleSubmitCart = () => {
    const error = validateEnrollment(studentClasses, shoppingCart, lang);
    if (error) { onTriggerToast(error); return; }
    setStudentClasses(prev => [...prev, ...shoppingCart]);
    setShoppingCart([]);
    onTriggerToast(tr("Rencana studi disimpan. Jadwal telah diperbarui.", "Study plan saved. Your schedule has been updated."));
  };

  const handleInternshipSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    downloadCsv(tr("draft-pengajuan-magang.csv", "internship-request-draft.csv"), [
      [tr("Perusahaan", "Company"), tr("Posisi", "Position"), tr("Durasi (bulan)", "Duration (months)"), tr("Email HR", "HR email")],
      [data.get("company"), data.get("position"), data.get("duration"), data.get("hrEmail")]
    ]);
    onTriggerToast(tr("Draf magang diunduh. Kirim melalui layanan resmi kampus.", "Internship draft downloaded. Submit it through official campus services."));
  };

  const cartSks = totalSks(shoppingCart);
  const planSks = totalSks(studentClasses);
  const dropSks = totalSks(studentClasses.filter(c => selectedDropIds.includes(c.id)));

  return (
    <div className="space-y-6 animate-fade-in">
      {subViewId === "enrollment/pre-enrollment" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Survei Pra-KRS", "Pre-Enrollment Survey")} description={tr("Tandai mata kuliah pilihan yang kamu minati agar kuota seksi paralel dapat dihitung sebelum KRS dibuka.", "Mark the electives you are interested in so parallel section quotas can be calculated before enrollment opens.")}>
            <span className="chip chip-green">{tr(`${preEnrollments.filter(c => c.selected).length} mata kuliah diminati`, `${preEnrollments.filter(c => c.selected).length} courses marked`)}</span>
          </PageHeader>
          <Timeline activeStep={1} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <section className="panel xl:col-span-8 space-y-3">
              <div className="panel-head">
                <div>
                  <h3 className="panel-title">{tr("Mata kuliah pilihan semester depan", "Next semester's electives")}</h3>
                  <p className="panel-sub">{tr("Minat yang kamu tandai tersimpan di browser ini.", "Your choices are saved in this browser.")}</p>
                </div>
              </div>
              {preEnrollments.map(course => {
                const full = course.enrolledCount >= course.quota;
                const [day, ...time] = course.schedule.split(",");
                return (
                  <article key={course.id} className="subtle-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white transition-colors">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="code-tag">{course.code}</span>
                        <h4 className="text-[13px] font-bold text-slate-800">{course.name}</h4>
                        <span className="chip chip-gray">{course.sks} SKS</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{course.lecturer} · {dayLabel(day.trim(), lang)}, {time.join(",").trim()}</p>
                      <p className="text-[11px] text-slate-500">
                        {tr("Kuota", "Quota")}: <strong className={full ? "text-umn-orange-600" : "text-umn-blue-600"}>{course.enrolledCount} / {course.quota} {tr("mahasiswa", "students")}</strong>
                        {full && ` · ${tr("penuh", "full")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleAddCourseToCart(course)}>
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" /> {tr("Keranjang", "Cart")}
                      </button>
                      <button type="button" aria-pressed={!!course.selected} className={`btn btn-sm ${course.selected ? "btn-soft" : "btn-primary"}`} onClick={() => togglePreEnrollInterest(course.id)}>
                        {course.selected ? <><Check className="w-3.5 h-3.5" aria-hidden="true" /> {tr("Minat tercatat", "Interested")}</> : tr("Tandai minat", "Mark interest")}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="xl:col-span-4 rounded-2xl p-5 hero-gradient space-y-2">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest font-display">{tr("Catatan pengisian", "Enrollment note")}</h3>
              <p className="text-xs leading-relaxed text-blue-100">
                {tr("Minat yang ditandai hanya contoh alokasi kuota. Saat tahap 2 dibuka, pindahkan seksi prioritasmu ke ", "Marked interests are only sample quota allocations. When step 2 opens, move your priority sections to the ")}
                <strong className="text-white">{tr("Keranjang KRS", "Enrollment Cart")}</strong>
                {tr(" untuk menyusun rencana studi.", " to build your study plan.")}
              </p>
            </aside>
          </div>
        </>
      )}

      {subViewId === "enrollment/shopping-cart" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Keranjang KRS", "Enrollment Cart")} description={tr("Susun draf mata kuliah. Saat disimpan, sistem memeriksa duplikasi, bentrok jadwal, dan batas 24 SKS.", "Draft your courses. When you save, duplicates, schedule conflicts, and the 24 SKS limit are checked.")}>
            <span className="chip">{planSks + cartSks} / {MAX_SKS} SKS</span>
          </PageHeader>
          <Timeline activeStep={2} />

          <section className="panel">
            <div className="panel-head">
              <div>
                <h3 className="panel-title">{tr("Draf mata kuliah", "Draft courses")}</h3>
                <p className="panel-sub">{tr(`${shoppingCart.length} mata kuliah · ${cartSks} SKS dalam keranjang, ${planSks} SKS sudah terdaftar.`, `${shoppingCart.length} courses · ${cartSks} SKS in cart, ${planSks} SKS already enrolled.`)}</p>
              </div>
              <button type="button" className="btn btn-primary" disabled={shoppingCart.length === 0} onClick={handleSubmitCart}>
                {tr("Simpan rencana studi (KRS)", "Save study plan")}
              </button>
            </div>

            {shoppingCart.length > 0 ? (
              <div className="space-y-3">
                {shoppingCart.map(course => (
                  <article key={course.id} className="subtle-card flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-bold text-slate-800">{course.name}</span>
                        <span className="code-tag">{course.code}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{course.lecturerName} · {dayLabel(course.day, lang)}, {course.startTime} – {course.endTime}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-slate-600">{course.sks} SKS</span>
                      <button
                        type="button"
                        aria-label={tr(`Hapus ${course.name} dari keranjang`, `Remove ${course.name} from cart`)}
                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                        onClick={() => { setShoppingCart(prev => prev.filter(c => c.id !== course.id)); onTriggerToast(tr("Dihapus dari keranjang KRS.", "Removed from the enrollment cart.")); }}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">{tr("Keranjang KRS masih kosong. Tambahkan mata kuliah dari halaman Survei Pra-KRS.", "Your cart is empty. Add courses from the Pre-Enrollment Survey page.")}</div>
            )}
          </section>
        </>
      )}

      {subViewId === "enrollment/swap-classes" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Tukar Seksi Kelas", "Swap Class Section")} description={tr("Ubah label seksi pada rencana studi. Ketersediaan seksi dan jadwal perlu dikonfirmasi melalui kampus.", "Change a section in your study plan. Section availability and times must be confirmed with the campus.")} />
          <section className="panel grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {studentClasses.length === 0 ? (
                <div className="empty-state">{tr("Belum ada mata kuliah pada rencana studi.", "No courses in your study plan yet.")}</div>
              ) : (
                <>
                  <div>
                    <label htmlFor="swap-source" className="field-label">{tr("Mata kuliah", "Course")}</label>
                    <select id="swap-source" className="field" value={swapSourceId} onChange={e => setSwapSourceId(e.target.value)}>
                      <option value="">{tr("Pilih mata kuliah", "Choose a course")}</option>
                      {studentClasses.map(c => <option key={c.id} value={c.id}>{c.name} ({tr("seksi", "section")} {c.classSection})</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="swap-target" className="field-label">{tr("Pindah ke seksi", "Move to section")}</label>
                    <select id="swap-target" className="field" value={swapTargetGroup} onChange={e => setSwapTargetGroup(e.target.value)}>
                      <option value="A (Reguler)">A (Reguler) – {tr("Pagi", "Morning")}</option>
                      <option value="BL (Blended)">BL (Blended) – Hybrid</option>
                      <option value="C (Reguler)">C (Reguler) – {tr("Siang", "Afternoon")}</option>
                    </select>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleSwapClass}>{tr("Tukar seksi", "Swap section")}</button>
                </>
              )}
            </div>
            <div className="subtle-card text-xs text-slate-500 space-y-2 leading-relaxed self-start">
              <p className="font-bold text-slate-700">{tr("Ketentuan", "Rules")}</p>
              <p>• {tr("Pilihan seksi di sini belum terhubung dengan kuota kampus.", "Section choices here are not yet linked to campus quotas.")}</p>
              <p>• {tr("Pergantian seksi tidak mengubah jam perkuliahan pada jadwal.", "Swapping sections does not change class times in your schedule.")}</p>
            </div>
          </section>
        </>
      )}

      {subViewId === "enrollment/drop-classes" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Batal Mata Kuliah", "Drop Courses")} description={tr("Pilih mata kuliah yang ingin dibatalkan dari rencana studi semester berjalan.", "Select courses to remove from this semester's study plan.")}>
            <span className="chip chip-gray">{planSks} {tr("SKS terdaftar", "SKS enrolled")}</span>
          </PageHeader>
          <section className="panel space-y-4">
            {studentClasses.length === 0 ? (
              <div className="empty-state">{tr("Tidak ada mata kuliah pada rencana studi.", "There are no courses in your study plan.")}</div>
            ) : (
              <fieldset className="space-y-3">
                <legend className="sr-only">{tr("Mata kuliah yang akan dibatalkan", "Courses to drop")}</legend>
                {studentClasses.map(item => {
                  const checked = selectedDropIds.includes(item.id);
                  return (
                    <label key={item.id} className={`subtle-card flex justify-between items-center gap-4 cursor-pointer transition-colors ${checked ? "!bg-rose-50 !border-rose-200" : "hover:bg-white"}`}>
                      <span className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => setSelectedDropIds(e.target.checked ? [...selectedDropIds, item.id] : selectedDropIds.filter(id => id !== item.id))}
                          className="w-4 h-4 rounded accent-umn-blue-600 !min-h-0"
                        />
                        <span>
                          <span className="block text-[13px] font-bold text-slate-800">{item.name}</span>
                          <span className="block text-[11px] text-slate-500 mt-0.5">{item.code} · {tr("Seksi", "Section")} {item.classSection} · {item.sks} SKS</span>
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-400 hidden sm:block text-right">{item.lecturerName}</span>
                    </label>
                  );
                })}
              </fieldset>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500">{selectedDropIds.length > 0 ? tr(`${selectedDropIds.length} mata kuliah (${dropSks} SKS) dipilih.`, `${selectedDropIds.length} course(s) (${dropSks} SKS) selected.`) : tr("Belum ada mata kuliah dipilih.", "No courses selected.")}</p>
              <button type="button" className="btn btn-danger" disabled={selectedDropIds.length === 0} onClick={handleDropClasses}>{tr("Batalkan mata kuliah terpilih", "Drop selected courses")}</button>
            </div>
          </section>
        </>
      )}

      {subViewId === "enrollment/my-exam" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Jadwal Ujian", "Exam Schedule")} description={tr("Jadwal ujian beserta gedung, ruang, dan nomor kursi yang ditetapkan.", "Exam schedule with buildings, rooms, and assigned seat numbers.")}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => downloadCsv(tr("jadwal-ujian.csv", "exam-schedule.csv"), [[tr("Mata kuliah", "Course"), tr("Ujian", "Exam"), tr("Tanggal", "Date"), tr("Waktu", "Time"), tr("Ruang", "Room"), tr("Kursi", "Seat")], ...dummyExams.map(e => [e.courseName, examType(e.examType), e.date, e.time, tx(e.room), e.seatNumber])])}
            >
              <Download className="w-4 h-4" aria-hidden="true" /> {tr("Unduh jadwal (CSV)", "Download schedule (CSV)")}
            </button>
          </PageHeader>
          <section className="panel space-y-3">
            {dummyExams.map(exam => (
              <article key={exam.id} className="subtle-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white transition-colors">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="chip chip-amber">{examType(exam.examType)}</span>
                    <h4 className="text-[13px] font-bold text-slate-800">{exam.courseName}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">{formatDate(exam.date, lang)} · {exam.time} WIB</p>
                </div>
                <div className="flex items-center gap-8 text-xs">
                  <div>
                    <span className="mini-label block">{tr("Ruang", "Room")}</span>
                    <span className="font-bold text-slate-700">{tx(exam.room)}</span>
                  </div>
                  <div>
                    <span className="mini-label block">{tr("Kursi", "Seat")}</span>
                    <span className="font-bold text-umn-blue-600">{exam.seatNumber}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {subViewId === "enrollment/dates" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Tanggal Penting KRS", "Key Enrollment Dates")} description={tr("Rangkaian tenggat pengisian rencana studi dan jadwal ujian akhir semester.", "Deadlines for study plan registration and the final exam period.")} />
          <section className="panel space-y-3">
            {[
              { title: tr("Heregistrasi dan pelunasan SPP pokok", "Re-registration and base tuition payment"), note: tr("Wajib diselesaikan sebelum pengisian KRS", "Must be completed before enrollment"), date: tr("10 – 15 Januari 2026", "10 – 15 January 2026"), chip: tr("Selesai", "Done"), tone: "chip-green" },
              { title: tr("Penambahan mata kuliah mandiri (masa KRS)", "Self-service course registration"), note: tr("Dibuka untuk mahasiswa dengan IPK ≥ 3,00", "Open to students with GPA ≥ 3.00"), date: tr("22 – 29 Januari 2026", "22 – 29 January 2026"), chip: tr("Selesai", "Done"), tone: "chip-green" },
              { title: tr("Ujian Akhir Semester (UAS)", "Final exams (UAS)"), note: tr("Pastikan kehadiran minimum 75% terpenuhi", "Make sure you meet the 75% attendance minimum"), date: tr("15 – 26 Juni 2026", "15 – 26 June 2026"), chip: tr("Akan datang", "Upcoming"), tone: "" }
            ].map(item => (
              <article key={item.title} className="subtle-card flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-[13px] font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.note}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-slate-700">{item.date}</span>
                  <span className={`chip ${item.tone}`}>{item.chip}</span>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {subViewId === "enrollment/internship" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Magang Industri", "Industry Internship")} description={tr("Siapkan draf pengajuan surat pengantar magang industri selama 6 bulan. Draf diunduh sebagai CSV untuk dikirim melalui layanan resmi kampus.", "Prepare a draft request for a 6-month internship cover letter. The draft downloads as CSV to submit through official campus services.")} />
          <section className="panel">
            <div className="panel-head">
              <div className="flex items-center gap-3">
                <span className="stat-icon blue"><Briefcase size={19} aria-hidden="true" /></span>
                <div>
                  <h3 className="panel-title">{tr("Formulir pengajuan surat pengantar", "Cover letter request form")}</h3>
                  <p className="panel-sub">{tr("Isi data perusahaan tujuan magang.", "Fill in the details of the host company.")}</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleInternshipSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="internship-company" className="field-label">{tr("Perusahaan tujuan", "Company")}</label>
                <input id="internship-company" name="company" required type="text" placeholder={tr("Contoh: PT Tokopedia Indonesia", "e.g. PT Tokopedia Indonesia")} className="field" />
              </div>
              <div>
                <label htmlFor="internship-position" className="field-label">{tr("Posisi yang dilamar", "Position")}</label>
                <input id="internship-position" name="position" required type="text" placeholder={tr("Contoh: Frontend Engineer", "e.g. Frontend Engineer")} className="field" />
              </div>
              <div>
                <label htmlFor="internship-duration" className="field-label">{tr("Durasi (bulan)", "Duration (months)")}</label>
                <input id="internship-duration" name="duration" required type="number" min="1" max="12" defaultValue="6" className="field" />
              </div>
              <div>
                <label htmlFor="internship-email" className="field-label">{tr("Email HR / pembimbing lapangan", "HR / supervisor email")}</label>
                <input id="internship-email" name="hrEmail" required type="email" placeholder={tr("hr@perusahaan.com", "hr@company.com")} className="field" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button type="submit" className="btn btn-primary"><Download className="w-4 h-4" aria-hidden="true" /> {tr("Unduh draf pengajuan (CSV)", "Download request draft (CSV)")}</button>
              </div>
            </form>
          </section>
        </>
      )}

      {subViewId === "enrollment/confirmation" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Konfirmasi KSM", "Study Card (KSM)")} description={tr("Tinjau Kartu Studi Mahasiswa semester berjalan sebelum dicetak. Dokumen ini bukan dokumen resmi universitas.", "Review this semester's student study card before printing. This is not an official university document.")}>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              <Printer className="w-4 h-4" aria-hidden="true" /> {tr("Cetak KSM", "Print card")}
            </button>
          </PageHeader>

          <section className="panel max-w-3xl mx-auto w-full space-y-5">
            <div className="text-center space-y-1">
              <h3 className="font-display font-extrabold text-slate-800 tracking-tight">UNIVERSITAS MULTIMEDIA NUSANTARA</h3>
              <p className="text-[11px] tracking-[.18em] text-slate-400 font-semibold">{tr("KARTU STUDI MAHASISWA", "STUDENT STUDY CARD")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-y border-slate-200 py-3 text-xs">
              <p><span className="text-slate-400">{tr("Nama", "Name")}</span><br /><strong className="text-slate-800">{dummyStudent.name}</strong></p>
              <p><span className="text-slate-400">NIM</span><br /><strong className="text-slate-800">{dummyStudent.nim}</strong></p>
              <p><span className="text-slate-400">Semester</span><br /><strong className="text-slate-800">{dummyStudent.semester} · {tx(dummyStudent.major)}</strong></p>
            </div>
            {studentClasses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">{tr("Kode", "Code")}</th>
                      <th scope="col">{tr("Mata kuliah", "Course")}</th>
                      <th scope="col">{tr("Seksi", "Section")}</th>
                      <th scope="col" className="text-right">SKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentClasses.map(c => (
                      <tr key={c.id}>
                        <td className="text-slate-500">{c.code}</td>
                        <td className="font-semibold text-slate-700">{c.name}</td>
                        <td className="text-slate-500">{c.classSection}</td>
                        <td className="text-right text-slate-700">{c.sks}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="text-right font-bold text-slate-700">{tr("Total SKS", "Total SKS")}</td>
                      <td className="text-right font-bold text-umn-blue-600">{planSks}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">{tr("Belum ada mata kuliah pada rencana studi.", "No courses in your study plan yet.")}</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
