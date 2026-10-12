import {
  Course,
  Address,
  PhoneRecord,
  EmailRecord,
  PreEnrollmentItem,
  SKKMEvent,
  HelpTicket,
  FinanceItem,
  ExamRecord,
  HandbookItem
} from "./types";

export const dummyStudent = {
  name: "Vassel Goleyu",
  nim: "00000078921",
  major: { id: "Informatika", en: "Informatics" },
  faculty: { id: "Teknik & Informatika", en: "Engineering & Informatics" },
  entryYear: 2024,
  semester: 4,
  gpa: "3.91",
  totalSks: 61,
  skkmCurrent: 105,
  advisorName: "Dr. Eng. Ronald Adrian, S.T., M.T.",
  advisorNIP: "0305108401"
};

export const dummyCourses: Course[] = [
  {
    id: "crs-1",
    code: "IF301",
    name: "Data Analytics",
    sks: 3,
    classSection: "A (Reguler)",
    lecturerName: "Dr. Winarno, M.Kom.",
    day: "Monday",
    startTime: "08:00",
    endTime: "10:30",
    room: "C404",
    attendanceCount: 13,
    attendanceTotal: 14,
    grades: {
      quiz: 90,
      assignment: 95,
      uts: 88,
      uas: 92,
      finalScore: 91.5,
      gradeLetter: "A"
    }
  },
  {
    id: "crs-2",
    code: "IF322",
    name: "Software Engineering",
    sks: 4,
    classSection: "A (Reguler)",
    lecturerName: "Maria Angela, S.Kom., M.T.C.S.E.",
    day: "Tuesday",
    startTime: "10:30",
    endTime: "13:50",
    room: "C502",
    attendanceCount: 14,
    attendanceTotal: 14,
    grades: {
      quiz: 85,
      assignment: 90,
      uts: 84,
      uas: 89,
      finalScore: 87.1,
      gradeLetter: "A"
    }
  },
  {
    id: "crs-3",
    code: "IF315",
    name: "Database Systems",
    sks: 3,
    classSection: "A (Reguler)",
    lecturerName: "Arya Wicaksana, M.Si.",
    day: "Wednesday",
    startTime: "08:00",
    endTime: "10:30",
    room: "D601",
    attendanceCount: 12,
    attendanceTotal: 14,
    grades: {
      quiz: 88,
      assignment: 92,
      uts: 95,
      uas: 90,
      finalScore: 91.1,
      gradeLetter: "A"
    }
  },
  {
    id: "crs-4",
    code: "IF381",
    name: "Cloud Computing Architectures",
    sks: 3,
    classSection: "BL (Blended)",
    lecturerName: "Alexander Agung, M.Sc.",
    day: "Thursday",
    startTime: "13:00",
    endTime: "15:30",
    room: "D504 (Lab)",
    attendanceCount: 14,
    attendanceTotal: 14,
    grades: {
      quiz: 95,
      assignment: 95,
      uts: 90,
      uas: 91,
      finalScore: 92.2,
      gradeLetter: "A"
    }
  },
  {
    id: "crs-5",
    code: "IF332",
    name: "Computer Networks & Security",
    sks: 4,
    classSection: "A (Reguler)",
    lecturerName: "Raymond Koswara, M.T.",
    day: "Friday",
    startTime: "09:00",
    endTime: "12:20",
    room: "C402",
    attendanceCount: 13,
    attendanceTotal: 14,
    grades: {
      quiz: 80,
      assignment: 85,
      uts: 82,
      uas: 84,
      finalScore: 82.9,
      gradeLetter: "A-"
    }
  },
  {
    id: "crs-6",
    code: "UM312",
    name: "Technopreneurship",
    sks: 2,
    classSection: "A (Reguler)",
    lecturerName: "Dr. Florentina, M.B.A.",
    day: "Wednesday",
    startTime: "13:00",
    endTime: "14:40",
    room: "C303",
    attendanceCount: 14,
    attendanceTotal: 14,
    grades: {
      quiz: 90,
      assignment: 95,
      uts: 92,
      uas: 94,
      finalScore: 93.1,
      gradeLetter: "A"
    }
  },
  {
    id: "crs-7",
    code: "IF390",
    name: "Research Methodology",
    sks: 2,
    classSection: "BL (Blended)",
    lecturerName: "Dr. Eng. Ronald Adrian, S.T., M.T.",
    day: "Thursday",
    startTime: "10:30",
    endTime: "12:10",
    room: "C312",
    attendanceCount: 13,
    attendanceTotal: 14,
    grades: {
      quiz: 85,
      assignment: 88,
      uts: 85,
      uas: 86,
      finalScore: 86.1,
      gradeLetter: "A"
    }
  }
];

