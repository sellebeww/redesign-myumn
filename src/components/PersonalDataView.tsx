import { useRef, useState } from "react";
import { Plus, User, Mail, Phone, MapPin, ShieldCheck, Info, Eye, EyeOff, RefreshCw, FileEdit, History, UserCheck, Award, FileSignature, Lock, UploadCloud, Check, Trash2 } from "lucide-react";
import { useSavedState } from "../lib/storage";
import { usePrefs, type Bilingual, type Text } from "../lib/preferences";
import { dummyStudent, dummyAddresses, dummyPhones, dummyEmails } from "../data";
import { Address, PhoneRecord, EmailRecord } from "../types";
import PageHeader from "./PageHeader";

interface PersonalDataViewProps {
  subViewId: string;
  onTriggerToast: (msg: string) => void;
}

interface CorrectionRequest {
  id: string;
  requestedName: string;
  reason: Text;
  status: string;
  date: string;
  notes: Text;
}

const ADDRESS_LABEL: Record<Address["type"], Bilingual> = {
  "Permanent (KTP)": { id: "Alamat tetap (KTP)", en: "Permanent address (ID card)" },
  "Correspondence (Domisili)": { id: "Alamat domisili", en: "Current address" }
};

const CORRECTION_REASONS: Bilingual[] = [
  { id: "Koreksi ejaan karakter", en: "Spelling correction" },
  { id: "Penambahan gelar akademik", en: "Add academic title" },
  { id: "Penyesuaian nama hukum", en: "Legal name change" },
  { id: "Penambahan tanda diakritik", en: "Add diacritics" },
  { id: "Ketidakcocokan data PDDIKTI", en: "PDDIKTI data mismatch" }
];

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const emptyAddress = { type: "Permanent (KTP)" as Address["type"], street: "", village: "", district: "", city: "", province: "", postalCode: "" };
const emptyPhone = { type: "", countryCode: "+62", number: "", isPrimary: false };
const emptyEmail = { type: "", address: "", isPrimary: false };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="kv-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function CardTitle({ icon: Icon, title, aside }: { icon: React.ComponentType<{ className?: string }>; title: string; aside?: React.ReactNode }) {
  return (
    <div className="panel-head">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-umn-blue-600" />
        <h3 className="panel-title">{title}</h3>
      </div>
      {aside}
    </div>
  );
}

