import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-900 text-white h-screen p-4">
        Teacher Panel
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}