import { sessionsStore, newsStore, json, readBody, ADMIN_KEY, NEWS_KEY } from '../lib/store.mjs';

async function getFeed(ns) {
  try { return (await ns.get(NEWS_KEY, { type: 'json' })) || []; } catch (e) { return []; }
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);
  const { token, action, text, id } = await readBody(req);
  if (!token) return json({ error: 'Non authentifié' }, 401);

  const sess = await sessionsStore().get(token);
  if (!sess) return json({ error: 'Session invalide' }, 401);
  const isAdmin = sess === ADMIN_KEY;

  const ns = newsStore();

  // Publier une annonce — réservé à l'administrateur
  if (action === 'post') {
    if (!isAdmin) return json({ error: 'Réservé à l’administrateur.' }, 403);
    const msg = String(text || '').trim().slice(0, 800);
    if (!msg) return json({ error: 'Message vide' }, 400);
    const feed = await getFeed(ns);
    feed.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), text: msg, ts: Date.now() });
    const trimmed = feed.slice(0, 100);
    await ns.setJSON(NEWS_KEY, trimmed);
    return json({ feed: trimmed });
  }

  // Supprimer une annonce — réservé à l'administrateur
  if (action === 'delete') {
    if (!isAdmin) return json({ error: 'Réservé à l’administrateur.' }, 403);
    if (!id) return json({ error: 'Identifiant manquant' }, 400);
    const feed = (await getFeed(ns)).filter((p) => p.id !== id);
    await ns.setJSON(NEWS_KEY, feed);
    return json({ feed });
  }

  // Consulter le fil — tout compte connecté (joueur ou admin)
  if (action === 'list') {
    const feed = await getFeed(ns);
    return json({ feed });
  }

  return json({ error: 'Action inconnue' }, 400);
};
