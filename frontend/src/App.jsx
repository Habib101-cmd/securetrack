import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import ForbiddenPage from './pages/ForbiddenPage'
import IssueDetailPage from './pages/IssueDetailPage'
import IssuesListPage from './pages/IssuesListPage'
import LoginPage from './pages/LoginPage'
import NewIssuePage from './pages/NewIssuePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/issues" element={<IssuesListPage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />

          <Route element={<ProtectedRoute roles={['analyste', 'admin']} />}>
            <Route path="/issues/new" element={<NewIssuePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}