import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance } from "../features/attendance/attendanceSlice";
import Loading from "../components/Loading";

function Attendance() {
  const dispatch = useDispatch();

  const attendanceState = useSelector((state) => state.attendance) || {};
  const { list, loading, error } = attendanceState;

  // if backend returns one object instead of array, convert it into array
  const attendanceList = Array.isArray(list) ? list : list ? [list] : [];

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  const formatReason = (reason) => {
    if (!reason) return "No reason";
    return reason
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "No date";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Invalid date";
    return parsed.toLocaleString();
  };

  const getReasonTypeStyle = (type) => {
    switch (type) {
      case "ABSENT":
        return "bg-red-100 text-red-700";
      case "LATE":
        return "bg-yellow-100 text-yellow-700";
      case "PRESENT":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white border border-red-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <p className="text-red-600 text-base sm:text-lg font-medium">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[var(--bg-main)]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
            My Attendance
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2">
            Here are all of your submitted attendance records.
          </p>
        </div>

        {attendanceList.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm p-6 sm:p-8 text-center text-sm sm:text-base text-[var(--text-muted)]">
            No attendance records found.
          </div>
        ) : (
          <div className="grid gap-4">
            {attendanceList.map((item) => (
              <div
                key={item.attendanceId}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                      {formatReason(item.reason)}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Submitted: {formatDate(item.submittedAt)}
                    </p>
                  </div>

                  <span
                    className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold ${getReasonTypeStyle(
                      item.reasonType
                    )}`}
                  >
                    {item.reasonType || "Unknown"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Reason</p>
                    <p className="text-slate-700">{formatReason(item.reason)}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-xs mb-1">Type</p>
                    <p className="text-slate-700">{item.reasonType || "Unknown"}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-slate-500 text-xs mb-1">Comment</p>
                    <p className="text-slate-700 break-words">
                      {item.comment || "No comment"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;