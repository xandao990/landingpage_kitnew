/* ==========================================================================
   KIT ALWAYS FIT — LP02
   Scripts: countdown, FAQ accordion e sticky CTA
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. COUNTDOWN TIMER (reinicia por sessão)
     Para alterar o tempo total, mude a constante DURACAO_MINUTOS abaixo.
     ======================================================================== */
  var DURACAO_MINUTOS = 15;
  var CHAVE_STORAGE = 'kit_lp02_countdown_end';

  function iniciarContador() {
    var agora = Date.now();
    var fim = parseInt(sessionStorage.getItem(CHAVE_STORAGE), 10);

    // Se não há contador ativo ou já expirou, cria um novo
    if (!fim || fim <= agora) {
      fim = agora + DURACAO_MINUTOS * 60 * 1000;
      sessionStorage.setItem(CHAVE_STORAGE, fim);
    }

    var elementos = document.querySelectorAll('.countdown-timer');

    function atualizar() {
      var restante = fim - Date.now();

      if (restante <= 0) {
        // Quando chega a zero, reinicia automaticamente para manter pressão
        fim = Date.now() + DURACAO_MINUTOS * 60 * 1000;
        sessionStorage.setItem(CHAVE_STORAGE, fim);
        restante = fim - Date.now();
      }

      var minutos = Math.floor(restante / 60000);
      var segundos = Math.floor((restante % 60000) / 1000);
      var texto = pad(minutos) + ':' + pad(segundos);

      elementos.forEach(function (el) { el.textContent = texto; });
    }

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    atualizar();
    setInterval(atualizar, 1000);
  }

  /* ========================================================================
     2. FAQ ACCORDION
     Abre/fecha cada pergunta ao clicar.
     ======================================================================== */
  function iniciarFAQ() {
    var perguntas = document.querySelectorAll('.faq__question');

    perguntas.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq__item');
        item.classList.toggle('is-open');
      });
    });
  }

  /* ========================================================================
     3. STICKY CTA — esconde quando o usuário está na seção de preços
     (evita sobreposição visual com os cards de oferta)
     ======================================================================== */
  function iniciarStickyCTA() {
    var sticky = document.querySelector('.sticky-cta');
    var oferta = document.getElementById('oferta');

    if (!sticky || !oferta) return;

    function atualizarVisibilidade() {
      var rect = oferta.getBoundingClientRect();
      var visivel = rect.top < window.innerHeight && rect.bottom > 0;
      sticky.style.opacity = visivel ? '0' : '1';
      sticky.style.pointerEvents = visivel ? 'none' : 'auto';
    }

    window.addEventListener('scroll', atualizarVisibilidade, { passive: true });
    atualizarVisibilidade();
  }

  /* ========================================================================
     4. PRESERVAR PARÂMETROS UTM NOS LINKS DE COMPRA
     Mantém os parâmetros de rastreamento (utm_source, utm_campaign etc.)
     em todos os links ao clicar.
     ======================================================================== */
  function preservarUTMs() {
    var permitidos = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
    var params = new URLSearchParams(window.location.search);
    var utms = [];

    params.forEach(function (valor, chave) {
      if (permitidos.indexOf(chave) !== -1) {
        utms.push(encodeURIComponent(chave) + '=' + encodeURIComponent(valor));
      }
    });

    if (utms.length === 0) return;

    var query = utms.join('&');
    var links = document.querySelectorAll('a[href]');

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('javascript:')) return;

      var separador = href.indexOf('?') !== -1 ? '&' : '?';
      link.href = href + separador + query;
    });
  }

  /* ========================================================================
     INICIALIZAÇÃO
     ======================================================================== */
  function init() {
    iniciarContador();
    iniciarFAQ();
    iniciarStickyCTA();
    preservarUTMs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
