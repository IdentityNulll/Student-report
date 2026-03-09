import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLessons } from "../features/lessons/lessonsSlice";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [
  { id: 1, label: "Period 1" },
  { id: 2, label: "Period 2" },
  { id: 3, label: "Period 3" },
  { id: 4, label: "Period 4" },
  { id: 5, label: "Period 5" },
];

function Schedule() {
  const dispatch = useDispatch();
  const lessons = useSelector((state) => state.lessons.list || []);
  const loading = useSelector((state) => state.lessons.loading);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Map: day -> period -> lesson
  const scheduleMap = React.useMemo(() => {
    const map = {};
    DAYS.forEach((day) => (map[day] = {}));
    lessons.forEach((lesson) => {
      if (!map[lesson.day]) return;
      map[lesson.day][lesson.period] = lesson;
    });
    return map;
  }, [lessons]);

  if (loading) {
    return <p className="text-[var(--text-muted)]">Loading schedule…</p>;
  }

  if (lessons.length === 0) {
    return <p className="text-[var(--text-muted)]">No lessons available</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
        Weekly Schedule
      </h1>
      <p className="text-sm text-[var(--text-muted)]">
        View your lessons by period
      </p>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-[var(--border-color)]">
          <caption className="sr-only">
            Weekly schedule showing periods and lessons
          </caption>
          <thead>
            <tr>
              <th className="border p-2 bg-[var(--bg-card)]"></th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className={`border p-2 text-center ${
                    day === today
                      ? "bg-[var(--color-secondary)] text-white font-semibold"
                      : "bg-[var(--bg-card)]"
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period) => (
              <tr key={period.id}>
                <th className="border p-2 bg-[var(--bg-card)] text-center">
                  {period.label}
                </th>
                {DAYS.map((day) => {
                  const lesson = scheduleMap[day][period.label];
                  return (
                    <td
                      key={day}
                      className={`border p-2 min-h-[60px] text-center rounded-md transition-colors ${
                        day === today
                          ? "bg-[var(--color-secondary)] text-white font-semibold"
                          : "bg-[var(--bg-card)]"
                      }`}
                      aria-label={
                        lesson
                          ? `${lesson.name} with ${lesson.teacher.firstName} ${lesson.teacher.lastName} on ${day} ${period.label}`
                          : `${period.label} on ${day} empty`
                      }
                    >
                      {lesson
                        ? `${lesson.name} (${lesson.teacher.firstName})`
                        : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {DAYS.map((day) => (
          <div
            key={day}
            className={`bg-[var(--bg-card)] rounded-[var(--radius)] p-4 border ${
              day === today ? "ring-2 ring-[var(--color-secondary)]" : ""
            }`}
          >
            <h2 className="font-semibold text-[var(--color-primary)] mb-2">
              {day}
            </h2>
            <div className="space-y-2">
              {PERIODS.map((period) => {
                const lesson = scheduleMap[day][period.label];
                return (
                  <div
                    key={period.id}
                    className="flex justify-between items-center bg-slate-100 p-2 rounded-md"
                  >
                    <span className="font-medium">{period.label}</span>
                    <span className="text-[var(--text-muted)]">
                      {lesson
                        ? `${lesson.name} (${lesson.teacher.firstName})`
                        : "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;
