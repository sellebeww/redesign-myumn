import {
  Home,
  Star,
  User,
  GraduationCap,
  BookOpen,
  Sliders,
  HelpCircle,
  type LucideIcon
} from "lucide-react";
import { pick, type Bilingual, type Lang } from "./preferences";

export interface MenuItem {
  id: string;
  name: Bilingual;
  description: Bilingual;
  icon?: LucideIcon;
  children?: MenuItem[];
}

const t = (id: string, en: string): Bilingual => ({ id, en });

export const menuStructure: MenuItem[] = [
  {
    id: "dashboard",
    name: t("Dashboard", "Dashboard"),
    description: t("Ringkasan jadwal hari ini, capaian studi, dan pengumuman kampus.", "Today's schedule, study progress, and campus announcements at a glance."),
    icon: Home
  },
  {
    id: "my-favourites",
    name: t("Favorit Saya", "My Favourites"),
    description: t("Pintasan ke layanan yang sering kamu buka.", "Shortcuts to the services you use most."),
    icon: Star
  },
  {
    id: "student-information",
    name: t("Informasi Mahasiswa", "Student Information"),
    description: t("Profil akademik, keuangan, hasil studi, dan kehadiran kuliah.", "Academic profile, finances, grades, and class attendance."),
    icon: User,
    children: [
      { id: "student-information/profile", name: t("Profil Akademik", "Academic Profile"), description: t("Biodata akademik, angkatan, semester berjalan, dan dosen pembimbing.", "Academic details, cohort, current semester, and academic advisor.") },
      { id: "student-information/finance", name: t("Status Keuangan", "Finance Status"), description: t("Tagihan kuliah per semester, status pembayaran, dan panduan pembayaran.", "Tuition bills per semester, payment status, and payment guides.") },
      { id: "student-information/grades", name: t("Hasil Studi", "Grades"), description: t("Nilai quiz, tugas, UTS, UAS, dan nilai akhir semester berjalan.", "Quiz, assignment, midterm, final exam, and final scores for this semester.") },
      { id: "student-information/attendance", name: t("Kehadiran Kuliah", "Attendance"), description: t("Persentase kehadiran tiap mata kuliah dan kelayakan mengikuti UAS.", "Attendance rate per course and final exam eligibility.") }
    ]
  },
  {
    id: "enrollment",
    name: t("KRS & Pendaftaran", "Enrollment"),
    description: t("Seluruh layanan pengisian rencana studi, jadwal, ujian, dan kegiatan mahasiswa.", "Everything for study plans, schedules, exams, and student activities."),
    icon: GraduationCap,
    children: [
      { id: "enrollment/pre-enrollment", name: t("Survei Pra-KRS", "Pre-Enrollment Survey"), description: t("Tandai mata kuliah pilihan yang kamu minati untuk semester berikutnya.", "Mark the electives you are interested in for next semester.") },
      { id: "enrollment/shopping-cart", name: t("Keranjang KRS", "Enrollment Cart"), description: t("Susun draf mata kuliah, cek bentrok jadwal dan batas 24 SKS, lalu simpan.", "Draft your courses, check schedule conflicts and the 24 SKS limit, then save.") },
      { id: "enrollment/swap-classes", name: t("Tukar Seksi Kelas", "Swap Class Section"), description: t("Ubah seksi kelas pada rencana studi yang sudah tersimpan.", "Change the class section of a course in your saved study plan.") },
      { id: "enrollment/drop-classes", name: t("Batal Mata Kuliah", "Drop Courses"), description: t("Batalkan mata kuliah dari rencana studi semester berjalan.", "Remove courses from this semester's study plan.") },
      { id: "enrollment/weekly-schedule", name: t("Jadwal Mingguan", "Weekly Schedule"), description: t("Jadwal kuliah per hari lengkap dengan ruang, dosen, dan kehadiran.", "Daily class schedule with rooms, lecturers, and attendance.") },
      { id: "enrollment/my-exam", name: t("Jadwal Ujian", "Exam Schedule"), description: t("Tanggal, waktu, ruang, dan nomor kursi ujian. Bisa diunduh sebagai CSV.", "Exam dates, times, rooms, and seat numbers. Downloadable as CSV.") },
      { id: "enrollment/dates", name: t("Tanggal Penting KRS", "Key Enrollment Dates"), description: t("Tenggat heregistrasi, pengisian KRS, dan masa ujian akhir.", "Deadlines for re-registration, enrollment, and final exams.") },
      { id: "enrollment/skkm-points", name: t("Poin SKKM", "SKKM Points"), description: t("Pantau poin kegiatan mahasiswa dan catat kegiatan baru.", "Track student activity points and log new activities.") },
      { id: "enrollment/internship", name: t("Magang Industri", "Industry Internship"), description: t("Siapkan draf pengajuan surat pengantar magang.", "Prepare a draft request for an internship cover letter.") },
      { id: "enrollment/confirmation", name: t("Konfirmasi KSM", "Study Card (KSM)"), description: t("Tinjau dan cetak Kartu Studi Mahasiswa semester berjalan.", "Review and print this semester's student study card.") }
    ]
  },
  {
    id: "self-service",
    name: t("Layanan Mandiri", "Self Service"),
    description: t("Kelola data pribadi, rencana studi, progres kelulusan, dan rekam akademik.", "Manage personal data, study plans, degree progress, and academic records."),
    icon: Sliders,
    children: [
      {
        id: "self-service/personal-info",
        name: t("Data Pribadi", "Personal Information"),
        description: t("Identitas, alamat, nomor telepon, dan alamat email.", "Identity, addresses, phone numbers, and email addresses."),
        children: [
          { id: "self-service/personal-info/personal-data-summary", name: t("Ringkasan Data Pribadi", "Personal Data Summary"), description: t("Identitas resmi, alamat, kontak telepon, dan email dalam satu halaman.", "Official identity, addresses, phone contacts, and email on one page.") },
          { id: "self-service/personal-info/names", name: t("Verifikasi Nama", "Name Verification"), description: t("Periksa penulisan nama dan siapkan draf permohonan koreksi nama.", "Check how your name is written and draft a name correction request.") },
          { id: "self-service/personal-info/addresses", name: t("Alamat", "Addresses"), description: t("Kelola alamat KTP dan alamat domisili.", "Manage your ID card address and current address.") },
          { id: "self-service/personal-info/phone-numbers", name: t("Nomor Telepon", "Phone Numbers"), description: t("Nomor telepon utama dan kontak darurat.", "Primary phone number and emergency contacts.") },
          { id: "self-service/personal-info/email-addresses", name: t("Alamat Email", "Email Addresses"), description: t("Email kampus dan email cadangan.", "Campus email and backup email.") }
        ]
      },
      {
        id: "self-service/academic-planning",
        name: t("Perencanaan Studi", "Academic Planning"),
        description: t("Rencana semester ke depan dan riwayat mata kuliah.", "Upcoming semester plans and course history."),
        children: [
          { id: "self-service/academic-planning/my-planner", name: t("Perencana Studi", "Study Planner"), description: t("Pilih peminatan dan lihat rencana mata kuliah semester 5 sampai 8.", "Pick a specialization and see the course plan for semesters 5 to 8.") },
          { id: "self-service/academic-planning/course-history", name: t("Riwayat Mata Kuliah", "Course History"), description: t("Mata kuliah yang sudah lulus beserta nilai dan SKS per semester.", "Completed courses with grades and credits per semester.") }
        ]
      },
      {
        id: "self-service/degree-progress",
        name: t("Progres Kelulusan", "Degree Progress"),
        description: t("Pemenuhan SKS yang disyaratkan untuk lulus.", "Credits completed toward graduation requirements."),
        children: [
          { id: "self-service/degree-progress/my-requirements", name: t("Syarat Kelulusan", "Graduation Requirements"), description: t("Progres SKS wajib universitas, mata kuliah program studi, dan tugas akhir.", "Progress on university core credits, major courses, and the final project.") }
        ]
      },
      {
        id: "self-service/academic-records",
        name: t("Rekam Akademik", "Academic Records"),
        description: t("Riwayat akademik lengkap dan dosen pembimbing.", "Full academic history and academic advisor."),
        children: [
          { id: "self-service/academic-records/course-history", name: t("Riwayat Akademik Lengkap", "Full Academic History"), description: t("Transkrip semua semester yang telah ditempuh.", "Transcript of every completed semester.") },
          { id: "self-service/academic-records/my-advisors", name: t("Dosen Pembimbing", "Academic Advisor"), description: t("Dosen pembimbing akademik dan catatan konsultasi.", "Your academic advisor and consultation notes.") }
        ]
      }
    ]
  },
  {
    id: "handbooks",
    name: t("Buku Panduan Kampus", "Campus Handbooks"),
    description: t("Tata tertib, ketentuan penilaian, dan aturan akademik universitas.", "Code of conduct, grading rules, and university academic regulations."),
    icon: BookOpen
  },
  {
    id: "help-desk",
    name: t("Pusat Bantuan", "Help Center"),
    description: t("Ajukan pertanyaan, pantau tiket, dan temukan kontak layanan kampus.", "Ask questions, track tickets, and find campus service contacts."),
    icon: HelpCircle
  }
];

export function findMenuItem(id: string, items: MenuItem[] = menuStructure): MenuItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findMenuItem(id, item.children);
      if (found) return found;
    }
  }
  return null;
}

/** Menu items from the top level down to (and including) the item with this id. */
export function getMenuTrail(id: string, items: MenuItem[] = menuStructure): MenuItem[] {
  for (const item of items) {
    if (item.id === id) return [item];
    if (item.children) {
      const inner = getMenuTrail(id, item.children);
      if (inner.length) return [item, ...inner];
    }
  }
  return [];
}

export function hasChildren(item: MenuItem | null | undefined): boolean {
  return !!item?.children?.length;
}

export interface SearchEntry {
  id: string;
  name: string;
  category: string;
  description: string;
}

/** Every navigable entry (categories and pages) with its parent label, for search. */
export function flattenMenu(lang: Lang, items: MenuItem[] = menuStructure, parent = ""): SearchEntry[] {
  return items.flatMap(item => [
    { id: item.id, name: pick(item.name, lang), category: parent || (lang === "en" ? "Main menu" : "Menu utama"), description: pick(item.description, lang) },
    ...(item.children ? flattenMenu(lang, item.children, pick(item.name, lang)) : [])
  ]);
}
