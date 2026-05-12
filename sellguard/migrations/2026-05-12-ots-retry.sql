-- SellCov · OpenTimestamps retry tracking
-- À exécuter dans Supabase SQL Editor
--
-- Ajoute deux colonnes à certificats pour gérer le retry de la création
-- du proof OTS quand l'appel initial aux Calendar OpenTimestamps échoue.
--
-- ots_attempts        : nombre de tentatives de création (0 = pas encore essayé,
--                       N = N tentatives, qu'elles aient réussi ou échoué)
-- last_ots_attempt_at : timestamp de la dernière tentative, pour throttler
--                       les retries entre eux (le cron tourne 1×/jour mais ce
--                       champ permet d'ajouter un délai min si on passe Pro)

alter table public.certificats
  add column if not exists ots_attempts integer not null default 0,
  add column if not exists last_ots_attempt_at timestamptz;

-- Index pour le cron de retry : on doit pouvoir lister rapidement les
-- certificats avec ots_proof NULL et qui n'ont pas atteint MAX_ATTEMPTS (=5).
create index if not exists certificats_ots_retry_idx
  on public.certificats (created_at)
  where ots_proof is null and ots_attempts < 5;

-- Commentaires
comment on column public.certificats.ots_attempts is
  'Nombre de tentatives de création du proof OTS. Stop après MAX_ATTEMPTS (5).';
comment on column public.certificats.last_ots_attempt_at is
  'Timestamp de la dernière tentative de stamp/upgrade OTS.';

-- Nouveaux statuts possibles pour ots_status :
--   NULL                : initial, pas encore tenté
--   'pending_bitcoin'   : proof créé, attestation Bitcoin en attente
--   'bitcoin_confirmed' : attestation Bitcoin définitive
--   'create_failed'     : échec création (peut être retry)
--   'create_abandoned'  : MAX_ATTEMPTS atteint, on abandonne
