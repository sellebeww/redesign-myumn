import { useState } from "react";
import { Clock, CreditCard, ChevronDown, Phone, MessageSquare, Check, Copy, AlertTriangle, CheckCircle2 } from "lucide-react";
import { dummyFinanceItems, dummyStudent } from "../data";
import { formatDate, formatRupiah } from "../lib/format";
import { usePrefs, type Bilingual } from "../lib/preferences";
import { Course } from "../types";
import PageHeader from "./PageHeader";

interface PerformanceDashboardProps {
  subViewId: string;
  studentClasses: Course[];
  onTriggerToast: (msg: string) => void;
}

const ACTIVE_SEMESTER = 4;

interface BankChannel {
  id: string;
  name: string;
  product: Bilingual;
  branch: Bilingual;
  tone: string;
  accounts: { label: Bilingual; prefix: string }[];
  recipient: string;
  guideTitle: Bilingual;
  steps: Bilingual[];
}

const BANKS: BankChannel[] = [
  {
    id: "bca",
    name: "BCA",
    product: { id: "Virtual Account", en: "Virtual Account" },
    branch: { id: "Cabang Gading Serpong", en: "Gading Serpong branch" },
    tone: "#3b74d9",
    accounts: [{ label: { id: "VA biaya kuliah", en: "Tuition VA" }, prefix: "278890" }],
    recipient: `UMN – ${dummyStudent.name}`,
    guideTitle: { id: "Panduan pembayaran m-BCA", en: "How to pay with m-BCA" },
    steps: [
      { id: "Buka aplikasi m-BCA, lalu masukkan PIN akses.", en: "Open the m-BCA app and enter your access PIN." },
      { id: "Pilih m-Transfer → BCA Virtual Account.", en: "Choose m-Transfer → BCA Virtual Account." },
      { id: "Masukkan nomor VA (278890 + NIM).", en: "Enter the VA number (278890 + student ID)." },
      { id: "Pastikan nama tagihan tertulis UMN – nama kamu.", en: "Check that the bill name reads UMN – your name." },
      { id: "Masukkan PIN transaksi untuk menyelesaikan pembayaran.", en: "Enter your transaction PIN to complete the payment." }
    ]
  },
  {
    id: "cimb",
    name: "CIMB NIAGA",
    product: { id: "Transfer rekening", en: "Bank transfer" },
    branch: { id: "Cabang Wahid Hasyim Jakarta", en: "Wahid Hasyim branch, Jakarta" },
    tone: "#d6404f",
    accounts: [
      { label: { id: "Rekening biaya kuliah", en: "Tuition account" }, prefix: "78890" },
      { label: { id: "Rekening asrama", en: "Dormitory account" }, prefix: "78891" }
    ],
    recipient: "Yayasan Multimedia Nusantara",
    guideTitle: { id: "Panduan transfer CIMB", en: "How to transfer via CIMB" },
    steps: [
      { id: "Gunakan aplikasi OCTO Mobile, CIMB Clicks, atau ATM bank lain.", en: "Use OCTO Mobile, CIMB Clicks, or another bank's ATM." },
      { id: "Pilih Transfer ke Bank Lain (kode CIMB 022).", en: "Choose Transfer to Other Bank (CIMB code 022)." },
      { id: "Masukkan nomor rekening sesuai keperluan.", en: "Enter the account number for the payment type." },
      { id: "Isi nominal sesuai sisa tagihan.", en: "Enter the outstanding amount." },
      { id: "Pastikan nama penerima Yayasan Multimedia Nusantara.", en: "Check that the recipient is Yayasan Multimedia Nusantara." }
    ]
  },
  {
    id: "bri",
    name: "BANK BRI",
    product: { id: "Kode BRIVA", en: "BRIVA code" },
    branch: { id: "Cabang Jakarta Kota", en: "Jakarta Kota branch" },
    tone: "#ee7543",
    accounts: [
      { label: { id: "BRIVA biaya kuliah", en: "Tuition BRIVA" }, prefix: "02400" },
      { label: { id: "BRIVA asrama", en: "Dormitory BRIVA" }, prefix: "02401" }
    ],
    recipient: "Yayasan Multimedia Nusantara",
    guideTitle: { id: "Panduan pembayaran BRIVA", en: "How to pay with BRIVA" },
    steps: [
      { id: "Masuk ke aplikasi BRImo atau gunakan ATM BRI.", en: "Open the BRImo app or use a BRI ATM." },
      { id: "Pilih menu Pembayaran → BRIVA.", en: "Choose Payment → BRIVA." },
      { id: "Masukkan nomor BRIVA.", en: "Enter the BRIVA number." },
      { id: "Pastikan nominal sesuai tagihan dan nama penerima Yayasan Multimedia Nusantara.", en: "Check the amount and that the recipient is Yayasan Multimedia Nusantara." },
      { id: "Selesaikan transaksi dengan PIN.", en: "Complete the transaction with your PIN." }
    ]
  }
];

