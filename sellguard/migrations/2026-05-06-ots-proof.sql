-- SellCov · OpenTimestamps integration
-- À exécuter dans Supabase SQL Editor
--
-- Ajoute deux colonnes à la table certificats pour stocker le proof
-- OpenTimestamps qui ancre chaque certificat dans la blockchain Bitcoin.
--
-- ots_proof  : le fichier .ots binaire encodé en base64 (peut faire 5-30 KB)
-- ots_status : "pending_bitcoin" (juste après stamp) ou "bitcoin_confirmed"
--              (après upgrade ~2h plus tard quand un block Bitcoin est miné)

alter table public.certificats
  add column if not exists ots_proof text,
  add column if not exists ots_status text;

-- Index pour le cron d'upgrade : on doit pouvoir lister rapidement
-- les certificats encore "pending_bitcoin" qui ont >2h
create index if not exists certificats_ots_status_pending_idx
  on public.certificats (created_at)
  where ots_status = 'pending_bitcoin';

-- Commentaires de documentation
comment on column public.certificats.ots_proof is
  'Fichier .ots OpenTimestamps en base64. Permet de vérifier indépendamment de SellCov que le hash existait à un moment T (ancré dans la blockchain Bitcoin).';
comment on column public.certificats.ots_status is
  'pending_bitcoin = proof créé, attestation Bitcoin en attente. bitcoin_confirmed = attestation Bitcoin définitive incluse dans le proof.';
