import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoMdHome,
  IoMdAnalytics,
  IoMdCalendar,
  IoMdPeople,
  IoMdPerson,
  IoMdLogOut,
  IoMdCheckboxOutline,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { TbLayoutSidebarFilled } from "react-icons/tb";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const userId = useSelector((state) => state.auth.user.id);
  const userRole = useSelector((state) => state.auth.user.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      path:
        userRole === "STUDENT" ? "/student/dashboard" : "/teacher/dashboard",
      icon: <IoMdHome />,
    },

    ...(userRole === "TEACHER"
      ? [
          {
            name: "Analytics",
            path: "/teacher/analytics",
            icon: <IoMdAnalytics />,
          },
        ]
      : []),

    // {
    //   name: "Schedule",
    //   path: userRole === "STUDENT" ? "/student/schedule" : "/teacher/schedule",
    //   icon: <IoMdCalendar />,
    // },

    ...(userRole === "STUDENT"
      ? [
          {
            name: "Attendance",
            path: "/student/attendance",
            icon: <IoMdCheckboxOutline />,
          },
        ]
      : []),

    {
      name: "Notifications",
      path:
        userRole === "STUDENT"
          ? "/student/notifications"
          : "/teacher/notifications",
      icon: <IoMdNotificationsOutline />,
    },

    {
      name: "Profile",
      path:
        userRole === "STUDENT"
          ? `/student/profile/${userId}`
          : `/teacher/profile/${userId}`,
      icon: <IoMdPerson />,
    },
  ];

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <aside
      className={clsx(
        "h-screen flex flex-col border-r transition-all duration-300",
        collapsed ? "w-20" : "w-72",
      )}
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-5 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        {!collapsed && (
          <h4
            className="text-lg font-semibold tracking-wide"
            style={{ color: "var(--color-primary)" }}
          >
            Attendance system
          </h4>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Collapse"
          className="hidden md:block transition"
          style={{ color: "var(--text-muted)" }}
        >
          <TbLayoutSidebarFilled className="text-2xl" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const active = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              aria-label={item.name}
              className={clsx(
                "flex flex-col md:flex-row items-center gap-1 md:gap-4 px-4 py-3 rounded-lg transition",
                active ? "font-semibold" : "hover:bg-[var(--bg-hover)]",
              )}
              style={{
                color: active ? "var(--color-primary)" : "var(--text-muted)",
                backgroundColor: active
                  ? "var(--color-primary-soft)"
                  : "transparent",
                fontSize: "1rem",
              }}
            >
              <span
                className="text-2xl"
                style={{
                  color: active ? "var(--color-primary)" : "var(--text-muted)",
                }}
              >
                {item.icon}
              </span>

              <span
                className={clsx(
                  "whitespace-nowrap transition-all duration-300 text-[10px] md:text-base",
                  collapsed
                    ? "md:opacity-0 md:w-0 md:overflow-hidden"
                    : "opacity-100 w-auto",
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className="px-6 py-5 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          className="flex items-center gap-4 w-full transition cursor-pointer text-base hover:text-[var(--color-danger)]"
          style={{ color: "var(--text-muted)" }}
          onClick={handleLogOut}
        >
          <IoMdLogOut className="text-2xl" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
