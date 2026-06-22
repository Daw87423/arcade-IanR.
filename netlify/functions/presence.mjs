import { sessionsStore, usersStore, presenceStore, json, readBody } from '../lib/store.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const { token, playing } = await readBody(req);
  if (!token) return json({ error: 'Non authentifié' }, 401);

  const key = await sessionsStore().get(token);
  if (!key) return json({ error: 'Session invalide' }, 401);

  if (key !== '__admin__') {
    const u = await usersStore().get(key, { type: 'json' });
    if (u) {
      await presenceStore().setJSON(key, { name: u.name, ts: Date.now(), playing: !!playing });
    }
  }
  return json({ ok: true });
};
