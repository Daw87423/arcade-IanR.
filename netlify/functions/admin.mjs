import { sessionsStore, usersStore, presenceStore, messagesStore, json, readBody, ADMIN_KEY } from '../lib/store.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);
  const { token } = await readBody(req);
  if (!token) return json({ error: 'Non authentifié' }, 401);
  const sess = await sessionsStore().get(token);
  if (sess !== ADMIN_KEY) return json({ error: 'Accès réservé à l’administrateur.' }, 403);

  const us = usersStore(), ps = presenceStore(), ms = messagesStore();
  const { blobs } = await us.list();
  const now = Date.now();
  const users = [];
  for (const b of blobs) {
    const u = await us.get(b.key, { type: 'json' });
    if (!u) continue;
    let pres = null;
    try { pres = await ps.get(b.key, { type: 'json' }); } catch (e) {}
    const online = !!(pres && (now - (pres.ts || 0) < 30000));
    let thread = [];
    try { thread = (await ms.get(b.key, { type: 'json' })) || []; } catch (e) {}
    const unread = thread.filter((m) => m.from === 'user' && !m.read).length;
    users.push({
      key: b.key, name: u.name, scores: u.scores || {},
      online, playing: !!(online && pres && pres.playing), unread,
    });
  }
  users.sort((a, b) => (b.online - a.online) || (b.unread - a.unread) || a.name.localeCompare(b.name));
  return json({ users });
};
