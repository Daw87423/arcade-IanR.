import { sessionsStore, usersStore, messagesStore, json, readBody, ADMIN_KEY } from '../lib/store.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);
  const { token, user } = await readBody(req);
  if (!token) return json({ error: 'Non authentifié' }, 401);
  const sess = await sessionsStore().get(token);
  if (sess !== ADMIN_KEY) return json({ error: 'Accès réservé.' }, 403);
  if (!user) return json({ error: 'Joueur manquant' }, 400);

  const ms = messagesStore();
  let thread = [];
  try { thread = (await ms.get(user, { type: 'json' })) || []; } catch (e) {}
  let changed = false;
  for (const m of thread) { if (m.from === 'user' && !m.read) { m.read = true; changed = true; } }
  if (changed) await ms.setJSON(user, thread);

  let name = user;
  try { const u = await usersStore().get(user, { type: 'json' }); if (u) name = u.name; } catch (e) {}
  return json({ messages: thread, name });
};
