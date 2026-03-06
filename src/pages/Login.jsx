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
    <div className="min-h-screen flex items-center justify-center bg-black-950 px-4">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-xl px-8 py-20 sm:p-20">
        <h1 className="text-4xl text-[var(--text-main)] font-bold mb-8 text-center">
          Welcome Back
        </h1>

        {error && (
          <div
            role="alert"
            className="bg-red-700 text-white text-sm p-3 rounded mb-5 text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-[var(--text-main)] mb-2 font-medium"
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
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-main)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-midnight-700 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[var(--text-main)] mb-2 font-medium"
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
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-main)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-midnight-700 transition pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-[var(--text-main)] hover:text-paper-90 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-red-50 py-3 mt-1 bg-[var(--color-primary)] hover:bg-midnight-800 font-semibold rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-paper-50 text-center mt-6 text-sm select-none">
          © 2026 CactusCRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
