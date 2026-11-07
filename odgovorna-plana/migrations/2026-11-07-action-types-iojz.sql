-- Odgovorna Plana: action types and type-specific data
-- Run once in the Supabase SQL Editor before using the new admin fields.
alter table public.actions add column if not exists action_type text not null default 'general';
alter table public.actions add column if not exists type_data jsonb not null default '{}'::jsonb;
comment on column public.actions.action_type is 'Type of action. Current values include general and informacije_od_javnog_znacaja.';
comment on column public.actions.type_data is 'JSONB payload for fields specific to action_type; IOJZ request metadata, timeline and documents are stored here.';
create index if not exists actions_action_type_idx on public.actions (action_type);