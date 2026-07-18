/* ═══════════════════════════════════════════════════════════
   Rochane Kherbouche · ia.rochane.fr
   Scripts partagés : navigation, apparitions, compteurs,
   assistant conversationnel, formulaire de contact.
   ═══════════════════════════════════════════════════════════ */
(function () {

  // ── WIDGET CHAT : markup injecté sur toutes les pages ──
  var CHAT_HTML = `
<div id="chat-container" class="chat-container">
  <button id="chat-toggle-btn" class="chat-toggle-btn" aria-label="Ouvrir l'assistant de discussion">
    <svg class="fa-comment-dots" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.1.84 4.03 2.24 5.55-.18 1.4-.77 2.65-1.55 3.6-.16.2-.02.5.23.48 1.93-.18 3.6-.86 4.9-1.66 1.27.46 2.67.73 4.18.73 5.52 0 10-3.94 10-8.8S17.52 2 12 2zM7.5 12.1a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z"/></svg>
    <svg class="fa-times" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
    <span class="chat-badge" id="chat-badge"></span>
  </button>
  <div class="chat-nudge" id="chat-nudge">
    💬 Une question ? Je suis là !
    <span class="chat-nudge-close" id="chat-nudge-close">✕</span>
  </div>
  <div id="chat-widget" class="chat-widget">
    <div class="chat-header">
      <div class="chat-header-top">
        <div class="chat-header-title">Une question ?</div>
        <button class="chat-header-close" id="chat-close-btn">✕</button>
      </div>
      <div class="chat-header-sub">Je réponds sur les interventions, formats et disponibilités de Rochane.</div>
    </div>
    <div id="chat-messages" class="chat-messages"></div>
    <div class="chat-input-area">
      <textarea id="chat-input" rows="1" placeholder="Votre question ici..."></textarea>
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
  // COUNTER
  let done = false;
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const statsEl = document.querySelector('.stats-card');
  if (statsEl) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done) {
        done = true;
        counters.forEach(el => {
          const target = +el.dataset.target;
          const suffix = el.dataset.suffix || '';
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
    var INITIAL_MSG = "Bonjour ! Je suis l'assistant virtuel de Rochane Kherbouche. Posez-moi vos questions sur ses expertises, projets et interventions.";
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

    function addMsg(text, who, els) {
      var d = document.createElement('div');
      d.className = 'chat-message ' + who;
      // Extraire les liens Markdown [label](url) avant tout traitement
      var links = [];
      var processed = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, function(_, label, url) {
        var i = links.length;
        links.push('<a href="' + url + '" target="_blank" rel="noopener" style="color:#1d3db0;font-weight:600;text-decoration:underline;">' + label + ' ↗</a>');
        return '%%LINK' + i + '%%';
      });
      // Transformations texte
      processed = processed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/(\d+\. )/g, '<br>$1')
        .replace(/^<br>/, '');
      // URLs brutes restantes
      processed = processed.replace(/(https?:\/\/[^\s<"%%]+)/g, function(url) {
        var i = links.length;
        links.push('<a href="' + url + '" target="_blank" rel="noopener" style="color:#1d3db0;text-decoration:underline;word-break:break-all;">' + url + '</a>');
        return '%%LINK' + i + '%%';
      });
      // Restaurer tous les liens
      var html = processed.replace(/%%LINK(\d+)%%/g, function(_, i) { return links[+i]; });
      d.innerHTML = html;
      els.messages.appendChild(d);
      els.messages.scrollTop = els.messages.scrollHeight;
      return d;
    }

    function openChat(els) {
      els.container.classList.add('open');
      if (els.badge) els.badge.style.display = 'none';
      if (els.nudge) els.nudge.classList.remove('visible');
      if (els.messages.children.length === 0) addMsg(INITIAL_MSG, 'ai', els);
    }

    function closeChat(els) {
      els.container.classList.remove('open');
    }

    async function send(els) {
      var text = els.input.value.trim();
      if (!text) return;
      addMsg(text, 'user', els);
      els.input.value = '';
      els.input.style.height = 'auto';
      history.push({ role: 'user', parts: [{ text: text }] });

      var loader = document.createElement('div');
      loader.className = 'chat-message ai loading';
      loader.innerHTML = '<span></span><span></span><span></span>';
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
        var data = await res.json();
        els.messages.removeChild(loader);
        var reply = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
        var replyText = reply || 'Désolé, pas de réponse disponible.';
        addMsg(replyText, 'ai', els);
        if (reply) history.push({ role: 'model', parts: [{ text: reply }] });
      } catch(e) {
        els.messages.removeChild(loader);
        addMsg('Erreur de connexion.', 'ai', els);
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
          } else { throw new Error(); }
        } catch(_) {
          var nom  = (form.querySelector('[name="nom"]') || {}).value || '';
          var mail = (form.querySelector('[name="_replyto"]') || {}).value || '';
          var type = (form.querySelector('[name="type"]') || {}).value || '';
          var msg  = (form.querySelector('[name="message"]') || {}).value || '';
          var sub  = encodeURIComponent('Contact depuis ia.rochane.fr');
          var bod  = encodeURIComponent('Nom: '+nom+'\nEmail: '+mail+'\nType: '+type+'\n\n'+msg);
          window.location.href = 'mailto:ia@rochane.fr?subject='+sub+'&body='+bod;
          err.style.display = 'block';
          btn.textContent = 'Envoyer →';
          btn.disabled = false;
        }
      });
    }

  function boot() {
    mountChat();
    initNav();
    initReveal();
    initCounters();
    init();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
