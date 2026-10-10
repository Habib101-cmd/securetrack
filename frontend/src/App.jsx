import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import IssuesListPage from './pages/IssuesListPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/issues" element={<IssuesListPage />} />
        </Route>
      </Route>

      <Route path="/403" element={<p className="p-6">Accès refusé</p>} />
      <Route path="*" element={<p className="p-6">Page introuvable</p>} />
    </Routes>
  )
}