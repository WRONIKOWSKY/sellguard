# Tier system (2026-05-12)

Le tier d'abonnement d'un utilisateur est stocké dans
`auth.users.raw_app_meta_data.tier` (champ JSONB Supabase Auth, non
modifiable par le user lui-même — seul le `service_role` peut écrire).

Pas de migration SQL nécessaire : `raw_app_meta_data` existe déjà dans
`auth.users`. Aucune table à créer.

## Tiers possibles

| Tier        | Source                     | Quotas/jour (analyze / litige / upload) |
|-------------|----------------------------|-----------------------------------------|
| `beta`      | default si non défini       | 20 / 10 / 10                            |
| `discovery` | plan gratuit (3 certifs/mo) | 5 / 3 / 3                               |
| `seller`    | plan 14,90 €/mois            | 50 / 30 / 30                            |
| `pro`       | plan 29,90 €/mois            | 200 / 200 / 200                         |
| `admin`     | compte interne               | 9999 / 9999 / 9999                      |

Valeurs centralisées dans `lib/tier.js` → `TIER_LIMITS`. Pour les modifier,
éditer ce fichier et redéployer.

## Upgrade manuel d'un utilisateur

Via Supabase SQL Editor :

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
                     || '{"tier": "pro"}'::jsonb
where email = 'user@example.com';
```

L'utilisateur doit se déconnecter / reconnecter pour que son JWT inclue
le nouveau tier (le tier est lu depuis le token, pas re-fetché à chaque
requête).

## Branchement futur Stripe

Quand Stripe sera plumbé, créer une route `pages/api/stripe/webhook.js`
qui reçoit les events `customer.subscription.created/updated/deleted` et
met à jour `app_metadata.tier` via l'API admin Supabase :

```js
const { error } = await supa.auth.admin.updateUserById(userId, {
  app_metadata: { tier: "seller" }
});
```

Aucune autre modif de code requise — `withAuth` lira automatiquement le
nouveau tier.

## Note quota mensuel vs journalier

Le CGU annonce des quotas mensuels (3/30/illimité par mois). En interne
on applique des quotas journaliers (calculés pour absorber les bursts).
Si tu veux passer en strict mensuel plus tard :
- modifier la fonction Postgres `increment_anthropic_usage` pour utiliser
  une fenêtre mensuelle au lieu de journalière
- ou créer une table `usage_anthropic_monthly` distincte
