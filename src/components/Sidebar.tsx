import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Star } from "lucide-react";
import { dummyStudent } from "../data";
import { findMenuItem, hasChildren, menuStructure, type MenuItem } from "../lib/menu";
import { openGroupsFor, toggleSidebarGroup } from "../lib/sidebar";
import { usePrefs } from "../lib/preferences";

interface SidebarProps {
  currentViewId: string;
  onSelectView: (viewId: string) => void;
  favourites: string[];
  onToggleFavourite: (viewId: string) => void;
  mobileSidebarOpen: boolean;
}

export default function Sidebar({
  currentViewId,
  onSelectView,
  favourites,
  onToggleFavourite,
  mobileSidebarOpen
}: SidebarProps) {
  const { tr, tx } = usePrefs();
  const currentIsGroup = hasChildren(findMenuItem(currentViewId));
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => openGroupsFor(currentViewId, currentIsGroup));

  // Whatever page is open, its category (and sub-category) is expanded and highlighted.
  useEffect(() => {
    setExpandedGroups(openGroupsFor(currentViewId, currentIsGroup));
  }, [currentViewId, currentIsGroup]);

  const initials = useMemo(() => dummyStudent.name.split(" ").map(part => part[0]).join("").slice(0, 2), []);

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isGroup = hasChildren(item);
    const isExpanded = !!expandedGroups[item.id];
    const isSelected = currentViewId === item.id;
    const isTrail = !isSelected && currentViewId.startsWith(item.id + "/");
    const state = isSelected ? "active" : isTrail ? "trail" : "idle";
    const Icon = item.icon;
    const canFavourite = !isGroup && item.id !== "dashboard" && item.id !== "my-favourites";
    const isFav = favourites.includes(item.id);
    const indent = depth === 0 ? "px-3 py-2.5" : depth === 1 ? "px-3 py-2" : "px-3 py-1.5";

    return (
      <div key={item.id}>
        <div className="nav-row group" data-state={state}>
          <button
            type="button"
            aria-current={isSelected ? "page" : undefined}
            onClick={() => onSelectView(item.id)}
            className={`nav-item ${indent} ${depth > 1 ? "text-[12.5px]" : ""} ${canFavourite ? "pr-9" : ""}`}
          >
            {Icon && <Icon aria-hidden="true" className="nav-icon w-[18px] h-[18px]" />}
            <span className="min-w-0 flex-1">{tx(item.name)}</span>
          </button>
          {isGroup && (
            <button
              type="button"
              className="nav-chevron"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? tr("Tutup", "Collapse") : tr("Buka", "Expand")} ${tr("submenu", "submenu")} ${tx(item.name)}`}
              onClick={() => setExpandedGroups(prev => toggleSidebarGroup(prev, item.id))}
            >
              {isExpanded ? <ChevronDown aria-hidden="true" className="w-4 h-4" /> : <ChevronRight aria-hidden="true" className="w-4 h-4" />}
            </button>
          )}
          {canFavourite && (
            <button
              type="button"
              onClick={() => onToggleFavourite(item.id)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-opacity hover:bg-amber-50 focus:opacity-100 group-hover:opacity-100 ${isFav ? "opacity-100 text-amber-500" : "opacity-0 text-slate-400 hover:text-amber-500"}`}
              aria-label={`${isFav ? tr("Hapus dari favorit", "Remove from favourites") : tr("Tambahkan ke favorit", "Add to favourites")}: ${tx(item.name)}`}
              aria-pressed={isFav}
            >
              <Star aria-hidden="true" className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400" : ""}`} />
            </button>
          )}
        </div>

        {isGroup && isExpanded && (
          <div className="nav-children">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      id="student-portal-sidebar"
      aria-label={tr("Navigasi portal", "Portal navigation")}
      className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-30 overflow-y-auto flex flex-col p-4 md:translate-x-0 transition-transform duration-300 ${
        mobileSidebarOpen ? "translate-x-0 visible" : "-translate-x-full invisible md:visible md:translate-x-0"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelectView("student-information/profile")}
        className="w-full bg-slate-50 border border-slate-200 hover:border-umn-blue-200 rounded-2xl p-3.5 flex items-center gap-3 text-left mb-4 transition-colors"
      >
        <span className="relative flex-shrink-0">
          <span className="w-11 h-11 bg-umn-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm font-display">
            {initials}
          </span>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" aria-hidden="true" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-xs font-bold text-slate-800 truncate">{dummyStudent.name}</span>
          <span className="block text-[11px] text-slate-500 mt-0.5">NIM {dummyStudent.nim}</span>
          <span className="chip mt-1.5">Semester {dummyStudent.semester}</span>
        </span>
      </button>

      <nav aria-label={tr("Menu utama", "Main menu")} className="flex-1 space-y-1">
        {menuStructure.map(item => renderMenuItem(item))}
      </nav>

      <div className="pt-4 mt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 select-none">
        <p className="font-semibold">Universitas Multimedia Nusantara</p>
        <p className="mt-0.5">{tr("Portal mahasiswa", "Student portal")}</p>
      </div>
    </aside>
  );
}
