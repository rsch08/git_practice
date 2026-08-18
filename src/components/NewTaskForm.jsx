import { useState } from 'react'

export default function NewTaskForm({ onCreate, onCreatedGrande }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('media')
  const [dueDate, setDueDate] = useState('')
  const [esGrande, setEsGrande] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const nueva = await onCreate({ title: title.trim(), priority, dueDate })
      if (esGrande && nueva) onCreatedGrande(nueva)
      setTitle('')
      setDueDate('')
      setEsGrande(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
      <input
        className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nueva tarea…"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="border border-slate-300 rounded-md px-2 py-1 text-xs"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <input
          type="date"
          className="border border-slate-300 rounded-md px-2 py-1 text-xs"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <label className="flex items-center gap-1 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={esGrande}
            onChange={(e) => setEsGrande(e.target.checked)}
          />
          es grande
        </label>
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="ml-auto px-3 py-1 text-xs rounded-md bg-indigo-600 text-white disabled:opacity-50"
        >
          {saving ? 'Agregando…' : 'Agregar'}
        </button>
      </div>
    </form>
  )
}
