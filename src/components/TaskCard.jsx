import { useState } from 'react'
import PriorityBadge from './PriorityBadge.jsx'
import { claseOxidado, etiquetaOxidado } from '../utils/oxidado.js'

const SIGUIENTE_ESTADO = {
  por_hacer: 'en_progreso',
  en_progreso: 'hecho',
  hecho: 'por_hacer',
}

const ETIQUETA_ESTADO = {
  por_hacer: 'Por hacer',
  en_progreso: 'En progreso',
  hecho: 'Hecho',
}

export default function TaskCard({ task, subtasks, onUpdateStatus, onDelete, onAddSubtask }) {
  const [showSubtaskForm, setShowSubtaskForm] = useState(false)
  const [subtaskTitle, setSubtaskTitle] = useState('')

  const clases = task.status === 'hecho' ? 'bg-white border-slate-200' : claseOxidado(task.last_moved_at)
  const etiquetaOxi = task.status === 'hecho' ? null : etiquetaOxidado(task.last_moved_at)

  const subtareasHechas = subtasks.filter((s) => s.status === 'hecho').length

  async function handleAddSubtask(e) {
    e.preventDefault()
    if (!subtaskTitle.trim()) return
    await onAddSubtask(task.id, subtaskTitle.trim())
    setSubtaskTitle('')
    setShowSubtaskForm(false)
  }

  return (
    <div className={`rounded-lg border p-3 shadow-sm ${clases}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800">{task.title}</p>
        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-300 hover:text-red-500 text-xs shrink-0"
          title="Eliminar tarea"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        <PriorityBadge priority={task.priority} />
        {task.due_date && (
          <span className="text-xs text-slate-500">📅 {task.due_date}</span>
        )}
        {etiquetaOxi && (
          <span className="text-xs text-slate-500">⚠ {etiquetaOxi}</span>
        )}
      </div>

      <button
        onClick={() => onUpdateStatus(task.id, SIGUIENTE_ESTADO[task.status])}
        className="mt-2 text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
      >
        Mover a: {ETIQUETA_ESTADO[SIGUIENTE_ESTADO[task.status]]}
      </button>

      {subtasks.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-200/70 space-y-1.5">
          <p className="text-xs text-slate-400">
            Subtareas ({subtareasHechas}/{subtasks.length})
          </p>
          {subtasks.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between gap-2">
              <button
                onClick={() => onUpdateStatus(sub.id, SIGUIENTE_ESTADO[sub.status])}
                className={`text-xs text-left flex-1 truncate ${
                  sub.status === 'hecho' ? 'line-through text-slate-400' : 'text-slate-700'
                }`}
                title={ETIQUETA_ESTADO[sub.status]}
              >
                {sub.status === 'hecho' ? '☑' : '☐'} {sub.title}
              </button>
              <button
                onClick={() => onDelete(sub.id)}
                className="text-slate-300 hover:text-red-500 text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {showSubtaskForm ? (
        <form onSubmit={handleAddSubtask} className="mt-2 flex gap-1">
          <input
            autoFocus
            className="flex-1 border border-slate-300 rounded-md px-2 py-1 text-xs"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
            placeholder="Nueva subtarea"
            onBlur={() => !subtaskTitle && setShowSubtaskForm(false)}
          />
          <button type="submit" className="text-xs px-2 py-1 rounded-md bg-indigo-600 text-white">
            +
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowSubtaskForm(true)}
          className="mt-2 text-xs text-indigo-600 hover:underline"
        >
          + subtarea
        </button>
      )}
    </div>
  )
}
