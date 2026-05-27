-- Table leads : pipeline de démarchage des power-resellers vintage
-- pour la cohorte fondateurs. Alimentée et consultée uniquement via
-- l'interface /admin (réservée au user de tier `admin`).
--
-- Aucune RLS policy ouverte : on bypass via service_role depuis les
-- endpoints /api/admin/*, eux-mêmes protégés par lib/adminAuth.js
-- (vérif app_metadata.tier === 'admin').

create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  handle          text not null,
  platform        text,
  email           text,
  first_name      text,
  raw_notes       text,
  status          text not null default 'todo',
  last_subject    text,
  last_body       text,
  sent_at         timestamptz,
  followup_j3_due timestamptz,
  followup_j7_due timestamptz,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_sent_at_idx on public.leads (sent_at);

create or replace function public.set_leads_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_leads_updated_at();

-- RLS : table fermée par défaut, seul service_role peut lire/écrire.
alter table public.leads enable row level security;

-- Optionnel : log des messages envoyés (audit + reprise éventuelle si Resend tombe).
create table if not exists public.lead_messages (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads(id) on delete cascade,
  kind        text not null,
  subject     text,
  body        text,
  resend_id   text,
  sent_at     timestamptz not null default now()
);

create index if not exists lead_messages_lead_id_idx on public.lead_messages (lead_id);

alter table public.lead_messages enable row level security;
