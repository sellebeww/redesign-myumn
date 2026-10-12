import { ArrowRight, Star } from "lucide-react";
import PageHeader from "./PageHeader";
import { hasChildren, type MenuItem } from "../lib/menu";
import { usePrefs } from "../lib/preferences";

interface ServiceCardProps {
  item: MenuItem;
  category?: string;
  isFavourite: boolean;
  onOpen: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export function ServiceCard({ item, category, isFavourite, onOpen, onToggleFavourite }: ServiceCardProps) {
  const { tr, tx } = usePrefs();
  const Icon = item.icon;
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl hover:border-umn-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <button type="button" onClick={() => onOpen(item.id)} className="w-full h-full text-left p-5 pr-14 flex flex-col gap-3 rounded-2xl">
        <span className="flex items-center gap-3">
          {Icon && (
            <span className="w-9 h-9 rounded-xl bg-umn-blue-50 text-umn-blue-600 flex items-center justify-center shrink-0">
              <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
            </span>
          )}
          <span className="min-w-0">
            {category && <span className="mini-label block text-[9px] mb-0.5">{category}</span>}
            <span className="block text-[13px] font-bold text-slate-800 group-hover:text-umn-blue-600 transition-colors leading-snug">{tx(item.name)}</span>
          </span>
        </span>
        <span className="block text-xs text-slate-500 leading-relaxed line-clamp-3">{tx(item.description)}</span>
        <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-umn-blue-600">
          {tr("Buka halaman", "Open page")} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </button>
      <button
        type="button"
        onClick={() => onToggleFavourite(item.id)}
        aria-pressed={isFavourite}
        aria-label={`${isFavourite ? tr("Hapus dari favorit", "Remove from favourites") : tr("Tambahkan ke favorit", "Add to favourites")}: ${tx(item.name)}`}
        className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-colors ${
          isFavourite
            ? "bg-amber-50 border-amber-200 text-amber-500"
            : "bg-slate-50 border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-200"
        }`}
      >
        <Star className={`w-3.5 h-3.5 ${isFavourite ? "fill-amber-400" : ""}`} aria-hidden="true" />
      </button>
    </div>
  );
}

interface CategoryDirectoryProps {
  item: MenuItem;
  favourites: string[];
  onOpen: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

/** Overview of everything inside a sidebar category or sub-category. */
export default function CategoryDirectory({ item, favourites, onOpen, onToggleFavourite }: CategoryDirectoryProps) {
  const { tr, tx } = usePrefs();
  const children = item.children ?? [];
  const leaves = children.filter(child => !hasChildren(child));
  const groups = children.filter(child => hasChildren(child));
  const pageCount = leaves.length + groups.reduce((sum, group) => sum + (group.children?.length ?? 0), 0);
  const Icon = item.icon;

  return (
    <div className="space-y-8 animate-fade-in" id="category-index-directory">
      <PageHeader eyebrow={tr("KATEGORI LAYANAN", "SERVICE CATEGORY")} title={tx(item.name)} description={tx(item.description)}>
        <span className="chip">
          {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
          {pageCount} {tr("halaman", pageCount === 1 ? "page" : "pages")}
        </span>
      </PageHeader>

      {leaves.length > 0 && (
        <section className="space-y-3" aria-label={groups.length > 0 ? tr("Halaman langsung", "Direct pages") : tx(item.name)}>
          {groups.length > 0 && <h3 className="mini-label">{tr("Halaman langsung", "Direct pages")}</h3>}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {leaves.map(leaf => (
              <ServiceCard key={leaf.id} item={leaf} isFavourite={favourites.includes(leaf.id)} onOpen={onOpen} onToggleFavourite={onToggleFavourite} />
            ))}
          </div>
        </section>
      )}

      {groups.map(group => (
        <section key={group.id} className="space-y-3" aria-label={tx(group.name)}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-sm bg-umn-orange-500" aria-hidden="true" />
              <h3 className="font-display text-sm font-bold text-slate-800">{tx(group.name)}</h3>
              <span className="chip chip-gray">{group.children?.length} {tr("halaman", group.children?.length === 1 ? "page" : "pages")}</span>
            </div>
            <button type="button" onClick={() => onOpen(group.id)} className="text-xs font-semibold text-umn-blue-600 hover:text-umn-blue-650 inline-flex items-center gap-1">
              {tr("Lihat kategori", "View category")} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {group.children?.map(child => (
              <ServiceCard key={child.id} item={child} isFavourite={favourites.includes(child.id)} onOpen={onOpen} onToggleFavourite={onToggleFavourite} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
