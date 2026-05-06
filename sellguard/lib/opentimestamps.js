// SellCov · OpenTimestamps integration
//
// À chaque upload de vidéo certifiée, on ancre le hash SHA-256 dans la
// blockchain Bitcoin via OpenTimestamps. Personne (même nous) ne peut
// modifier le timestamp une fois ancré. Vérifiable indépendamment par
// n'importe qui via le fichier .ots téléchargeable.
//
// Lib : https://github.com/opentimestamps/javascript-opentimestamps
//
// Cycle de vie d'un proof :
//   t=0   : on crée le proof — il contient l'attestation du Calendar
//           OpenTimestamps (preuve "pending Bitcoin"), valide juridiquement
//           dès la première seconde car le calendar est une infrastructure
//           publique et open-source.
//   t≈2h  : un block Bitcoin est miné qui inclut l'empreinte. On peut
//           "upgrader" le proof pour qu'il contienne l'attestation Bitcoin
//           définitive — irréversible et vérifiable sans dépendre de personne.
//
// Le proof est stocké en base64 dans la table certificats, colonne ots_proof.

import OpenTimestamps from "javascript-opentimestamps";

const OTS = OpenTimestamps?.default || OpenTimestamps;

/**
 * Crée un proof OpenTimestamps "pending Bitcoin" pour un hash SHA-256.
 *
 * @param {string} hashHex - le hash SHA-256 en hexadécimal (64 chars)
 * @returns {Promise<string>} le proof .ots encodé en base64
 * @throws si la communication avec les calendars OTS échoue
 */
export async function createOtsProof(hashHex) {
  if (typeof hashHex !== "string" || !/^[a-f0-9]{64}$/i.test(hashHex)) {
    throw new Error("Invalid SHA-256 hash format");
  }
  const hashBytes = Buffer.from(hashHex, "hex");
  const Ops = OTS.Ops;
  const DetachedTimestampFile = OTS.DetachedTimestampFile;
  const detached = DetachedTimestampFile.fromHash(new Ops.OpSHA256(), hashBytes);
  await OTS.stamp(detached);
  const proofBytes = detached.serializeToBytes();
  return Buffer.from(proofBytes).toString("base64");
}

/**
 * Tente d'upgrader un proof "pending" en proof "Bitcoin attesté".
 * À appeler ~2h après création pour avoir l'attestation blockchain finale.
 * Idempotent : peut être appelé plusieurs fois, ne fait rien si déjà upgradé.
 *
 * @param {string} otsProofBase64 - le proof actuel encodé en base64
 * @returns {Promise<{upgraded: boolean, proofBase64: string}>}
 */
export async function upgradeOtsProof(otsProofBase64) {
  const proofBytes = Buffer.from(otsProofBase64, "base64");
  const DetachedTimestampFile = OTS.DetachedTimestampFile;
  const detached = DetachedTimestampFile.deserialize(proofBytes);
  const wasUpgraded = await OTS.upgrade(detached);
  if (wasUpgraded) {
    const newBytes = detached.serializeToBytes();
    return { upgraded: true, proofBase64: Buffer.from(newBytes).toString("base64") };
  }
  return { upgraded: false, proofBase64: otsProofBase64 };
}

/**
 * Vérifie un proof OpenTimestamps et retourne le timestamp Bitcoin
 * (Unix epoch en secondes) si l'attestation est confirmée.
 *
 * @param {string} otsProofBase64 - le proof encodé en base64
 * @param {string} hashHex - le hash SHA-256 attendu (64 chars hex)
 * @returns {Promise<{verified: boolean, btcTimestamp: number|null, error?: string}>}
 */
export async function verifyOtsProof(otsProofBase64, hashHex) {
  try {
    const proofBytes = Buffer.from(otsProofBase64, "base64");
    const DetachedTimestampFile = OTS.DetachedTimestampFile;
    const detached = DetachedTimestampFile.deserialize(proofBytes);
    const expectedHash = Buffer.from(hashHex, "hex");
    if (!Buffer.from(detached.fileDigest()).equals(expectedHash)) {
      return { verified: false, btcTimestamp: null, error: "hash mismatch" };
    }
    const result = await OTS.verify(detached);
    const btcTimestamp = result?.bitcoin?.timestamp || null;
    return { verified: !!btcTimestamp, btcTimestamp, error: btcTimestamp ? undefined : "pending Bitcoin confirmation" };
  } catch (e) {
    return { verified: false, btcTimestamp: null, error: e.message };
  }
}
