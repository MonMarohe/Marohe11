create table if not exists public.marohe_posts (
  id text primary key,
  post jsonb not null
);
alter table public.marohe_posts enable row level security;
revoke all on public.marohe_posts from anon, authenticated;
grant select, insert, update, delete on public.marohe_posts to service_role;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images','blog-images',true,6291456,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true, file_size_limit=6291456, allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images" on storage.objects
for select to public using (bucket_id = 'blog-images');
