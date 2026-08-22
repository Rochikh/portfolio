/* ═══════════════════════════════════════════════════════════
   Rochane Kherbouche · ia.rochane.fr
   Scripts partagés : navigation, apparitions, compteurs,
   assistant conversationnel, formulaire de contact.
   ═══════════════════════════════════════════════════════════ */
(function () {

  // ── WIDGET CHAT : markup injecté sur toutes les pages ──
  var CHAT_HTML = `
<div id="chat-container" class="chat-container">
  <button id="chat-toggle-btn" class="chat-toggle-btn" aria-label="Ouvrir l'assistant de discussion" aria-expanded="false" aria-controls="chat-widget">
    <svg class="fa-comment-dots" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.1.84 4.03 2.24 5.55-.18 1.4-.77 2.65-1.55 3.6-.16.2-.02.5.23.48 1.93-.18 3.6-.86 4.9-1.66 1.27.46 2.67.73 4.18.73 5.52 0 10-3.94 10-8.8S17.52 2 12 2zM7.5 12.1a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"/></svg>
    <svg class="fa-times" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
    <span class="chat-badge" id="chat-badge"></span>
  </button>
  <div class="chat-nudge" id="chat-nudge">
    <span aria-hidden="true">💬</span> Une question ? Je suis là !
    <button class="chat-nudge-close" id="chat-nudge-close" aria-label="Masquer ce message">✕</button>
  </div>
  <div id="chat-widget" class="chat-widget" hidden>
    <div class="chat-header">
      <div class="chat-header-top">
        <div class="chat-header-title">Une question ?</div>
        <button class="chat-header-close" id="chat-close-btn" aria-label="Fermer l'assistant">✕</button>
      </div>
      <div class="chat-header-sub">Je réponds sur les interventions, formats et disponibilités de Rochane.</div>
    </div>
    <div id="chat-messages" class="chat-messages" role="log" aria-live="polite" aria-atomic="false"></div>
    <div class="chat-input-area">
      <textarea id="chat-input" rows="1" placeholder="Votre question ici..." aria-label="Votre question"></textarea>
      <button id="chat-send-btn">Envoyer</button>
    </div>
  </div>
</div>
`;

  function mountChat() {
    if (document.getElementById('chat-container')) return;
    document.body.insertAdjacentHTML('beforeend', CHAT_HTML);
  }

  function initNav() {
  // NAV SCROLL
  window.addEventListener('scroll', () => {
    document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 10);
  });

  // MENU MOBILE
  const navEl = document.getElementById('main-nav');
  const burger = document.getElementById('nav-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = navEl.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    navEl.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        navEl.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  }

  function initReveal() {
  // REVEAL
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), i * 55);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => io.observe(el));

  // Trigger visible on load
  setTimeout(() => {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    });
  }, 80);
  }

  function initCounters() {
  // COUNTER — la valeur finale est écrite en dur dans le HTML (visible sans JS
  // et pour les crawlers). Au premier passage dans le viewport, remise à 0 puis
  // animation jusqu'à data-count-to. En prefers-reduced-motion, on ne touche
  // à rien : la valeur du HTML reste affichée.
  let done = false;
  const counters = document.querySelectorAll('.stat-num[data-count-to]');
  const statsEl = document.querySelector('.stats-card');
  if (statsEl && counters.length) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    new IntersectionObserver(([e], io) => {
      if (e.isIntersecting && !done) {
        done = true;
        io.disconnect();
        counters.forEach(el => {
          const target = +el.dataset.countTo;
          const suffix = el.dataset.suffix || '';
          el.textContent = '0';
          const start = performance.now();
          const dur = 1100;
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target).toLocaleString('fr-FR') + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }
    }, { threshold: 0.6 }).observe(statsEl);
  }
  }

    // ── CHAT ──
    var INITIAL_MSG = "Bonjour ! Je suis l'assistant virtuel de Rochane Kherbouche. Posez-moi vos questions sur ses interventions, ses outils et son livre.";
    var history = [];

    function getElements() {
      return {
        container: document.getElementById('chat-container'),
        toggle:    document.getElementById('chat-toggle-btn'),
        widget:    document.getElementById('chat-widget'),
        messages:  document.getElementById('chat-messages'),
        input:     document.getElementById('chat-input'),
        send:      document.getElementById('chat-send-btn'),
        closeBtn:  document.getElementById('chat-close-btn'),
        badge:     document.getElementById('chat-badge'),
        nudge:     document.getElementById('chat-nudge'),
        nudgeX:    document.getElementById('chat-nudge-close')
      };
    }

    function escapeHTML(s) {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // Rendu markdown minimal sur une chaîne DÉJÀ échappée. Seuls quatre motifs
    // produisent des balises : gras, retours à la ligne, listes à puces,
    // liens https absolus. Le texte échappé ne contient plus ni < ni guillemets
    // bruts, les URLs restaurées dans href="" sont donc inertes.
    function renderMarkdown(escaped) {
      // Neutraliser tout octet nul du texte source : \x00 est réservé aux
      // placeholders de liens ci-dessous
      escaped = escaped.replace(/\x00/g, '');
      var links = [];
      // Liens Markdown [label](https://url) — placeholders \x00N\x00, un octet
      // nul ne peut pas provenir du texte échappé
      var processed = escaped.replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)/g, function (_, label, url) {
        var i = links.length;
        links.push('<a href="' + url + '" target="_blank" rel="noopener" style="color:#1d3db0;font-weight:600;text-decoration:underline;">' + label + ' <span aria-hidden="true">↗</span></a>');
        return '\x00' + i + '\x00';
      });
      // URLs https brutes restantes, ponctuation finale laissée hors du lien
      processed = processed.replace(/https:\/\/[^\s\x00]+/g, function (url) {
        var trail = (url.match(/(?:&quot;|&#39;|[.,;:!?»)\]])+$/) || [''])[0];
        if (trail) url = url.slice(0, url.length - trail.length);
        var i = links.length;
        links.push('<a href="' + url + '" target="_blank" rel="noopener" style="color:#1d3db0;text-decoration:underline;word-break:break-all;">' + url + '</a>');
        return '\x00' + i + '\x00' + trail;
      });
      // Gras
      processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Listes à puces et retours à la ligne
      var html = '';
      var inList = false;
      var needBr = false;
      processed.split('\n').forEach(function (line) {
        var item = line.match(/^\s*[-*]\s+(.*)$/);
        if (item) {
          if (!inList) { html += '<ul>'; inList = true; }
          html += '<li>' + item[1] + '</li>';
          needBr = false;
        } else {
          if (inList) { html += '</ul>'; inList = false; }
          if (needBr) html += '<br>';
          html += line;
          needBr = true;
        }
      });
      if (inList) html += '</ul>';
      // Restaurer les liens
      return html.replace(/\x00(\d+)\x00/g, function (_, i) { return links[+i]; });
    }

    function addMsg(text, who, els) {
      var d = document.createElement('div');
      d.className = 'chat-message ' + who;
      if (who === 'user') {
        // Jamais d'interprétation HTML côté utilisateur
        d.textContent = text;
        d.style.whiteSpace = 'pre-wrap';
      } else {
        d.innerHTML = renderMarkdown(escapeHTML(text));
      }
      els.messages.appendChild(d);
      els.messages.scrollTop = els.messages.scrollHeight;
      return d;
    }

    function openChat(els) {
      // Rendre le panneau au flux avant .open : le reflow forcé laisse la
      // transition opacity/transform se jouer malgré le changement de display
      els.widget.hidden = false;
      void els.widget.offsetWidth;
      els.container.classList.add('open');
      els.toggle.setAttribute('aria-expanded', 'true');
      if (els.badge) els.badge.style.display = 'none';
      if (els.nudge) els.nudge.classList.remove('visible');
      if (els.messages.children.length === 0) addMsg(INITIAL_MSG, 'ai', els);
      els.input.focus();
    }

    function closeChat(els) {
      els.container.classList.remove('open');
      els.toggle.setAttribute('aria-expanded', 'false');
      // hidden retire le panneau de l'ordre de tabulation, posé après la
      // transition de fermeture (.25s), sauf réouverture entre-temps
      window.setTimeout(function () {
        if (!els.container.classList.contains('open')) els.widget.hidden = true;
      }, 260);
      els.toggle.focus();
    }

    var sending = false;

    async function send(els) {
      if (sending) return;
      var text = els.input.value.trim();
      if (!text) return;
      sending = true;
      if (els.send) els.send.disabled = true;
      els.input.disabled = true;
      addMsg(text, 'user', els);
      els.input.value = '';
      els.input.style.height = 'auto';
      history.push({ role: 'user', parts: [{ text: text }] });

      var loader = document.createElement('div');
      loader.className = 'chat-message ai loading';
      loader.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><span class="sr-only">L\'assistant rédige une réponse…</span>';
      els.messages.appendChild(loader);
      els.messages.scrollTop = els.messages.scrollHeight;

      try {
        // Le prompt système est géré côté serveur (_worker.js) : rien d'autre que
        // l'historique de conversation ne transite depuis le navigateur.
        var res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: history })
        });
        if (!res.ok) throw new Error('reponse non ok');
        var data = await res.json();
        els.messages.removeChild(loader);
        var reply = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
        var replyText = reply || 'Désolé, pas de réponse disponible.';
        addMsg(replyText, 'ai', els);
        if (reply) history.push({ role: 'model', parts: [{ text: reply }] });
      } catch(e) {
        // Repli unique (échec réseau, statut HTTP en erreur ou JSON invalide),
        // sans détail technique dans le fil
        if (loader.parentNode) els.messages.removeChild(loader);
        addMsg("L'assistant est momentanément indisponible. Réessayez dans un instant.", 'ai', els);
      } finally {
        sending = false;
        if (els.send) els.send.disabled = false;
        els.input.disabled = false;
        // La désactivation du textarea a rendu le focus au document
        els.input.focus();
      }
    }

    function init() {
      var els = getElements();
      if (!els.container || !els.toggle) return;

      els.toggle.addEventListener('click', function() {
        if (els.container.classList.contains('open')) {
          closeChat(els);
        } else {
          openChat(els);
        }
      });

      if (els.closeBtn) {
        els.closeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          closeChat(els);
        });
      }

      if (els.send) {
        els.send.addEventListener('click', function() { send(els); });
      }

      if (els.input) {
        els.input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(els); }
        });
        els.input.addEventListener('input', function() {
          els.input.style.height = 'auto';
          els.input.style.height = els.input.scrollHeight + 'px';
        });
      }

      if (els.nudgeX) {
        els.nudgeX.addEventListener('click', function(e) {
          e.stopPropagation();
          if (els.nudge) els.nudge.classList.remove('visible');
        });
      }

      if (els.nudge) {
        els.nudge.addEventListener('click', function(e) {
          if (e.target === els.nudgeX) return;
          openChat(els);
        });
      }

      // Escape ferme le panneau (closeChat rend le focus au déclencheur)
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && els.container.classList.contains('open')) {
          closeChat(els);
        }
      });

      // Piège de focus : Tab boucle sur les éléments focusables du panneau
      els.widget.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        var focusables = els.widget.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else if (document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      });

      // Scroll nudge trigger
      var nudgeDone = false;
      window.addEventListener('scroll', function() {
        if (nudgeDone || !els.nudge) return;
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 200) {
          nudgeDone = true;
          els.nudge.classList.add('visible');
        }
      });
    }

    // ── CONTACT FORM ──
    function initForm() {
      var form = document.getElementById('contact-form');
      if (!form) return;
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var btn = document.getElementById('submit-btn');
        var ok = document.getElementById('form-success');
        var err = document.getElementById('form-error');
        btn.textContent = 'Envoi...';
        btn.disabled = true;
        var envoye = false;
        try {
          var r = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
          });
          if (r.ok) {
            ok.style.display = 'block';
            err.style.display = 'none';
            form.reset();
            btn.textContent = 'Envoyé ✓';
            envoye = true;
          } else { throw new Error(); }
        } catch(_) {
          var nom  = (form.querySelector('[name="nom"]') || {}).value || '';
          var mail = (form.querySelector('[name="_replyto"]') || {}).value || '';
          var type = (form.querySelector('[name="type"]') || {}).value || '';
          var msg  = (form.querySelector('[name="message"]') || {}).value || '';
          var sub  = encodeURIComponent('Contact depuis ia.rochane.fr');
          var bod  = encodeURIComponent('Nom: '+nom+'\nEmail: '+mail+'\nType: '+type+'\n\n'+msg);
          window.location.href = 'mailto:contact@rochane.fr?subject='+sub+'&body='+bod;
          err.style.display = 'block';
          btn.textContent = 'Envoyer →';
          btn.disabled = false;
        }
        // Navigation vers la page de confirmation, uniquement sur succes reel de la
        // requete. Hors du try : une navigation qui echouerait ne doit pas retomber
        // dans le catch et declencher le repli mailto. Le message de confirmation
        // reste affiche en place, il sert de repli si la navigation n'aboutit pas.
        if (envoye) window.location.assign('/merci');
      });
    }

  // ── FILTRES DE LA BIBLIOTHÈQUE RESSOURCES ──
  function initFilters() {
    var bar = document.querySelector('.filter-bar');
    if (!bar) return;
    var sections = document.querySelectorAll('[data-res-section]');
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      var f = btn.dataset.filter;
      bar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      sections.forEach(function (s) {
        s.style.display = (f === 'all' || s.dataset.resSection === f) ? '' : 'none';
      });
    });
  }


    // ── MESURE D'AUDIENCE, EVENEMENTS PLAUSIBLE ──
    // Cablage par delegation sur document : le contenu de ressources.html evolue,
    // aucun ecouteur n'est attache a une liste figee de liens.
    function envoyer(nom, props) {
      if (typeof window.plausible !== 'function') return;
      if (props) window.plausible(nom, { props: props });
      else window.plausible(nom);
    }

    function initAnalytics() {
      // Conversion du formulaire : declenchee a l'arrivee sur merci.html, pas au clic
      // sur le bouton. Seule une page de confirmation reellement atteinte prouve que
      // Formspree a accepte l'envoi.
      if (location.pathname === '/merci' || location.pathname === '/merci.html') {
        envoyer('conversion-formulaire-contact');
      }

      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;

        var href = a.getAttribute('href') || '';
        var nom = null, props = null;

        if (href.indexOf('cal.com/rochane') !== -1) {
          nom = 'clic-cal-com';
        } else if (href.indexOf('chroniquesociale.com') !== -1) {
          nom = 'clic-bon-de-commande-livre';
        } else if (href.indexOf('livre.rochane.fr') !== -1) {
          nom = 'telechargement-extrait-livre';
        } else if (href.indexOf('chat.whatsapp.com') !== -1) {
          nom = 'clic-communaute-whatsapp';
        } else if (a.classList.contains('proj-card') && a.closest('#outils')) {
          // Le nom de l'outil part en propriete, pas en evenement distinct :
          // un seul evenement quel que soit le nombre d'outils listes.
          var t = a.querySelector('.proj-name');
          nom = 'clic-outil-externe';
          props = { outil: (t ? t.textContent : href).trim() };
        }
        if (!nom) return;

        // Tous les liens instrumentes portent target="_blank" : la page courante
        // n'est pas dechargee, la requete a le temps de partir. Le cas d'une
        // navigation dans le meme onglet est traite par securite, le contenu du
        // site pouvant evoluer : l'evenement part d'abord, la navigation suit,
        // avec un delai de garde pour ne jamais bloquer le visiteur.
        var memeOnglet = a.target !== '_blank'
          && !e.defaultPrevented
          && e.button === 0
          && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

        if (!memeOnglet || typeof window.plausible !== 'function') {
          envoyer(nom, props);
          return;
        }

        e.preventDefault();
        var parti = false;
        var suivre = function () {
          if (parti) return;
          parti = true;
          window.location.href = a.href;
        };
        var opts = { callback: suivre };
        if (props) opts.props = props;
        window.plausible(nom, opts);
        setTimeout(suivre, 1000);
      });
    }

  function boot() {
    mountChat();
    initNav();
    initReveal();
    initCounters();
    initFilters();
    init();
    initForm();
    initAnalytics();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
