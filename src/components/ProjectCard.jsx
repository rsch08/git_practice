import { Link } from 'react-router-dom'
import PriorityBadge from './PriorityBadge.jsx'
import { claseOxidado, etiquetaOxidado, nivelOxidadoProyecto } from '../utils/oxidado.js'

export default function ProjectCard({ project, tasks }) {
  const total = tasks.length
  const hechas = tasks.filter((t) => t.status === 'hecho').length
  const avance = total === 0 ? 0 : Math.round((hechas / total) * 100)

  const nivel = nivelOxidadoProyecto(tasks)
  const tareaMasOxidada = tasks
    .filter((t) => t.status !== 'hecho')
    .sort((a, b) => new Date(a.last_moved_at) - new Date(b.last_moved_at))[0]
  const etiqueta = tareaMasOxidada ? etiquetaOxidado(tareaMasOxidada.last_moved_at) : null
  const clases = tareaMasOxidada ? claseOxidado(tareaMasOxidada.last_moved_at) : 'bg-white border-slate-200'

  return (
    <Link
      to={`/project/${project.id}`}
      className={`block rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-shadow ${clases}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="font-semibold text-slate-800 truncate">{project.name}</h3>
        </div>
        <PriorityBadge priority={project.priority} />
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{avance}% completado</span>
          <span>
            {hechas}/{total} tareas
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${avance}%` }}
          />
        </div>
      </div>

      {etiqueta && nivel !== 'normal' && (
        <p className="mt-3 text-xs font-medium text-slate-600">⚠ {etiqueta}</p>
      )}
    </Link>
  )
}
