-- Afiya Taskboard: einmal im Supabase SQL Editor ausführen

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'todo',
  assignee    text,
  priority    text not null default 'mittel',
  due         date,
  position    double precision not null default 0,
  created_by  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.tasks enable row level security;

-- Jeder mit dem Link (anon key) darf lesen und schreiben
create policy "team_all" on public.tasks
  for all to anon using (true) with check (true);

-- Live-Updates aktivieren
alter publication supabase_realtime add table public.tasks;