export const dummySkkmEvents: SKKMEvent[] = [
  {
    id: "skkm-1",
    activityName: "Infinite Hackathon Regional UMN",
    category: "Scientific and Reasoning",
    role: { id: "Juara 2 (Product Lead)", en: "2nd place (Product Lead)" },
    points: 25,
    date: "2025-11-20",
    status: "Approved",
    certificateNumber: "REG-HACK-2025-0042"
  },
  {
    id: "skkm-2",
    activityName: { id: "Kepengurusan HMIF UMN", en: "HMIF UMN Board Membership" },
    category: "Organization and Personality Development",
    role: { id: "Panitia Inti - Divisi Humas", en: "Core Committee - Public Relations" },
    points: 30,
    date: "2025-12-15",
    status: "Approved",
    certificateNumber: "HMIF-TEN-2025-081"
  },
  {
    id: "skkm-3",
    activityName: "Symphony Orchestra Anniversary Concert XI",
    category: "Talents and Interests",
    role: { id: "Pemain Biola Pertama", en: "First Violinist" },
    points: 20,
    date: "2025-09-10",
    status: "Approved",
    certificateNumber: "UMN-ORCH-EXP-2025"
  },
  {
    id: "skkm-4",
    activityName: { id: "Inisiatif Kampus Hijau: Caring & Cleaning", en: "Green Campus Initiative: Caring & Cleaning" },
    category: "Community Development",
    role: { id: "Koordinator Relawan", en: "Volunteer Coordinator" },
    points: 20,
    date: "2025-10-05",
    status: "Approved",
    certificateNumber: "COMM-CLEAN-05041"
  },
  {
    id: "skkm-5",
    activityName: { id: "Webinar: Akselerasi DevOps pada Ekosistem Kontainer", en: "Webinar: Accelerating DevOps in Container Ecosystems" },
    category: "Scientific and Reasoning",
    role: { id: "Peserta", en: "Participant" },
    points: 10,
    date: "2026-03-24",
    status: "Approved",
    certificateNumber: "UMN-WEBINAR-DEV-0012"
  },
  {
    id: "skkm-6",
    activityName: { id: "Kepemimpinan Organisasi Mahasiswa Baru UMN", en: "UMN New Student Organization Leadership" },
    category: "Organization and Personality Development",
    role: { id: "Peserta", en: "Participant" },
    points: 15,
    date: "2024-09-02",
    status: "Approved",
    certificateNumber: "OMB-UMN-2024-5C"
  }
];

