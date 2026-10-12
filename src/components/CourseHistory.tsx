import { dummySemesterHistory, dummyStudent } from "../data";
import PageHeader from "./PageHeader";
import { usePrefs } from "../lib/preferences";

export default function CourseHistoryView() {
  const { tr, tx } = usePrefs();
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={tr("REKAM AKADEMIK", "ACADEMIC RECORDS")}
        title={tr("Riwayat Mata Kuliah", "Course History")}
        description={tr("Daftar mata kuliah yang telah kamu tempuh pada setiap semester beserta SKS, nilai huruf, dan status kelulusan.", "Every course you have taken each semester, with credits, letter grades, and pass status.")}
      >
        <span className="chip chip-green">{tr("IPK", "GPA")} {dummyStudent.gpa}</span>
        <span className="chip">{dummyStudent.totalSks} {tr("SKS lulus", "SKS passed")}</span>
      </PageHeader>

      <div className="space-y-5">
        {dummySemesterHistory.map((sem) => (
          <section key={sem.semesterIndex} className="panel">
            <div className="panel-head">
              <div>
                <h3 className="panel-title">{tx(sem.semesterName)}</h3>
                <p className="panel-sub">Universitas Multimedia Nusantara</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="chip chip-gray">{tr("IP semester", "Semester GPA")} {sem.gpa}</span>
                <span className="chip">{sem.sks} SKS</span>
                <span className="chip chip-green">{tr("Lulus semua", "All passed")}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">{tr("Kode", "Code")}</th>
                    <th scope="col">{tr("Mata kuliah", "Course")}</th>
                    <th scope="col" className="text-center">SKS</th>
                    <th scope="col" className="text-center">{tr("Nilai", "Grade")}</th>
                    <th scope="col" className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.courses.map((crs) => (
                    <tr key={crs.code}>
                      <td><span className="code-tag">{crs.code}</span></td>
                      <td className="font-semibold text-slate-700">{crs.name}</td>
                      <td className="text-center text-slate-600">{crs.sks}</td>
                      <td className="text-center"><span className="chip">{crs.gradeLetter}</span></td>
                      <td className="text-center"><span className="chip chip-green">{tr("Lulus", "Passed")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
