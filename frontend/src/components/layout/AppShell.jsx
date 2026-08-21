import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import MobileNav from "./MobileNav.jsx";

export default function AppShell() {
  return (
    <div className="relative min-h-screen bg-void">
      <div className="pointer-events-none fixed inset-0 grid-backdrop opacity-60" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-[248px]">
          <Topbar />
          <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
