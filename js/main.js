(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const toggleMenu = (open) => {
    mobileMenu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  hamburger.addEventListener('click', () =>
    toggleMenu(!mobileMenu.classList.contains('open'))
  );
  $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  const revealEls = $$('.reveal');
  revealEls.forEach((el) => {
    const delay = el.dataset.delay || '0';
    el.style.setProperty('--d', `${delay}ms`);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  const GAP_REM = 1;
  const visibleCount = () =>
    window.innerWidth < 640 ? 1
      : window.innerWidth < 900 ? 2
      : window.innerWidth < 1150 ? 3 : 4;

  $$('.carousel-block').forEach((block) => {
    const track = $('.carousel-track', block);
    const items = $$('.carousel-item', track);
    const prev = $('[data-prev]', block);
    const next = $('[data-next]', block);
    const dotsWrap = $('.carousel-dots', block);
    let idx = 0;
    let visible = Math.min(visibleCount(), items.length);

    const renderDots = () => {
      dotsWrap.innerHTML = '';
      const count = Math.max(0, items.length - visible) + 1;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('span');
        d.className = i === idx ? 'dot active' : 'dot idle';
        dotsWrap.appendChild(d);
      }
    };

    const layout = () => {
      const v = Math.min(visibleCount(), items.length);
      if (v !== visible) {
        visible = v;
        idx = Math.min(idx, Math.max(0, items.length - visible));
      }
      const itemW = `calc((100% - ${(visible - 1) * GAP_REM}rem) / ${visible})`;
      items.forEach((it) => { it.style.width = itemW; });
      move();
    };

    const move = () => {
      const max = Math.max(0, items.length - visible);
      idx = Math.max(0, Math.min(idx, max));
      track.style.transform = `translateX(calc(-${idx} * ((100% + ${GAP_REM}rem) / ${visible})))`;
      prev.disabled = idx === 0;
      next.disabled = idx === max;
      renderDots();
    };

    prev.addEventListener('click', () => { idx -= 1; move(); });
    next.addEventListener('click', () => { idx += 1; move(); });

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(layout, 120);
    });

    layout();
  });

  const eventsPages = $$('.events-page');
  const eventsToggle = $('#eventsToggle');
  const eventsDots = $$('.events-dot');
  let eventsPage = 1;

  const showEventsPage = (page) => {
    eventsPage = page;
    eventsPages.forEach((p) => { p.hidden = Number(p.dataset.page) !== page; });
    eventsToggle.textContent = page === 1 ? 'Próxima página' : 'Página anterior';
    eventsDots.forEach((d, i) => {
      const active = (page === 1 ? 0 : 1) === i;
      d.classList.toggle('active', active);
      d.classList.toggle('idle', !active);
    });
  };

  eventsToggle.addEventListener('click', () =>
    showEventsPage(eventsPage === 1 ? 2 : 1)
  );
  eventsDots.forEach((dot, i) =>
    dot.addEventListener('click', () => showEventsPage(i === 0 ? 1 : 2))
  );
  showEventsPage(1);

  const EVENTS = {
    jornada: {
      tag: 'Evento',
      title: 'Jornada Acadêmica de Fisioterapia UFCSPA',
      desc: 'Evento organizado pelo CA FISIO UFCSPA.',
      images: [
        'assets/images/eventos/jornada/jornada-1.jpg',
        'assets/images/eventos/jornada/jornada-2.jpg',
        'assets/images/eventos/jornada/jornada-3.jpg',
      ],
    },
    acolhe: {
      tag: 'Evento',
      title: 'UFCSPA Acolhe',
      desc: 'Evento organizado pela UFCSPA.',
      images: [
        'assets/images/eventos/acolhe/acolhe-1.jpg',
        'assets/images/eventos/acolhe/acolhe-2.jpg',
        'assets/images/eventos/acolhe/acolhe-3.jpg',
      ],
    },
    'volta-ao-jogo': {
      tag: 'Minicurso',
      title: 'De Volta ao Jogo',
      desc: 'Minicurso de organização MOVA.',
      images: [
        'assets/images/eventos/volta-ao-jogo/volta-ao-jogo-1.jpg',
        'assets/images/eventos/volta-ao-jogo/volta-ao-jogo-2.jpg',
        'assets/images/eventos/volta-ao-jogo/volta-ao-jogo-3.jpg',
      ],
    },
    'ponto-de-partida': {
      tag: 'Minicurso',
      title: 'Ponto de Partida',
      desc: 'Minicurso de organização MOVA.',
      images: [
        'assets/images/eventos/ponto-de-partida/ponto-de-partida-1.jpg',
        'assets/images/eventos/ponto-de-partida/ponto-de-partida-2.jpg',
        'assets/images/eventos/ponto-de-partida/ponto-de-partida-3.jpg',
      ],
    },
    'maratona-poa': {
      tag: 'Participação',
      title: 'Maratona Internacional de Porto Alegre',
      desc: 'Participação da MOVA com recovery esportivo.',
      images: [
        'assets/images/eventos/maratona-poa/maratona-poa-1.jpg',
        'assets/images/eventos/maratona-poa/maratona-poa-2.jpg',
        'assets/images/eventos/maratona-poa/maratona-poa-3.jpg',
      ],
    },
    'nb-42k': {
      tag: 'Participação',
      title: 'New Balance 42K',
      desc: 'Participação da MOVA com recovery esportivo.',
      images: [
        'assets/images/eventos/nb-42k/nb-42k-1.jpg',
        'assets/images/eventos/nb-42k/nb-42k-2.jpg',
        'assets/images/eventos/nb-42k/nb-42k-3.jpg',
      ],
    },
    caminhos: {
      tag: 'Palestra',
      title: 'Caminhos a Alta Performance Desportiva',
      desc: 'Palestra organizada pela MOVA.',
      images: [
        'assets/images/eventos/caminhos/caminhos-1.jpg',
        'assets/images/eventos/caminhos/caminhos-2.jpg',
        'assets/images/eventos/caminhos/caminhos-3.jpg',
      ],
    },
    'run-parkinsons': {
      tag: 'Participação',
      title: 'Run for Parkinson\u2019s',
      desc: 'Organização e promoção do SESC Azenha \u2014 participação da MOVA com recovery esportivo.',
      images: [
        'assets/images/eventos/run-parkinsons/run-parkinsons-1.jpg',
        'assets/images/eventos/run-parkinsons/run-parkinsons-2.jpg',
        'assets/images/eventos/run-parkinsons/run-parkinsons-3.jpg',
      ],
    },
  };

  const modal = $('#eventModal');
  const modalPanel = $('.modal-panel', modal);
  const modalTrack = $('#modalTrack');
  const modalDots = $('#modalDots');
  const modalCounter = $('#modalCounter');
  const modalTag = $('#modalTag');
  const modalTitle = $('#modalTitle');
  const modalDesc = $('#modalDesc');
  const modalNavs = $$('.modal-nav', modal);
  let modalIndex = 0;
  let lastFocus = null;

  const goTo = (i) => {
    const total = modalTrack.children.length;
    if (!total) return;
    modalIndex = (i + total) % total;
    modalTrack.style.transform = `translateX(-${modalIndex * 100}%)`;
    $$('.modal-dot', modalDots).forEach((d, k) => d.classList.toggle('active', k === modalIndex));
    modalCounter.textContent = `${modalIndex + 1} / ${total}`;
    modalNavs.forEach((nav) => { nav.disabled = total <= 1; });
  };

  const gallery = (imgs) => {
    modalTrack.innerHTML = imgs
      .map((src, i) => `<img class="modal-slide" src="${src}" alt="" draggable="false" data-i="${i}" />`)
      .join('');
    modalDots.innerHTML = imgs
      .map((_, i) => `<button type="button" class="modal-dot" data-i="${i}" aria-label="Imagem ${i + 1}"></button>`)
      .join('');
    $$('.modal-dot', modalDots).forEach((d) =>
      d.addEventListener('click', () => goTo(Number(d.dataset.i)))
    );
    goTo(0);
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  };

  const openModal = (key) => {
    const ev = EVENTS[key];
    if (!ev) return;
    lastFocus = document.activeElement;
    gallery(ev.images);
    const alt = ev.title;
    $$('.modal-slide', modalTrack).forEach((img) => { img.alt = alt; });
    modalTag.textContent = ev.tag;
    modalTitle.textContent = ev.title;
    modalDesc.textContent = ev.desc;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalPanel.focus();
  };

  $$('.event-card').forEach((card) => {
    card.addEventListener('click', () => openModal(card.dataset.event));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.event);
      }
    });
  });

  modalNavs.forEach((nav) =>
    nav.addEventListener('click', () => goTo(modalIndex + Number(nav.dataset.modalNav)))
  );

  $$('[data-modal-close]').forEach((el) => el.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goTo(modalIndex - 1);
    if (e.key === 'ArrowRight') goTo(modalIndex + 1);
    if (e.key === 'Tab') {
      const focusables = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modalPanel);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  const CURRENT_YEAR = 2026;
  const START_YEAR = 2018;
  const TEAM_PHOTOS = {
    2026: 'assets/images/equipe/2026.jpg',
    2025: 'assets/images/equipe/2025.jpg',
    2024: 'assets/images/equipe/2024.jpg',
    2023: 'assets/images/equipe/2023.jpg',
    2022: 'assets/images/equipe/2022.jpg',
    2021: 'assets/images/equipe/2021.jpg',
    2020: 'assets/images/equipe/2020.jpg',
    2019: 'assets/images/equipe/2019.jpg',
    2018: 'assets/images/equipe/2018.jpg',
  };

  const chipsWrap = $('.year-chips');
  const historyImg = $('#historyImg');
  const historyBadge = $('#historyBadge');
  const historyStatus = $('#historyStatus');
  const historyPhoto = $('#historyPhoto');
  let historyYear = CURRENT_YEAR;

  const years = Array.from(
    { length: CURRENT_YEAR - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  );

  years.forEach((y) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'year-chip idle';
    chip.textContent = String(y);
    chip.setAttribute('role', 'tab');
    chip.setAttribute('aria-selected', 'false');
    chip.addEventListener('click', () => selectYear(y));
    chipsWrap.appendChild(chip);
if (y === CURRENT_YEAR) chip.classList.add('active');
  });

  function selectYear(y) {
    if (y === historyYear) return;
    historyYear = y;
    historyPhoto.style.opacity = '0';
    historyPhoto.style.opacity = '0';
    $$('.year-chip', chipsWrap).forEach((c) => {
      const active = Number(c.textContent) === y;
      c.classList.toggle('active', active);
      c.classList.toggle('idle', !active);
      c.setAttribute('aria-selected', String(active));
    });
    setTimeout(() => {
      historyImg.src = TEAM_PHOTOS[y] || TEAM_PHOTOS[CURRENT_YEAR];
      historyImg.alt = `Equipe MOVA ${y}`;
      historyBadge.textContent = `MOVA ${y}`;
      historyStatus.textContent = y === CURRENT_YEAR ? 'Equipe atual' : `Gestão ${y}`;
      historyPhoto.style.opacity = '1';
    }, 280);
  }
  selectYear(CURRENT_YEAR);

  const contactForm = $('#contactForm');
  const successBox = $('#successBox');
  const resetFormBtn = $('#resetForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.hidden = true;
    successBox.hidden = false;
  });

  resetFormBtn.addEventListener('click', () => {
    contactForm.reset();
    contactForm.hidden = false;
    successBox.hidden = true;
  });
})();