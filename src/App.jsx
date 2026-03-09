import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Schedule from "./pages/Schedule";
import Notifications from "./pages/Notifications";

import TeacherLayout from "./layouts/TeacherLayout";
import StudentLayout from "./layouts/StudentLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import Notfound from "./routes/Notfound";
import StudentDashboard from "./pages/StudentDashboard";
import Attendance from "./pages/Attendance";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Notfound />} />

      {/* TEACHER ROUTES */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="TEACHER">
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile/:id" element={<Profile />} />
      </Route>

      {/* STUDENT ROUTES */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="attendance" element={<Attendance />} />
      </Route>
    </Routes>
  );
}

export default App;