export const dummyFinanceItems: FinanceItem[] = [
  {
    id: "fin-4-1",
    componentName: { id: "Biaya Kuliah Tetap (BKT) - Semester 4", en: "Fixed Tuition Fee (BKT) - Semester 4" },
    semester: 4,
    billingPeriod: { id: "Semester Genap 2025/2026", en: "Even Semester 2025/2026" },
    dueDate: "2026-01-20",
    amount: 14500000,
    status: "Paid",
    paymentDate: "2026-01-18 09:30"
  },
  {
    id: "fin-4-2",
    componentName: { id: "Biaya SKS Variabel (21 SKS) - Semester 4", en: "Variable Credit Fee (21 SKS) - Semester 4" },
    semester: 4,
    billingPeriod: { id: "Semester Genap 2025/2026", en: "Even Semester 2025/2026" },
    dueDate: "2026-02-28",
    amount: 10500000,
    status: "Unpaid"
  },
  {
    id: "fin-4-3",
    componentName: { id: "Iuran Ikoma UMN dan Kegiatan Mahasiswa - Semester 4", en: "UMN Alumni & Student Activity Fee - Semester 4" },
    semester: 4,
    billingPeriod: { id: "Semester Genap 2025/2026", en: "Even Semester 2025/2026" },
    dueDate: "2026-03-10",
    amount: 250000,
    status: "Paid",
    paymentDate: "2026-03-08 14:15"
  },
  {
    id: "fin-4-4",
    componentName: { id: "Biaya Workshop & Laboratorium Komputer - Semester 4", en: "Workshop & Computer Lab Fee - Semester 4" },
    semester: 4,
    billingPeriod: { id: "Semester Genap 2025/2026", en: "Even Semester 2025/2026" },
    dueDate: "2026-03-15",
    amount: 750000,
    status: "Unpaid"
  },
  {
    id: "fin-3-1",
    componentName: { id: "Biaya Kuliah Tetap (BKT) - Semester 3", en: "Fixed Tuition Fee (BKT) - Semester 3" },
    semester: 3,
    billingPeriod: { id: "Semester Ganjil 2025/2026", en: "Odd Semester 2025/2026" },
    dueDate: "2025-08-20",
    amount: 14500000,
    status: "Paid",
    paymentDate: "2025-08-15 10:00"
  },
  {
    id: "fin-3-2",
    componentName: { id: "Biaya SKS Variabel (21 SKS) - Semester 3", en: "Variable Credit Fee (21 SKS) - Semester 3" },
    semester: 3,
    billingPeriod: { id: "Semester Ganjil 2025/2026", en: "Odd Semester 2025/2026" },
    dueDate: "2025-09-25",
    amount: 10500000,
    status: "Paid",
    paymentDate: "2025-09-23 11:20"
  },
  {
    id: "fin-3-3",
    componentName: { id: "Iuran Ikoma UMN - Semester 3", en: "UMN Alumni Fee - Semester 3" },
    semester: 3,
    billingPeriod: { id: "Semester Ganjil 2025/2026", en: "Odd Semester 2025/2026" },
    dueDate: "2025-08-30",
    amount: 250000,
    status: "Paid",
    paymentDate: "2025-08-28 08:35"
  },
  {
    id: "fin-2-1",
    componentName: { id: "Biaya Kuliah Tetap (BKT) - Semester 2", en: "Fixed Tuition Fee (BKT) - Semester 2" },
    semester: 2,
    billingPeriod: { id: "Semester Genap 2024/2025", en: "Even Semester 2024/2025" },
    dueDate: "2025-01-20",
    amount: 13500000,
    status: "Paid",
    paymentDate: "2025-01-15 13:40"
  },
  {
    id: "fin-2-2",
    componentName: { id: "Biaya SKS Variabel (20 SKS) - Semester 2", en: "Variable Credit Fee (20 SKS) - Semester 2" },
    semester: 2,
    billingPeriod: { id: "Semester Genap 2024/2025", en: "Even Semester 2024/2025" },
    dueDate: "2025-02-25",
    amount: 9000000,
    status: "Paid",
    paymentDate: "2025-02-20 16:11"
  },
  {
    id: "fin-1-1",
    componentName: { id: "Uang Pangkal / Biaya Registrasi Awal - Semester 1", en: "Admission / Initial Registration Fee - Semester 1" },
    semester: 1,
    billingPeriod: { id: "Semester Ganjil 2024/2025", en: "Odd Semester 2024/2025" },
    dueDate: "2024-06-30",
    amount: 25000000,
    status: "Paid",
    paymentDate: "2024-06-25 10:45"
  },
  {
    id: "fin-1-2",
    componentName: { id: "Biaya Kuliah Paket Semester 1 (Tetap + SKS)", en: "Semester 1 Tuition Package (Fixed + Credits)" },
    semester: 1,
    billingPeriod: { id: "Semester Ganjil 2024/2025", en: "Odd Semester 2024/2025" },
    dueDate: "2024-08-10",
    amount: 19500000,
    status: "Paid",
    paymentDate: "2024-08-08 09:12"
  },
  {
    id: "fin-1-3",
    componentName: { id: "Biaya Matrikulasi & Jas Almamater - Semester 1", en: "Matriculation & Alma Mater Jacket Fee - Semester 1" },
    semester: 1,
    billingPeriod: { id: "Semester Ganjil 2024/2025", en: "Odd Semester 2024/2025" },
    dueDate: "2024-08-15",
    amount: 1500000,
    status: "Paid",
    paymentDate: "2024-08-12 11:00"
  }
];

