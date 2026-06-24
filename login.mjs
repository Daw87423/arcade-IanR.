import { getStore } from '@netlify/blobs';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

// --- Identité administrateur ---
export const ADMIN_ID = process.env.ADMIN_ID || 'Ian';
export const ADMIN_CODE = process.env.ADMIN_CODE || '@LeaderIanTheBoss2014';
export const ADMIN_KEY = '__admin__'; // valeur sentinelle stockée dans la session admin

// --- Stores Netlify Blobs ---
export const usersStore = () => getStore('users');
export const sessionsStore = () => getStore('sessions');
export const presenceStore = () => getStore('presence');
export const messagesStore = () => getStore('messages');

// --- Mots de passe (scrypt + sel) ---
export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}
export function verifyPassword(password, salt, hash) {
  const test = scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(test, 'hex'), b = Buffer.from(hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}
export function newToken() { return randomBytes(24).toString('hex'); }

// --- Helpers ---
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}
export async function getUser(key) { return await usersStore().get(key, { type: 'json' }); }
export async function readBody(req) { try { return await req.json(); } catch { return {}; } }
