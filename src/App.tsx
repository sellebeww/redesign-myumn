import { useState, useEffect, useRef, Fragment } from "react";
import { ChevronRight, SearchX } from "lucide-react";
import { dummyCourses, dummyStudent, dummySkkmEvents, dummyHelpTickets } from "./data";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Course } from "./types";

import Dashboard from "./components/Dashboard";
import { useSavedState } from "./lib/storage";
import { findMenuItem, getMenuTrail, hasChildren } from "./lib/menu";
import { usePrefs } from "./lib/preferences";
import WeeklyScheduleView from "./components/WeeklyScheduleView";
import SkkmPointsView from "./components/SkkmPointsView";
import HelpDeskView from "./components/HelpDeskView";
import MyPlannerView from "./components/MyPlanner";
import CourseHistoryView from "./components/CourseHistory";
import PersonalDataView from "./components/PersonalDataView";
import EnrollmentManagerView from "./components/EnrollmentManager";
import PerformanceDashboard from "./components/PerformanceDashboard";
import CategoryDirectory from "./components/CategoryDirectory";
import FavouritesView from "./components/FavouritesView";
import HandbooksView from "./components/HandbooksView";

const PERSONAL_INFO_VIEWS = [
  "self-service/personal-info/personal-data-summary",
  "self-service/personal-info/names",
  "self-service/personal-info/addresses",
  "self-service/personal-info/phone-numbers",
  "self-service/personal-info/email-addresses",
  "student-information/profile"
];

const ENROLLMENT_VIEWS = [
  "enrollment/pre-enrollment",
  "enrollment/shopping-cart",
  "enrollment/swap-classes",
  "enrollment/drop-classes",
  "enrollment/my-exam",
  "enrollment/dates",
  "enrollment/internship",
  "enrollment/confirmation"
];

const PERFORMANCE_VIEWS = [
  "student-information/finance",
  "student-information/grades",
  "student-information/attendance",
  "self-service/academic-records/my-advisors",
  "self-service/degree-progress/my-requirements"
];

const COURSE_HISTORY_VIEWS = [
  "self-service/academic-planning/course-history",
  "self-service/academic-records/course-history"
];

const readHash = () => {
  const raw = location.hash.slice(1);
  try { return decodeURIComponent(raw) || "dashboard"; } catch { return raw || "dashboard"; }
};

