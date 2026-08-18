import {
  sessionsStore, verifyPassword, newToken, json, getUser, readBody,
} from '../lib/store.mjs';

/**
 * login.mjs — connexion joueur UNIQUEMENT.
 * Ne crée jamais de session admin, peu importe l'identifiant ou le mot de passe.
 * L'admin se connecte exclusivement via /api/admin_login.
 */
export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const { id, password } = await readBody(req);
  if (!id || !password) return json({ error: 'Identifiant et mot de passe obligatoires.' }, 400);

  const key = String(id).trim().toLowerCase();

  const user = await getUser(key);
  if (!user || !verifyPassword(String(password), user.salt, user.hash)) {
    return json({ error: 'Identifiant ou mot de passe incorrect.' }, 401);
  }
  const token = newToken();
  await sessionsStore().set(token, key);
  return json({ token, name: user.name, admin: false });
};
