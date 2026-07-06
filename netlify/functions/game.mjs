import { sessionsStore, usersStore, worldStore, json, readBody, ADMIN_KEY } from '../lib/store.mjs';

// Catalogue de créatures (rate = cash/seconde, price = coût d'achat)
const CREATURES = {
  zizou:  { rate: 1,   price: 0    },
  ratata: { rate: 4,   price: 60   },
  bombo:  { rate: 12,  price: 280  },
  croco:  { rate: 30,  price: 900  },
  saturn: { rate: 80,  price: 3200 },
  goldo:  { rate: 200, price: 11000 },
};
const NUM_PLOTS = 8;
const ACTIVE_MS = 9000;

function hashInt(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return (h>>>0); }
function newId(){ return Math.random().toString(36).slice(2,9); }

async function allRecords(ws){
  const { blobs } = await ws.list();
  const out = [];
  for (const b of blobs){
    let r=null; try { r = await ws.get(b.key,{type:'json'}); } catch(e){}
    if (r) out.push([b.key, r]);
  }
  return out;
}

function rateOf(creatures){ let s=0; for(const c of (creatures||[])){ const d=CREATURES[c.type]; if(d) s+=d.rate; } return s; }

async function loadOrInit(ws, key, name){
  let rec = null;
  try { rec = await ws.get(key,{type:'json'}); } catch(e){}
  const now = Date.now();
  if (!rec){
    // attribuer une parcelle libre
    const recs = await allRecords(ws);
    const taken = new Set(recs.filter(([k,r])=> (now-(r.ts||0))<ACTIVE_MS).map(([k,r])=>r.plot));
    let plot = hashInt(key)%NUM_PLOTS;
    for (let i=0;i<NUM_PLOTS;i++){ const p=(hashInt(key)+i)%NUM_PLOTS; if(!taken.has(p)){ plot=p; break; } }
    rec = { name, skin: hashInt(key)%100000, plot,
            x:0, z:0, ry:0, cash:0,
            creatures:[{id:newId(), type:'zizou'}], carrying:null,
            ts:now, incomeTs:now };
  }
  rec.name = name;
  return rec;
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée' }, 405);
  const body = await readBody(req);
  const { token, action } = body;
  if (!token) return json({ error: 'Non authentifié' }, 401);
  const sess = await sessionsStore().get(token);
  if (!sess || sess === ADMIN_KEY) return json({ error: 'Session invalide' }, 401);
  const key = sess;
  const user = await usersStore().get(key, { type: 'json' });
  const name = (user && user.name) || 'Joueur';
  const ws = worldStore();
  const now = Date.now();

  const rec = await loadOrInit(ws, key, name);

  // accumulation de revenu depuis le dernier passage (créatures posées sur la base)
  const dt = Math.min(60, Math.max(0, (now - (rec.incomeTs||now))/1000));
  rec.cash = Math.floor((rec.cash||0) + rateOf(rec.creatures)*dt);
  rec.incomeTs = now;

  if (action === 'sync'){
    if (typeof body.x==='number') rec.x=body.x;
    if (typeof body.z==='number') rec.z=body.z;
    if (typeof body.ry==='number') rec.ry=body.ry;
    rec.ts = now;
    await ws.setJSON(key, rec);
    const recs = await allRecords(ws);
    const players = recs
      .filter(([k,r]) => k!==key && (now-(r.ts||0))<ACTIVE_MS)
      .map(([k,r]) => ({ key:k, name:r.name, skin:r.skin, x:r.x||0, z:r.z||0, ry:r.ry||0,
                         plot:r.plot, carrying:r.carrying||null,
                         creatures:(r.creatures||[]).map(c=>({id:c.id,type:c.type})) }));
    return json({ me:{ cash:rec.cash, creatures:rec.creatures, carrying:rec.carrying, plot:rec.plot, skin:rec.skin }, players });
  }

  if (action === 'steal'){
    if (rec.carrying) return json({ error:'Déjà en train de porter' }, 400);
    const vkey = body.victimKey, cid = body.creatureId;
    if (!vkey || !cid) return json({ error:'Cible manquante' }, 400);
    let vrec=null; try { vrec = await ws.get(vkey,{type:'json'}); } catch(e){}
    if (!vrec) return json({ error:'Cible introuvable' }, 404);
    let item=null;
    const idx=(vrec.creatures||[]).findIndex(c=>c.id===cid);
    if (idx>=0){ item=vrec.creatures[idx]; vrec.creatures.splice(idx,1); }
    else if (vrec.carrying && vrec.carrying.id===cid){ item=vrec.carrying; vrec.carrying=null; }
    if (!item) return json({ error:'Trop tard, déjà volé !' }, 409);
    rec.carrying = item;
    await ws.setJSON(vkey, vrec);
    await ws.setJSON(key, rec);
    return json({ ok:true, carrying:item, cash:rec.cash, creatures:rec.creatures });
  }

  if (action === 'stealBot'){
    if (rec.carrying) return json({ error:'Déjà en train de porter' }, 400);
    const type = CREATURES[body.type] ? body.type : 'zizou';
    rec.carrying = { id:newId(), type };
    await ws.setJSON(key, rec);
    return json({ ok:true, carrying:rec.carrying });
  }

  if (action === 'claim'){
    if (!rec.carrying) return json({ error:'Rien à déposer' }, 400);
    rec.creatures.push(rec.carrying); rec.carrying=null;
    await ws.setJSON(key, rec);
    return json({ ok:true, cash:rec.cash, creatures:rec.creatures, carrying:null });
  }

  if (action === 'buy'){
    const type = body.type;
    const def = CREATURES[type];
    if (!def) return json({ error:'Créature inconnue' }, 400);
    if (rec.cash < def.price) return json({ error:'Pas assez de cash' }, 400);
    rec.cash -= def.price;
    rec.creatures.push({ id:newId(), type });
    await ws.setJSON(key, rec);
    return json({ ok:true, cash:rec.cash, creatures:rec.creatures });
  }

  if (action === 'sell'){
    const cid = body.creatureId;
    const idx=(rec.creatures||[]).findIndex(c=>c.id===cid);
    if (idx<0) return json({ error:'Introuvable' }, 404);
    const def=CREATURES[rec.creatures[idx].type];
    rec.cash += Math.floor((def?def.price:0)*0.5)||5;
    rec.creatures.splice(idx,1);
    await ws.setJSON(key, rec);
    return json({ ok:true, cash:rec.cash, creatures:rec.creatures });
  }

  await ws.setJSON(key, rec);
  return json({ error:'Action inconnue' }, 400);
};
