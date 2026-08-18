import { useState } from 'react'
import { useProjects } from '../hooks/useProjects.js'
import ProjectCard from '../components/ProjectCard.jsx'
import NewProjectModal from '../components/NewProjectModal.jsx'

export default function Dashboard() {
  const { projects, tasksByProject, loading, error, createProject } = useProjects()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mis proyectos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          + Nuevo proyecto
        </button>
      </div>

      {loading && <p className="text-slate-500">Cargando…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="text-slate-500">
          Todavía no tienes proyectos. Crea el primero para empezar.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            tasks={tasksByProject[project.id] ?? []}
          />
        ))}
      </div>

      {showModal && (
        <NewProjectModal onClose={() => setShowModal(false)} onCreate={createProject} />
      )}
    </div>
  )
}
