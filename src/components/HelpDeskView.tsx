import { useState } from "react";
import { HelpCircle, Clock, Check, Plus, MapPin, Mail, Phone, ChevronDown, Timer } from "lucide-react";
import { useSavedState } from "../lib/storage";
import { nowStamp, randomId } from "../lib/format";
import { usePrefs, type Bilingual } from "../lib/preferences";
import { HelpTicket } from "../types";
import PageHeader from "./PageHeader";

interface HelpDeskViewProps {
  initialTickets: HelpTicket[];
  onTriggerToast: (msg: string) => void;
}

const CATEGORIES: Bilingual[] = [
  { id: "Pengisian KRS", en: "Course Enrollment" },
  { id: "Validasi Poin SKKM", en: "SKKM Point Validation" },
  { id: "Biaya Kuliah dan Tagihan", en: "Tuition and Billing" },
  { id: "Nilai dan Transkrip", en: "Grades and Transcripts" },
  { id: "Akses Akun Kampus (SSO)", en: "Campus Account Access (SSO)" }
];

const FAQS: { q: Bilingual; a: Bilingual }[] = [
  { q: { id: "Bagaimana mencatat kegiatan SKKM?", en: "How do I log SKKM activities?" }, a: { id: "Catat kegiatan melalui halaman Poin SKKM. Koordinator kegiatan mahasiswa meninjau pengajuan secara berkala.", en: "Log activities on the SKKM Points page. Student activity coordinators review submissions regularly." } },
  { q: { id: "Bagaimana aturan revisi KRS?", en: "What is the enrollment revision policy?" }, a: { id: "Mata kuliah dapat dibatalkan, ditukar, atau ditambah pada masa tambah-batal yang diumumkan BAA, biasanya pada minggu kedua perkuliahan.", en: "Courses can be dropped, swapped, or added during the add/drop period announced by BAA, usually in the second week of classes." } },
  { q: { id: "Apakah pembayaran kuliah boleh dicicil?", en: "Can tuition be paid in instalments?" }, a: { id: "Penundaan atau cicilan dapat diajukan ke bagian Keuangan sebelum ujian akhir dimulai.", en: "Deferrals or instalments can be requested from the Finance office before final exams begin." } },
  { q: { id: "Bagaimana memperbaiki nama di data resmi?", en: "How do I correct my name in official records?" }, a: { id: "Datang ke BAA dengan membawa KTP dan akta kelahiran asli untuk proses perubahan data.", en: "Visit BAA with your original ID card and birth certificate to update your records." } }
];

