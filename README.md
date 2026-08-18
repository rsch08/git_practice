# Dashboard de Proyectos Personales

MVP para dar seguimiento a proyectos personales con estructura jerárquica
(proyecto → tareas → subtareas de un nivel), pensado para no perder de vista
lo que se está estancando. Ver `SPEC.md` para el spec original.

## Stack

- React + Vite + Tailwind
- Supabase (Postgres + cliente JS)
- Pensado para desplegarse en Vercel

## Poner a correr el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear el proyecto de Supabase

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Abre el **SQL Editor** y ejecuta el contenido de `supabase/schema.sql`.
   Esto crea las tablas `projects` y `tasks`, el trigger que actualiza
   `last_moved_at` cuando cambia el status de una tarea (la base del efecto
   "oxidado"), y políticas RLS abiertas pensadas para un solo usuario con un
   link privado.
3. En **Project Settings → API**, copia la `Project URL` y la `anon public
   key`.

### 3. Variables de entorno

```bash
cp .env.example .env
```

Completa `.env` con la URL y la anon key del paso anterior.

### 4. Correr en local

```bash
npm run dev
```

## Deploy en Vercel

1. Sube este repo a GitHub (ya lo está) y conéctalo en [vercel.com](https://vercel.com).
2. Framework preset: **Vite**.
3. Agrega las variables de entorno `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` en la configuración del proyecto en Vercel
   (Settings → Environment Variables).
4. Deploy. El link que te da Vercel es el que abres desde el celular.

## Estructura

```
src/
  lib/supabaseClient.js      # cliente de Supabase
  hooks/                     # useProjects, useProject, useProjectTasks
  utils/oxidado.js           # lógica del efecto "oxidado"
  components/                # ProjectCard, KanbanBoard, TaskCard, modales…
  pages/Dashboard.jsx        # tarjetas de proyectos con % avance
  pages/ProjectView.jsx      # mini-kanban del proyecto
supabase/schema.sql          # esquema + trigger + RLS
```

## Efecto "oxidado"

`src/utils/oxidado.js` calcula, a partir de `last_moved_at`, cuántos días
lleva una tarea sin cambiar de status:

| Días sin moverse | Color   |
|---|---|
| 0-3   | normal |
| 4-7   | amarillo tenue |
| 8-14  | naranja |
| 15+   | rojo |

`last_moved_at` se actualiza solo vía trigger de Postgres cada vez que
cambia el `status` de una tarea — no hay que mantenerlo a mano desde el
frontend. La tarjeta de cada proyecto en el dashboard hereda el peor nivel
de oxidado entre sus tareas no terminadas.

## Trocear tareas grandes

Al crear una tarea puedes marcarla como "es grande"; al guardarla se abre
un modal para partirla en subtareas ahí mismo (una por línea). También
puedes agregar subtareas a cualquier tarea existente desde su tarjeta en el
kanban.

## Qué falta para producción real (fuera del MVP)

- Auth real por usuario (hoy las políticas RLS son abiertas, pensadas para
  un link privado de un solo usuario — endurecer antes de compartir el link).
- Fase 2 del spec: recordatorio semanal, captura rápida por voz/texto,
  filtro de prioridad global entre proyectos, reportes de avance.
