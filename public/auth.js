// ============ Helper d'authentification + présence + messages, partagé ============
(function () {
  const TOKEN_KEY = 'arcade_token';
  const NAME_KEY = 'arcade_name';
  let hbTimer = null, lastMsgTs = 0, firstPoll = true;

  function toastHost() {
    let h = document.getElementById('arcadeToasts');
    if (!h) {
      h = document.createElement('div');
      h.id = 'arcadeToasts';
      h.style.cssText = 'position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none';
      document.body.appendChild(h);
    }
    return h;
  }
  function esc(s){ return String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  function showToast(title, text) {
    const t = document.createElement('div');
    t.style.cssText = 'pointer-events:auto;max-width:340px;background:#12121f;border:1px solid rgba(176,107,255,.5);border-left:4px solid #b06bff;color:#f0f2ff;border-radius:12px;padding:12px 14px;box-shadow:0 14px 40px rgba(0,0,0,.5);font-family:system-ui,-apple-system,sans-serif;font-size:14px;opacity:0;transform:translateY(-8px);transition:opacity .2s,transform .2s';
    t.innerHTML = '<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#b06bff;font-weight:700;margin-bottom:3px">✉ ' + esc(title) + '</div>' + esc(text);
    toastHost().appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 250); }, 7000);
  }

  const Arcade = {
    token() { return localStorage.getItem(TOKEN_KEY); },
    name() { return localStorage.getItem(NAME_KEY); },
    setSession(token, name) { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(NAME_KEY, name); this.startHeartbeat(); },
    clear() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(NAME_KEY); this.stopHeartbeat(); },
    showToast,
    async api(path, body) {
      try {
        const r = await fetch('/api/' + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) });
        let d = {}; try { d = await r.json(); } catch (_) {}
        return { ok: r.ok, data: d };
      } catch (e) { return { ok: false, data: { error: 'Connexion au serveur impossible.' } }; }
    },
    async loadBest(game) {
      const t = this.token();
      if (!t) { location.replace('index.html'); return 0; }
      const { ok, data } = await this.api('score', { token: t, game, score: 0 });
      if (!ok) { this.clear(); location.replace('index.html'); return 0; }
      return (data && data.best) || 0;
    },
    async saveBest(game, score) {
      const t = this.token(); if (!t) return;
      await this.api('score', { token: t, game, score });
    },
    // Présence (toutes les 12 s) + remontée des messages de l'admin
    startHeartbeat() {
      if (hbTimer) return;
      const tick = async () => {
        const t = this.token(); if (!t) return;
        if (localStorage.getItem('arcade_isadmin')) return; // l'admin ne pointe pas comme joueur
        const playing = !/Arcade/.test(document.title); // une page de jeu => true
        await this.api('presence', { token: t, playing });
        const { ok, data } = await this.api('account', { token: t, action: 'messages' });
        if (ok && data && data.messages) {
          const adminMsgs = data.messages.filter(m => m.from === 'admin');
          if (!firstPoll) { for (const m of adminMsgs) { if ((m.ts || 0) > lastMsgTs) showToast('Administrateur', m.text); } }
          for (const m of adminMsgs) lastMsgTs = Math.max(lastMsgTs, m.ts || 0);
          firstPoll = false;
        }
      };
      tick(); hbTimer = setInterval(tick, 12000);
    },
    stopHeartbeat() { if (hbTimer) { clearInterval(hbTimer); hbTimer = null; } firstPoll = true; lastMsgTs = 0; },
  };
  window.Arcade = Arcade;
  if (Arcade.token() && !localStorage.getItem('arcade_isadmin')) Arcade.startHeartbeat();
})();
