import { usersStore, json, readBody } from '../lib/store.mjs';

// Accès administrateur. Surchargeables via les variables d'environnement
// ADMIN_ID et ADMIN_CODE dans les réglages Netlify.
const ADMIN_ID = process.env.ADMIN_ID || 'Ian';
const ADMIN_CODE = process.env.ADMIN_CODE || '@LeaderIanTheBoss2014';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const { id, code } = await readBody(req);
  if (String(id || '').trim() !== ADMIN_ID || String(code || '') !== ADMIN_CODE) {
    return json({ error: 'Identifiant ou code administrateur incorrect.' }, 401);
  }

  const store = usersStore();
  const { blobs } = await store.list();
  const users = [];
  for (const b of blobs) {
    const u = await store.get(b.key, { type: 'json' });
    if (!u) continue;
    const scores = u.scores || {};
    if (scores['2048'] == null && typeof u.best === 'number') scores['2048'] = u.best;
    users.push({ name: u.name, scores, created: u.created || 0 });
  }
  users.sort((a, b) => (b.created || 0) - (a.created || 0));
  return json({ users });
};
