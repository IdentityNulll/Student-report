import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeacherLayout from "./layouts/TeacherLayout";
import StudentLayout from "./layouts/StudentLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  );
}

export default App;