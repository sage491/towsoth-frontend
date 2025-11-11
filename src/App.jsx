import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ModernLandingPage from '@/pages/ModernLandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ThemeAwareStudentDashboard from '@/pages/ThemeAwareStudentDashboard'
import EnhancedDashboard from '@/pages/EnhancedDashboard'
import SubjectPage from '@/pages/SubjectPage'
import SubjectsListPage from '@/pages/SubjectsListPage'
import NoteViewer from '@/pages/NoteViewer'
import VideoViewer from '@/pages/VideoViewer'
import FullscreenPDFViewer from '@/pages/FullscreenPDFViewer'
import ThemeAwareProgressTracker from '@/pages/ThemeAwareProgressTracker'
import ProfilePage from '@/pages/ProfilePage'
// Removed direct import of AdminPage to avoid early loading and aborted requests
// import AdminPage from '@/pages/AdminPage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import ApiTestPage from '@/pages/ApiTestPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { lazy, Suspense } from 'react'

// Lazy-load AdminPage so it only loads for authorized users when rendered
const AdminPage = lazy(() => import('@/pages/AdminPage'))

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }) => {
  // Use raw context to avoid throwing when provider is missing
  const context = useContext(AuthContext)

  // If AuthProvider is missing for any reason, gracefully fallback
  if (!context) {
    return <AdminLoginPage />
  }

  const { user } = context

  if (!user || user.role !== 'admin') {
    return <AdminLoginPage />
  }

  return children
}

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<ModernLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ThemeAwareStudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/enhanced-dashboard" element={
            <ProtectedRoute>
              <EnhancedDashboard />
            </ProtectedRoute>
          } />
          <Route path="/subjects" element={
            <ProtectedRoute>
              <SubjectsListPage />
            </ProtectedRoute>
          } />
          <Route path="/subject/:id" element={
            <ProtectedRoute>
              <SubjectPage />
            </ProtectedRoute>
          } />
          <Route path="/note/:id" element={
            <ProtectedRoute>
              <NoteViewer />
            </ProtectedRoute>
          } />
          <Route path="/video/:id" element={
            <ProtectedRoute>
              <VideoViewer />
            </ProtectedRoute>
          } />
          <Route path="/pdf-viewer" element={
            <ProtectedRoute>
              <FullscreenPDFViewer />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <ThemeAwareProgressTracker />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <Suspense fallback={<div className="p-8 text-center">Loading admin...</div>}>
                <AdminPage />
              </Suspense>
            </ProtectedAdminRoute>
          } />
          <Route path="/api-test" element={<ApiTestPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