export const dummyExams: ExamRecord[] = [
  {
    id: "ex-1",
    courseName: "Data Analytics",
    examType: "Final Exam",
    date: "2026-06-15",
    time: "08:00 - 10:00",
    room: { id: "Gedung C - C502", en: "Building C - C502" },
    seatNumber: "A-12"
  },
  {
    id: "ex-2",
    courseName: "Software Engineering",
    examType: "Final Exam",
    date: "2026-06-17",
    time: "10:00 - 12:30",
    room: { id: "Gedung C - C404", en: "Building C - C404" },
    seatNumber: "B-03"
  },
  {
    id: "ex-3",
    courseName: "Database Systems",
    examType: "Final Exam",
    date: "2026-06-19",
    time: "08:00 - 10:00",
    room: { id: "Gedung D - D601", en: "Building D - D601" },
    seatNumber: "C-15"
  },
  {
    id: "ex-4",
    courseName: "Computer Networks & Security",
    examType: "Final Exam",
    date: "2026-06-22",
    time: "13:00 - 15:30",
    room: { id: "Gedung C - C402", en: "Building C - C402" },
    seatNumber: "A-24"
  },
  {
    id: "ex-5",
    courseName: "Technopreneurship",
    examType: "Final Exam",
    date: "2026-06-24",
    time: "10:30 - 12:00",
    room: { id: "Gedung C - C303", en: "Building C - C303" },
    seatNumber: "E-09"
  }
];

export const dummyPreEnrollment: PreEnrollmentItem[] = [
  {
    id: "pre-1",
    code: "IF410",
    name: "Data Warehousing",
    sks: 3,
    lecturer: "Dr. Winarno, M.Kom.",
    schedule: "Monday, 10:30 - 13:00",
    enrolledCount: 38,
    quota: 40,
    selected: true
  },
  {
    id: "pre-2",
    code: "IF432",
    name: "Mobile Application Engineering",
    sks: 3,
    lecturer: "Maria Angela, S.Kom., M.T.C.S.E.",
    schedule: "Wednesday, 13:00 - 15:30",
    enrolledCount: 22,
    quota: 40,
    selected: false
  },
  {
    id: "pre-3",
    code: "IF452",
    name: "Distributed Systems & Edge Computing",
    sks: 3,
    lecturer: "Alexander Agung, M.Sc.",
    schedule: "Thursday, 08:00 - 10:30",
    enrolledCount: 15,
    quota: 40,
    selected: false
  },
  {
    id: "pre-4",
    code: "IF481",
    name: "Advanced Information Retrieval",
    sks: 3,
    lecturer: "Arya Wicaksana, M.Si.",
    schedule: "Friday, 13:00 - 15:30",
    enrolledCount: 31,
    quota: 40,
    selected: true
  },
  {
    id: "pre-5",
    code: "IF492",
    name: "Information System Audits & Security",
    sks: 3,
    lecturer: "Raymond Koswara, M.T.",
    schedule: "Tuesday, 08:30 - 11:00",
    enrolledCount: 19,
    quota: 40,
    selected: false
  }
];

