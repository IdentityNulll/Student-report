import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiMail,
  FiUser,
  FiCalendar,
  FiShield,
  FiImage,
  FiEdit2,
} from "react-icons/fi";
import { fetchProfile } from "../features/profile/profileSlice";
import EditProfileModal from "../components/EditProfileModal";

function Profile() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const { data: profile, loading, error } = useSelector((state) => state.profile);

  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const formatDate = (date) => {
    if (!date) return "Not provided";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fullName = useMemo(() => {
    return (
      `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
      "Unknown User"
    );
  }, [profile]);

  const getInitials = () => {
    const first = profile?.firstName?.[0] || "";
    const last = profile?.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  const infoCards = [
    {
      label: "First Name",
      value: profile?.firstName || "Not provided",
      icon: <FiUser />,
    },
    {
      label: "Last Name",
      value: profile?.lastName || "Not provided",
      icon: <FiUser />,
    },
    {
      label: "Email Address",
      value: profile?.mail || "Not provided",
      icon: <FiMail />,
    },
    {
      label: "Birthday",
      value: formatDate(profile?.birthday),
      icon: <FiCalendar />,
    },
    {
      label: "Avatar Status",
      value: profile?.photoUrl ? "Uploaded" : "No avatar uploaded",
      icon: <FiImage />,
    },
    {
      label: "Account Type",
      value: authUser?.role || "Unknown",
      icon: <FiShield />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] p-4 sm:p-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div
            className="h-44 border"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-xl)",
            }}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div
              className="h-72 border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-surface)",
                borderRadius: "var(--radius-xl)",
              }}
            />
            <div
              className="h-72 border lg:col-span-2"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-surface)",
                borderRadius: "var(--radius-xl)",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--bg-main)] p-4 sm:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {error && (
            <div
              className="border px-4 py-3 text-sm"
              style={{
                borderColor: "var(--color-danger)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--color-danger)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {error}
            </div>
          )}

          {/* Header */}
          <section
            className="overflow-hidden border"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="h-32 sm:h-40 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary-hover)]" />

            <div className="px-5 pb-6 sm:px-8">
              <div className="-mt-16 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div
                    className="flex h-24 w-24 items-center justify-center overflow-hidden border-4 border-white text-2xl font-bold shadow-md sm:h-28 sm:w-28 sm:text-3xl"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--color-primary)",
                      borderRadius: "var(--radius-xl)",
                    }}
                  >
                    {profile?.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials()
                    )}
                  </div>

                  <div className="pt-1">
                    <h1 className="text-2xl font-bold sm:text-3xl text-[var(--text-main)]">
                      {fullName}
                    </h1>
                    <p className="mt-1 text-sm sm:text-base text-[var(--text-muted)]">
                      {authUser?.role || "User"} Profile
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      Manage your account details and personal information.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="inline-flex w-fit items-center px-4 py-2 text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--color-success-soft)",
                      color: "var(--color-success)",
                      borderRadius: "9999px",
                    }}
                  >
                    Active Account
                  </div>

                  <button
                    onClick={() => setOpenEdit(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <FiEdit2 />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left panel */}
            <aside className="space-y-6">
              <div
                className="border p-5 sm:p-6"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <h2 className="text-lg font-semibold text-[var(--color-primary)]">
                  Profile Summary
                </h2>

                <div className="mt-5 space-y-4">
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: "var(--bg-main)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Full Name
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-[var(--text-main)]">
                      {fullName}
                    </p>
                  </div>

                  <div
                    className="p-4"
                    style={{
                      backgroundColor: "var(--bg-main)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-[var(--text-main)]">
                      {profile?.mail || "Not provided"}
                    </p>
                  </div>

                  <div
                    className="p-4"
                    style={{
                      backgroundColor: "var(--bg-main)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Birthday
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--text-main)]">
                      {formatDate(profile?.birthday)}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="border p-5 sm:p-6"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <h2 className="text-lg font-semibold text-[var(--color-primary)]">
                  Account Notes
                </h2>
                <div className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
                  <p>
                    This profile page displays the currently stored account
                    information.
                  </p>
                  <p>
                    You can update your personal details using the edit button
                    above.
                  </p>
                </div>
              </div>
            </aside>

            {/* Right panel */}
            <section
              className="border p-5 sm:p-6 lg:col-span-2"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-surface)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-[var(--color-primary)] sm:text-xl">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Review your account details below.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {infoCards.map((item) => (
                  <div
                    key={item.label}
                    className="border p-4 transition hover:-translate-y-0.5 sm:p-5"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--bg-elevated)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center text-lg"
                        style={{
                          backgroundColor: "var(--color-primary-soft)",
                          color: "var(--color-primary)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                          {item.label}
                        </p>
                        <p className="mt-1 break-words text-sm font-medium text-[var(--text-main)] sm:text-base">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <EditProfileModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        profile={profile}
      />
    </>
  );
}

export default Profile;