import React, { useEffect, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/profile/profileSlice";
import { toast } from "react-toastify";

function EditProfileModal({ open, onClose, profile }) {
  const dispatch = useDispatch();
  const { updating } = useSelector((state) => state.profile);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    birthday: "",
  });

  const formatDateForInput = (date) => {
    if (!date) return "";

    // already correct format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        mail: profile.mail || "",
        birthday: formatDateForInput(profile.birthday),
      });
    }
  }, [profile]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        updateProfile({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          mail: form.mail.trim(),
          birthday: form.birthday || null,
        }),
      ).unwrap();

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4">
      <div
        className="w-full max-w-xl border"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4 sm:px-6"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-primary)] sm:text-xl">
              Edit Profile
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Update your personal information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition"
            style={{ color: "var(--text-muted)" }}
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-main)]">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border px-4 py-3 text-sm outline-none transition"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-elevated)",
                  borderRadius: "var(--radius-lg)",
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-main)]">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border px-4 py-3 text-sm outline-none transition"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-elevated)",
                  borderRadius: "var(--radius-lg)",
                }}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-main)]">
              Email
            </label>
            <input
              type="email"
              name="mail"
              value={form.mail}
              onChange={handleChange}
              className="w-full border px-4 py-3 text-sm outline-none transition"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "var(--radius-lg)",
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-main)]">
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="w-full border px-4 py-3 text-sm outline-none transition"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "var(--radius-lg)",
              }}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-sm font-medium transition"
              style={{
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                color: "var(--text-main)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{
                backgroundColor: "var(--color-primary)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <FiSave />
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
