import { useState } from 'react'

export default function TrocearModal({ task, onClose, onAddSubtask }) {
  const [lineas, setLineas] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const titulos = lineas
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (titulos.length === 0) {
      onClose()
      return
    }
    setSaving(true)
    for (const titulo of titulos) {
      await onAddSubtask(task.id, titulo)
    }
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5">
        <h2 className="text-lg font-semibold mb-1">Trocear "{task.title}"</h2>
        <p className="text-sm text-slate-500 mb-4">
          Es una tarea grande. Divídela en pasos más chicos ahora mismo — una por línea.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            autoFocus
            rows={5}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={lineas}
            onChange={(e) => setLineas(e.target.value)}
            placeholder={'Investigar opciones\nJuntar documentos\nHacer la llamada'}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Ahora no
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar subtareas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
