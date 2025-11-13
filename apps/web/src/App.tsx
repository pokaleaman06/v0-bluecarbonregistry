import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Projects } from './pages/Projects'
import { ProjectDetail } from './pages/ProjectDetail'
import { Verifications } from './pages/Verifications'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { AdminDashboard } from './pages/AdminDashboard'
import { DataManagement } from './pages/DataManagement'
import { DataUpload } from './components/DataUpload'
import { SpeciesGallery } from './components/SpeciesGallery'
import { DataValidation } from './pages/DataValidation'
import { Login } from './pages/Login'
import { useAuth } from './hooks/useAuth'
import { LoadingSpinner } from './components/LoadingSpinner'
import { UserProfile } from './pages/UserProfile'
import { AdminProfile } from './pages/AdminProfile'

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Login />
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/verifications" element={<Verifications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/data-management" element={<DataManagement />} />
          <Route path="/data-management/upload" element={<DataUpload />} />
          <Route path="/data-management/species" element={<SpeciesGallery />} />
          <Route path="/data-management/validation" element={<DataValidation />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Box>
  )
}

export default App
