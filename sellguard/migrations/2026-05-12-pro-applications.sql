-- SellCov · Table pro_applications
-- Stocke les candidatures à l'accès Pro gratuit pendant la bêta privée
-- (page /pros). Aucune authentification requise pour soumettre — c'est un
-- form public, accessible depuis les DM/posts de prospection.
--
-- À exécuter dans Supabase SQL Editor.

create table if not exists public.pro_applications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  handle text not null,              -- handle Instagram / Discord / Twitter
  platform text not null,            -- depop / etsy / vinted_pro / grailed / vestiaire / autre
  monthly_volume text not null,      -- 50_100 / 100_500 / 500_plus
  note text,                         -- message libre optionnel
  status text not null default 'pending',  -- pending / approved / rejected / contacted
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Index pour rechercher par email / handle (dédup) et par statut (dashboard)
create index if not exists pro_applications_email_idx on public.pro_applications (email);
create index if not exists pro_applications_status_idx on public.pro_applications (status);
create index if not exists pro_applications_created_at_idx on public.pro_applications (created_at desc);

-- RLS : la table est privée. Seul le service_role peut lire/écrire.
-- L'INSERT depuis le form public se fera via /api/pro-application qui utilise
-- le service_role côté serveur. Aucun accès direct depuis le browser.
alter table public.pro_applications enable row level security;

-- Aucune policy → personne ne peut accéder via la clé anon. service_role bypass RLS.

comment on table public.pro_applications is
  'Candidatures à l''accès Pro gratuit (bêta privée). Form public sur /pros.';
comment on column public.pro_applications.platform is
  'Plateforme principale de revente du candidat.';
comment on column public.pro_applications.monthly_volume is
  'Volume de ventes mensuelles déclaré (auto-déclaratif).';
comment on column public.pro_applications.status is
  'État de traitement : pending (nouveau), approved (accès donné), rejected, contacted.';
