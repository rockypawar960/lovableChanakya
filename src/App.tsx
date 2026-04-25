import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import { Navbar } from './components/Navbar'

// Auth Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminLogin from './pages/AdminLogin'
import Landing from './pages/Landing'

// User Pages
import UserDashboard from './pages/user/Dashboard'
import Assessment from './pages/user/Assessment'
import Recommendations from './pages/user/Recommendations'
import LearningPaths from './pages/user/LearningPaths'
import Resources from './pages/user/Resources'
import Progress from './pages/user/Progress'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import CareerManagement from './pages/admin/CareerManagement'
import AssessmentManagement from './pages/admin/AssessmentManagement'
import LearningPathManagement from './pages/admin/LearningPathManagement'
import ResourceManagement from './pages/admin/ResourceManagement'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout>
                  <UserDashboard />
                </UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/assessment"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout>
                  <Assessment />
                </UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/recommendations"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout>
                  <Recommendations />
                </UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/recommendations/assessment/:assessmentId"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout>
                  <Recommendations />
                </UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/learning-paths"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout>
                  <LearningPaths />
                </UserLayout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/user/learning-paths/:pathId/full" 
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout>
                  <LearningPaths /> {/* Aapka component name jo full path dikhayega */}
                </UserLayout>
              </ProtectedRoute>
            } 
          />
          <Route
            path="/user/resources"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout>
                  <Resources />
                </UserLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/progress"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserLayout>
                  <Progress />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Alias so /admin/dashboard also works */}
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/careers"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout>
                  <CareerManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assessments"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout>
                  <AssessmentManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/learning-paths"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout>
                  <LearningPathManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resources"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout>
                  <ResourceManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
