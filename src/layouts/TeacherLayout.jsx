import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function TeacherLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Sidebar />

      <main className="ml-20 md:ml-72 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
