create table if not exists public.marohe_posts (
  id text primary key,
  post jsonb not null
);
alter table public.marohe_posts enable row level security;
revoke all on public.marohe_posts from anon, authenticated;
grant select, insert, update, delete on public.marohe_posts to service_role;
insert into storage.buckets (id, name, public)
values ('marohe-blog','marohe-blog',true) on conflict (id) do nothing;
