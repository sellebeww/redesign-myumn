import { BookOpen, Brain, Code2, Cloud, ShieldCheck, Download, type LucideIcon } from "lucide-react";
import { useSavedState } from "../lib/storage";
import { downloadCsv } from "../lib/download";
import PageHeader from "./PageHeader";
import { usePrefs, type Bilingual } from "../lib/preferences";

interface MyPlannerViewProps {
  onTriggerToast: (msg: string) => void;
}

interface PlannedCourse {
  code: string;
  name: string;
  sks: number;
  term: number;
  description: Bilingual;
}

const TOTAL_SKS = 144;
const PASSED_SKS = 61;
const ACTIVE_SKS = 21;

const internship: Pick<PlannedCourse, "code" | "name" | "sks" | "term"> = { code: "IF471", name: "Industrial Internship", sks: 8, term: 7 };
const thesis: Pick<PlannedCourse, "code" | "name" | "sks" | "term"> = { code: "IF499", name: "Undergraduate Thesis", sks: 6, term: 8 };

const SPECIALIZATIONS: { name: string; icon: LucideIcon; courses: PlannedCourse[] }[] = [
  {
    name: "Data Engineering & Analytics",
    icon: Brain,
    courses: [
      { code: "IF410", name: "Data Warehousing", sks: 3, term: 5, description: { id: "Merancang basis data analitik, data mart, dan pipeline ETL yang andal.", en: "Design analytical databases, data marts, and reliable ETL pipelines." } },
      { code: "IF412", name: "Information Retrieval", sks: 3, term: 5, description: { id: "Pengindeksan, sistem pencarian, dan optimasi kueri basis data.", en: "Indexing, search systems, and database query optimisation." } },
      { code: "IF415", name: "Data Visualization", sks: 3, term: 6, description: { id: "Merancang grafik, dashboard, dan laporan data interaktif yang mudah diakses.", en: "Design accessible charts, dashboards, and interactive data reports." } },
      { code: "IF418", name: "Big Data Engineering", sks: 4, term: 6, description: { id: "Ekosistem Hadoop, pemrosesan aliran data dengan Spark, dan ekstraksi data berskala besar.", en: "Hadoop ecosystems, Spark stream processing, and large-scale data extraction." } },
      { ...internship, description: { id: "Magang penuh waktu selama 6 bulan di perusahaan mitra.", en: "A 6-month full-time placement at a partner company." } },
      { ...thesis, description: { id: "Penelitian akhir yang dipertahankan di hadapan dewan penguji.", en: "A final research project defended before an examining board." } }
    ]
  },
  {
    name: "Software Development",
    icon: Code2,
    courses: [
      { code: "IF421", name: "Enterprise Architecture & Design Patterns", sks: 3, term: 5, description: { id: "Transformasi monolit ke microservices, antrean peristiwa, dan desain arsitektur solid.", en: "Monolith-to-microservices transformation, event queues, and solid architecture." } },
      { code: "IF424", name: "Advanced Web & Mobile React Native", sks: 3, term: 5, description: { id: "Membangun aplikasi mobile hybrid berperforma tinggi dengan TypeScript.", en: "Build high-performance hybrid mobile apps with TypeScript." } },
      { code: "IF425", name: "Full-Stack DevOps & Deployment Pipelines", sks: 3, term: 6, description: { id: "Konfigurasi CI/CD, pengujian otomatis, dan strategi deployment blue-green.", en: "CI/CD setup, automated testing, and blue-green deployments." } },
      { code: "IF428", name: "Agile Development Methodologies", sks: 4, term: 6, description: { id: "Scrum lanjutan, estimasi sprint, dan perancangan proyek dengan Kanban.", en: "Advanced Scrum, sprint estimation, and Kanban project design." } },
      { ...internship, description: { id: "Magang 6 bulan yang berfokus pada pengembangan dan perilisan perangkat lunak.", en: "A 6-month internship focused on building and shipping software." } },
      { ...thesis, description: { id: "Skripsi rekayasa perangkat lunak berbasis karya orisinal.", en: "An original software engineering thesis." } }
    ]
  },
  {
    name: "Cloud Computing",
    icon: Cloud,
    courses: [
      { code: "IF431", name: "Distributed Infrastructure & Virtualization", sks: 3, term: 5, description: { id: "Hypervisor, virtualisasi kontainer Docker, jaringan, dan volume.", en: "Hypervisors, Docker container virtualisation, networking, and volumes." } },
      { code: "IF433", name: "Cloud Native Solution Architecture", sks: 3, term: 5, description: { id: "Arsitektur serverless, basis data terdistribusi, kebijakan IAM, dan penyimpanan cloud.", en: "Serverless architecture, distributed databases, IAM policies, and cloud storage." } },
      { code: "IF435", name: "Kubernetes Orchestration", sks: 3, term: 6, description: { id: "Mengatur klaster multi-node, service, ingress controller, dan secret.", en: "Manage multi-node clusters, services, ingress controllers, and secrets." } },
      { code: "IF438", name: "Reliability & Performance Budgets", sks: 4, term: 6, description: { id: "Monitoring lanjutan, tracing, pengumpulan metrik, dan aturan penskalaan klaster.", en: "Advanced monitoring, tracing, metrics collection, and cluster scaling rules." } },
      { ...internship, description: { id: "Magang operasi sistem yang berfokus pada orkestrasi cloud aktif.", en: "A systems operations internship focused on live cloud orchestration." } },
      { ...thesis, description: { id: "Penelitian mendalam tentang optimasi metrik klaster.", en: "In-depth research on cluster metric optimisation." } }
    ]
  },
  {
    name: "Cybersecurity",
    icon: ShieldCheck,
    courses: [
      { code: "IF441", name: "Applied Cryptography", sks: 3, term: 5, description: { id: "RSA, enkripsi simetris AES, kunci publik, dan protokol kriptografi.", en: "RSA, AES symmetric encryption, public keys, and cryptographic protocols." } },
      { code: "IF443", name: "Penetration Testing & Vulnerability Auditing", sks: 3, term: 5, description: { id: "Kerentanan OWASP Top 10, shell scripting, buffer overflow, dan audit keamanan.", en: "OWASP Top 10 vulnerabilities, shell scripting, buffer overflows, and security audits." } },
      { code: "IF445", name: "Digital Forensics & Malware Analytics", sks: 3, term: 6, description: { id: "Reverse engineering, jejak log sistem, dan perakitan paket jaringan.", en: "Reverse engineering, system log traces, and network packet reassembly." } },
      { code: "IF448", name: "Incident Response & SOC Management", sks: 4, term: 6, description: { id: "Protokol Security Operations Center, mitigasi langsung, dan threat hunting aktif.", en: "Security Operations Center protocols, live mitigation, and active threat hunting." } },
      { ...internship, description: { id: "Bergabung dengan tim SOC perusahaan untuk menguji protokol perlindungan siber.", en: "Join a corporate SOC team to test cyber protection protocols." } },
      { ...thesis, description: { id: "Analisis menyeluruh atas mitigasi ancaman di lingkungan perusahaan.", en: "A thorough analysis of threat mitigation in corporate environments." } }
    ]
  }
];

