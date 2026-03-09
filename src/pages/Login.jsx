import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRef = useRef(null);

  /* Focus email on mount */
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiredTime = localStorage.getItem("expiredTime");
    const role = localStorage.getItem("role");

    if (!token || !expiredTime) return;

    if (new Date() >= new Date(expiredTime)) {
      localStorage.clear();
      return;
    }

    if (role === "TEACHER") {
      navigate("/teacher/dashboard");
    } else if (role === "STUDENT") {
      navigate("/student/dashboard");
    }
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (loading) return;

      setError("");
      setLoading(true);

      try {
        const res = await api.post("/auth/login", {
          mail,
          password,
        });

        const { data } = res.data;
        const { currentUserId, role, token, expiredTime } = data;

        dispatch(
          setCredentials({
            token,
            id: currentUserId,
            role,
          }),
        );

        localStorage.setItem("expiredTime", expiredTime);

        /* Role based redirect */
        if (role === "TEACHER") {
          navigate("/teacher/dashboard");
        } else if (role === "STUDENT") {
          navigate("/student/dashboard");
        } else {
          alert("Something went wrong");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Invalid email or password");
        setPassword("");
      } finally {
        setLoading(false);
      }
    },
    [mail, password, dispatch, navigate, loading],
  );

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ background: "var(--bg-main)" }}
    >
      {/* Background blobs */}
      <div
        className="absolute w-[500px] h-[500px] blur-[140px] rounded-full top-[-100px] left-[-100px] animate-pulse"
        style={{ background: "var(--color-primary-soft)" }}
      ></div>

      <div
        className="absolute w-[400px] h-[400px] blur-[120px] rounded-full bottom-[-120px] right-[-120px] animate-pulse"
        style={{ background: "var(--color-secondary-soft)" }}
      ></div>

      <div
        className="relative w-full max-w-md backdrop-blur-xl border rounded-3xl shadow-lg px-10 py-16"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: "var(--text-main)" }}
        >
          Welcome Back
        </h1>

        {error && (
          <div
            role="alert"
            className="text-sm p-3 rounded mb-5 text-center"
            style={{
              background: "var(--color-danger-soft)",
              color: "var(--color-danger)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-medium"
              style={{ color: "var(--text-main)" }}
            >
              Email
            </label>

            <input
              ref={emailRef}
              type="email"
              id="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg transition focus:outline-none"
              style={{
                background: "var(--bg-main)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium"
              style={{ color: "var(--text-main)" }}
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg pr-12 transition focus:outline-none"
                style={{
                  background: "var(--bg-main)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-color)",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-1 font-semibold rounded-lg transition disabled:opacity-50"
            style={{
              background: "var(--color-primary)",
              color: "var(--text-invert)",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          className="text-center mt-6 text-sm select-none"
          style={{ color: "var(--text-muted)" }}
        >
          © 2026 CactusCRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}