export const dummyAddresses: Address[] = [
  {
    id: "addr-1",
    type: "Permanent (KTP)",
    street: "Jl. Boulevard Raya Gading Serpong, No. 42",
    village: "Kelapa Dua",
    district: "Kelapa Dua",
    city: "Tangerang",
    province: "Banten",
    postalCode: "15810"
  },
  {
    id: "addr-2",
    type: "Correspondence (Domisili)",
    street: "Apartemen Scientia Residences Tower B, Unit 1205",
    village: "Curug Sangereng",
    district: "Kelapa Dua",
    city: "Tangerang",
    province: "Banten",
    postalCode: "15811"
  }
];

export const dummyPhones: PhoneRecord[] = [
  {
    id: "ph-1",
    type: { id: "Ponsel (Pribadi / WA)", en: "Mobile (Personal / WhatsApp)" },
    countryCode: "+62",
    number: "81234567890",
    isPrimary: true
  },
  {
    id: "ph-2",
    type: { id: "Kontak Darurat (Orang Tua)", en: "Emergency Contact (Parents)" },
    countryCode: "+62",
    number: "89876543210",
    isPrimary: false
  }
];

export const dummyEmails: EmailRecord[] = [
  {
    id: "em-1",
    type: { id: "Email Kampus (SSO)", en: "Campus Email (SSO)" },
    address: "vassel.goleyu@student.umn.ac.id",
    isPrimary: true
  },
  {
    id: "em-2",
    type: { id: "Email Cadangan", en: "Backup Email" },
    address: "vassel.goleyu@gmail.com",
    isPrimary: false
  }
];

export const dummyAnnouncementList = [
  {
    id: "ann-1",
    title: { id: "Masa evaluasi tambah-batal KRS semester genap", en: "Even semester add/drop evaluation period" },
    category: { id: "Biro Administrasi Akademik (BAA)", en: "Academic Administration Bureau (BAA)" },
    date: "2026-06-08",
    content: {
      id: "Batas akhir membatalkan, menukar, atau mengisi seksi kelas paralel adalah 5 Juli. Persetujuan dosen pembimbing wajib diperoleh. Pastikan Virtual Account sudah lunas agar pengisian KRS tidak terkunci.",
      en: "The last day to drop, swap, or register parallel class sections is 5 July. Advisor approval is required. Make sure your Virtual Account is settled so enrollment is not locked."
    },
    isImportant: true
  },
  {
    id: "ann-2",
    title: { id: "Internship Fair 2026 di Gedung D", en: "Internship Fair 2026 in Building D" },
    category: { id: "Career Development Center (CDC)", en: "Career Development Center (CDC)" },
    date: "2026-06-10",
    content: {
      id: "Lebih dari 45 perusahaan teknologi, termasuk Tokopedia, BCA, dan Tiket.com, membuka wawancara langsung Kamis depan untuk mahasiswa Informatika program magang 6 bulan. Berpakaian rapi dan profesional.",
      en: "More than 45 tech companies, including Tokopedia, BCA, and Tiket.com, are interviewing Informatics students on campus next Thursday for 6-month internships. Dress professionally."
    },
    isImportant: false
  },
  {
    id: "ann-3",
    title: { id: "Pengingat konsultasi wajib dengan dosen pembimbing", en: "Reminder: mandatory advisor consultation" },
    category: { id: "Koordinator Program Studi (Kaprodi)", en: "Study Program Coordinator" },
    date: "2026-06-02",
    content: {
      id: "Seluruh mahasiswa semester 4 wajib bertemu dosen pembimbing untuk menyusun jalur mata kuliah pilihan semester 5. Draf rencana studi yang belum diserahkan akan menahan Kartu Studi Mahasiswa pada tahap berikutnya.",
      en: "All semester 4 students must meet their academic advisor to plan semester 5 electives. Study plans that are not submitted will hold your Student Study Card at the next stage."
    },
    isImportant: true
  }
];

