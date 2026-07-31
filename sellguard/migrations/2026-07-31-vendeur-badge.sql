-- SellCov · Badge vendeur & page publique /vendeur/[slug]
-- À exécuter dans le SQL Editor du dashboard Supabase (projet zzacnniwjamnwhwoidrf).
--
-- Le vendeur revendique son pseudo de plateforme (ex: @mistervintageparis sur
-- Vinted) via /api/vendeur-claim. Le slug normalisé sert d'URL publique
-- sellcov.com/vendeur/<slug>, qui affiche le nombre d'envois certifiés.
-- Unicité sur le slug : premier arrivé, premier servi (l'API renvoie 409 si
-- déjà pris).

alter table public.profiles
  add column if not exists public_handle   text,
  add column if not exists handle_platform text,
  add column if not exists handle_slug     text,
  add column if not exists handle_claimed_at timestamptz;

create unique index if not exists profiles_handle_slug_key
  on public.profiles (handle_slug)
  where handle_slug is not null;

comment on column public.profiles.public_handle   is 'Pseudo affiché tel que saisi (ex: @MisterVintageParis)';
comment on column public.profiles.handle_platform is 'vinted | depop | grailed | vestiaire | etsy | autre';
comment on column public.profiles.handle_slug     is 'Slug URL normalisé, unique (ex: mistervintageparis)';
