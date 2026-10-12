import { useState } from "react";
import { ChevronDown } from "lucide-react";
import PageHeader from "./PageHeader";
import { dummyHandbooks } from "../data";
import { usePrefs } from "../lib/preferences";

export default function HandbooksView() {
  const { tr, tx } = usePrefs();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={tr("PEDOMAN AKADEMIK", "ACADEMIC GUIDELINES")}
        title={tr("Buku Panduan Kampus", "Campus Handbooks")}
        description={tr("Tata tertib, ketentuan penilaian, dan aturan akademik yang berlaku bagi seluruh mahasiswa UMN.", "Code of conduct, grading rules, and academic regulations that apply to every UMN student.")}
      />
      <div className="space-y-3">
        {dummyHandbooks.map((handbook, index) => {
          const open = openIndex === index;
          return (
            <section key={index} className="panel p-0 overflow-hidden">
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="code-tag shrink-0">0{index + 1}</span>
                    <span className="font-display text-sm font-bold text-slate-800">{tx(handbook.title)}</span>
                  </span>
                  <ChevronDown aria-hidden="true" className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
              </h3>
              {open && <p className="px-6 pb-6 -mt-1 text-[13px] text-slate-600 leading-[1.8] max-w-3xl">{tx(handbook.content)}</p>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
