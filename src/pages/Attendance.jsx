import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function Attendance() {
  const { list: attendanceList, loading, error } = useSelector(
    (state) => state.attendance
  );

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
      <div className="p-4 sm:p-6">
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 shadow-sm">
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            Loading attendance...
          </p>
        </div>
      </div>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
            Attendance Records
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2">
            View all submitted attendance reports here.
          </p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
          {attendanceList.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-[var(--text-muted)]">
              No attendance records found.
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="block lg:hidden p-4 space-y-4">
                {attendanceList.map((item) => {
                  const student = item.studentResponseDto;

                  return (
                    <div
                      key={item.attendanceId}
                      className="border border-[var(--border-color)] rounded-xl p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                          {student?.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            `${student?.firstName?.[0] || ""}${
                              student?.lastName?.[0] || ""
                            }`
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-sm sm:text-base break-words">
                            {student?.firstName} {student?.lastName}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500">
                            {student?.role || "Student"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Email</p>
                          <p className="text-slate-700 break-all">
                            {student?.email || "No email"}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500 text-xs mb-1">Reason</p>
                          <p className="text-slate-700">
                            {formatReason(item.reason)}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500 text-xs mb-1">Type</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getReasonTypeStyle(
                              item.reasonType
                            )}`}
                          >
                            {item.reasonType || "Unknown"}
                          </span>
                        </div>

                        <div>
                          <p className="text-slate-500 text-xs mb-1">Comment</p>
                          <p className="text-slate-700 break-words">
                            {item.comment || "No comment"}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500 text-xs mb-1">
                            Submitted At
                          </p>
                          <p className="text-slate-700">
                            {formatDate(item.submittedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-slate-50 border-b border-[var(--border-color)]">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                        Student
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                        Email
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                        Reason
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                        Type
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                        Comment
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                        Submitted At
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendanceList.map((item) => {
                      const student = item.studentResponseDto;

                      return (
                        <tr
                          key={item.attendanceId}
                          className="border-b border-[var(--border-color)] hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                                {student?.photoUrl ? (
                                  <img
                                    src={student.photoUrl}
                                    alt={`${student.firstName} ${student.lastName}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  `${student?.firstName?.[0] || ""}${
                                    student?.lastName?.[0] || ""
                                  }`
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {student?.firstName} {student?.lastName}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {student?.role}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-slate-700">
                            {student?.email || "No email"}
                          </td>

                          <td className="px-6 py-4 text-slate-700">
                            {formatReason(item.reason)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getReasonTypeStyle(
                                item.reasonType
                              )}`}
                            >
                              {item.reasonType || "Unknown"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-slate-700 max-w-[250px]">
                            <p className="truncate" title={item.comment}>
                              {item.comment || "No comment"}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-slate-700">
                            {formatDate(item.submittedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;