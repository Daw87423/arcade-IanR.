import { sessionsStore, usersStore, presenceStore, messagesStore, json, readBody } from '../lib/store.mjs';

async function getThread(ms, key) {
  try { return (await ms.get(key, { type: 'json' })) || []; } catch (e) { return []; }
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);

  const body = await readBody(req);
  const { token, action } = body;
  if (!token) return json({ error: 'Non authentifié' }, 401);

  const key = await sessionsStore().get(token);
  if (!key || key === '__admin__') return json({ error: 'Session invalide' }, 401);

  const us = usersStore(), ms = messagesStore();

  if (action === 'delete') {
    try { await us.delete(key); } catch (e) {}
    try { await presenceStore().delete(key); } catch (e) {}
    try { await ms.delete(key); } catch (e) {}
    try { await sessionsStore().delete(token); } catch (e) {}
    return json({ ok: true });
  }

  if (action === 'message_send') {
    const text = String(body.text || '').trim().slice(0, 500);
    if (!text) return json({ error: 'Message vide' }, 400);
    const thread = await getThread(ms, key);
    thread.push({ from: 'user', text, ts: Date.now(), read: false });
    await ms.setJSON(key, thread);
    return json({ ok: true });
  }

  if (action === 'messages') {
    const thread = await getThread(ms, key);
    let changed = false;
    for (const m of thread) { if (m.from === 'admin' && !m.read) { m.read = true; changed = true; } }
    if (changed) await ms.setJSON(key, thread);
    return json({ messages: thread });
  }

  if (action === 'check') {
    const thread = await getThread(ms, key);
    const unread = thread.filter((m) => m.from === 'admin' && !m.read).length;
    return json({ unread });
  }

  return json({ error: 'Action inconnue' }, 400);
};
