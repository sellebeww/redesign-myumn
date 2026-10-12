import { Star } from "lucide-react";
import PageHeader from "./PageHeader";
import { ServiceCard } from "./CategoryDirectory";
import { findMenuItem, getMenuTrail } from "../lib/menu";
import { usePrefs } from "../lib/preferences";

interface FavouritesViewProps {
  favourites: string[];
  onOpen: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export default function FavouritesView({ favourites, onOpen, onToggleFavourite }: FavouritesViewProps) {
  const { tr, tx } = usePrefs();
  const items = favourites.map(id => findMenuItem(id)).filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader eyebrow={tr("PINTASAN", "SHORTCUTS")} title={tr("Favorit Saya", "My Favourites")} description={tr("Layanan yang kamu tandai bintang tersimpan di sini agar mudah dibuka kembali.", "Services you star are kept here so you can reopen them quickly.")}>
        <span className="chip chip-amber">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
          {items.length} {tr("favorit", items.length === 1 ? "favourite" : "favourites")}
        </span>
      </PageHeader>

      {items.length === 0 ? (
        <div className="panel">
          <div className="empty-state max-w-lg mx-auto border-0">
            <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-400 mb-4">
              <Star className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">{tr("Belum ada favorit", "No favourites yet")}</h3>
            <p className="mt-1.5">{tr("Klik ikon bintang di samping layanan pada menu kiri, atau pada kartu layanan di halaman kategori, untuk menambahkannya ke sini.", "Click the star next to a service in the left menu, or on a service card in a category page, to add it here.")}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <ServiceCard
              key={item.id}
              item={item}
              category={(() => { const root = getMenuTrail(item.id)[0]; return root ? tx(root.name) : undefined; })()}
              isFavourite
              onOpen={onOpen}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