export const dummyHelpTickets: HelpTicket[] = [
  {
    id: "TCK-5401",
    category: { id: "Pengisian KRS", en: "Course Enrollment" },
    subject: { id: "Kelas Data Analytics seksi A penuh", en: "Data Analytics section A is full" },
    status: "Resolved",
    createdAt: "2026-02-02 09:15",
    description: {
      id: "IPK saya memungkinkan mengambil hingga 24 SKS, tetapi seksi A mata kuliah IF301 sudah penuh. Apakah saya bisa mendapat pengecualian untuk masuk seksi A sesuai rencana studi saya?",
      en: "My GPA lets me take up to 24 SKS, but section A of IF301 is full. Can I get an exception to join section A as planned in my study plan?"
    },
    replies: [
      {
        sender: "Student",
        message: {
          id: "IPK saya memungkinkan mengambil hingga 24 SKS, tetapi seksi A mata kuliah IF301 sudah penuh. Apakah saya bisa mendapat pengecualian untuk masuk seksi A sesuai rencana studi saya?",
          en: "My GPA lets me take up to 24 SKS, but section A of IF301 is full. Can I get an exception to join section A as planned in my study plan?"
        },
        timestamp: "2026-02-02 09:15"
      },
      {
        sender: "HelpDesk Staff",
        message: {
          id: "Dosen pembimbing Anda sudah menyetujui penambahan kuota. BAA telah memperbarui rencana studi dan Anda terdaftar di seksi A.",
          en: "Your advisor has approved the extra seat. BAA has updated your study plan and you are now enrolled in section A."
        },
        timestamp: "2026-02-03 11:30"
      }
    ]
  },
  {
    id: "TCK-6295",
    category: { id: "Validasi Poin SKKM", en: "SKKM Point Validation" },
    subject: { id: "Sertifikat konser orkestra belum tercatat", en: "Orchestra concert certificate not recorded" },
    status: "Open",
    createdAt: "2026-06-11 08:30",
    description: {
      id: "Saya sudah mengumpulkan sertifikat penampilan pada konser Symphony Orchestra XI untuk 20 poin SKKM kategori Bakat dan Minat, tetapi statusnya masih menunggu pada catatan saya. Mohon bantuannya.",
      en: "I submitted my performance certificate from the Symphony Orchestra XI concert for 20 SKKM points in Talents and Interests, but it still shows as pending. Please help."
    },
    replies: [
      {
        sender: "Student",
        message: {
          id: "Saya sudah mengumpulkan sertifikat penampilan pada konser Symphony Orchestra XI untuk 20 poin SKKM kategori Bakat dan Minat, tetapi statusnya masih menunggu pada catatan saya. Mohon bantuannya.",
          en: "I submitted my performance certificate from the Symphony Orchestra XI concert for 20 SKKM points in Talents and Interests, but it still shows as pending. Please help."
        },
        timestamp: "2026-06-11 08:30"
      }
    ]
  }
];

export const dummyHandbooks: HandbookItem[] = [
  {
    title: { id: "Tata Tertib dan Nilai Karakter 5C UMN", en: "UMN Code of Conduct and 5C Values" },
    content: {
      id: "Seluruh civitas Universitas Multimedia Nusantara menjunjung nilai inti 5C dalam keseharian: Caring, Credible, Competent, Competitive, dan Customer Oriented. Mahasiswa wajib berpakaian sopan dan profesional di lingkungan kampus.",
      en: "Everyone at Universitas Multimedia Nusantara upholds the 5C core values every day: Caring, Credible, Competent, Competitive, and Customer Oriented. Students must dress modestly and professionally on campus."
    }
  },
  {
    title: { id: "Kebijakan Anti-Plagiarisme dan Integritas Akademik", en: "Anti-Plagiarism and Academic Integrity Policy" },
    content: {
      id: "Seluruh tugas pemrograman, skema basis data, dan metodologi penelitian harus merupakan hasil karya asli mahasiswa. Menyalin kode dari repositori atau sumber lain tanpa izin dosen dikategorikan sebagai pelanggaran akademik berat.",
      en: "All programming assignments, database schemas, and research methods must be the student's original work. Copying code from repositories or other sources without the lecturer's permission is a serious academic offence."
    }
  },
  {
    title: { id: "Ketentuan Kehadiran Minimum dan SKS", en: "Minimum Attendance and Credit Rules" },
    content: {
      id: "Mahasiswa wajib hadir minimal 75% dari seluruh pertemuan kuliah. Kehadiran di bawah 75% otomatis menggugurkan hak mengikuti Ujian Akhir Semester (UAS) dan nilai akhir tercatat E pada transkrip.",
      en: "Students must attend at least 75% of all class meetings. Attendance below 75% automatically removes the right to sit the final exam (UAS) and records a final grade of E on the transcript."
    }
  }
];

