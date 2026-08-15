import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProfilePage from "@/pages/student/ProfilePage";
import AssessmentPage from "@/pages/student/AssessmentPage";
import AssessmentResultsPage from "@/pages/student/AssessmentResultsPage";
import DashboardPage from "@/pages/student/DashboardPage";
import RecommendationsPage from "@/pages/student/RecommendationsPage";
import CoursesPage from "@/pages/student/CoursesPage";
import CourseDetailPage from "@/pages/student/CourseDetailPage";
import CareersPage from "@/pages/student/CareersPage";
import CareerDetailPage from "@/pages/student/CareerDetailPage";
import CollegesPage from "@/pages/student/CollegesPage";
import CollegeDetailPage from "@/pages/student/CollegeDetailPage";
import CollegeComparePage from "@/pages/student/CollegeComparePage";
import ScholarshipsPage from "@/pages/student/ScholarshipsPage";
import TimelinePage from "@/pages/student/TimelinePage";
import ResourcesPage from "@/pages/student/ResourcesPage";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCollegesPage from "@/pages/admin/AdminCollegesPage";
import AdminCoursesPage from "@/pages/admin/AdminCoursesPage";
import AdminScholarshipsPage from "@/pages/admin/AdminScholarshipsPage";
import AdminAdmissionsPage from "@/pages/admin/AdminAdmissionsPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import AdminStudentsPage from "@/pages/admin/AdminStudentsPage";
import AdminCareersPage from "@/pages/admin/AdminCareersPage";
import AdminResourcesPage from "@/pages/admin/AdminResourcesPage";
import AdminTimelinePage from "@/pages/admin/AdminTimelinePage";
import RoadmapPage from "@/pages/student/RoadmapPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineIndicator />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student App */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assessment/results" element={<AssessmentResultsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:id" element={<CareerDetailPage />} />
          <Route path="/colleges/compare" element={<CollegeComparePage />} />
          <Route path="/colleges/:id" element={<CollegeDetailPage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/colleges" element={<AdminCollegesPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/scholarships" element={<AdminScholarshipsPage />} />
          <Route path="/admin/admissions" element={<AdminAdmissionsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/careers" element={<AdminCareersPage />} />
          <Route path="/admin/resources" element={<AdminResourcesPage />} />
          <Route path="/admin/timeline" element={<AdminTimelinePage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
