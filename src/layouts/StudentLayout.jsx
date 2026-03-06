export default function StudentLayout() {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-900 text-white h-screen p-4">
        Student Panel
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}