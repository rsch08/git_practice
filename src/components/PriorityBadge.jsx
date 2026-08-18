const ESTILOS = {
  alta: 'bg-red-100 text-red-700',
  media: 'bg-blue-100 text-blue-700',
  baja: 'bg-slate-100 text-slate-600',
}

const ETIQUETAS = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

export default function PriorityBadge({ priority }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTILOS[priority]}`}>
      {ETIQUETAS[priority]}
    </span>
  )
}