const REQUIREMENTS: { label: Bilingual; done: number; total: number }[] = [
  { label: { id: "SKS wajib universitas", en: "University core credits" }, done: 24, total: 24 },
  { label: { id: "Mata kuliah inti Informatika", en: "Informatics major courses" }, done: 58, total: 106 },
  { label: { id: "Magang dan skripsi", en: "Internship and thesis" }, done: 0, total: 14 }
];

const attendanceRatio = (c: Course) => (c.attendanceTotal > 0 ? Math.round((c.attendanceCount / c.attendanceTotal) * 100) : 100);

export default function PerformanceDashboard({ subViewId, studentClasses, onTriggerToast }: PerformanceDashboardProps) {
  const { tr, tx, lang } = usePrefs();
  const [selectedSemester, setSelectedSemester] = useState<string>(String(ACTIVE_SEMESTER));
  const [openBank, setOpenBank] = useState<string | null>(null);

  const activeItems = dummyFinanceItems.filter(item => item.semester === ACTIVE_SEMESTER);
  const activePaid = activeItems.filter(item => item.status === "Paid");
  const activeUnpaid = activeItems.filter(item => item.status === "Unpaid");
  const sum = (items: typeof activeItems) => items.reduce((acc, item) => acc + item.amount, 0);
  const filteredFinanceItems = dummyFinanceItems.filter(item => selectedSemester === "all" || String(item.semester) === selectedSemester);

  const semesterTabs = [
    { id: "all", label: tr("Semua tagihan", "All bills") },
    { id: "4", label: tr("Semester 4 (aktif)", "Semester 4 (current)") },
    { id: "3", label: "Semester 3" },
    { id: "2", label: "Semester 2" },
    { id: "1", label: "Semester 1" }
  ];

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onTriggerToast(tr(`Berhasil menyalin ${label}.`, `Copied ${label}.`));
    } catch {
      onTriggerToast(tr("Akses clipboard tidak tersedia. Salin nomor secara manual.", "Clipboard access is unavailable. Copy the number manually."));
    }
  };

  const gradedClasses = studentClasses.filter(c => c.grades);
  const totalRequirement = REQUIREMENTS.reduce((acc, r) => acc + r.total, 0);
  const doneRequirement = REQUIREMENTS.reduce((acc, r) => acc + r.done, 0);
  const noCourses = <div className="empty-state">{tr("Belum ada mata kuliah pada rencana studi.", "No courses in your study plan yet.")}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {subViewId === "student-information/finance" && (
        <>
          <PageHeader eyebrow={tr("INFORMASI MAHASISWA", "STUDENT INFORMATION")} title={tr("Status Keuangan", "Finance Status")} description={tr("Pantau tagihan biaya kuliah tetap dan SKS variabel, status pembayaran, serta panduan pembayaran bank.", "Track fixed tuition and variable credit fees, payment status, and bank payment guides.")}>
            <span className="mini-label">Semester {ACTIVE_SEMESTER}</span>
            {activeUnpaid.length > 0 ? <span className="chip chip-amber">{tr("Belum lunas", "Outstanding")}</span> : <span className="chip chip-green">{tr("Lunas", "Paid")}</span>}
          </PageHeader>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat-card">
              <div className="stat-icon blue"><Clock size={19} aria-hidden="true" /></div>
              <p className="text-xs text-slate-500 mt-4">{tr(`Total tagihan (semester ${ACTIVE_SEMESTER})`, `Total billed (semester ${ACTIVE_SEMESTER})`)}</p>
              <p className="text-2xl font-display font-bold mt-1 text-slate-800">{formatRupiah(sum(activeItems))}</p>
              <p className="text-[11px] text-slate-500 mt-2">{tr(`${activeItems.length} komponen tagihan`, `${activeItems.length} bill items`)}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><CheckCircle2 size={19} aria-hidden="true" /></div>
              <p className="text-xs text-slate-500 mt-4">{tr("Sudah dibayar", "Paid")}</p>
              <p className="text-2xl font-display font-bold mt-1 text-emerald-700">{formatRupiah(sum(activePaid))}</p>
              <p className="text-[11px] text-slate-500 mt-2">{tr(`${activePaid.length} komponen lunas`, `${activePaid.length} items paid`)}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><AlertTriangle size={19} aria-hidden="true" /></div>
              <p className="text-xs text-slate-500 mt-4">{tr("Sisa tagihan", "Outstanding")}</p>
              <p className="text-2xl font-display font-bold mt-1 text-umn-orange-600">{formatRupiah(sum(activeUnpaid))}</p>
              <p className="text-[11px] text-slate-500 mt-2">{tr(`${activeUnpaid.length} tagihan menunggu`, `${activeUnpaid.length} bills pending`)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="panel lg:col-span-7 space-y-4">
              <div className="panel-head mb-0">
                <div>
                  <h3 className="panel-title">{tr("Rincian tagihan", "Bill details")}</h3>
                  <p className="panel-sub">{selectedSemester === "all" ? tr("Seluruh semester", "All semesters") : `Semester ${selectedSemester}`} · {filteredFinanceItems.length} {tr("tagihan", "bills")}</p>
                </div>
              </div>

              <div className="tabs" role="group" aria-label={tr("Filter semester", "Filter by semester")}>
                {semesterTabs.map(tab => (
                  <button key={tab.id} type="button" className="tab" aria-pressed={selectedSemester === tab.id} onClick={() => setSelectedSemester(tab.id)}>{tab.label}</button>
                ))}
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredFinanceItems.length === 0 ? (
                  <div className="empty-state">{tr("Tidak ada tagihan untuk filter ini.", "No bills for this filter.")}</div>
                ) : (
                  filteredFinanceItems.map(item => {
                    const paid = item.status === "Paid";
                    return (
                      <article key={item.id} className={`subtle-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${paid ? "" : "!bg-orange-50 !border-orange-200"}`}>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <p className="text-[13px] font-bold text-slate-800 leading-snug">{tx(item.componentName)}</p>
                            <span className="chip chip-gray">Semester {item.semester}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{tr("Jatuh tempo", "Due")} {formatDate(item.dueDate, lang)}</p>
                          {item.paymentDate && (
                            <p className="text-[11px] text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" aria-hidden="true" />{tr("Dibayar", "Paid")} {formatDate(item.paymentDate, lang)}</p>
                          )}
                        </div>
                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <p className={`text-sm font-bold ${paid ? "text-slate-600" : "text-umn-orange-600"}`}>{formatRupiah(item.amount)}</p>
                          <div className="flex items-center gap-2">
                            <span className={`chip ${paid ? "chip-green" : "chip-amber"}`}>{paid ? tr("Lunas", "Paid") : tr("Belum dibayar", "Unpaid")}</span>
                            {!paid && (
                              <button type="button" className="btn btn-soft btn-sm py-1" onClick={() => handleCopyText("278890" + dummyStudent.nim, tr("nomor VA BCA", "the BCA VA number"))}>
                                <CreditCard className="w-3 h-3" aria-hidden="true" /> {tr("Salin VA", "Copy VA")}
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>

            <section className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="panel-title">{tr("Metode pembayaran", "Payment methods")}</h3>
                <div className="flex gap-2">
                  <a href="tel:02154220808" aria-label={tr("Telepon bagian keuangan", "Call the finance office")} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-umn-blue-600 hover:border-umn-blue-200 transition-colors"><Phone className="w-3.5 h-3.5" /></a>
                  <a href="https://wa.me/628228889921" target="_blank" rel="noreferrer" aria-label={tr("WhatsApp bagian keuangan", "WhatsApp the finance office")} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors"><MessageSquare className="w-3.5 h-3.5" /></a>
                </div>
              </div>

              {BANKS.map(bank => {
                const open = openBank === bank.id;
                return (
                  <article key={bank.id} className="panel p-4 space-y-3" style={{ borderLeft: `4px solid ${bank.tone}` }}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-extrabold tracking-wide" style={{ color: bank.tone }}>{bank.name}</span>
                        <span className="text-[11px] text-slate-400">{tx(bank.product)}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{tx(bank.branch)}</span>
                    </div>

                    <div className="subtle-card p-3 space-y-3">
                      {bank.accounts.map((acc, index) => {
                        const number = acc.prefix + dummyStudent.nim;
                        return (
                          <div key={acc.prefix} className={`flex items-center justify-between gap-3 ${index > 0 ? "pt-3 border-t border-slate-200" : ""}`}>
                            <div className="min-w-0">
                              <span className="mini-label block text-[9px]">{tx(acc.label)}</span>
                              <span className="text-[13px] font-bold tracking-wider text-slate-800 break-all">{number}</span>
                            </div>
                            <button type="button" className="btn btn-outline btn-sm shrink-0" aria-label={`${tr("Salin", "Copy")} ${tx(acc.label)}`} onClick={() => handleCopyText(number, tx(acc.label).toLowerCase())}>
                              <Copy className="w-3 h-3" aria-hidden="true" /> {tr("Salin", "Copy")}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-slate-500">{tr("Atas nama", "Account name")} <strong className="text-slate-700">{bank.recipient}</strong></p>

                    <button type="button" aria-expanded={open} onClick={() => setOpenBank(open ? null : bank.id)} className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-umn-blue-50 text-umn-blue-600 text-[11px] font-semibold hover:bg-umn-blue-100 transition-colors">
                      <span>{tx(bank.guideTitle)}</span>
                      <ChevronDown aria-hidden="true" className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && (
                      <ol className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed list-decimal pl-5">
                        {bank.steps.map(step => <li key={step.id}>{tx(step)}</li>)}
                      </ol>
                    )}
                  </article>
                );
              })}
              <p className="notice">{tr("Nomor rekening dan VA pada halaman ini adalah data contoh. Jangan melakukan pembayaran berdasarkan halaman ini.", "Account and VA numbers on this page are sample data. Do not make payments based on this page.")}</p>
            </section>
          </div>
        </>
      )}

      {subViewId === "student-information/grades" && (
        <>
          <PageHeader eyebrow={tr("INFORMASI MAHASISWA", "STUDENT INFORMATION")} title={tr("Hasil Studi", "Grades")} description={tr("Penilaian berkelanjutan semester berjalan: quiz, tugas, UTS, dan UAS beserta nilai akhir.", "Ongoing assessment this semester: quizzes, assignments, midterms, finals, and final scores.")}>
            <span className="chip chip-green">{tr("IPK", "GPA")} {dummyStudent.gpa}</span>
          </PageHeader>
          <section className="panel">
            {studentClasses.length === 0 ? noCourses : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">{tr("Mata kuliah", "Course")}</th>
                      <th scope="col" className="text-center">SKS</th>
                      <th scope="col" className="text-center">Quiz 15%</th>
                      <th scope="col" className="text-center">{tr("Tugas", "Assignment")} 25%</th>
                      <th scope="col" className="text-center">{tr("UTS", "Midterm")} 30%</th>
                      <th scope="col" className="text-center">{tr("UAS", "Final")} 30%</th>
                      <th scope="col" className="text-center">{tr("Nilai akhir", "Final score")}</th>
                      <th scope="col" className="text-center">{tr("Huruf", "Grade")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentClasses.map(c => (
                      <tr key={c.id}>
                        <td>
                          <p className="font-semibold text-slate-700">{c.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{c.code} · {tr("Seksi", "Section")} {c.classSection}</p>
                        </td>
                        <td className="text-center text-slate-700">{c.sks}</td>
                        <td className="text-center text-slate-500">{c.grades?.quiz ?? "–"}</td>
                        <td className="text-center text-slate-500">{c.grades?.assignment ?? "–"}</td>
                        <td className="text-center text-slate-500">{c.grades?.uts ?? "–"}</td>
                        <td className="text-center text-slate-500">{c.grades?.uas ?? "–"}</td>
                        <td className="text-center font-bold text-umn-blue-600">{c.grades?.finalScore ?? "–"}</td>
                        <td className="text-center">{c.grades ? <span className="chip">{c.grades.gradeLetter}</span> : <span className="chip chip-gray">{tr("Belum ada", "Pending")}</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {gradedClasses.length < studentClasses.length && (
              <p className="notice mt-4">{tr("Mata kuliah yang baru ditambahkan belum memiliki nilai.", "Newly added courses do not have grades yet.")}</p>
            )}
          </section>
        </>
      )}

      {subViewId === "student-information/attendance" && (
        <>
          <PageHeader eyebrow={tr("INFORMASI MAHASISWA", "STUDENT INFORMATION")} title={tr("Kehadiran Kuliah", "Attendance")} description={tr("Tingkat kehadiran pada semester berjalan. Kehadiran minimal 75% diperlukan untuk mengikuti UAS.", "Attendance this semester. At least 75% is required to sit the final exam.")}>
            <span className="chip chip-gray">{tr("Minimum", "Minimum")} 75%</span>
          </PageHeader>
          <section className="panel space-y-3">
            {studentClasses.length === 0 && noCourses}
            {studentClasses.map(cl => {
              const ratio = attendanceRatio(cl);
              const safe = ratio >= 75;
              return (
                <article key={cl.id} className="subtle-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-slate-800">{cl.name} <span className="font-medium text-slate-400">({cl.code})</span></h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cl.lecturerName} · {tr("Seksi", "Section")} {cl.classSection}</p>
                  </div>
                  <div className="flex items-center gap-6 justify-between sm:justify-end">
                    <div className="sm:text-right">
                      <p className="text-xs text-slate-600">{tr("Hadir", "Attended")} <strong className="text-slate-800">{cl.attendanceCount} / {cl.attendanceTotal}</strong> {tr("pertemuan", "sessions")}</p>
                      <span className={`chip mt-1 ${safe ? "chip-green" : "chip-red"}`}>{safe ? tr("Memenuhi syarat UAS", "Eligible for final exam") : tr("Di bawah batas minimum", "Below the minimum")}</span>
                    </div>
                    <div className="w-20 text-center shrink-0">
                      <span className="text-sm font-bold text-slate-800">{ratio}%</span>
                      <div className={`progress mt-1.5 ${safe ? "green" : "orange"}`} style={{ height: 5 }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ratio} aria-label={`${tr("Kehadiran", "Attendance")} ${cl.name}`}>
                        <span style={{ width: `${ratio}%` }} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      {subViewId === "self-service/academic-records/my-advisors" && (
        <>
          <PageHeader eyebrow={tr("REKAM AKADEMIK", "ACADEMIC RECORDS")} title={tr("Dosen Pembimbing", "Academic Advisor")} description={tr("Dosen pembimbing akademik yang mendampingi jalur kelulusanmu, lengkap dengan catatan konsultasi.", "The academic advisor guiding your path to graduation, with consultation notes.")} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <section className="panel space-y-4">
              <h3 className="mini-label">{tr("Dosen pembimbing akademik (DPA)", "Academic advisor")}</h3>
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <span className="w-12 h-12 rounded-full bg-umn-blue-50 text-umn-blue-600 flex items-center justify-center font-bold text-xs shrink-0">{tr("DPA", "ADV")}</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{dummyStudent.advisorName}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">NIP {dummyStudent.advisorNIP}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {tr("Ruang kerja: Gedung D, Ruang 502, Universitas Multimedia Nusantara. Tersedia pada jam kerja. Kirim email terlebih dahulu untuk membuat janji temu.", "Office: Building D, Room 502, Universitas Multimedia Nusantara. Available during office hours. Email first to book an appointment.")}
              </p>
            </section>

            <section className="panel space-y-4">
              <h3 className="mini-label">{tr("Catatan konsultasi", "Consultation notes")}</h3>
              <div className="subtle-card space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-[13px] font-bold text-slate-800">{tr("Konsultasi pemilihan mata kuliah – semester 4", "Course selection consultation – semester 4")}</p>
                  <span className="chip chip-green shrink-0">{tr("Terverifikasi", "Verified")}</span>
                </div>
                <p className="text-[11px] text-slate-500">{formatDate("2026-01-18", lang)} · {dummyStudent.advisorName}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200 italic">
                  {tr(
                    `“Capaian akademik sangat baik dengan IPK ${dummyStudent.gpa}. Disarankan mengambil Cloud Computing dan Data Engineering untuk memenuhi jalur wajib sebelum magang industri di semester 7.”`,
                    `“Excellent academic progress with a GPA of ${dummyStudent.gpa}. Taking Cloud Computing and Data Engineering is recommended to complete the required track before the semester 7 internship.”`
                  )}
                </p>
              </div>
            </section>
          </div>
        </>
      )}

      {subViewId === "self-service/degree-progress/my-requirements" && (
        <>
          <PageHeader eyebrow={tr("PROGRES KELULUSAN", "DEGREE PROGRESS")} title={tr("Syarat Kelulusan", "Graduation Requirements")} description={tr("Pemenuhan SKS kurikulum yang disyaratkan untuk lulus, termasuk mata kuliah yang sedang diambil.", "Curriculum credits required to graduate, including courses in progress.")}>
            <span className="chip chip-green">{doneRequirement} / {totalRequirement} SKS</span>
          </PageHeader>
          <section className="panel space-y-6">
            {REQUIREMENTS.map(req => {
              const percent = Math.round((req.done / req.total) * 100);
              const complete = req.done >= req.total;
              return (
                <div key={req.label.id} className="space-y-2">
                  <div className="flex justify-between items-center gap-3 text-xs">
                    <span className="font-bold text-slate-700">{tx(req.label)}</span>
                    <span className={`font-semibold ${complete ? "text-emerald-600" : req.done > 0 ? "text-umn-blue-600" : "text-slate-400"}`}>
                      {complete ? tr("Selesai", "Complete") : req.done > 0 ? tr("Berjalan", "In progress") : tr("Direncanakan", "Planned")} ({req.done} / {req.total} SKS)
                    </span>
                  </div>
                  <div className={`progress ${complete ? "green" : ""}`} role="progressbar" aria-valuemin={0} aria-valuemax={req.total} aria-valuenow={req.done} aria-label={tx(req.label)}>
                    <span style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}
