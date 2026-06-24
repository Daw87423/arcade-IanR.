import {
  sessionsStore, newToken, json, readBody,
  ADMIN_ID, ADMIN_CODE, ADMIN_KEY,
} from '../lib/store.mjs';

/**
 * admin_login.mjs — connexion administrateur UNIQUEMENT.
 * Appelé par la modale engrenage, jamais par le formulaire joueur principal.
 */
export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const { id, password } = await readBody(req);
  if (!id || !password) return json({ error: 'Identifiant et code obligatoires.' }, 400);

  const key = String(id).trim().toLowerCase();

  if (key !== ADMIN_ID.toLowerCase() || String(password) !== ADMIN_CODE) {
    return json({ error: 'Identifiant ou code admin incorrect.' }, 401);
  }

  const token = newToken();
  await sessionsStore().set(token, ADMIN_KEY);
  return json({ token, name: ADMIN_ID, admin: true });
};
