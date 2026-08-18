-- Dashboard de Proyectos Personales — esquema MVP
-- Ejecutar en el SQL Editor de tu proyecto de Supabase.

create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  color text not null default '#6366f1',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  parent_task_id uuid references tasks(id) on delete cascade,
  title text not null,
  status text not null default 'por_hacer' check (status in ('por_hacer', 'en_progreso', 'hecho')),
  priority text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  due_date date,
  last_moved_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists tasks_project_id_idx on tasks(project_id);
create index if not exists tasks_parent_task_id_idx on tasks(parent_task_id);

-- Actualiza last_moved_at automáticamente cada vez que cambia el status.
-- Esto alimenta el "efecto oxidado" del dashboard.
create or replace function set_last_moved_at()
returns trigger as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    new.last_moved_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_last_moved_at on tasks;
create trigger tasks_set_last_moved_at
  before insert or update on tasks
  for each row execute function set_last_moved_at();

-- RLS: MVP de un solo usuario sin auth (el link no es público).
-- Antes de compartir el link con más gente, reemplaza estas políticas
-- por unas que filtren por auth.uid().
alter table projects enable row level security;
alter table tasks enable row level security;

drop policy if exists "projects_anon_all" on projects;
create policy "projects_anon_all" on projects
  for all using (true) with check (true);

drop policy if exists "tasks_anon_all" on tasks;
create policy "tasks_anon_all" on tasks
  for all using (true) with check (true);