export default function App({ sessionEmail, onLogout }: { sessionEmail: string; onLogout: () => void }) {
  const { tr, tx } = usePrefs();
  const [currentViewId, setCurrentViewId] = useState<string>(readHash);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const [shoppingCart, setShoppingCart] = useSavedState<Course[]>("myumn_cart", []);
  const [studentClasses, setStudentClasses] = useSavedState<Course[]>("myumn_classes", dummyCourses);
  const [favourites, setFavourites] = useSavedState<string[]>("myumn_favourites", []);

  const activeItem = findMenuItem(currentViewId);
  const isCategoryView = hasChildren(activeItem);
  const trail = getMenuTrail(currentViewId);

  useEffect(() => {
    const sync = () => setCurrentViewId(readHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (readHash() !== currentViewId) location.hash = currentViewId;
    window.scrollTo({ top: 0, behavior: "instant" });
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSearchFocused(false);
    setSearchTerm("");
    // Opening a category keeps the drawer open so its pages stay visible; opening a page closes it.
    if (!isCategoryView) setMobileSidebarOpen(false);
  }, [currentViewId, isCategoryView]);

  useEffect(() => {
    document.title = `${activeItem ? tx(activeItem.name) : tr("Halaman tidak ditemukan", "Page not found")} · MyUMN`;
  }, [activeItem, tx, tr]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const toggleFavourite = (viewId: string) => {
    const item = findMenuItem(viewId);
    const name = item ? tx(item.name) : tr("Layanan", "Service");
    const wasFavourite = favourites.includes(viewId);
    setFavourites(prev => (prev.includes(viewId) ? prev.filter(id => id !== viewId) : [...prev, viewId]));
    triggerToast(wasFavourite ? tr(`“${name}” dihapus dari favorit.`, `“${name}” removed from favourites.`) : tr(`“${name}” ditambahkan ke favorit.`, `“${name}” added to favourites.`));
  };

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  const triggerToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setSuccessToast(msg);
    toastTimer.current = setTimeout(() => setSuccessToast(null), 3500);
  };

  const isKnownView =
    !!activeItem ||
    PERSONAL_INFO_VIEWS.includes(currentViewId) ||
    ENROLLMENT_VIEWS.includes(currentViewId) ||
    PERFORMANCE_VIEWS.includes(currentViewId);

  return (
    <div className="min-h-screen app-bg font-sans flex flex-col text-slate-800 antialiased selection:bg-umn-blue-100">
      <a href="#main-content" className="skip-link" onClick={e => { e.preventDefault(); document.getElementById("main-content")?.focus(); }}>{tr("Lewati navigasi", "Skip to content")}</a>

      {successToast && (
        <div role="status" aria-live="polite" id="toast-success-banner" className="fixed top-20 right-4 left-4 sm:left-auto sm:max-w-sm bg-umn-blue-850 border-l-4 border-umn-orange-500 text-white px-5 py-3.5 rounded-xl shadow-2xl z-50 animate-slide-in">
          <p className="text-[11px] font-semibold text-blue-200">{tr("Pemberitahuan", "Notice")}</p>
          <p className="text-xs text-slate-100 font-medium mt-0.5">{successToast}</p>
        </div>
      )}

      <Header
        sessionEmail={sessionEmail}
        onLogout={onLogout}
        onSelectView={setCurrentViewId}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen(open => !open)}
        notificationsOpen={notificationsOpen}
        onNotificationsOpenChange={setNotificationsOpen}
        profileOpen={profileOpen}
        onProfileOpenChange={setProfileOpen}
        searchFocused={searchFocused}
        onSearchFocusedChange={setSearchFocused}
      />

      <div className="pt-16 flex flex-1 relative">
        {mobileSidebarOpen && (
          <div
            aria-hidden="true"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 top-16 bg-umn-blue-850/40 z-30 md:hidden backdrop-blur-xs"
          />
        )}

        <Sidebar
          currentViewId={currentViewId}
          onSelectView={setCurrentViewId}
          favourites={favourites}
          onToggleFavourite={toggleFavourite}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        <main id="main-content" tabIndex={-1} className="flex-1 md:ml-64 min-w-0 px-4 md:px-10 py-6 md:py-8 app-bg outline-none">
          {/* Breadcrumb */}
          {currentViewId !== "dashboard" && (
            <nav aria-label={tr("Jejak halaman", "Breadcrumb")} className="mb-5">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 font-medium">
                <li>
                  <button type="button" className="hover:text-umn-blue-600 transition-colors" onClick={() => setCurrentViewId("dashboard")}>MyUMN</button>
                </li>
                {(trail.length ? trail.map(item => ({ id: item.id, name: tx(item.name) })) : [{ id: currentViewId, name: tr("Halaman tidak ditemukan", "Page not found") }]).map((crumb, index, list) => {
                  const last = index === list.length - 1;
                  return (
                    <Fragment key={crumb.id}>
                      <li aria-hidden="true"><ChevronRight className="w-3 h-3 text-slate-300" /></li>
                      <li>
                        {last ? (
                          <span aria-current="page" className="text-umn-blue-600 font-semibold">{crumb.name}</span>
                        ) : (
                          <button type="button" className="hover:text-umn-blue-600 transition-colors" onClick={() => setCurrentViewId(crumb.id)}>{crumb.name}</button>
                        )}
                      </li>
                    </Fragment>
                  );
                })}
              </ol>
            </nav>
          )}

          {currentViewId === "dashboard" && <Dashboard courses={studentClasses} navigate={setCurrentViewId} />}

          {isCategoryView && activeItem && (
            <CategoryDirectory
              item={activeItem}
              favourites={favourites}
              onOpen={setCurrentViewId}
              onToggleFavourite={toggleFavourite}
            />
          )}

          {currentViewId === "my-favourites" && (
            <FavouritesView favourites={favourites} onOpen={setCurrentViewId} onToggleFavourite={toggleFavourite} />
          )}

          {currentViewId === "enrollment/weekly-schedule" && <WeeklyScheduleView studentClasses={studentClasses} />}

          {currentViewId === "enrollment/skkm-points" && (
            <SkkmPointsView initialEvents={dummySkkmEvents} studentName={dummyStudent.name} onTriggerToast={triggerToast} />
          )}

          {PERSONAL_INFO_VIEWS.includes(currentViewId) && (
            <PersonalDataView subViewId={currentViewId} onTriggerToast={triggerToast} />
          )}

          {ENROLLMENT_VIEWS.includes(currentViewId) && (
            <EnrollmentManagerView
              subViewId={currentViewId}
              shoppingCart={shoppingCart}
              setShoppingCart={setShoppingCart}
              studentClasses={studentClasses}
              setStudentClasses={setStudentClasses}
              onTriggerToast={triggerToast}
            />
          )}

          {PERFORMANCE_VIEWS.includes(currentViewId) && (
            <PerformanceDashboard subViewId={currentViewId} studentClasses={studentClasses} onTriggerToast={triggerToast} />
          )}

          {currentViewId === "self-service/academic-planning/my-planner" && <MyPlannerView onTriggerToast={triggerToast} />}

          {COURSE_HISTORY_VIEWS.includes(currentViewId) && <CourseHistoryView />}

          {currentViewId === "handbooks" && <HandbooksView />}

          {currentViewId === "help-desk" && <HelpDeskView initialTickets={dummyHelpTickets} onTriggerToast={triggerToast} />}

          {!isKnownView && (
            <div className="panel text-center space-y-4 max-w-xl mx-auto mt-10 py-12">
              <div className="mx-auto w-12 h-12 bg-umn-blue-50 rounded-full flex items-center justify-center text-umn-blue-600">
                <SearchX className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-display text-lg font-bold text-slate-800">{tr("Halaman tidak ditemukan", "Page not found")}</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {tr("Alamat yang kamu buka tidak tersedia. Pilih layanan dari menu navigasi atau kembali ke dashboard.", "The address you opened does not exist. Choose a service from the menu or go back to the dashboard.")}
              </p>
              <button type="button" onClick={() => setCurrentViewId("dashboard")} className="btn btn-primary">
                {tr("Kembali ke dashboard", "Back to dashboard")}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
