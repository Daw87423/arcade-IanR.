import {
  usersStore, sessionsStore, hashPassword, newToken, json, getUser, readBody,
} from '../lib/store.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const { id, password } = await readBody(req);
  if (!id || !password) return json({ error: 'Identifiant et mot de passe obligatoires.' }, 400);

  const key = String(id).trim().toLowerCase();
  const name = String(id).trim();
  if (key.length < 3) return json({ error: 'Identifiant : 3 caractères minimum.' }, 400);
  if (String(password).length < 4) return json({ error: 'Mot de passe : 4 caractères minimum.' }, 400);

  const existing = await getUser(key);
  if (existing) return json({ error: 'Cet identifiant existe déjà.' }, 409);

  const { salt, hash } = hashPassword(String(password));
  await usersStore().setJSON(key, { name, salt, hash, scores: {}, created: Date.now() });

  const token = newToken();
  await sessionsStore().set(token, key);
  return json({ token, name });
};
