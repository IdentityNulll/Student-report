import React, { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiSend,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/axios";
// import Header from "../../../../Components/studentHeader/SHeader";

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [mainStatus, setMainStatus] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [report, setReport] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const reasonMap = {
    Sick: "SICK",
    "Family Problem": "FAMILY_MATTER",
    "Cannot Go": "TRAVELING",
    Emergency: "EMERGENCY",
    Course: "COURSE",
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAttendance = async () => {
      const studentId = localStorage.getItem("id");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");

      if (firstName || lastName) {
        setStudentName(`${firstName || ""} ${lastName || ""}`.trim());
      }

      if (!studentId) return;

      try {
        const res = await api.get(`/attendance/by-userId/${studentId}`);

        if (res.status === 200 && res.data?.data) {
          const data = res.data.data;

          setReport(data);
          setStudentName(
            `${data.studentResponseDto.firstName} ${data.studentResponseDto.lastName}`
          );
          setIsLocked(true);
          setSubmitted(true);
        }
      } catch (err) {
        console.log("No attendance found yet");
      }
    };

    checkAttendance();
  }, []);

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

      const res = await api.get(`/attendance/by-userId/${studentId}`);
      const data = res.data.data;

      setReport(data);
      setStudentName(
        `${data.studentResponseDto.firstName} ${data.studentResponseDto.lastName}`
      );
      setIsLocked(true);
      setSubmitted(true);

      toast.success("Attendance submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const reasons = [
    "Sick",
    "Family Problem",
    "Cannot Go",
    "Emergency",
    "Course",
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)]">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--color-primary-soft)] border-t-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* <Header /> */}

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-md)]">
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

                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
                  <FiCheckCircle className="text-base" />
                  Academic Portal
                </div>
              </div>
            </div>

            {/* Attendance Form */}
            {!isLocked && (
              <div className="rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-md)]">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Attendance Submission</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Select your attendance status and provide the required details.
                  </p>
                </div>

                {/* Main status buttons */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleMainSelect("Absent")}
                    className={`group rounded-[var(--radius-lg)] border p-4 text-left transition-all duration-200 ${
                      mainStatus === "Absent"
                        ? "border-[var(--color-danger)] bg-[var(--color-danger-soft)] shadow-[var(--shadow-sm)]"
                        : "border-[var(--border-color)] bg-[var(--bg-elevated)] hover:border-[var(--color-danger)] hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-xl p-3 ${
                          mainStatus === "Absent"
                            ? "bg-[var(--color-danger)] text-white"
                            : "bg-[var(--border-soft)] text-[var(--text-muted)] group-hover:text-[var(--color-danger)]"
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
                    className={`group rounded-[var(--radius-lg)] border p-4 text-left transition-all duration-200 ${
                      mainStatus === "Late"
                        ? "border-[var(--color-warning)] bg-[var(--color-warning-soft)] shadow-[var(--shadow-sm)]"
                        : "border-[var(--border-color)] bg-[var(--bg-elevated)] hover:border-[var(--color-warning)] hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-xl p-3 ${
                          mainStatus === "Late"
                            ? "bg-[var(--color-warning)] text-white"
                            : "bg-[var(--border-soft)] text-[var(--text-muted)] group-hover:text-[var(--color-warning)]"
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

                {/* Reason options */}
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
                          className={`rounded-[var(--radius-md)] border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            reason === r
                              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                              : "border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comment */}
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
                      className="w-full rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-elevated)] px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-[var(--text-soft)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
                    />
                  </div>
                )}

                {/* Submit */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiSend />
                    {submitting ? "Submitting..." : "Submit Attendance"}
                  </button>
                </div>
              </div>
            )}

            {/* Report Card */}
            {submitted && report && (
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-success)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-md)]">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-[var(--color-success-soft)] p-3 text-[var(--color-success)]">
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
                  <div className="rounded-[var(--radius-lg)] bg-[var(--bg-main)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Student Name
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {report.studentResponseDto.firstName}{" "}
                      {report.studentResponseDto.lastName}
                    </p>
                  </div>

                  <div className="rounded-[var(--radius-lg)] bg-[var(--bg-main)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-medium">{report.reason}</p>
                  </div>

                  <div className="rounded-[var(--radius-lg)] bg-[var(--bg-main)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Comment
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {report.comment || "No comment"}
                    </p>
                  </div>

                  <div className="rounded-[var(--radius-lg)] bg-[var(--bg-main)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Date
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <div className="rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-md)]">
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
                  <FiAlertCircle className="mt-0.5 text-[var(--color-warning)]" />
                  <p>
                    Choose <span className="font-medium text-[var(--text-main)]">Late</span> if you will attend but arrive after the scheduled time.
                  </p>
                </div>
                <div className="flex gap-3">
                  <FiAlertCircle className="mt-0.5 text-[var(--color-danger)]" />
                  <p>
                    Choose <span className="font-medium text-[var(--text-main)]">Absent</span> if you will not attend for the day.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-md)]">
              <h3 className="text-lg font-semibold">Today</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="mt-5 rounded-[var(--radius-lg)] bg-[var(--bg-main)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Current submission status
                </p>
                <p
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    isLocked
                      ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                      : "bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
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