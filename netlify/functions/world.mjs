import { sessionsStore, json, readBody } from '../lib/store.mjs';
import { getStore } from '@netlify/blobs';

const players = () => getStore('world_players');
const claims  = () => getStore('world_claims');

/**
 * world.mjs — état partagé de "Steal a Brainrot".
 *   action 'sync'  : publie ma position/skin/cash + créatures possédées, renvoie les autres joueurs et les revendications.
 *   action 'claim' : revendique (ou vole) une créature -> écrit un enregistrement horodaté (résolution last-write-wins).
 */
export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);
  const body = await readBody(req);
  const { token, action } = body;
  if (!token) return json({ error: 'Non authentifié' }, 401);
  const key = await sessionsStore().get(token);
  if (!key || key === '__admin__') return json({ error: 'Session invalide' }, 401);

  const now = Date.now();

  if (action === 'claim') {
    const cid = String(body.cid || '').slice(0, 48);
    if (!cid) return json({ error: 'cid manquant' }, 400);
    await claims().setJSON('c_' + cid, {
      cid, owner: key,
      name: String(body.name || key).slice(0, 24),
      type: String(body.type || '').slice(0, 24),
      ts: now,
    });
    return json({ ok: true });
  }

  // action 'sync' (par défaut)
  const owned = Array.isArray(body.owned) ? body.owned.slice(0, 6).map(o => ({
    id: String(o.id || '').slice(0, 48), type: String(o.type || '').slice(0, 24),
  })) : [];
  const st = {
    name: String(body.name || key).slice(0, 24),
    x: +body.x || 0, z: +body.z || 0, rot: +body.rot || 0,
    skin: String(body.skin || '').slice(0, 24),
    cash: Math.max(0, Math.floor(+body.cash || 0)),
    carry: body.carry ? String(body.carry).slice(0, 24) : '',
    lock: +body.lock || 0,
    owned, ts: now,
  };
  await players().setJSON(key, st);

  const out = [];
  try {
    const { blobs } = await players().list();
    for (const b of blobs) {
      if (b.key === key) continue;
      let p = null;
      try { p = await players().get(b.key, { type: 'json' }); } catch (e) {}
      if (!p) continue;
      if (now - (p.ts || 0) > 10000) { try { await players().delete(b.key); } catch (e) {} continue; }
      out.push({ key: b.key, name: p.name, x: p.x, z: p.z, rot: p.rot, skin: p.skin, cash: p.cash, carry: p.carry, owned: p.owned || [], lock: p.lock || 0 });
    }
  } catch (e) {}

  const cl = [];
  try {
    const cres = await claims().list();
    for (const b of cres.blobs) {
      let c = null;
      try { c = await claims().get(b.key, { type: 'json' }); } catch (e) {}
      if (!c) continue;
      if (now - (c.ts || 0) > 120000) { try { await claims().delete(b.key); } catch (e) {} continue; }
      cl.push(c);
    }
  } catch (e) {}

  return json({ players: out, claims: cl });
};
