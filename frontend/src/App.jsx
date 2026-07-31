import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import StudentAnalytics from "./pages/StudentAnalytics";
import RecruiterAnalytics from "./pages/RecruiterAnalytics";
import ResumeBuilder from "./pages/ResumeBuilder";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import RecruiterRoute from "./components/admin/RecruiterRoute";
import PrivateRoute from "./components/PrivateRoute";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/saved-jobs",
    element: (
      <PrivateRoute>
        <SavedJobs />
      </PrivateRoute>
    ),
  },
  {
    path: "/analytics/student",
    element: (
      <PrivateRoute>
        <StudentAnalytics />
      </PrivateRoute>
    ),
  },
  {
    path: "/analytics/recruiter",
    element: (
      <RecruiterRoute>
        <RecruiterAnalytics />
      </RecruiterRoute>
    ),
  },

  // admin (recruiter) routes start
  {
    path: "/admin/companies",
    element: (
      <RecruiterRoute>
        <Companies />
      </RecruiterRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <RecruiterRoute>
        <CompanyCreate />
      </RecruiterRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <RecruiterRoute>
        <CompanySetup />
      </RecruiterRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <RecruiterRoute>
        <AdminJobs />
      </RecruiterRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <RecruiterRoute>
        <PostJob />
      </RecruiterRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <RecruiterRoute>
        <Applicants />
      </RecruiterRoute>
    ),
  },
  {
    path: "/resume-builder",
    element: (
      <PrivateRoute>
        <ResumeBuilder />
      </PrivateRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <PrivateRoute>
        <Chat />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <PrivateRoute>
        <AdminDashboard />
      </PrivateRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