export const dummySemesterHistory = [
  {
    semesterIndex: 1,
    semesterName: { id: "Semester 1 · Ganjil 2024/2025", en: "Semester 1 · Odd 2024/2025" },
    gpa: "3.85",
    sks: 20,
    courses: [
      { code: "UM102", name: "Agama & Etika Kemahasiswaan", sks: 2, score: 92, gradeLetter: "A" },
      { code: "UM115", name: "Pancasila & Kewarganegaraan", sks: 2, score: 88, gradeLetter: "A" },
      { code: "IF101", name: "Introduction to Informatics", sks: 3, score: 94, gradeLetter: "A" },
      { code: "IF112", name: "Algorithms & Programming Basic", sks: 4, score: 87, gradeLetter: "A" },
      { code: "IF124", name: "Discrete Structure & Mathematics", sks: 3, score: 82, gradeLetter: "A-" },
      { code: "IF130", name: "Web Programming Basics", sks: 3, score: 96, gradeLetter: "A" },
      { code: "IF144", name: "Basic Physics & Electricity", sks: 3, score: 80, gradeLetter: "B+" }
    ]
  },
  {
    semesterIndex: 2,
    semesterName: { id: "Semester 2 · Genap 2024/2025", en: "Semester 2 · Even 2024/2025" },
    gpa: "3.88",
    sks: 21,
    courses: [
      { code: "UM202", name: "Indonesian Academic Composition", sks: 2, score: 86, gradeLetter: "A" },
      { code: "IF201", name: "Object Oriented Programming (OOP)", sks: 4, score: 91, gradeLetter: "A" },
      { code: "IF211", name: "Data Structures & Linear Algorithms", sks: 4, score: 89, gradeLetter: "A" },
      { code: "IF222", name: "Linear Algebra & Trigonometry", sks: 3, score: 84, gradeLetter: "A-" },
      { code: "IF231", name: "Computer Organization & Architectures", sks: 3, score: 92, gradeLetter: "A" },
      { code: "IF240", name: "Human-Computer Interactions", sks: 3, score: 95, gradeLetter: "A" },
      { code: "IF252", name: "Basic Statistics & Probabilities", sks: 2, score: 88, gradeLetter: "A" }
    ]
  },
  {
    semesterIndex: 3,
    semesterName: { id: "Semester 3 · Ganjil 2025/2026", en: "Semester 3 · Odd 2025/2026" },
    gpa: "4.00",
    sks: 20,
    courses: [
      { code: "UM301", name: "English Professional Communications", sks: 2, score: 95, gradeLetter: "A" },
      { code: "IF311", name: "Design & Analysis of Algorithms", sks: 4, score: 96, gradeLetter: "A" },
      { code: "IF320", name: "Operating Systems", sks: 3, score: 94, gradeLetter: "A" },
      { code: "IF331", name: "Numerical Methods", sks: 3, score: 92, gradeLetter: "A" },
      { code: "IF342", name: "State Auto Mechanics & Compile Theories", sks: 4, score: 91, gradeLetter: "A" },
      { code: "IF355", name: "Functional Programming Basics", sks: 2, score: 93, gradeLetter: "A" },
      { code: "IF362", name: "Computer Graphics", sks: 2, score: 98, gradeLetter: "A" }
    ]
  }
];
