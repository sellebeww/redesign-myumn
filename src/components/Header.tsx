import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Bell, ChevronDown, User, LogOut, Award, ShieldAlert, CheckCircle, Calendar, Menu, HelpCircle, GraduationCap, X } from "lucide-react";
import { dummyAnnouncementList, dummyStudent } from "../data";
import { flattenMenu } from "../lib/menu";
import { formatDate } from "../lib/format";
import { usePrefs } from "../lib/preferences";
import { LanguageSwitch, ThemeToggle } from "./PreferenceToggles";

interface HeaderProps {
  sessionEmail: string;
  onLogout: () => void;
  onSelectView: (viewId: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  mobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
  notificationsOpen: boolean;
  onNotificationsOpenChange: (val: boolean) => void;
  profileOpen: boolean;
  onProfileOpenChange: (val: boolean) => void;
  searchFocused: boolean;
  onSearchFocusedChange: (val: boolean) => void;
}

export default function Header({
  sessionEmail,
  onLogout,
  onSelectView,
  searchTerm,
  onSearchChange,
  mobileSidebarOpen,
  onToggleMobileSidebar,
  notificationsOpen,
  onNotificationsOpenChange,
  profileOpen,
  onProfileOpenChange,
  searchFocused,
  onSearchFocusedChange
}: HeaderProps) {
  const { tr, tx, lang } = usePrefs();
  const searchableItems = useMemo(() => flattenMenu(lang), [lang]);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const initials = dummyStudent.name.split(" ").map(part => part[0]).join("").slice(0, 2);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) onNotificationsOpenChange(false);
      if (profileRef.current && !profileRef.current.contains(target)) onProfileOpenChange(false);
      if (!target.closest("[data-search]")) onSearchFocusedChange(false);
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onNotificationsOpenChange(false);
        onProfileOpenChange(false);
        onSearchFocusedChange(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", escape);
    };
  }, [onNotificationsOpenChange, onProfileOpenChange, onSearchFocusedChange]);

  const filteredSuggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    const byName = searchableItems.filter(item => item.name.toLowerCase().includes(term));
    const byContext = searchableItems.filter(
      item => !byName.includes(item) && `${item.category} ${item.description}`.toLowerCase().includes(term)
    );
    return [...byName, ...byContext].slice(0, 8);
  }, [searchTerm, searchableItems]);

  const pickSuggestion = (id: string) => {
    onSelectView(id);
    onSearchChange("");
    onSearchFocusedChange(false);
    setMobileSearchOpen(false);
  };

  const renderSearch = (idSuffix: string, autoFocus = false) => (
    <div data-search className="relative">
      <Search aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        id={`header-search-${idSuffix}`}
        aria-label={tr("Cari layanan portal", "Search portal services")}
        type="search"
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder={tr("Cari layanan portal…", "Search portal services…")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => onSearchFocusedChange(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && filteredSuggestions[0]) {
            e.preventDefault();
            pickSuggestion(filteredSuggestions[0].id);
          }
        }}
        className="field rounded-full pl-10 py-2 text-xs min-h-0"
      />
      {searchFocused && searchTerm.trim().length > 0 && (
        <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs max-h-72 overflow-y-auto">
          <div className="px-3 py-1.5 mini-label border-b border-slate-100">{tr("Hasil pencarian layanan", "Service results")}</div>
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => pickSuggestion(item.id)}
                className="w-full text-left px-3 py-2 hover:bg-umn-blue-50 rounded-lg flex items-center justify-between gap-3 transition-colors mt-1 group"
              >
                <span className="font-medium text-slate-700 group-hover:text-umn-blue-600 transition-colors">{item.name}</span>
                <span className="chip chip-gray shrink-0">{item.category}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-slate-400 text-center">{tr(`Layanan “${searchTerm}” tidak ditemukan.`, `No service matches “${searchTerm}”.`)}</div>
          )}
        </div>
      )}
    </div>
  );

  const shortcuts = [
    { id: "enrollment/weekly-schedule", label: tr("Jadwal Mingguan", "Schedule"), icon: Calendar },
    { id: "student-information/grades", label: tr("Hasil Studi", "Grades"), icon: Award },
    { id: "help-desk", label: tr("Pusat Bantuan", "Help"), icon: HelpCircle }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between gap-2 px-3 sm:px-6 z-40 select-none">
      {/* Brand */}
      <div className="flex items-center gap-2 self-stretch md:w-64 md:-ml-6 md:pl-6 md:border-r md:border-slate-200 shrink-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-2 -ml-1 text-slate-600 hover:text-umn-blue-600 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          aria-label={mobileSidebarOpen ? tr("Tutup navigasi", "Close navigation") : tr("Buka navigasi", "Open navigation")}
          aria-expanded={mobileSidebarOpen}
          aria-controls="student-portal-sidebar"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <button type="button" aria-label={tr("MyUMN, ke dashboard", "MyUMN, go to dashboard")} onClick={() => onSelectView("dashboard")} className="flex items-center gap-2.5 group text-left">
          <img src="/myumn-mark.png" alt="" className="w-10 h-10 object-contain" />
          <span>
            <span className="text-[9px] text-slate-400 block tracking-[.18em] font-bold leading-none">MYUMN</span>
            <span className="block text-xs font-extrabold text-umn-blue-700 leading-normal font-display group-hover:text-umn-blue-600 transition-colors">Student Portal</span>
          </span>
        </button>
      </div>

      {/* Search (desktop) */}
      <div className="flex-1 max-w-sm lg:max-w-md mx-2 lg:mx-6 hidden sm:block">{renderSearch("desktop")}</div>

      {/* Right toolbox */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        <div className="hidden xl:flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-full text-[11px] font-medium text-slate-600">
          {shortcuts.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelectView(id)}
              className="px-3 py-1.5 rounded-full hover:bg-white hover:text-umn-blue-600 transition-colors flex items-center gap-1.5"
            >
              <Icon className="w-3.5 h-3.5 text-umn-blue-500" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <LanguageSwitch className="hidden md:inline-flex" />
        <ThemeToggle className="hidden sm:grid" />

        <button
          type="button"
          aria-label={tr("Cari layanan", "Search services")}
          aria-expanded={mobileSearchOpen}
          onClick={() => setMobileSearchOpen(open => !open)}
          className="sm:hidden p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:text-umn-blue-600 transition-colors"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            aria-label={tr("Notifikasi kampus", "Campus notifications")}
            aria-expanded={notificationsOpen}
            id="notifications-bell-btn"
            onClick={() => { onNotificationsOpenChange(!notificationsOpen); onProfileOpenChange(false); }}
            className="relative p-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:text-umn-blue-600 hover:bg-umn-blue-50 transition-all"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-umn-orange-500 border-2 border-white rounded-full" aria-hidden="true"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-1.5rem)] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs text-left">
              <div className="hero-gradient px-4 py-3.5 flex items-center justify-between">
                <span className="font-semibold text-sm font-display">{tr("Notifikasi kampus", "Campus notifications")}</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{dummyAnnouncementList.length} {tr("pengumuman", "announcements")}</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {dummyAnnouncementList.map((ann) => (
                  <button
                    key={ann.id}
                    type="button"
                    className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors"
                    onClick={() => { onSelectView("dashboard"); onNotificationsOpenChange(false); }}
                  >
                    <span className="flex items-start gap-2.5">
                      {ann.isImportant ? (
                        <ShieldAlert className="w-4 h-4 text-umn-orange-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="block">
                        <span className="block font-semibold text-slate-700 line-clamp-1">{tx(ann.title)}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{formatDate(ann.date, lang)} · {tx(ann.category)}</span>
                        <span className="block text-slate-500 text-[11px] line-clamp-2 mt-1 leading-normal">{tx(ann.content)}</span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                <button
                  id="view-all-announcements-btn"
                  type="button"
                  onClick={() => { onSelectView("dashboard"); onNotificationsOpenChange(false); }}
                  className="text-[11px] font-semibold text-umn-blue-600 hover:text-umn-blue-700 transition-colors py-1 block w-full"
                >
                  {tr("Lihat semua di dashboard", "View all on dashboard")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-label={tr("Menu profil", "Profile menu")}
            aria-expanded={profileOpen}
            id="profile-dropdown-btn"
            onClick={() => { onProfileOpenChange(!profileOpen); onNotificationsOpenChange(false); }}
            className="flex items-center gap-2 bg-slate-50 hover:bg-umn-blue-50 transition-all p-1 md:pr-3 rounded-full border border-slate-200"
          >
            <span className="w-8 h-8 rounded-full bg-umn-blue-600 flex items-center justify-center text-white font-bold text-[12px] font-display select-none flex-shrink-0">
              {initials}
            </span>
            <span className="text-left hidden md:block">
              <span className="block text-xs font-bold text-slate-800 leading-tight">{dummyStudent.name.split(" ")[0]}</span>
              <span className="block text-[10px] text-slate-400 leading-none mt-0.5">{dummyStudent.nim}</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-1.5rem)] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 text-xs text-slate-700 text-left">
              <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-1 bg-slate-50">
                <span className="font-bold text-slate-800 truncate">{sessionEmail}</span>
                <span className="text-slate-400">NIM {dummyStudent.nim}</span>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-500 font-semibold">{tr("IPK", "GPA")}</span>
                  <span className="chip chip-green">{dummyStudent.gpa}</span>
                </div>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => { onSelectView("student-information/profile"); onProfileOpenChange(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-umn-blue-600 transition-colors flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{tr("Profil akademik", "Academic profile")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onSelectView("self-service/degree-progress/my-requirements"); onProfileOpenChange(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-umn-blue-600 transition-colors flex items-center gap-2.5"
                >
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>{tr("Syarat kelulusan", "Graduation requirements")}</span>
                </button>
              </div>
              <div className="border-t border-slate-100 px-4 py-3 space-y-2.5">
                <p className="mini-label">{tr("Tampilan", "Display")}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600">{tr("Bahasa", "Language")}</span>
                  <LanguageSwitch />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600">{tr("Mode gelap", "Dark mode")}</span>
                  <ThemeToggle className="!w-9 !h-9" />
                </div>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-rose-600 font-semibold transition-colors flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{tr("Keluar", "Sign out")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search (mobile) */}
      {mobileSearchOpen && (
        <div className="sm:hidden absolute top-16 inset-x-0 bg-white border-b border-slate-200 p-3 shadow-md">
          {renderSearch("mobile", true)}
        </div>
      )}
    </header>
  );
}
