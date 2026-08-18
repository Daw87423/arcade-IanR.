import { sessionsStore, usersStore, messagesStore, json, readBody, ADMIN_KEY } from '../lib/store.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);
  const { token, user, text } = await readBody(req);
  if (!token) return json({ error: 'Non authentifié' }, 401);
  const sess = await sessionsStore().get(token);
  if (sess !== ADMIN_KEY) return json({ error: 'Accès réservé.' }, 403);
  if (!user) return json({ error: 'Joueur manquant' }, 400);
  const msg = String(text || '').trim().slice(0, 500);
  if (!msg) return json({ error: 'Message vide' }, 400);

  // le destinataire existe-t-il encore ?
  const u = await usersStore().get(user, { type: 'json' });
  if (!u) return json({ error: 'Ce compte n’existe plus.' }, 404);

  const ms = messagesStore();
  let thread = [];
  try { thread = (await ms.get(user, { type: 'json' })) || []; } catch (e) {}
  thread.push({ from: 'admin', text: msg, ts: Date.now(), read: false });
  if (thread.length > 200) thread = thread.slice(-200);
  await ms.setJSON(user, thread);
  return json({ messages: thread });
};