export default function PersonalDataView({ subViewId, onTriggerToast }: PersonalDataViewProps) {
  const { tr, tx, locale } = usePrefs();
  const [showNik, setShowNik] = useState(false);
  const [showMotherName, setShowMotherName] = useState(false);

  const [addresses, setAddresses] = useSavedState<Address[]>("myumn_addresses", dummyAddresses);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useSavedState<PhoneRecord[]>("myumn_phones", dummyPhones);
  const [newPhone, setNewPhone] = useState(emptyPhone);
  const [showAddPhone, setShowAddPhone] = useState(false);

  const [emails, setEmails] = useSavedState<EmailRecord[]>("myumn_emails", dummyEmails);
  const [newEmail, setNewEmail] = useState(emptyEmail);
  const [showAddEmail, setShowAddEmail] = useState(false);

  const [namesLastSynced, setNamesLastSynced] = useState<Date | null>(null);
  const [targetCorrectionName, setTargetCorrectionName] = useState("");
  const [reasonIndex, setReasonIndex] = useState(0);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [correctionHistory, setCorrectionHistory] = useSavedState<CorrectionRequest[]>("myumn_corrections", [
    {
      id: "REQ-0925",
      requestedName: dummyStudent.name,
      reason: { id: "Validasi pendaftaran awal", en: "Initial enrollment validation" },
      status: "Approved",
      date: "12 Jan 2024",
      notes: { id: "Sesuai dengan ijazah SMA dan akta kelahiran.", en: "Matches the high school diploma and birth certificate." }
    }
  ]);

  const initials = dummyStudent.name.split(" ").map(part => part[0]).join("").slice(0, 2);
  const primaryLabel = (primary: boolean) => (primary ? <span className="chip chip-green">{tr("Utama", "Primary")}</span> : null);
  const addressLabel = (type: Address["type"]) => (ADDRESS_LABEL[type] ? tx(ADDRESS_LABEL[type]) : type);
  const eyebrow = tr("DATA PRIBADI", "PERSONAL INFORMATION");

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street.trim() || !newAddress.city.trim()) return;
    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        type: newAddress.type,
        street: newAddress.street.trim(),
        village: newAddress.village.trim() || "-",
        district: newAddress.district.trim() || "-",
        city: newAddress.city.trim(),
        province: newAddress.province.trim() || "Banten",
        postalCode: newAddress.postalCode.trim()
      }
    ]);
    setNewAddress(emptyAddress);
    setShowAddAddress(false);
    onTriggerToast(tr("Alamat baru tersimpan di browser ini.", "New address saved in this browser."));
  };

  const handleRemoveAddress = (id: string) => {
    if (!window.confirm(tr("Hapus alamat ini?", "Delete this address?"))) return;
    setAddresses(addresses.filter(a => a.id !== id));
    onTriggerToast(tr("Alamat dihapus.", "Address deleted."));
  };

  const handleAddPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9 ()+-]{6,20}$/.test(newPhone.number)) { onTriggerToast(tr("Masukkan nomor telepon yang valid.", "Enter a valid phone number.")); return; }
    const added: PhoneRecord = { id: `ph-${Date.now()}`, ...newPhone, type: newPhone.type.trim() || { id: "Ponsel", en: "Mobile" } };
    setPhoneNumbers([...phoneNumbers.map(p => (added.isPrimary ? { ...p, isPrimary: false } : p)), added]);
    setNewPhone(emptyPhone);
    setShowAddPhone(false);
    onTriggerToast(tr("Nomor telepon tersimpan di browser ini.", "Phone number saved in this browser."));
  };

  const handleRemovePhone = (id: string) => {
    if (!window.confirm(tr("Hapus nomor telepon ini?", "Delete this phone number?"))) return;
    setPhoneNumbers(phoneNumbers.filter(p => p.id !== id));
    onTriggerToast(tr("Nomor telepon dihapus.", "Phone number deleted."));
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const address = newEmail.address.trim();
    if (!address) return;
    if (emails.some(item => item.address.toLowerCase() === address.toLowerCase())) { onTriggerToast(tr("Alamat email sudah terdaftar.", "This email address is already registered.")); return; }
    const added: EmailRecord = { id: `em-${Date.now()}`, type: newEmail.type.trim() || { id: "Pribadi", en: "Personal" }, address, isPrimary: newEmail.isPrimary };
    setEmails([...emails.map(item => (added.isPrimary ? { ...item, isPrimary: false } : item)), added]);
    setNewEmail(emptyEmail);
    setShowAddEmail(false);
    onTriggerToast(tr("Alamat email tersimpan. Verifikasi email belum tersedia.", "Email saved. Email verification is not available yet."));
  };

  const handleRemoveEmail = (id: string) => {
    if (!window.confirm(tr("Hapus alamat email ini?", "Delete this email address?"))) return;
    setEmails(emails.filter(item => item.id !== id));
    onTriggerToast(tr("Alamat email dihapus.", "Email address deleted."));
  };

  const handleRefreshStatus = () => {
    setNamesLastSynced(new Date());
    onTriggerToast(tr("Status diperbarui. Sinkronisasi PDDIKTI belum terhubung.", "Status refreshed. PDDIKTI sync is not connected yet."));
  };

  const attachFile = (file: File | undefined) => {
    if (!file) return;
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type) || file.size > MAX_FILE_BYTES) {
      onTriggerToast(tr("Pilih PDF, JPG, atau PNG maksimal 5 MB.", "Choose a PDF, JPG, or PNG up to 5 MB."));
      return;
    }
    setUploadedFileName(file.name);
    onTriggerToast(tr(`Berkas “${file.name}” dipilih untuk draf lokal.`, `“${file.name}” attached to the local draft.`));
  };

  const handleNamesCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCorrectionName.trim()) { onTriggerToast(tr("Isi nama yang diusulkan.", "Enter the proposed name.")); return; }
    if (!uploadedFileName) { onTriggerToast(tr("Lampirkan dokumen pendukung (KTP, akta kelahiran, atau paspor).", "Attach a supporting document (ID card, birth certificate, or passport).")); return; }
    const request: CorrectionRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedName: targetCorrectionName.trim(),
      reason: CORRECTION_REASONS[reasonIndex],
      status: "Under Review",
      date: new Date().toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }),
      notes: additionalNotes.trim() || { id: "Menunggu verifikasi registrar.", en: "Awaiting registrar review." }
    };
    setCorrectionHistory([request, ...correctionHistory]);
    onTriggerToast(tr("Draf koreksi nama tersimpan di browser. Belum dikirim ke registrar.", "Name correction draft saved in this browser. It has not been sent to the registrar."));
    setTargetCorrectionName("");
    setUploadedFileName(null);
    setAdditionalNotes("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const eyeButton = (shown: boolean, toggle: () => void, hideLabel: string, showLabel: string) => (
    <button type="button" className="text-slate-400 hover:text-umn-blue-600" aria-pressed={shown} aria-label={shown ? hideLabel : showLabel} onClick={toggle}>
      {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {subViewId === "student-information/profile" && (
        <>
          <PageHeader eyebrow={tr("INFORMASI MAHASISWA", "STUDENT INFORMATION")} title={tr("Profil Akademik", "Academic Profile")} description={tr("Biodata akademik, angkatan, semester berjalan, dan dosen pembimbingmu.", "Your academic details, cohort, current semester, and advisor.")}>
            <span className="chip chip-green">{tr("Mahasiswa aktif", "Active student")}</span>
          </PageHeader>
          <section className="panel space-y-6">
            <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
              <span className="w-16 h-16 rounded-full bg-umn-blue-600 flex items-center justify-center text-white font-bold text-xl font-display shrink-0">{initials}</span>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800">{dummyStudent.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tx(dummyStudent.major)} · {tr("Fakultas", "Faculty of")} {tx(dummyStudent.faculty)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <div>
                <h3 className="mini-label mb-2">{tr("Informasi akademik", "Academic information")}</h3>
                <Row label={tr("Nomor Induk Mahasiswa (NIM)", "Student ID (NIM)")} value={dummyStudent.nim} />
                <Row label={tr("Angkatan", "Cohort")} value={dummyStudent.entryYear} />
                <Row label={tr("Semester berjalan", "Current semester")} value={`${dummyStudent.semester} (${tr("Genap", "Even")})`} />
                <Row label={tr("IPK", "GPA")} value={<span className="text-emerald-600">{dummyStudent.gpa} / 4.00</span>} />
              </div>
              <div>
                <h3 className="mini-label mb-2">{tr("Dosen pembimbing", "Academic advisor")}</h3>
                <Row label={tr("Dosen PA", "Advisor")} value={dummyStudent.advisorName} />
                <Row label="NIP" value={dummyStudent.advisorNIP} />
                <Row label={tr("Fakultas", "Faculty")} value={tx(dummyStudent.faculty)} />
              </div>
            </div>
          </section>
        </>
      )}

      {subViewId === "self-service/personal-info/personal-data-summary" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Ringkasan Data Pribadi", "Personal Data Summary")} description={tr("Identitas resmi, alamat, kontak telepon, dan email yang tercatat atas namamu. Data adalah contoh dan tersimpan di browser ini.", "Official identity, addresses, phone contacts, and email on record for you. This is sample data saved in this browser.")}>
            <span className="chip chip-green">{tr("Data contoh", "Sample data")}</span>
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <section className="panel">
                <CardTitle icon={User} title={tr("Identitas resmi", "Official identity")} aside={<span className="chip chip-green"><ShieldCheck className="w-3 h-3" aria-hidden="true" />{tr("Contoh terverifikasi", "Sample · verified")}</span>} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="subtle-card"><span className="mini-label">{tr("Nama lengkap", "Full name")}</span><p className="text-[13px] font-bold text-slate-800 mt-1">{dummyStudent.name}</p></div>
                  <div className="subtle-card">
                    <div className="flex justify-between items-center"><span className="mini-label">{tr("NIK", "National ID (NIK)")}</span>{eyeButton(showNik, () => setShowNik(!showNik), tr("Sembunyikan NIK", "Hide ID number"), tr("Tampilkan NIK", "Show ID number"))}</div>
                    <p className="text-[13px] font-bold text-slate-800 mt-1 tracking-wide">{showNik ? "3174092406020003" : "317409••••••••03"}</p>
                  </div>
                  <div className="subtle-card"><span className="mini-label">{tr("Tempat, tanggal lahir", "Place and date of birth")}</span><p className="text-[13px] font-bold text-slate-800 mt-1">{tr("Tangerang, 24 Juni 2004", "Tangerang, 24 June 2004")}</p></div>
                  <div className="subtle-card"><span className="mini-label">{tr("Jenis kelamin", "Sex")}</span><p className="text-[13px] font-bold text-slate-800 mt-1">{tr("Laki-laki", "Male")}</p></div>
                  <div className="subtle-card">
                    <div className="flex justify-between items-center"><span className="mini-label">{tr("Nama ibu kandung", "Mother's maiden name")}</span>{eyeButton(showMotherName, () => setShowMotherName(!showMotherName), tr("Sembunyikan nama ibu", "Hide mother's name"), tr("Tampilkan nama ibu", "Show mother's name"))}</div>
                    <p className="text-[13px] font-bold text-slate-800 mt-1">{showMotherName ? "Maria Lestari" : "Maria L•••••••"}</p>
                  </div>
                  <div className="subtle-card"><span className="mini-label">{tr("Kewarganegaraan", "Citizenship")}</span><p className="text-[13px] font-bold text-slate-800 mt-1">{tr("WNI (Warga Negara Indonesia)", "Indonesian citizen")}</p></div>
                </div>
              </section>

              <section className="panel">
                <CardTitle icon={MapPin} title={tr("Alamat terdaftar", "Registered addresses")} aside={<span className="chip chip-gray">{addresses.length} {tr("alamat", "addresses")}</span>} />
                {addresses.length === 0 ? (
                  <div className="empty-state">{tr("Belum ada alamat. Tambahkan melalui halaman Alamat.", "No addresses yet. Add one on the Addresses page.")}</div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <div key={addr.id} className="subtle-card flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <span className="chip chip-gray">{addressLabel(addr.type)}</span>
                          <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-1.5">{addr.street}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Kel. {addr.village}, Kec. {addr.district}, {addr.city}, {addr.province} {addr.postalCode}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <section className="panel">
                <CardTitle icon={Phone} title={tr("Kontak telepon", "Phone contacts")} aside={<span className="chip chip-gray">{phoneNumbers.length}</span>} />
                {phoneNumbers.length === 0 ? <div className="empty-state">{tr("Belum ada nomor telepon.", "No phone numbers yet.")}</div> : (
                  <div className="space-y-3">
                    {phoneNumbers.map(ph => (
                      <div key={ph.id} className="subtle-card p-3">
                        <p className="text-xs font-bold text-slate-700">{tx(ph.type)}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{ph.countryCode} {ph.number}</p>
                        <div className="mt-1.5">{primaryLabel(ph.isPrimary)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="panel">
                <CardTitle icon={Mail} title="Email" aside={<span className="chip chip-gray">{emails.length}</span>} />
                {emails.length === 0 ? <div className="empty-state">{tr("Belum ada alamat email.", "No email addresses yet.")}</div> : (
                  <div className="space-y-3">
                    {emails.map(em => (
                      <div key={em.id} className="subtle-card p-3">
                        <p className="text-xs font-bold text-slate-700">{tx(em.type)}</p>
                        <p className="text-[11px] text-slate-500 mt-1 break-all">{em.address}</p>
                        <div className="mt-1.5">{primaryLabel(em.isPrimary)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>

          <p className="notice"><Info className="w-4 h-4 shrink-0" aria-hidden="true" /><span><strong>{tr("Catatan privasi:", "Privacy note:")}</strong> {tr("Data pribadi dilindungi Undang-Undang Pelindungan Data Pribadi (UU PDP). Jangan memasukkan informasi pribadi asli pada versi contoh ini.", "Personal data is protected under Indonesia's Personal Data Protection Law (UU PDP). Do not enter real personal information in this sample version.")}</span></p>
        </>
      )}

      {subViewId === "self-service/personal-info/names" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Verifikasi Nama", "Name Verification")} description={tr("Periksa penulisan namamu pada dokumen akademik dan siapkan draf permohonan koreksi bila ada yang tidak sesuai.", "Check how your name appears on academic documents and draft a correction request if something is wrong.")}>
            <span className="chip chip-gray">NIM {dummyStudent.nim}</span>
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <section className="panel">
                <CardTitle icon={UserCheck} title={tr("Bentuk penulisan nama", "How your name is written")} aside={<span className="chip chip-gray"><Lock className="w-3 h-3" aria-hidden="true" />{tr("Terkunci", "Locked")}</span>} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: FileSignature, label: tr("Nama hukum", "Legal name"), value: dummyStudent.name, note: tr("Sesuai akta kelahiran dan data kependudukan.", "Matches the birth certificate and civil records.") },
                    { icon: Award, label: tr("Nama pada ijazah", "Name on diploma"), value: `${dummyStudent.name}, S.Kom.`, note: tr("Penulisan yang akan dicetak pada ijazah dan transkrip.", "How it will be printed on your diploma and transcript.") },
                    { icon: User, label: tr("Panduan pelafalan", "Pronunciation guide"), value: "VAH-suhl GOH-lay-oo", note: tr("Digunakan MC saat pemanggilan di acara wisuda.", "Used by the MC at the graduation ceremony.") },
                    { icon: Lock, label: tr("Alias akun kampus", "Campus account alias"), value: "vassel.goleyu", note: tr("Pengenal akun yang terhubung dengan email kampus.", "Account identifier linked to your campus email.") }
                  ].map(item => (
                    <div key={item.value} className="subtle-card">
                      <div className="flex items-center gap-1.5 text-slate-500"><item.icon className="w-3.5 h-3.5" aria-hidden="true" /><span className="mini-label">{item.label}</span></div>
                      <p className="text-[13px] font-bold text-slate-800 mt-1.5">{item.value}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <form onSubmit={handleNamesCorrectionSubmit} className="panel space-y-4" aria-label={tr("Formulir koreksi nama", "Name correction form")}>
                <CardTitle icon={FileEdit} title={tr("Ajukan koreksi nama", "Request a name correction")} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="correction-name" className="field-label">{tr("Nama yang diusulkan", "Proposed name")}</label>
                    <input id="correction-name" className="field" type="text" placeholder={tr("Contoh: Vassel Goleyu Alatas", "e.g. Vassel Goleyu Alatas")} value={targetCorrectionName} onChange={e => setTargetCorrectionName(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="correction-reason" className="field-label">{tr("Alasan koreksi", "Reason")}</label>
                    <select id="correction-reason" className="field" value={reasonIndex} onChange={e => setReasonIndex(Number(e.target.value))}>
                      {CORRECTION_REASONS.map((reason, index) => <option key={reason.id} value={index}>{tx(reason)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <span className="field-label">{tr("Dokumen pendukung (KTP, akta kelahiran, atau paspor)", "Supporting document (ID card, birth certificate, or passport)")}</span>
                  <input ref={fileInput} id="names-file-input" type="file" className="sr-only" accept=".pdf,.png,.jpg,.jpeg" onChange={e => attachFile(e.target.files?.[0])} />
                  <label
                    htmlFor="names-file-input"
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={e => { e.preventDefault(); setIsDragOver(false); attachFile(e.dataTransfer.files?.[0]); }}
                    className={`flex flex-col items-center justify-center gap-2 text-center rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors ${isDragOver ? "border-umn-blue-500 bg-umn-blue-50" : "border-slate-200 bg-slate-50 hover:border-umn-blue-200"}`}
                  >
                    <UploadCloud className={`w-7 h-7 ${isDragOver ? "text-umn-blue-600" : "text-slate-400"}`} aria-hidden="true" />
                    {uploadedFileName ? (
                      <>
                        <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1"><Check className="w-4 h-4" aria-hidden="true" />{tr("Terlampir", "Attached")}: {uploadedFileName}</span>
                        <span className="text-[11px] text-slate-400">{tr("Seret berkas lain atau klik untuk mengganti", "Drop another file or click to replace")}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-slate-700">{tr("Seret berkas ke sini, atau klik untuk memilih", "Drop a file here, or click to browse")}</span>
                        <span className="text-[11px] text-slate-400">{tr("PDF, PNG, atau JPG hingga 5 MB", "PDF, PNG, or JPG up to 5 MB")}</span>
                      </>
                    )}
                  </label>
                </div>

                <div>
                  <label htmlFor="correction-notes" className="field-label">{tr("Catatan tambahan", "Additional notes")}</label>
                  <textarea id="correction-notes" className="field min-h-24" placeholder={tr("Jelaskan konteks permohonanmu, misalnya perbaikan ejaan nama belakang pada transkrip.", "Explain your request, e.g. correcting the spelling of your surname on the transcript.")} value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary">{tr("Simpan draf permohonan", "Save request draft")}</button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <section className="panel space-y-3">
                <CardTitle icon={RefreshCw} title={tr("Status PDDIKTI", "PDDIKTI status")} />
                <Row label={tr("Kecocokan data", "Data match")} value={<span className="chip chip-green">{tr("Sesuai (contoh)", "Matched (sample)")}</span>} />
                <Row label={tr("ID referensi", "Reference ID")} value={`2026-UMN-${dummyStudent.nim}`} />
                <Row label={tr("Terakhir diperbarui", "Last refreshed")} value={namesLastSynced ? namesLastSynced.toLocaleString(locale, { timeZone: "Asia/Jakarta" }) + " WIB" : tr("Belum pernah", "Never")} />
                <button type="button" className="btn btn-soft w-full" onClick={handleRefreshStatus}>
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> {tr("Perbarui status", "Refresh status")}
                </button>
                <p className="text-[11px] text-slate-400 leading-relaxed">{tr("Sinkronisasi PDDIKTI belum terhubung. Tombol ini hanya memperbarui waktu pada tampilan.", "PDDIKTI sync is not connected. This button only updates the time shown.")}</p>
              </section>

              <section className="panel">
                <CardTitle icon={History} title={tr("Riwayat permohonan", "Request history")} />
                <ol className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {correctionHistory.map((item, index) => {
                    const approved = item.status === "Approved";
                    return (
                      <li key={item.id} className="flex gap-3 relative">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 z-10 ${approved ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-umn-blue-50 text-umn-blue-600 border border-umn-blue-100"}`}>{index + 1}</span>
                        <div className="space-y-1 text-xs flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-bold text-slate-800">{item.id}</span>
                            <span className={`chip ${approved ? "chip-green" : ""}`}>{approved ? tr("Disetujui", "Approved") : tr("Draf ditinjau", "Draft in review")}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{item.date} · {tx(item.reason)}</p>
                          <p className="font-semibold text-slate-700">{tr("Nama", "Name")}: “{item.requestedName}”</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed italic pl-2 border-l-2 border-slate-100">{tx(item.notes)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            </div>
          </div>

          <p className="notice"><Info className="w-4 h-4 shrink-0" aria-hidden="true" /><span><strong>{tr("Catatan registrar:", "Registrar note:")}</strong> {tr("Perubahan data identitas bersifat dapat diaudit dan terkunci setelah semester 7. Hubungi BAA melalui Pusat Bantuan untuk kasus yang rumit.", "Identity changes are auditable and lock after semester 7. Contact BAA through the Help Center for complex cases.")}</span></p>
        </>
      )}

      {subViewId === "self-service/personal-info/addresses" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Alamat", "Addresses")} description={tr("Pastikan alamat surat-menyurat terisi akurat, termasuk untuk pengiriman ijazah fisik.", "Keep your mailing address accurate, including for delivery of your printed diploma.")}>
            <button type="button" className="btn btn-primary" onClick={() => setShowAddAddress(!showAddAddress)} aria-expanded={showAddAddress}>
              <Plus className="w-4 h-4" aria-hidden="true" /> {tr("Tambah alamat", "Add address")}
            </button>
          </PageHeader>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="panel space-y-4" aria-label={tr("Formulir alamat baru", "New address form")}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="addr-type" className="field-label">{tr("Tipe alamat", "Address type")}</label>
                  <select id="addr-type" className="field" value={newAddress.type} onChange={e => setNewAddress({ ...newAddress, type: e.target.value as Address["type"] })}>
                    <option value="Permanent (KTP)">{addressLabel("Permanent (KTP)")}</option>
                    <option value="Correspondence (Domisili)">{addressLabel("Correspondence (Domisili)")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="addr-street" className="field-label">{tr("Jalan, blok, nomor rumah", "Street and number")}</label>
                  <input id="addr-street" className="field" required type="text" placeholder={tr("Contoh: Scientia Residences, Unit 1205", "e.g. Scientia Residences, Unit 1205")} value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="addr-village" className="field-label">{tr("Kelurahan", "Village / ward")}</label>
                  <input id="addr-village" className="field" type="text" value={newAddress.village} onChange={e => setNewAddress({ ...newAddress, village: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="addr-district" className="field-label">{tr("Kecamatan", "District")}</label>
                  <input id="addr-district" className="field" type="text" value={newAddress.district} onChange={e => setNewAddress({ ...newAddress, district: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="addr-city" className="field-label">{tr("Kota / kabupaten", "City / regency")}</label>
                  <input id="addr-city" className="field" required type="text" placeholder="Tangerang" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="addr-province" className="field-label">{tr("Provinsi", "Province")}</label>
                  <input id="addr-province" className="field" type="text" placeholder="Banten" value={newAddress.province} onChange={e => setNewAddress({ ...newAddress, province: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="addr-postal" className="field-label">{tr("Kode pos", "Postal code")}</label>
                  <input id="addr-postal" className="field" type="text" inputMode="numeric" placeholder="15810" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddAddress(false)}>{tr("Batal", "Cancel")}</button>
                <button type="submit" className="btn btn-primary">{tr("Simpan alamat", "Save address")}</button>
              </div>
            </form>
          )}

          <section className="space-y-3">
            {addresses.length === 0 && <div className="empty-state">{tr("Belum ada alamat tersimpan.", "No saved addresses.")}</div>}
            {addresses.map(addr => (
              <article key={addr.id} className="panel p-5 flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="chip">{addressLabel(addr.type)}</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{addr.street}, Kel. {addr.village}, Kec. {addr.district}, {addr.city}, {addr.province} {addr.postalCode}</p>
                </div>
                <button type="button" className="btn btn-danger btn-sm shrink-0" onClick={() => handleRemoveAddress(addr.id)} aria-label={`${tr("Hapus alamat", "Delete address")} ${addr.street}`}>
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> {tr("Hapus", "Delete")}
                </button>
              </article>
            ))}
          </section>
        </>
      )}

      {subViewId === "self-service/personal-info/phone-numbers" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Nomor Telepon", "Phone Numbers")} description={tr("Digunakan untuk pemberitahuan kuliah mendesak melalui SMS atau WhatsApp.", "Used for urgent class notices via SMS or WhatsApp.")}>
            <button type="button" className="btn btn-primary" onClick={() => setShowAddPhone(!showAddPhone)} aria-expanded={showAddPhone}>
              <Plus className="w-4 h-4" aria-hidden="true" /> {tr("Tambah kontak", "Add contact")}
            </button>
          </PageHeader>

          {showAddPhone && (
            <form onSubmit={handleAddPhone} className="panel space-y-4" aria-label={tr("Formulir nomor telepon", "Phone number form")}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="phone-type" className="field-label">{tr("Jenis kontak", "Contact type")}</label>
                  <input id="phone-type" className="field" type="text" placeholder={tr("Contoh: WhatsApp", "e.g. WhatsApp")} value={newPhone.type} onChange={e => setNewPhone({ ...newPhone, type: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="phone-code" className="field-label">{tr("Kode negara", "Country code")}</label>
                  <input id="phone-code" className="field" type="text" placeholder="+62" value={newPhone.countryCode} onChange={e => setNewPhone({ ...newPhone, countryCode: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="phone-number" className="field-label">{tr("Nomor", "Number")}</label>
                  <input id="phone-number" className="field" type="tel" inputMode="tel" required placeholder="8123456789" value={newPhone.number} onChange={e => setNewPhone({ ...newPhone, number: e.target.value })} />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-umn-blue-600 !min-h-0" checked={newPhone.isPrimary} onChange={e => setNewPhone({ ...newPhone, isPrimary: e.target.checked })} />
                {tr("Jadikan kontak utama", "Make primary contact")}
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddPhone(false)}>{tr("Batal", "Cancel")}</button>
                <button type="submit" className="btn btn-primary">{tr("Simpan kontak", "Save contact")}</button>
              </div>
            </form>
          )}

          <section className="space-y-3">
            {phoneNumbers.length === 0 && <div className="empty-state">{tr("Belum ada nomor telepon tersimpan.", "No saved phone numbers.")}</div>}
            {phoneNumbers.map(ph => (
              <article key={ph.id} className="panel p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-800 text-[13px]">{tx(ph.type)}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{ph.countryCode} {ph.number}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {primaryLabel(ph.isPrimary)}
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemovePhone(ph.id)} aria-label={`${tr("Hapus", "Delete")} ${tx(ph.type)} ${ph.number}`}><Trash2 className="w-3.5 h-3.5" aria-hidden="true" /></button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {subViewId === "self-service/personal-info/email-addresses" && (
        <>
          <PageHeader eyebrow={eyebrow} title={tr("Alamat Email", "Email Addresses")} description={tr("Notifikasi dan bukti akademik dikirim ke email utamamu.", "Notifications and academic receipts are sent to your primary email.")}>
            <button type="button" className="btn btn-primary" onClick={() => setShowAddEmail(!showAddEmail)} aria-expanded={showAddEmail}>
              <Plus className="w-4 h-4" aria-hidden="true" /> {tr("Tambah email", "Add email")}
            </button>
          </PageHeader>

          {showAddEmail && (
            <form onSubmit={handleAddEmail} className="panel space-y-4" aria-label={tr("Formulir email baru", "New email form")}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email-type" className="field-label">{tr("Jenis email", "Email type")}</label>
                  <input id="email-type" className="field" type="text" placeholder={tr("Contoh: Email cadangan", "e.g. Backup email")} value={newEmail.type} onChange={e => setNewEmail({ ...newEmail, type: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="email-address" className="field-label">{tr("Alamat email", "Email address")}</label>
                  <input id="email-address" className="field" type="email" required placeholder={tr("nama@gmail.com", "name@gmail.com")} value={newEmail.address} onChange={e => setNewEmail({ ...newEmail, address: e.target.value })} />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-umn-blue-600 !min-h-0" checked={newEmail.isPrimary} onChange={e => setNewEmail({ ...newEmail, isPrimary: e.target.checked })} />
                {tr("Jadikan email utama", "Make primary email")}
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddEmail(false)}>{tr("Batal", "Cancel")}</button>
                <button type="submit" className="btn btn-primary">{tr("Simpan email", "Save email")}</button>
              </div>
            </form>
          )}

          <section className="space-y-3">
            {emails.length === 0 && <div className="empty-state">{tr("Belum ada alamat email tersimpan.", "No saved email addresses.")}</div>}
            {emails.map(em => (
              <article key={em.id} className="panel p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[13px]">{tx(em.type)}</p>
                  <p className="text-slate-500 text-xs mt-0.5 break-all">{em.address}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {primaryLabel(em.isPrimary)}
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveEmail(em.id)} aria-label={`${tr("Hapus", "Delete")} ${em.address}`}><Trash2 className="w-3.5 h-3.5" aria-hidden="true" /></button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
