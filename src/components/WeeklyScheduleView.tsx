import { useMemo, useState } from "react";
import { Clock, MapPin, BookOpen, User } from "lucide-react";
import { Course } from "../types";
import { dummyStudent } from "../data";
import { WEEKDAYS, dayLabel } from "../lib/format";
import PageHeader from "./PageHeader";
import { usePrefs } from "../lib/preferences";

interface WeeklyScheduleViewProps {
  studentClasses: Course[];
}

const MAX_SKS = 24;

export default function WeeklyScheduleView({ studentClasses }: WeeklyScheduleViewProps) {
  const { tr, lang } = usePrefs();
  const [selectedDay, setSelectedDay] = useState<string>(() => new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Jakarta" }));

  const classesByDay = useMemo(() => {
    const grouped: Record<string, Course[]> = {};
    for (const course of studentClasses) (grouped[course.day] ??= []).push(course);
    for (const day of Object.keys(grouped)) grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return grouped;
  }, [studentClasses]);

  const totalSks = studentClasses.reduce((sum, item) => sum + item.sks, 0);
  const todaysClasses = classesByDay[selectedDay] ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={tr("JADWAL KULIAH", "CLASS SCHEDULE")}
        title={tr("Jadwal Mingguan", "Weekly Schedule")}
        description={tr("Jadwal perkuliahan semester berjalan lengkap dengan ruang, dosen pengampu, dan catatan kehadiran.", "This semester's classes with rooms, lecturers, and attendance records.")}
      >
        <span className="chip">Semester {dummyStudent.semester}</span>
        <span className="chip chip-gray">{studentClasses.length} {tr("mata kuliah", "courses")}</span>
      </PageHeader>

      <div className="tabs" role="group" aria-label={tr("Pilih hari", "Choose a day")}>
        {WEEKDAYS.map((day) => {
          const count = classesByDay[day]?.length ?? 0;
          return (
            <button key={day} type="button" className="tab inline-flex items-center gap-2" aria-pressed={selectedDay === day} onClick={() => setSelectedDay(day)}>
              <span>{dayLabel(day, lang)}</span>
              {count > 0 && (
                <span className={`min-w-4 h-4 px-1 rounded-full text-[9px] font-bold grid place-items-center ${selectedDay === day ? "bg-white/25 text-white" : "bg-umn-blue-100 text-umn-blue-600"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <section className="panel lg:col-span-2" aria-live="polite">
          <div className="panel-head">
            <div>
              <h3 className="panel-title">{tr(`Kelas hari ${dayLabel(selectedDay)}`, `Classes on ${selectedDay}`)}</h3>
              <p className="panel-sub">{tr(`${todaysClasses.length} mata kuliah terjadwal.`, `${todaysClasses.length} course${todaysClasses.length === 1 ? "" : "s"} scheduled.`)}</p>
            </div>
          </div>

          {todaysClasses.length > 0 ? (
            <div className="space-y-3">
              {todaysClasses.map((cl, index) => (
                <article key={cl.id} className="subtle-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-umn-blue-200 hover:bg-white transition-colors">
                  <div className="flex gap-4 min-w-0">
                    <div className={`schedule-line line-${index % 3}`} aria-hidden="true" />
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="code-tag">{cl.code}</span>
                        <span className="chip chip-gray">{tr("Seksi", "Section")} {cl.classSection}</span>
                      </div>
                      <h4 className="text-[13px] font-bold text-slate-800 leading-snug">{cl.name}</h4>
                      <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />{cl.startTime} – {cl.endTime}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />{tr("Ruang", "Room")} {cl.room}</span>
                        <span className="inline-flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />{cl.lecturerName}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-0 border-slate-200">
                    <span className="text-xs font-bold text-slate-700">{cl.sks} SKS</span>
                    <span className="chip chip-green whitespace-nowrap">{tr("Hadir", "Attended")} {cl.attendanceCount} / {cl.attendanceTotal}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="font-semibold text-slate-600">{tr("Tidak ada kuliah", "No classes")}</p>
              <p className="mt-1">{tr(`Tidak ada kuliah atau praktikum pada hari ${dayLabel(selectedDay)}.`, `There are no lectures or labs on ${selectedDay}.`)}</p>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="panel space-y-4">
            <h3 className="panel-title">{tr("Beban studi", "Study load")}</h3>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold text-slate-800">{totalSks}<span className="text-xs text-slate-400 font-sans font-medium ml-2">SKS</span></span>
              <span className="text-[11px] text-slate-400 font-semibold">{tr("Maksimal", "Max")} {MAX_SKS} SKS</span>
            </div>
            <div className={`progress ${totalSks > MAX_SKS ? "orange" : ""}`} role="progressbar" aria-valuemin={0} aria-valuemax={MAX_SKS} aria-valuenow={Math.min(totalSks, MAX_SKS)} aria-label={tr("Beban SKS", "Credit load")}>
              <span style={{ width: `${Math.min(100, Math.round((totalSks / MAX_SKS) * 100))}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {totalSks > MAX_SKS ? tr("Beban studi melebihi batas 24 SKS.", "Study load exceeds the 24 SKS limit.") : tr(`Masih tersisa ${MAX_SKS - totalSks} SKS sebelum mencapai batas maksimal.`, `${MAX_SKS - totalSks} SKS left before the maximum.`)}
            </p>
          </section>

          <section className="rounded-2xl p-5 hero-gradient space-y-3">
            <div className="flex items-center gap-2 text-amber-300">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <h3 className="text-xs font-bold uppercase tracking-wide">{tr("Pengingat jadwal", "Schedule reminders")}</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-blue-100 leading-relaxed">
              <li className="flex gap-2"><span className="text-umn-orange-500 font-bold">•</span><span>{tr("Kuliah dimulai tepat waktu. Presensi ditutup 15 menit setelah kuliah dimulai.", "Classes start on time. Attendance closes 15 minutes after the start.")}</span></li>
              <li className="flex gap-2"><span className="text-umn-orange-500 font-bold">•</span><span>{tr("Kelas berkode BL bersifat blended: pertemuan tatap muka mengikuti pola mingguan yang ditetapkan.", "BL sections are blended: in-person meetings follow the set weekly pattern.")}</span></li>
              <li className="flex gap-2"><span className="text-umn-orange-500 font-bold">•</span><span>{tr("Ruang kuliah dapat berubah. Pantau selalu email kampusmu.", "Rooms can change. Keep an eye on your campus email.")}</span></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
