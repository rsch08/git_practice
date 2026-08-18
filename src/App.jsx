import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import ProjectView from './pages/ProjectView.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/project/:projectId" element={<ProjectView />} />
    </Routes>
  )
}
