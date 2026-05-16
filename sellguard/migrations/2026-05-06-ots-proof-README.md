# OpenTimestamps · Étapes de déploiement

## 1. Installer la dépendance

Dans GitHub Desktop ou en local :

```bash
npm install
```

(Le `package.json` contient déjà `javascript-opentimestamps` ^0.4.6, npm install va l'ajouter.)

## 2. Migration Supabase

1. Aller sur https://app.supabase.com → projet SellCov → SQL Editor
2. Coller le contenu de `migrations/2026-05-06-ots-proof.sql`
3. Run
4. Vérifier que les colonnes `ots_proof` et `ots_status` existent dans `certificats`

## 3. Variable d'environnement Vercel

Sur https://vercel.com/wronikowsky/sellcov/settings/environment-variables :

Ajouter :
- Name : `OTS_UPGRADE_SECRET`
- Value : un long string aléatoire (ex : `openssl rand -hex 32` dans terminal)
- Environments : Production + Preview

Cette variable protège l'endpoint `/api/ots-upgrade` contre les abus.

## 4. Cron d'upgrade quotidien (optionnel mais recommandé)

Pour upgrader les proofs "pending_bitcoin" en "bitcoin_confirmed" automatiquement, créer un Vercel Cron Job.

Créer fichier `vercel.json` à la racine :

```json
{
  "crons": [
    {
      "path": "/api/ots-upgrade",
      "schedule": "0 4 * * *"
    }
  ]
}
```

Ce cron tourne tous les jours à 4h du matin UTC.

⚠️ Vercel Cron envoie un header `Authorization: Bearer <CRON_SECRET>` automatique, mais notre endpoint attend `x-cron-secret`. Pour que ça marche, il faut soit :
- (a) Utiliser un service externe (n8n, GitHub Actions, cron-job.org) qui peut envoyer le header `x-cron-secret`
- (b) Modifier l'endpoint pour accepter aussi `Authorization: Bearer ...`

Pour démarrer simple : utilise cron-job.org gratuit, configure une URL `https://www.sellcov.com/api/ots-upgrade` avec le header custom `x-cron-secret`.

## 5. Test bout-en-bout

1. Push + merge sur `clean-version`
2. Attendre rebuild Vercel
3. Aller sur `https://www.sellcov.com/protection`
4. Faire un certificat de test
5. Aller sur `https://www.sellcov.com/verify/SC-XXXX-XXX`
6. Tu dois voir le bandeau "Ancrage Bitcoin en cours" (orange)
7. Le lendemain (après le cron), tu dois voir "✓ Ancré dans Bitcoin"
8. Cliquer sur "Télécharger la preuve .ots" → tu obtiens un fichier `SC-XXXX-XXX.ots`
9. Vérifier sur https://opentimestamps.org/ : upload le .ots + drag-drop la vidéo originale → doit confirmer le timestamp Bitcoin

## Comportement en cas d'échec OTS

Si l'API OpenTimestamps est down au moment de l'upload :
- Le certificat est créé normalement (HMAC valide)
- Le proof OTS est juste manquant temporairement
- L'erreur est loggée dans Vercel logs : `[upload] OTS stamp failed (non-fatal): ...`
- Tu peux relancer manuellement : on peut ajouter un endpoint admin plus tard pour réessayer

## Pitch utilisable dès aujourd'hui

> "Chaque certificat SellCov est ancré dans la blockchain Bitcoin via le protocole OpenTimestamps. La preuve est vérifiable par n'importe qui, sans dépendre de SellCov. Personne — pas même nous — ne peut modifier l'horodatage."