export default function HelpDeskView({ initialTickets, onTriggerToast }: HelpDeskViewProps) {
  const { tr, tx } = usePrefs();
  const [helpTickets, setHelpTickets] = useSavedState<HelpTicket[]>("myumn_tickets", initialTickets);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [newReplyText, setNewReplyText] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const statusLabel = (status: HelpTicket["status"]) =>
    status === "Resolved" ? tr("Selesai", "Resolved") : status === "In Progress" ? tr("Diproses", "In progress") : tr("Menunggu", "Open");
  const openTickets = helpTickets.filter(t => t.status === "Open" || t.status === "In Progress");
  const resolvedTickets = helpTickets.filter(t => t.status === "Resolved");

  const resetForm = () => {
    setTicketSubject("");
    setTicketDesc("");
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;
    const stamp = nowStamp();
    const ticket: HelpTicket = {
      id: `TCK-${randomId()}`,
      category: CATEGORIES[categoryIndex],
      subject: ticketSubject.trim(),
      status: "Open",
      createdAt: stamp,
      description: ticketDesc.trim(),
      replies: [{ sender: "Student", message: ticketDesc.trim(), timestamp: stamp }]
    };
    setHelpTickets([ticket, ...helpTickets]);
    resetForm();
    setShowCreateTicket(false);
    onTriggerToast(tr("Tiket tersimpan di browser ini. Belum dikirim ke BAA.", "Ticket saved in this browser. It has not been sent to BAA."));
  };

  const handleSendReply = (ticketId: string) => {
    const message = newReplyText.trim();
    if (!message) return;
    setHelpTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, replies: [...t.replies, { sender: "Student" as const, message, timestamp: nowStamp() }] } : t))
    );
    setNewReplyText("");
    onTriggerToast(tr("Balasan tersimpan di browser ini.", "Reply saved in this browser."));
  };

  const stats = [
    { label: tr("Total tiket", "Total tickets"), value: helpTickets.length, note: tr("Seluruh tiket tercatat", "All recorded tickets"), icon: HelpCircle, color: "blue" },
    { label: tr("Antrean aktif", "Open queue"), value: openTickets.length, note: tr("Menunggu tanggapan staf", "Awaiting staff reply"), icon: Clock, color: "orange" },
    { label: tr("Tiket selesai", "Resolved"), value: resolvedTickets.length, note: tr("Pertanyaan terjawab", "Questions answered"), icon: Check, color: "green" },
    { label: tr("Rata-rata respons", "Average response"), value: tr("1,5 jam", "1.5 hrs"), note: tr("Pada hari kerja", "On working days"), icon: Timer, color: "purple" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={tr("LAYANAN BANTUAN", "SUPPORT")}
        title={tr("Pusat Bantuan", "Help Center")}
        description={tr("Ajukan pertanyaan, pantau tiket, atau cari panduan singkat dari Biro Administrasi Akademik (BAA).", "Ask a question, track your tickets, or find quick answers from the Academic Administration Bureau (BAA).")}
      >
        <button
          type="button"
          className={`btn ${showCreateTicket ? "btn-outline" : "btn-primary"}`}
          onClick={() => { setShowCreateTicket(open => !open); resetForm(); }}
        >
          {showCreateTicket ? tr("Tutup formulir", "Close form") : <><Plus className="w-4 h-4" aria-hidden="true" /> {tr("Buat tiket baru", "New ticket")}</>}
        </button>
      </PageHeader>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        {stats.map(({ label, value, note, icon: Icon, color }) => (
          <div className="stat-card" key={color}>
            <div className={`stat-icon ${color}`}><Icon size={19} aria-hidden="true" /></div>
            <p className="text-xs text-slate-500 mt-4">{label}</p>
            <p className="text-2xl font-display font-bold mt-1 text-slate-800">{value}</p>
            <p className="text-[11px] text-slate-500 mt-2">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {showCreateTicket && (
            <form onSubmit={handleSubmitTicket} className="panel space-y-4" aria-label={tr("Formulir tiket baru", "New ticket form")}>
              <div>
                <h3 className="panel-title">{tr("Tiket baru", "New ticket")}</h3>
                <p className="panel-sub">{tr("Tiket disimpan di browser ini dan belum dikirim ke BAA.", "Tickets are saved in this browser and are not sent to BAA.")}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ticket-category" className="field-label">{tr("Kategori", "Category")}</label>
                  <select id="ticket-category" className="field" value={categoryIndex} onChange={e => setCategoryIndex(Number(e.target.value))}>
                    {CATEGORIES.map((c, index) => <option key={c.id} value={index}>{tx(c)}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="ticket-subject" className="field-label">{tr("Subjek", "Subject")}</label>
                  <input id="ticket-subject" className="field" type="text" required placeholder={tr("Ringkasan singkat masalahmu", "A short summary of your issue")} value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ticket-desc" className="field-label">{tr("Uraian", "Description")}</label>
                  <textarea id="ticket-desc" className="field" required rows={4} placeholder={tr("Jelaskan kronologi, kode mata kuliah, atau detail lain yang relevan…", "Describe what happened, course codes, or other relevant details…")} value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => { setShowCreateTicket(false); resetForm(); }}>{tr("Batal", "Cancel")}</button>
                <button type="submit" className="btn btn-primary">{tr("Simpan tiket", "Save ticket")}</button>
              </div>
            </form>
          )}

          <section className="panel">
            <div className="panel-head">
              <div>
                <h3 className="panel-title">{tr("Tiket saya", "My tickets")}</h3>
                <p className="panel-sub">{tr("Riwayat contoh percakapan bantuan. Balasan baru tersimpan secara lokal.", "Sample support conversations. New replies are saved locally.")}</p>
              </div>
            </div>

            <div className="space-y-3">
              {helpTickets.length > 0 ? (
                helpTickets.map(t => {
                  const isOpen = activeTicketId === t.id;
                  return (
                    <article key={t.id} className={`subtle-card space-y-3 transition-colors ${isOpen ? "border-umn-blue-200" : ""}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="code-tag">{t.id}</span>
                          <span className="text-[11px] text-slate-400">{t.createdAt}</span>
                        </div>
                        <span className={`chip ${t.status === "Resolved" ? "chip-green" : "chip-amber"}`}>{statusLabel(t.status)}</span>
                      </div>

                      <div>
                        <p className="mini-label">{tx(t.category)}</p>
                        <h4 className="text-[13px] font-bold text-slate-800 leading-snug mt-1">{tx(t.subject)}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1.5">{tx(t.description)}</p>
                      </div>

                      {!isOpen ? (
                        <button type="button" className="text-xs font-semibold text-umn-blue-600 hover:text-umn-blue-650" onClick={() => { setActiveTicketId(t.id); setNewReplyText(""); }}>
                          {tr(`Lihat percakapan (${t.replies.length} pesan) →`, `View conversation (${t.replies.length} message${t.replies.length === 1 ? "" : "s"}) →`)}
                        </button>
                      ) : (
                        <div className="pt-3 border-t border-slate-200 space-y-3">
                          <p className="mini-label">{tr("Riwayat percakapan", "Conversation")}</p>
                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                            {t.replies.map((rep, index) => {
                              const mine = rep.sender === "Student";
                              return (
                                <div key={index} className={`p-3 rounded-2xl text-xs max-w-sm space-y-1 ${mine ? "bg-white border border-slate-200 ml-auto" : "bg-umn-blue-50 mr-auto"}`}>
                                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">{mine ? tr("Saya", "Me") : tr("Staf BAA", "BAA staff")}</p>
                                  <p className="leading-relaxed text-slate-800">{tx(rep.message)}</p>
                                  <p className="text-[10px] text-slate-400">{rep.timestamp}</p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <label htmlFor={`reply-${t.id}`} className="sr-only">{tr("Balasan", "Reply")}</label>
                            <input
                              id={`reply-${t.id}`}
                              className="field flex-1 min-w-48"
                              type="text"
                              placeholder={tr("Tulis balasan atau pertanyaan lanjutan…", "Write a reply or follow-up question…")}
                              value={newReplyText}
                              onChange={e => setNewReplyText(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSendReply(t.id); } }}
                            />
                            <button type="button" className="btn btn-primary" onClick={() => handleSendReply(t.id)}>{tr("Kirim", "Send")}</button>
                            <button type="button" className="btn btn-outline" onClick={() => setActiveTicketId(null)}>{tr("Tutup", "Close")}</button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="empty-state">{tr("Belum ada tiket bantuan.", "No support tickets yet.")}</div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="panel">
            <h3 className="panel-title">{tr("Pertanyaan umum", "FAQ")}</h3>
            <p className="panel-sub">{tr("Jawaban singkat untuk pertanyaan yang sering diajukan.", "Quick answers to common questions.")}</p>
            <div className="mt-4 space-y-2">
              {FAQS.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div key={faq.q.id} className="subtle-card p-0 overflow-hidden">
                    <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)} className="w-full flex items-center justify-between gap-3 text-left p-3.5 hover:bg-white transition-colors">
                      <span className="text-xs font-bold text-slate-700 leading-snug">{tx(faq.q)}</span>
                      <ChevronDown aria-hidden="true" className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <p className="px-3.5 pb-3.5 text-[11px] text-slate-500 leading-relaxed">{tx(faq.a)}</p>}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel">
            <h3 className="panel-title">{tr("Kontak layanan", "Contact")}</h3>
            <p className="panel-sub">{tr("Meja layanan BAA dan saluran bantuan.", "BAA service desk and support channels.")}</p>
            <ul className="mt-4 space-y-4 text-xs">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-umn-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-bold text-slate-800">{tr("Kantor Layanan BAA", "BAA Service Office")}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{tr("Gedung D, Ruang R.502, UMN Gading Serpong, Tangerang", "Building D, Room R.502, UMN Gading Serpong, Tangerang")}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 text-umn-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-bold text-slate-800">{tr("Jam layanan", "Opening hours")}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{tr("Senin – Jumat: 08.30 – 17.00 WIB", "Monday – Friday: 08:30 – 17:00 WIB")}</p>
                  <p className="text-slate-400 text-[11px]">{tr("Sabtu – Minggu: tutup", "Saturday – Sunday: closed")}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-umn-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-bold text-slate-800">Email</p>
                  <a href="mailto:baa@student.umn.ac.id" className="text-umn-blue-600 font-semibold text-[11px] hover:underline">baa@student.umn.ac.id</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-umn-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-bold text-slate-800">{tr("Telepon", "Phone")}</p>
                  <a href="tel:+622154220808" className="text-slate-600 font-semibold text-[11px] hover:underline">+62 (21) 5422 0808 ext. 502</a>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
