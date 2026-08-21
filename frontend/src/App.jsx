import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Assistant from "./pages/Assistant.jsx";
import Resources from "./pages/Resources.jsx";
import Education from "./pages/Education.jsx";
import Questions from "./pages/Questions.jsx";
import Profile from "./pages/Profile.jsx";
import Manage from "./pages/Manage.jsx";
import NotFound from "./pages/NotFound.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import { ROLES } from "./utils/roles.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="resources" element={<Resources />} />
          <Route path="education" element={<Education />} />
          <Route path="questions" element={<Questions />} />
          <Route path="profile" element={<Profile />} />

          <Route element={<RoleRoute allow={[ROLES.ORGANIZATION, ROLES.ADMIN]} />}>
            <Route path="manage" element={<Manage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
