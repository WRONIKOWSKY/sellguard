# OTS retry tracking (2026-05-12)

Avant : si l'appel à `createOtsProof()` échouait au moment de l'upload
(serveurs OpenTimestamps down, réseau coupé, etc.), le certificat
restait avec `ots_proof = NULL` indéfiniment. Aucun retry n'était tenté.

Maintenant : on track le nombre de tentatives (`ots_attempts`) et le
cron `/api/ots-upgrade` fait deux passes :

- **Phase A (retry create)** : pour les certs où `ots_proof IS NULL`
  et `ots_attempts < MAX_ATTEMPTS` (5), on rappelle `createOtsProof`
  avec le `video_hash` stocké en DB.
- **Phase B (upgrade existant)** : comportement original, on upgrade
  les `pending_bitcoin` >2h en `bitcoin_confirmed`.

## Migration

Exécuter `2026-05-12-ots-retry.sql` dans Supabase SQL Editor. Idempotent
(utilise `add column if not exists`).

## Statuts ots_status

| Statut             | Sens                                          |
|--------------------|-----------------------------------------------|
| `NULL`             | Initial, pas encore tenté                     |
| `pending_bitcoin`  | Proof créé, attestation Bitcoin en attente    |
| `bitcoin_confirmed`| Attestation Bitcoin définitive                |
| `create_failed`    | Échec création — peut être retry              |
| `create_abandoned` | MAX_ATTEMPTS atteint, on abandonne            |

Un cert avec `ots_status = 'create_abandoned'` reste valide juridiquement
via le HMAC SellCov (SHA-256 + signature interne), mais sans ancrage
Bitcoin indépendant. Cas rare en pratique.

## Surveiller la santé du système

Dans Supabase SQL Editor, pour voir combien de certs sont en échec :

```sql
select ots_status, count(*)
from certificats
where ots_status in ('create_failed', 'create_abandoned')
   or ots_proof is null
group by ots_status;
```

Si la colonne `create_abandoned` grossit, c'est qu'OpenTimestamps a un
souci durable côté infra — à surveiller manuellement le temps de
brancher une alerte type Sentry/Slack plus tard.
