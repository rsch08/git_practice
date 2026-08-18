import { useState } from 'react'

const COLORES = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6']

export default function NewProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [priority, setPriority] = useState('media')
  const [color, setColor] = useState(COLORES[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onCreate({ name: name.trim(), priority, color })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Nuevo proyecto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
            <input
              autoFocus
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Finanzas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Prioridad</label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Color</label>
            <div className="flex gap-2">
              {COLORES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 ${color === c ? 'border-slate-800' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white disabled:opacity-50"
            >
              {saving ? 'Creando…' : 'Crear proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
