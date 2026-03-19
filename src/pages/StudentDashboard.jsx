import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiSend,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance } from "../features/attendance/attendanceSlice";
import api from "../api/axios";
import Loading from "../components/Loading";

function StudentDashboard() {
  const dispatch = useDispatch();

  const { list, loading: attendanceLoading, error } = useSelector(
    (state) => state.attendance || {}
  );

  const attendanceList = Array.isArray(list) ? list : list ? [list] : [];
  const latestReport = attendanceList[0] || null;

  const [mainStatus, setMainStatus] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [studentName, setStudentName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reasonMap = {
    Sick: "SICK",
    "Family Problem": "FAMILY_MATTER",
    "Cannot Go": "TRAVELING",
    Emergency: "EMERGENCY",
    Course: "COURSE",
  };

  const reasons = [
    "Sick",
    "Family Problem",
    "Cannot Go",
    "Emergency",
    "Course",
  ];

  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (firstName || lastName) {
      setStudentName(`${firstName || ""} ${lastName || ""}`.trim());
    }

    dispatch(fetchAttendance());
  }, [dispatch]);

  useEffect(() => {
    if (latestReport?.studentResponseDto) {
      setStudentName(
        `${latestReport.studentResponseDto.firstName} ${latestReport.studentResponseDto.lastName}`
      );
    }
  }, [latestReport]);

  const isLocked = useMemo(() => attendanceList.length > 0, [attendanceList]);
  const submitted = isLocked;
  const report = latestReport;

  const handleMainSelect = (status) => {
    if (isLocked) return;
    setMainStatus(status);
    setReason("");
  };

  const handleSubmit = async () => {
    const studentId = localStorage.getItem("id");

    if (!studentId) {
      toast.error("Student ID missing!");
      return;
    }

    if (!mainStatus) {
      toast.error("Please select Absent or Late!");
      return;
    }

    if (mainStatus === "Absent" && !reason) {
      toast.error("Please select a reason for absence!");
      return;
    }

    const payload = {
      studentId,
      reason: mainStatus === "Late" ? null : reasonMap[reason] || "EMERGENCY",
      reasonType: mainStatus.toUpperCase(),
      comment: comment.trim() || "No comment",
    };

    try {
      setSubmitting(true);

      await api.post("/attendance", payload);
      await dispatch(fetchAttendance()).unwrap();

      setMainStatus("");
      setReason("");
      setComment("");

      toast.success("Attendance submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatReason = (value) => {
    if (!value) return "No reason";
    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (attendanceLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="space-y-6 lg:col-span-2">
            {/* Welcome Card */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">
                    Student Dashboard
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight">
                    Welcome, {studentName || "Student"}
                  </h1>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {!isLocked
                      ? "Please report your attendance status for today."
                      : "Your attendance has already been recorded for today."}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
                  <FiCheckCircle className="text-base" />
                  Academic Portal
                </div>
              </div>
            </div>

            {/* Redux error */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Attendance Form */}
            {!isLocked && (
              <div className="rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Attendance Submission</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Select your attendance status and provide the required details.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleMainSelect("Absent")}
                    className={`group rounded-xl border p-4 text-left transition ${
                      mainStatus === "Absent"
                        ? "border-red-300 bg-red-50"
                        : "border-[var(--border-color)] bg-white hover:border-red-300 hover:bg-red-50/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-xl p-3 ${
                          mainStatus === "Absent"
                            ? "bg-red-500 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:text-red-500"
                        }`}
                      >
                        <FiXCircle className="text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Absent</h3>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          Report that you will not attend today.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMainSelect("Late")}
                    className={`group rounded-xl border p-4 text-left transition ${
                      mainStatus === "Late"
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-[var(--border-color)] bg-white hover:border-yellow-300 hover:bg-yellow-50/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-xl p-3 ${
                          mainStatus === "Late"
                            ? "bg-yellow-500 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:text-yellow-500"
                        }`}
                      >
                        <FiClock className="text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Late</h3>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          Report that you may arrive later than usual.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {mainStatus === "Absent" && (
                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Reason for absence
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {reasons.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReason(r)}
                          className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                            reason === r
                              ? "border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]"
                              : "border-[var(--border-color)] bg-white text-[var(--text-main)] hover:bg-slate-50"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(mainStatus === "Absent" || mainStatus === "Late") && (
                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-[var(--text-main)]">
                      Comment
                    </label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        mainStatus === "Late"
                          ? "Explain why you may be late..."
                          : "Leave an additional comment..."
                      }
                      className="w-full rounded-xl border border-[var(--border-color)] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary)]"
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiSend />
                    {submitting ? "Submitting..." : "Submit Attendance"}
                  </button>
                </div>
              </div>
            )}

            {/* Report Card */}
            {submitted && report && (
              <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-green-50 p-3 text-green-600">
                    <FiCheckCircle className="text-2xl" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">Attendance Recorded</h2>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Your attendance information has been successfully submitted.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[var(--bg-main)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Student Name
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {report.studentResponseDto?.firstName}{" "}
                      {report.studentResponseDto?.lastName}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-main)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {report.reasonType || "Unknown"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-main)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Reason
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {formatReason(report.reason)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-main)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Comment
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {report.comment || "No comment"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Attendance Guidelines</h3>
              <div className="mt-4 space-y-4 text-sm text-[var(--text-muted)]">
                <div className="flex gap-3">
                  <FiAlertCircle className="mt-0.5 text-[var(--color-primary)]" />
                  <p>
                    Submit your attendance only once per day. After submission,
                    editing is locked.
                  </p>
                </div>
                <div className="flex gap-3">
                  <FiAlertCircle className="mt-0.5 text-yellow-500" />
                  <p>
                    Choose <span className="font-medium text-[var(--text-main)]">Late</span> if you will attend but arrive after the scheduled time.
                  </p>
                </div>
                <div className="flex gap-3">
                  <FiAlertCircle className="mt-0.5 text-red-500" />
                  <p>
                    Choose <span className="font-medium text-[var(--text-main)]">Absent</span> if you will not attend for the day.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Today</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="mt-5 rounded-xl bg-[var(--bg-main)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Current submission status
                </p>
                <p
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    isLocked
                      ? "bg-green-50 text-green-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {isLocked ? "Submitted" : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;