const CORE_COURSES: Record<number, { code: string; name: string; sks: number }[]> = {
  5: [
    { code: "IF401", name: "System Distributions & Networks", sks: 3 },
    { code: "IF402", name: "Formal Language Automata", sks: 4 }
  ],
  6: [
    { code: "IF451", name: "Ethical & Social Informatics", sks: 2 },
    { code: "UM402", name: "Scientific Writing Seminar", sks: 2 }
  ]
};

const TERMS = [5, 6, 7, 8];

export default function MyPlannerView({ onTriggerToast }: MyPlannerViewProps) {
  const { tr, tx } = usePrefs();
  const [selected, setSelected] = useSavedState<string>("myumn_specialization", SPECIALIZATIONS[0].name);
  const specialization = SPECIALIZATIONS.find(spec => spec.name === selected) ?? SPECIALIZATIONS[0];

  const futureSks = TOTAL_SKS - PASSED_SKS - ACTIVE_SKS;
  const progress = Math.round(((PASSED_SKS + ACTIVE_SKS) / TOTAL_SKS) * 100);
  const summary = [
    { label: tr("SKS lulus (semester 1–3)", "Credits passed (semesters 1–3)"), value: `${PASSED_SKS} SKS` },
    { label: tr("SKS aktif (semester 4)", "Current credits (semester 4)"), value: `${ACTIVE_SKS} SKS` },
    { label: tr("Rencana (semester 5–8)", "Planned (semesters 5–8)"), value: `${futureSks} SKS` }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={tr("PETA KELULUSAN", "GRADUATION MAP")}
        title={tr("Perencana Studi", "Study Planner")}
        description={tr("Pilih peminatan untuk melihat rekomendasi mata kuliah semester 5 sampai 8 agar lulus tepat waktu dalam 8 semester (144 SKS).", "Choose a specialization to see recommended courses for semesters 5 to 8 and graduate on time in 8 semesters (144 SKS).")}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
        {summary.map(item => (
          <div key={item.label} className="stat-card">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="font-display text-2xl font-bold mt-2 text-slate-800">{item.value}</p>
          </div>
        ))}
        <div className="stat-card">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>{tr("Progres kelulusan", "Graduation progress")}</span>
            <strong className="text-slate-800">{progress}%</strong>
          </div>
          <div className="progress green mt-5" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={tr("Progres kelulusan", "Graduation progress")}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <section className="panel space-y-5">
        <div>
          <h3 className="panel-title">{tr("Pilih peminatan", "Choose a specialization")}</h3>
          <p className="panel-sub">{tr("Pilihan ini memperbarui rekomendasi mata kuliah pilihan pada semester 5, 6, dan 7. Tersimpan di browser ini.", "This updates the recommended electives for semesters 5, 6, and 7. Saved in this browser.")}</p>
        </div>

        <div className="tabs" role="group" aria-label={tr("Peminatan", "Specialization")}>
          {SPECIALIZATIONS.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              className="tab inline-flex items-center gap-2"
              aria-pressed={selected === name}
              onClick={() => {
                setSelected(name);
                onTriggerToast(tr(`Rencana studi difokuskan pada peminatan ${name}.`, `Study plan now focuses on ${name}.`));
              }}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 mini-label">
          <BookOpen className="w-4 h-4 text-umn-blue-600" aria-hidden="true" />
          <span>{tr("Rekomendasi mata kuliah semester 5 – 8", "Recommended courses, semesters 5 – 8")}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TERMS.map(term => {
            const elective = specialization.courses.filter(c => c.term === term);
            const core = CORE_COURSES[term] ?? [];
            const totalSks = [...elective, ...core].reduce((sum, c) => sum + c.sks, 0);

            return (
              <article key={term} className="subtle-card flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-800">Semester {term}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tr("Proyeksi periode akademik", "Projected academic term")}</p>
                  </div>
                  <span className="chip">{totalSks} SKS</span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {elective.map(c => (
                    <div key={c.code} className="p-3 bg-white border border-slate-200 rounded-xl">
                      <div className="flex justify-between items-center gap-2">
                        <span className="code-tag">{c.code} · {tr("Pilihan peminatan", "Specialization elective")}</span>
                        <span className="text-[11px] font-semibold text-slate-400">{c.sks} SKS</span>
                      </div>
                      <p className="text-[13px] font-bold text-slate-800 mt-2 leading-snug">{c.name}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{tx(c.description)}</p>
                    </div>
                  ))}
                  {core.map(c => (
                    <div key={c.code} className="p-3 bg-white/70 border border-slate-100 rounded-xl flex justify-between items-center gap-3">
                      <div>
                        <span className="chip chip-gray">{c.code} · {tr("Wajib", "Core")}</span>
                        <p className="text-xs font-semibold text-slate-700 mt-1.5">{c.name}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">{c.sks} SKS</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => downloadCsv(tr(`rencana-semester-${term}.csv`, `semester-${term}-plan.csv`), [[tr("Kode", "Code"), tr("Mata kuliah", "Course"), "SKS"], ...[...elective, ...core].map(c => [c.code, c.name, c.sks])])}
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" /> {tr("Unduh rencana semester (CSV)", "Download semester plan (CSV)")}
                </button>
              </article>
            );
          })}
        </div>

        <p className="notice">
          {tr(`Daftar ini hanya memuat mata kuliah utama tiap peminatan. Sisa SKS menuju ${TOTAL_SKS} SKS diisi dengan mata kuliah pilihan bebas bersama dosen pembimbing.`, `This list only shows each specialization's main courses. The remaining credits toward ${TOTAL_SKS} SKS are free electives chosen with your advisor.`)}
        </p>
      </section>
    </div>
  );
}
