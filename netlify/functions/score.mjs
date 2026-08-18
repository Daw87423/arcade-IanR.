import { usersStore, sessionsStore, json, readBody } from '../lib/store.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const { token, game, score } = await readBody(req);
  if (!token) return json({ error: 'Non authentifié' }, 401);

  const key = await sessionsStore().get(token);
  if (!key) return json({ error: 'Session invalide' }, 401);
  if (key === '__admin__') return json({ best: 0, scores: {}, name: process.env.ADMIN_ID || 'Ian', admin: true });

  const user = await usersStore().get(key, { type: 'json' });
  if (!user) return json({ error: 'Compte introuvable' }, 404);

  user.scores = user.scores || {};
  // Compatibilité : ancien champ "best" = record 2048 des comptes existants
  if (user.scores['2048'] == null && typeof user.best === 'number') {
    user.scores['2048'] = user.best;
  }

  let changed = false;
  if (game) {
    const s = Number(score) || 0;
    if (s > (user.scores[game] || 0)) {
      user.scores[game] = s;
      changed = true;
    }
  }
  if (changed) await usersStore().setJSON(key, user);

  return json({ best: game ? (user.scores[game] || 0) : 0, scores: user.scores, name: user.name });
};
