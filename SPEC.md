# Dashboard de Proyectos Personales — Spec v1

## Problema que resuelve
Casta maneja 4-6 proyectos personales activos (finanzas, conferencista, depa, coche, IMSS mamá, etc.) con estructura jerárquica variable (algunos son tareas simples, otros tienen subproyectos con sub-tareas). Las to-do lists planas no permiten priorizar ni dar seguimiento a qué se ha estancado. Con TDAH, las tareas grandes abruman y se pierden de vista.

## Stack sugerido
- **Frontend**: React + Vite + Tailwind
- **Backend/DB**: Supabase (Postgres + auth, free tier) — necesario porque es código real desplegado, no un artifact con storage nativo
- **Deploy**: Vercel (link accesible desde el navegador del celular)
- **Auth**: simple, un solo usuario (login básico o incluso sin auth si el link no es público)

## Modelo de datos (MVP)
```
Project
 - id, name, priority (alta/media/baja), color, created_at

Task (pertenece a un Project, opcionalmente a otra Task como padre → permite subtareas)
 - id, project_id, parent_task_id (nullable)
 - title, status (por_hacer / en_progreso / hecho)
 - priority, due_date (nullable)
 - last_moved_at  ← clave para el efecto "oxidado"
 - created_at
```

## Features — MVP (fase 1)
1. Dashboard general: tarjetas de proyectos con % avance y prioridad
2. Vista de proyecto: mini-kanban (Por hacer / En progreso / Hecho)
3. Tareas con fecha y prioridad
4. Subtareas anidadas (un nivel basta para empezar)
5. **Efecto "oxidado"**: color de la tarjeta cambia según días desde `last_moved_at`
   - 0-3 días: normal
   - 4-7 días: amarillo tenue
   - 8-14 días: naranja
   - 15+ días: rojo
6. Al crear una tarea marcada como "grande", prompt para trocearla en subtareas ahí mismo

## Features — Fase 2 (después del MVP)
- Recordatorio semanal (vía alarma del celular, no notificación push nativa) para revisar el dashboard
- Captura rápida de tareas por voz/texto corto
- Filtro por prioridad global (ver top tareas de TODOS los proyectos, no por proyecto)
- Reportes simples de avance

## Riesgo #1 identificado
Historial de construir el dashboard y dejar de actualizarlo. Mitigación: diseño de captura ultra-rápida + hábito de revisión semanal con recordatorio real (alarma), no solo pasivo.

## Siguiente paso práctico
1. Instalar/abrir Claude Code
2. Inicializar repo (`npm create vite@latest`)
3. Pegar este spec como contexto inicial
4. Construir MVP en este orden: modelo de datos → CRUD de proyectos/tareas → kanban visual → lógica de "oxidado" → deploy en Vercel
