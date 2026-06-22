import { getStore } from '@netlify/blobs';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

// --- Stores Netlify Blobs ---
export const usersStore = () => getStore('users');
export const sessionsStore = () => getStore('sessions');

// --- Hachage sécurisé des mots de passe (scrypt + sel) ---
export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}
export function verifyPassword(password, salt, hash) {
  const test = scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(test, 'hex');
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

// --- Jeton de session ---
export function newToken() {
  return randomBytes(24).toString('hex');
}

// --- Helpers ---
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
export async function getUser(key) {
  return await usersStore().get(key, { type: 'json' });
}
export async function readBody(req) {
  try { return await req.json(); } catch { return {}; }
}
