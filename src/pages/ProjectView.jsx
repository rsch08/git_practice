import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProject } from '../hooks/useProject.js'
import { useProjectTasks } from '../hooks/useProjectTasks.js'
import KanbanBoard from '../components/KanbanBoard.jsx'
import NewTaskForm from '../components/NewTaskForm.jsx'
import TrocearModal from '../components/TrocearModal.jsx'
import PriorityBadge from '../components/PriorityBadge.jsx'

export default function ProjectView() {
  const { projectId } = useParams()
  const { project, loading: loadingProject, error: projectError } = useProject(projectId)
  const {
    tasks,
    loading: loadingTasks,
    error: tasksError,
    createTask,
    updateTaskStatus,
    deleteTask,
  } = useProjectTasks(projectId)
  const [tareaATrocear, setTareaATrocear] = useState(null)

  async function handleAddSubtask(parentTaskId, title) {
    await createTask({ title, priority: 'media', dueDate: null, parentTaskId })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">
        ← Todos los proyectos
      </Link>

      {loadingProject && <p className="text-slate-500 mt-4">Cargando…</p>}
      {projectError && <p className="text-red-600 mt-4">Error: {projectError}</p>}

      {project && (
        <div className="flex items-center gap-3 mt-2 mb-6">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
          <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
          <PriorityBadge priority={project.priority} />
        </div>
      )}

      <div className="mb-6 max-w-md">
        <NewTaskForm
          onCreate={createTask}
          onCreatedGrande={(nuevaTarea) => setTareaATrocear(nuevaTarea)}
        />
      </div>

      {loadingTasks && <p className="text-slate-500">Cargando tareas…</p>}
      {tasksError && <p className="text-red-600">Error: {tasksError}</p>}

      {!loadingTasks && !tasksError && (
        <KanbanBoard
          tasks={tasks}
          onUpdateStatus={updateTaskStatus}
          onDelete={deleteTask}
          onAddSubtask={handleAddSubtask}
        />
      )}

      {tareaATrocear && (
        <TrocearModal
          task={tareaATrocear}
          onClose={() => setTareaATrocear(null)}
          onAddSubtask={handleAddSubtask}
        />
      )}
    </div>
  )
}
