// Efecto "oxidado": entre más tiempo sin moverse una tarea/proyecto,
// más "oxidado" se ve, para que lo estancado salte a la vista.

export function diasDesde(fechaISO) {
  const entonces = new Date(fechaISO).getTime()
  const ahora = Date.now()
  return Math.floor((ahora - entonces) / (1000 * 60 * 60 * 24))
}

export function nivelOxidado(fechaISO) {
  const dias = diasDesde(fechaISO)
  if (dias <= 3) return 'normal'
  if (dias <= 7) return 'amarillo'
  if (dias <= 14) return 'naranja'
  return 'rojo'
}

const CLASES_POR_NIVEL = {
  normal: 'bg-white border-slate-200',
  amarillo: 'bg-yellow-50 border-yellow-300',
  naranja: 'bg-orange-50 border-orange-400',
  rojo: 'bg-red-50 border-red-400',
}

const ETIQUETA_POR_NIVEL = {
  normal: null,
  amarillo: 'Sin moverse hace días',
  naranja: 'Estancada',
  rojo: 'Muy estancada',
}

export function claseOxidado(fechaISO) {
  return CLASES_POR_NIVEL[nivelOxidado(fechaISO)]
}

export function etiquetaOxidado(fechaISO) {
  return ETIQUETA_POR_NIVEL[nivelOxidado(fechaISO)]
}

// Para un proyecto: el nivel más "oxidado" entre sus tareas no terminadas.
export function nivelOxidadoProyecto(tareas) {
  const ORDEN = ['normal', 'amarillo', 'naranja', 'rojo']
  const activas = tareas.filter((t) => t.status !== 'hecho')
  if (activas.length === 0) return 'normal'
  return activas.reduce((peor, t) => {
    const actual = nivelOxidado(t.last_moved_at)
    return ORDEN.indexOf(actual) > ORDEN.indexOf(peor) ? actual : peor
  }, 'normal')
}
