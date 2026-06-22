// ============ Helper d'authentification partagé par toutes les pages ============
(function () {
  const TOKEN_KEY = 'arcade_token';
  const NAME_KEY = 'arcade_name';

  const Arcade = {
    token() { return localStorage.getItem(TOKEN_KEY); },
    name() { return localStorage.getItem(NAME_KEY); },
    setSession(token, name) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(NAME_KEY, name);
    },
    clear() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(NAME_KEY);
    },
    async api(path, body) {
      try {
        const r = await fetch('/api/' + path, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body || {}),
        });
        let d = {};
        try { d = await r.json(); } catch (_) {}
        return { ok: r.ok, data: d };
      } catch (e) {
        return { ok: false, data: { error: 'Connexion au serveur impossible.' } };
      }
    },
    // Récupère le record d'un jeu (score 0 ne baisse jamais le record).
    // Valide aussi la session : si le jeton est invalide, retour au menu.
    async loadBest(game) {
      const t = this.token();
      if (!t) { location.replace('index.html'); return 0; }
      const { ok, data } = await this.api('score', { token: t, game, score: 0 });
      if (!ok) { this.clear(); location.replace('index.html'); return 0; }
      return (data && data.best) || 0;
    },
    // Enregistre un nouveau record pour un jeu.
    async saveBest(game, score) {
      const t = this.token();
      if (!t) return;
      await this.api('score', { token: t, game, score });
    },
  };

  window.Arcade = Arcade;
})();
