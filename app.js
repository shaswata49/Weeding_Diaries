(() => {
  'use strict';
  const C = window.INVITE;
  const root = document.documentElement;
  const app = document.getElementById('app');
  const dock = document.getElementById('dock');
  const controls = document.getElementById('controls');
  const toastEl = document.getElementById('toast');

  /* ---------- state ---------- */
  const saved = (() => { try { return localStorage.getItem('invite-lang'); } catch { return null; } })();
  let lang = saved === 'bn' || saved === 'en' ? saved : C.defaultLang;
  const state = { leaves: { left: false, right: false }, photo: 0, seen: new Set() };
  const rsvp = { step: 1, name: '', coming: null, guests: 1, veg: 0, nonveg: 0, note: '', sent: false };
  const LAST_STEP = 5;

  /* ---------- helpers ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const raw = o => (o && typeof o === 'object' ? (o[lang] ?? o.en ?? '') : o ?? '');
  const t = o => esc(raw(o));
  const num = n => (lang === 'bn' ? String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]) : String(n));
  const zoom = () => parseFloat(getComputedStyle(root).getPropertyValue('--z')) || 1;
  const $ = (sel, el = app) => el.querySelector(sel);
  const $$ = (sel, el = app) => [...el.querySelectorAll(sel)];

  const toast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };
  const copy = async (text, done) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const a = document.createElement('textarea');
      a.value = text; document.body.append(a); a.select();
      document.execCommand('copy'); a.remove();
    }
    toast(done);
  };

  /* A photo is named without its extension: whichever file exists is used, so a
     real album-1.jpg takes over from the demo album-1.svg just by being there. */
  const EXT = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
  const found = new Map();
  const findPhoto = base => {
    if (!found.has(base)) {
      found.set(base, new Promise(done => {
        let i = 0;
        const probe = new Image();
        probe.onload = () => done(probe.src);
        probe.onerror = () => { if (i < EXT.length) probe.src = `${base}.${EXT[i++]}`; else done(null); };
        probe.onerror();
      }));
    }
    return found.get(base);
  };
  const loadPhoto = img => {
    const base = img.dataset.photo;
    if (!base) return;
    findPhoto(base).then(url => { if (url && img.dataset.photo === base) img.src = url; });
  };
  // Pictures load only as a guest nears them, which saves data on a phone.
  const photoWatch = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { photoWatch.unobserve(e.target); loadPhoto(e.target); }
  }), { rootMargin: '700px 0px' });
  const photoTag = (base, cls, alt = '') => `<img class="${cls}" data-photo="${esc(base)}" alt="${esc(alt)}" decoding="async">`;

  /* ---------- icons ---------- */
  const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const ICON = {
    fish: '<path d="M3 12c4-6 11-6 15 0-4 6-11 6-15 0Z"/><path d="M18 12l3-3v6l-3-3Z"/><circle cx="8" cy="11" r=".8" fill="currentColor"/><path d="M12 9c1 2 1 4 0 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
    crown: '<path d="M12 3 7 19h10L12 3Z"/><path d="M9.4 12h5.2M8.2 15.5h7.6M5 21h14"/><circle cx="12" cy="8.5" r=".8" fill="currentColor"/>',
    leaf: '<path d="M12 3c-4 4-7 7-7 11a7 7 0 0 0 14 0c0-4-3-7-7-11Z"/><path d="M12 8v13M12 13l3-2M12 16l-3-2"/>',
    plane: '<path d="M12 3c1 0 1.5 1 1.5 2v4l7 4v2l-7-2v4l2 1.5V20L12 19l-3.500 1v-1.500l2-1.500v-4l-7 2v-2l7-4V5c0-1 .5-2 1.500-2Z"/>',
    train: '<rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 11h12M9 21l1.500-4M15 21l-1.500-4"/><circle cx="9.500" cy="14" r=".7" fill="currentColor"/><circle cx="14.500" cy="14" r=".7" fill="currentColor"/>',
    car: '<path d="M4 16v-3l2-5c.3-.7.9-1 1.600-1h8.800c.7 0 1.300.3 1.600 1l2 5v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/><path d="M4.500 12h15"/><circle cx="7.500" cy="14.500" r=".7" fill="currentColor"/><circle cx="16.500" cy="14.500" r=".7" fill="currentColor"/><path d="M6 17v2M18 17v2"/>',
    food: '<path d="M3 13h18a9 6 0 0 1-18 0Z"/><path d="M6 20h12M9 10c0-2 2-2 2-4M13 10c0-2 2-2 2-4"/>',
    gift: '<rect x="4" y="10" width="16" height="11" rx="1"/><path d="M3 7h18v3H3zM12 7v14M12 7C9 7 7.500 5.500 8.500 4S12 4 12 7ZM12 7c3 0 4.500-1.500 3.500-3S12 4 12 7Z"/>',
    chat: '<path d="M4 12a8 8 0 1 1 3.500 6.600L4 20l1.300-3.600A8 8 0 0 1 4 12Z"/><path d="M9 11h6M9 14h4"/>',
    phone: '<path d="M6 3h3l1.500 5-2 1.500a12 12 0 0 0 6 6l1.500-2 5 1.500v3a2 2 0 0 1-2 2C11 21 3 13 4 5a2 2 0 0 1 2-2Z"/>',
    story: '<path d="M12 8C10 4 5 5 5 9c0 3 4 5 7 7 3-2 7-4 7-7 0-4-5-5-7-1Z"/><path d="M12 16v5"/>',
    album: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="3.500"/><path d="M12 3.500v5M12 15.500v5M3.500 12h5M15.500 12h5"/>',
    events: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M8 3v4M16 3v4M12 13v5M9.500 15.500h5"/>',
    venue: '<path d="M12 21s7-6.500 7-12a7 7 0 0 0-14 0c0 5.500 7 12 7 12Z"/><circle cx="12" cy="9" r="2.500"/>',
    rsvp: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="m3.500 7.500 8.500 6 8.500-6"/>',
    note: '<path d="M9 18V6l10-2v12"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="16.500" cy="16" r="2.500"/>'
  };

  /* ---------- markup ---------- */
  const head = (n, h) => `
    <div class="head reveal">
      <span class="num">${num(n)}</span>
      <div class="labels"><small>${t(h.eyebrow)}</small><h2>${t(h.title)}</h2></div>
    </div>`;

  const coverHTML = () => {
    const c = C.cover, cp = C.couple;
    const longest = Math.max(raw(cp.first).length, raw(cp.second).length);
    const size = Math.min(17, Math.round((lang === 'bn' ? 100 : 84) / Math.max(longest, 4) * 10) / 10);
    return `
    <header class="cover ${isOpen() ? 'is-open' : ''} ${state.introPlayed ? '' : 'intro'}" id="cover">
      <img class="butterfly" src="art/butterfly.svg" alt="">
      <p class="blessing">${t(c.blessing)}</p>
      <div class="stage" style="--name-size:${size}cqw">
        <img class="alpona" src="art/alpona.svg" alt="">
        <div class="heart"></div>
        <div class="names">
          <small>${t(c.title)}</small>
          <strong>${t(cp.first)}</strong>
          <i>${t(cp.joiner)}</i>
          <strong>${t(cp.second)}</strong>
        </div>
        ${['left', 'right'].map(s => `
          <button class="leaf ${s} ${state.leaves[s] ? 'moved' : ''}" data-leaf="${s}" aria-label="${t(c.hint)}">
            <img src="art/paan.svg" alt="" draggable="false">
          </button>`).join('')}
      </div>
      <div class="cover-text">
        <div class="before">
          <h1>${t(c.welcome)}</h1>
          <span class="hint">${t(c.hint)}</span>
        </div>
        <div class="after">
          <p class="invite-line">${t(c.invite)}</p>
          <div class="when"><span>${t(c.weekday)}</span><b>${num(c.day)}</b><span>${t(c.monthYear)}</span></div>
          ${raw(c.lunarDate) ? `<p class="lunar">${t(c.lunarDate)}</p>` : ''}
          <p class="place">${t(c.place)}</p>
          <a class="down" href="#letter">${t(c.scroll)}</a>
        </div>
      </div>
      <canvas class="sparkle"></canvas>
    </header>`;
  };

  const letterHTML = () => {
    const l = C.letter;
    return `
    <section class="letter" id="letter">
      <div class="kalash reveal draw">${window.LINEART.kalash}</div>
      <div class="reveal">
        <h2>${t(l.greeting)}</h2>
        <p class="body">${t(l.body)}</p>
        <p class="sign">${t(l.signOff)}</p>
        <div class="families">
          <div><p>${t(l.familyOne.names)}</p><small>${t(l.familyOne.role)}</small></div>
          <div><p>${t(l.familyTwo.names)}</p><small>${t(l.familyTwo.role)}</small></div>
        </div>
        <p class="note">${t(l.note)}</p>
      </div>
    </section>`;
  };

  const storyHTML = () => `
    <section id="story">
      ${head(1, C.storyHead)}
      <div class="timeline" id="timeline">
        <svg class="route" id="route" aria-hidden="true"></svg>
        ${C.story.map((m, i) => `
          <article class="moment ${i % 2 ? 'r' : 'l'} reveal">
            <div class="year">${num(m.year)}</div>
            <h3>${t(m.title)}</h3>
            <p>${t(m.text)}</p>
            ${m.photo ? photoTag(m.photo, 'round', raw(m.title)) : ''}
          </article>`).join('')}
      </div>
    </section>`;

  const albumHTML = () => `
    <section id="album">
      ${head(2, C.albumHead)}
      <div class="album-stage reveal" id="albumStage">
        <img class="frame" src="art/album-frame.svg" alt="">
        ${photoTag(C.album[state.photo].photo, 'album-photo', raw(C.album[state.photo].caption))}
        <button class="arrow prev" data-move="-1" aria-label="Previous photo">‹</button>
        <button class="arrow next" data-move="1" aria-label="Next photo">›</button>
      </div>
      <p class="caption" id="caption">${t(C.album[state.photo].caption)}</p>
      <p class="count" id="photoCount">${num(state.photo + 1)} / ${num(C.album.length)}</p>
      <div class="thumbs">
        ${C.album.map((p, i) => `
          <button data-photo-index="${i}" class="${i === state.photo ? 'on' : ''}" aria-label="${t(p.caption)}">
            ${photoTag(p.photo, '')}
          </button>`).join('')}
      </div>
    </section>`;

  const countdownHTML = () => {
    const k = C.countdown;
    const ring = (cls, r) => `<circle class="track" cx="100" cy="100" r="${r}"/><circle class="${cls}" data-ring="${cls}" cx="100" cy="100" r="${r}" pathLength="1" stroke-dasharray="0 1"/>`;
    return `
    <div class="count-wrap reveal">
      <div class="dial">
        <svg viewBox="0 0 200 200" aria-hidden="true">${ring('a', 97)}${ring('b', 93.500)}${ring('c', 90)}</svg>
        <small id="cdBefore">${t(k.before)}</small>
        <div class="big" id="cdDays">–</div>
        <small id="cdDaysLabel">${t(k.days)}</small>
        <div class="units" id="cdUnits">
          <div><b id="cdH">–</b><small>${t(k.hours)}</small></div>
          <div><b id="cdM">–</b><small>${t(k.mins)}</small></div>
          <div><b id="cdS">–</b><small>${t(k.secs)}</small></div>
        </div>
      </div>
      <p class="count-date">${t(k.date)}</p>
    </div>`;
  };

  const eventsHTML = () => {
    const days = [];
    C.events.forEach((e, i) => {
      const key = e.start.slice(0, 10);
      const last = days[days.length - 1];
      if (last && last.key === key) last.items.push([e, i]); else days.push({ key, e, items: [[e, i]] });
    });
    return `
    <section id="events">
      ${head(3, C.eventsHead)}
      <div class="events">
        ${days.map(d => `
          <div class="day reveal">
            <div class="date"><small>${t(d.e.weekday)}</small><b>${num(d.e.day)}</b><small>${t(d.e.month)}</small></div>
            <div>
              ${d.items.map(([e, i]) => `
                <div class="event">
                  <span class="ico">${svg(ICON[e.icon] || ICON.leaf)}</span>
                  <div>
                    <h3>${t(e.title)}</h3>
                    ${raw(e.time) ? `<p class="t">${t(e.time)}</p>` : ''}
                    ${e.infoOnly ? '' : `<p class="p">${t(C.venues[e.venue].name)}</p>`}
                    ${raw(e.dress) ? `<p class="d"><em>${t(C.dressLabel)}</em>${t(e.dress)}</p>` : ''}
                    ${e.infoOnly ? '' : `<button class="calendar" data-cal="${i}">${t(C.calendarBtn)}</button>`}
                  </div>
                </div>`).join('')}
            </div>
          </div>`).join('')}
      </div>
    </section>`;
  };

  const venueHTML = () => {
    const b = C.venueButtons;
    return `
    <section id="venue">
      ${head(4, C.venueHead)}
      <div class="arch reveal draw">${window.LINEART.venue}</div>
      ${C.venues.map((v, i) => `
        <div class="venue-block reveal">
          <p class="venue-label">${t(v.label)}</p>
          <h3 class="venue-name">${t(v.name)}</h3>
          ${raw(v.address) ? `<p class="venue-addr">${t(v.address)}</p>` : ''}
          <p class="venue-when">${t(v.when)}</p>
          <div class="btns">
            <a class="btn solid" href="${esc(v.map)}" target="_blank" rel="noopener">${t(b.map)}</a>
            <button class="btn line" data-copy-address="${i}">${t(b.copy)}</button>
          </div>
        </div>`).join('')}
      ${C.routes.map(r => `
        <div class="route-card reveal">
          <span class="ico">${svg(ICON[r.icon] || ICON.car)}</span>
          <div><b>${t(r.from)}</b><small>${t(r.how)}</small></div>
          <span>${t(r.time)}</span>
        </div>`).join('')}
      ${raw(C.venueNote) ? `<p class="venue-note">${t(C.venueNote)}</p>` : ''}
    </section>`;
  };

  const infoHTML = () => `
    <section id="info">
      <p class="contacts-intro">${t(C.contactsIntro)}</p>
      <div>
        ${C.contacts.map(c => `
          <div class="contact">
            <div><b>${t(c.name)}</b><small>${t(c.side)}</small></div>
            <a href="https://wa.me/${esc(c.phone)}" target="_blank" rel="noopener" aria-label="WhatsApp">${svg(ICON.chat)}</a>
            <a href="tel:+${esc(c.phone)}" aria-label="Call">${svg(ICON.phone)}</a>
          </div>`).join('')}
      </div>
    </section>`;

  const rsvpHTML = () => `
    <section id="rsvp">
      ${head(5, C.rsvp)}
      <div class="rsvp-card reveal" id="rsvpCard"></div>
    </section>`;

  const closingHTML = () => {
    const cp = C.couple, f = C.footer;
    return `
    <footer class="closing">
      <div class="stage reveal">
        <img class="alpona" src="art/alpona.svg" alt="">
        <div class="mono">
          <div><b>${t(cp.monogram.first)}</b><i>${t(cp.joiner)}</i><b>${t(cp.monogram.second)}</b></div>
          <span>${num(f.date)}</span>
        </div>
      </div>
      <p class="thanks-line">${t(f.thanks)}</p>
      <h2>${t(cp.first)} ${t(cp.joiner)} ${t(cp.second)}</h2>
      <p class="tag">${t(cp.hashtag)}</p>
      <button class="share" data-share>${t(f.share)}</button>
      <p class="made">${t(f.made)}</p>
      <canvas class="sparkle"></canvas>
    </footer>`;
  };

  const controlsHTML = () => `
    <div class="lang" role="group" aria-label="Language">
      <button class="${lang === 'bn' ? 'on' : ''}" data-lang="bn">বাং</button>
      <button class="${lang === 'en' ? 'on' : ''}" data-lang="en">EN</button>
    </div>
    <button class="music ${music.playing ? 'on' : ''}" data-music aria-label="Music" aria-pressed="${music.playing}">${svg(ICON.note)}</button>`;

  const dockItems = ['story', 'album', 'events', 'venue', 'rsvp'];
  const dockHTML = () => dockItems.map(k => `<a href="#${k}" data-dock="${k}">${svg(ICON[k])}${t(C.nav[k])}</a>`).join('');

  /* ---------- RSVP ---------- */
  const renderRsvp = (motion = '') => {
    const r = C.rsvp, card = document.getElementById('rsvpCard');
    if (!card) return;
    if (rsvp.sent) { card.innerHTML = `<p class="thanks">${t(r.thanks)}</p>`; return; }
    const nextDisabled = (rsvp.step === 1 && !rsvp.name.trim()) || (rsvp.step === 2 && rsvp.coming === null)
      || (rsvp.step === 4 && rsvp.veg + rsvp.nonveg !== rsvp.guests);
    let body = '';
    if (rsvp.step === 1) body = `<label for="rName">${t(r.q1)}</label><input id="rName" autocomplete="name" value="${esc(rsvp.name)}">`;
    if (rsvp.step === 2) body = `<p class="q">${t(r.q2)}</p><div class="choices">
        <button class="${rsvp.coming === true ? 'on' : ''}" data-coming="1">${t(r.yes)}</button>
        <button class="${rsvp.coming === false ? 'on' : ''}" data-coming="0">${t(r.no)}</button></div>`;
    if (rsvp.step === 3) body = `<p class="q">${t(r.q3)}</p><div class="stepper">
        <button data-guests="-1" aria-label="Fewer">−</button><b>${num(rsvp.guests)}</b><button data-guests="1" aria-label="More">+</button></div>`;
    if (rsvp.step === 4) {
      const left = rsvp.guests - rsvp.veg - rsvp.nonveg;
      body = rsvp.guests === 1
        ? `<p class="q">${t(r.q4)}</p><div class="choices food">
            <button class="${rsvp.veg ? 'on' : ''}" data-food-one="veg"><i class="mark veg"></i>${t(r.veg)}</button>
            <button class="${rsvp.nonveg ? 'on' : ''}" data-food-one="nonveg"><i class="mark nonveg"></i>${t(r.nonveg)}</button></div>`
        : `<p class="q">${t(r.q4)}</p><div class="food-rows">
            ${[['veg', r.veg], ['nonveg', r.nonveg]].map(([k, label]) => `
              <div class="food-row"><span><i class="mark ${k}"></i>${t(label)}</span>
                <div class="stepper small">
                  <button data-food="${k}" data-by="-1" aria-label="Fewer" ${rsvp[k] === 0 ? 'disabled' : ''}>−</button>
                  <b>${num(rsvp[k])}</b>
                  <button data-food="${k}" data-by="1" aria-label="More" ${left === 0 ? 'disabled' : ''}>+</button>
                </div></div>`).join('')}
            <p class="food-left">${left > 0 ? esc(raw(r.foodLeft).replace('{n}', num(left))) : '✓'}</p></div>`;
    }
    if (rsvp.step === 5) body = `<label for="rNote">${t(r.q5)}</label><textarea id="rNote" rows="2">${esc(rsvp.note)}</textarea>`;
    card.innerHTML = `
      <div class="${motion}">
        <p class="step">${t(r.stepWord)} ${num(rsvp.step)} / ${num(LAST_STEP)}</p>
        ${body}
      </div>
      <div class="rsvp-actions">
        ${rsvp.step > 1 ? `<button class="back" data-rsvp-back>‹ ${t(r.back)}</button>` : ''}
        <button class="btn solid" data-rsvp-next ${nextDisabled ? 'disabled' : ''}>${rsvp.step === LAST_STEP ? t(r.send) : t(r.next)}</button>
      </div>`;
  };
  const sendRsvp = () => {
    const r = C.rsvp;
    const lines = [
      raw(C.pageTitle),
      `${raw(r.msgName)}: ${rsvp.name.trim()}`,
      rsvp.coming ? `${raw(r.msgComing)} · ${raw(r.msgGuests)}: ${rsvp.guests}` : raw(r.msgNotComing)
    ];
    if (rsvp.coming) lines.push(`${raw(r.msgFood)}: ${raw(r.veg)} ${rsvp.veg}, ${raw(r.nonveg)} ${rsvp.nonveg}`);
    if (rsvp.note.trim()) lines.push(`${raw(r.msgNote)}: ${rsvp.note.trim()}`);
    window.open(`https://wa.me/${r.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    rsvp.sent = true;
    renderRsvp();
  };

  /* ---------- calendar ---------- */
  const addToCalendar = e => {
    const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const start = new Date(e.start);
    const end = new Date(start.getTime() + (e.hours || 3) * 3600e3);
    const clean = s => String(s).replace(/([,;\\])/g, '\\$1');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'BEGIN:VEVENT',
      `UID:${stamp(start)}-${Math.random().toString(36).slice(2)}@wedding-invite`,
      `DTSTAMP:${stamp(new Date())}`,
      ...(e.start.includes('T')
        ? [`DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`]
        : [`DTSTART;VALUE=DATE:${e.start.replace(/-/g, '')}`,
           `DTEND;VALUE=DATE:${new Date(start.getTime() + 864e5).toISOString().slice(0, 10).replace(/-/g, '')}`]),
      `SUMMARY:${clean(raw(e.title))} · ${clean(raw(C.couple.first))} ${clean(raw(C.couple.joiner))} ${clean(raw(C.couple.second))}`,
      `LOCATION:${clean(`${raw(C.venues[e.venue].name)}, ${raw(C.venues[e.venue].address)}`)}`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${e.start.slice(0, 10)}-${e.icon}.ics` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* ---------- countdown ---------- */
  const tick = () => {
    const days = document.getElementById('cdDays');
    if (!days) return;
    const ms = new Date(C.weddingMoment).getTime() - Date.now();
    if (ms <= 0) {
      days.textContent = '❀';
      document.getElementById('cdBefore').textContent = raw(C.countdown.today);
      document.getElementById('cdDaysLabel').textContent = '';
      document.getElementById('cdUnits').style.display = 'none';
      return;
    }
    const s = Math.floor(ms / 1000);
    const parts = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    if (!state.dialReady) return;
    days.textContent = num(parts.d);
    document.getElementById('cdH').textContent = num(parts.h);
    document.getElementById('cdM').textContent = num(parts.m);
    const sec = document.getElementById('cdS');
    if (sec.textContent !== num(parts.s) && !calm) {
      sec.animate([{ transform: 'translateY(-5px)', opacity: .25 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'ease-out' });
    }
    sec.textContent = num(parts.s);
    const set = (k, f) => { const c = $(`[data-ring="${k}"]`); if (c) c.setAttribute('stroke-dasharray', `${f} 1`); };
    set('a', parts.h / 24); set('b', parts.m / 60); set('c', parts.s / 60);
  };

  const startDial = () => {
    if (state.dialReady) return;
    const target = Math.max(0, Math.floor((new Date(C.weddingMoment).getTime() - Date.now()) / 864e5));
    const days = document.getElementById('cdDays');
    if (calm || target === 0) { state.dialReady = true; tick(); return; }
    const begun = performance.now(), length = 1500;
    const step = now => {
      const f = Math.min(1, (now - begun) / length);
      const eased = 1 - Math.pow(1 - f, 3);
      if (document.getElementById('cdDays') === days) days.textContent = num(Math.round(target * eased));
      if (f < 1) requestAnimationFrame(step);
      else { state.dialReady = true; tick(); }
    };
    requestAnimationFrame(step);
    // Never leave the dial blank if the tab is in the background and frames stop.
    setTimeout(() => { if (!state.dialReady) { state.dialReady = true; tick(); } }, length + 400);
  };

  /* ---------- gold dust ---------- */
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dust = [];
  const startDust = canvas => {
    if (calm) return null;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, on = false, specks = [], burst = [];
    const size = () => {
      const r = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * r; canvas.height = H * r;
      ctx.setTransform(r, 0, 0, r, 0, 0);
      specks = Array.from({ length: Math.min(44, Math.round(W * H / 11000) + 10) }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: .5 + Math.random() * 1.1,
        vy: .08 + Math.random() * .22, vx: (Math.random() - .5) * .12, p: Math.random() * 6.28
      }));
    };
    const frame = t => {
      if (!on || !canvas.isConnected) { on = false; return; }
      ctx.clearRect(0, 0, W, H);
      for (const s of specks) {
        s.y -= s.vy; s.x += s.vx;
        if (s.y < -4) { s.y = H + 4; s.x = Math.random() * W; }
        ctx.globalAlpha = .25 + .6 * Math.abs(Math.sin(t / 1100 + s.p));
        ctx.fillStyle = '#e7c58d';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.29); ctx.fill();
      }
      burst = burst.filter(b => b.life > 0);
      for (const b of burst) {
        b.x += b.vx; b.y += b.vy; b.vx *= .975; b.vy = b.vy * .975 + .018; b.life -= .011;
        ctx.globalAlpha = Math.max(0, Math.min(1, b.life * 1.6));
        ctx.fillStyle = b.c;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.29); ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    };
    size();
    new IntersectionObserver(([e]) => {
      const was = on; on = e.isIntersecting;
      if (on && !was) requestAnimationFrame(frame);
    }).observe(canvas);
    addEventListener('resize', size);
    return {
      burst(x, y) {
        for (let i = 0; i < 90; i++) {
          const a = Math.random() * 6.29, v = .6 + Math.random() * 3.1;
          burst.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: .7 + Math.random() * 1.8, life: .6 + Math.random() * .6,
                       c: Math.random() < .25 ? '#fff4d8' : '#e7c58d' });
        }
      }
    };
  };

  /* ---------- the winding route of the story ---------- */
  let routeMask = null, routeLen = 0, routeNodes = [];
  function drawRoute() {
    const box = document.getElementById('timeline'), svgEl = document.getElementById('route');
    if (!box || !svgEl) return;
    const W = box.clientWidth, H = box.clientHeight, inset = 8;
    const items = $$('.moment', box);
    const pts = items.map((el, i) => {
      const year = $('.year', el);
      return { x: i % 2 ? inset : W - inset, y: el.offsetTop + year.offsetTop + year.offsetHeight / 2, right: !(i % 2) };
    });
    let d = `M${pts[0].x},${pts[0].y - 26} L${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], dir = b.x > a.x ? 1 : -1;
      d += ` L${a.x},${b.y - 74} Q${a.x},${b.y - 52} ${a.x + dir * 24},${b.y - 49}`;
      d += ` L${b.x - dir * 24},${b.y - 24} Q${b.x},${b.y - 21} ${b.x},${b.y}`;
    }
    const last = pts[pts.length - 1];
    d += ` L${last.x},${Math.min(H, last.y + 104)}`;
    const nodes = pts.map(p => {
      const toward = p.right ? -1 : 1;
      return `<g data-y="${p.y}"><path class="link" d="M${p.x},${p.y} h${toward * 52}" stroke="#c9a15d" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
              <circle class="node" cx="${p.x}" cy="${p.y}" r="4" fill="#f4eee1" stroke="#7c111b" stroke-width="1.5"/></g>`;
    }).join('');
    svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svgEl.innerHTML = `
      <defs><mask id="routeMask" maskUnits="userSpaceOnUse" x="-20" y="-40" width="${W + 40}" height="${H + 80}">
        <path id="routeReveal" d="${d}" fill="none" stroke="#fff" stroke-width="8"/></mask></defs>
      <path d="${d}" fill="none" stroke="#7c111b" stroke-width="1.5" stroke-dasharray="7 5" mask="url(#routeMask)"/>
      ${nodes}`;
    routeMask = svgEl.querySelector('#routeReveal');
    routeLen = routeMask.getTotalLength();
    routeNodes = [...svgEl.querySelectorAll('g[data-y]')];
    routeMask.style.strokeDasharray = routeLen;
    updateRoute();
  }
  function updateRoute() {
    if (!routeMask) return;
    const r = document.getElementById('timeline').getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) return;   // nothing to redraw while it is off screen
    const p = Math.min(1, Math.max(0, (innerHeight * .78 - r.top) / r.height));
    routeMask.style.strokeDashoffset = routeLen * (1 - p);
    const reached = (innerHeight * .78 - r.top) / zoom();
    routeNodes.forEach(g => [...g.children].forEach(el => el.classList.toggle('hit', Number(g.dataset.y) < reached)));
  }

  /* ---------- scroll: dock and route ---------- */
  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      updateRoute();
      const cover = document.getElementById('cover');
      dock.classList.toggle('show', isOpen() && scrollY > cover.offsetHeight * .6);
      controls.classList.toggle('away', scrollY > cover.getBoundingClientRect().height * .6);
      let active = null;
      dockItems.forEach(k => {
        const el = document.getElementById(k);
        if (el && el.getBoundingClientRect().top < innerHeight * .45) active = k;
      });
      if (document.getElementById('info').getBoundingClientRect().top < innerHeight * .45
          && document.getElementById('rsvp').getBoundingClientRect().top >= innerHeight * .45) active = 'venue';
      $$('[data-dock]', dock).forEach(a => a.classList.toggle('on', a.dataset.dock === active));
    });
  };

  /* ---------- reveal on scroll ---------- */
  let seenObserver = null;
  const watchReveals = () => {
    seenObserver?.disconnect();
    seenObserver = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('seen');
        seenObserver.unobserve(e.target);
        if (e.target.classList.contains('count-wrap')) setTimeout(startDial, 250);
      }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => seenObserver.observe(el));
  };

  /* ---------- paan leaves ---------- */
  const isOpen = () => state.leaves.left && state.leaves.right;
  const openLeaves = () => {
    if (isOpen()) return;
    state.leaves.left = state.leaves.right = true;
    $$('[data-leaf]').forEach(el => { el.classList.add('moved'); el.setAttribute('tabindex', '-1'); });
    const cover = $('#cover');
    cover.classList.add('is-open');
    root.classList.remove('locked');
    setTimeout(() => {
      const stage = $('.stage', cover).getBoundingClientRect(), box = cover.getBoundingClientRect();
      dust[0]?.burst((stage.left - box.left + stage.width / 2) / zoom(), (stage.top - box.top + stage.height / 2) / zoom());
    }, 550);
    setTimeout(() => { drawRoute(); onScroll(); }, 60);
  };
  const bindLeaves = () => {
    // A tap anywhere on the alpona counts too, even while the leaves are still unfolding.
    $('#cover .stage').addEventListener('click', openLeaves);
    $$('[data-leaf]').forEach(el => {
      let startX = 0, startY = 0, dragging = false;
      el.addEventListener('pointerdown', e => {
        if (state.leaves[el.dataset.leaf]) return;
        dragging = true; startX = e.clientX; startY = e.clientY;
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging');
      });
      el.addEventListener('pointermove', e => {
        if (!dragging) return;
        el.style.setProperty('--dx', `${e.clientX - startX}px`);
        el.style.setProperty('--dy', `${e.clientY - startY}px`);
      });
      const end = () => {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('dragging');
        el.style.removeProperty('--dx');
        el.style.removeProperty('--dy');
        openLeaves();                    // a tap or a drag both part the leaves
      };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLeaves(); }
      });
    });
  };

  /* ---------- album ---------- */
  const showPhoto = i => {
    const n = C.album.length;
    state.photo = (i + n) % n;
    const p = C.album[state.photo], img = $('.album-photo');
    img.classList.add('fading');
    setTimeout(() => {
      img.dataset.photo = p.photo;
      img.alt = raw(p.caption);
      loadPhoto(img);
      img.classList.remove('fading');
    }, 240);
    $('#caption').textContent = raw(p.caption);
    $('#photoCount').textContent = `${num(state.photo + 1)} / ${num(n)}`;
    $$('[data-photo-index]').forEach((b, k) => b.classList.toggle('on', k === state.photo));
  };
  const bindAlbum = () => {
    const s = $('#albumStage');
    let x = null;
    s.addEventListener('pointerdown', e => { x = e.clientX; state.albumTouched = Date.now(); });
    s.addEventListener('pointerup', e => {
      if (x === null) return;
      const dx = e.clientX - x; x = null;
      if (Math.abs(dx) > 40) showPhoto(state.photo + (dx < 0 ? 1 : -1));
    });
  };

  /* ---------- music ---------- */
  const music = {
    playing: false, audio: null, ctx: null, timer: null,
    // A soft plucked pentatonic tune, used until a song is placed at C.music.
    notes: [392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392, 440],
    synth() {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      this.ctx.resume();
      let i = 0;
      const pluck = () => {
        const now = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'triangle'; o.frequency.value = this.notes[i++ % this.notes.length];
        g.gain.setValueAtTime(.0001, now);
        g.gain.exponentialRampToValueAtTime(.07, now + .03);
        g.gain.exponentialRampToValueAtTime(.0001, now + 1.5);
        o.connect(g).connect(this.ctx.destination);
        o.start(now); o.stop(now + 1.6);
      };
      pluck();
      this.timer = setInterval(pluck, 700);
    },
    toggle() {
      this.playing = !this.playing;
      if (this.playing) {
        if (!this.audio && C.music) { this.audio = new Audio(C.music); this.audio.loop = true; }
        const fall = () => { if (this.playing && !this.timer) this.synth(); };
        if (this.audio) this.audio.play().catch(fall); else fall();
      } else {
        this.audio?.pause();
        clearInterval(this.timer); this.timer = null;
      }
      renderControls();
    }
  };

  /* ---------- clicks ---------- */
  app.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.move) { state.albumTouched = Date.now(); showPhoto(state.photo + Number(b.dataset.move)); }
    else if (b.dataset.photoIndex !== undefined) { state.albumTouched = Date.now(); showPhoto(Number(b.dataset.photoIndex)); }
    else if (b.dataset.cal !== undefined) addToCalendar(C.events[Number(b.dataset.cal)]);
    else if (b.dataset.copyAddress !== undefined) {
      const v = C.venues[Number(b.dataset.copyAddress)];
      copy([raw(v.name), raw(v.address)].filter(Boolean).join(', '), raw(C.venueButtons.copied));
    }
    else if (b.dataset.coming !== undefined) { rsvp.coming = b.dataset.coming === '1'; renderRsvp(); }
    else if (b.dataset.guests) {
      rsvp.guests = Math.min(20, Math.max(1, rsvp.guests + Number(b.dataset.guests)));
      if (rsvp.veg + rsvp.nonveg > rsvp.guests) rsvp.veg = rsvp.nonveg = 0;
      renderRsvp();
    }
    else if (b.dataset.foodOne) {
      rsvp.veg = b.dataset.foodOne === 'veg' ? 1 : 0;
      rsvp.nonveg = 1 - rsvp.veg;
      renderRsvp();
    }
    else if (b.dataset.food) {
      rsvp[b.dataset.food] = Math.max(0, rsvp[b.dataset.food] + Number(b.dataset.by));
      renderRsvp();
    }
    else if (b.hasAttribute('data-rsvp-back')) {
      rsvp.step -= (rsvp.step === LAST_STEP && !rsvp.coming) ? 3 : 1;
      renderRsvp('step-back');
    }
    else if (b.hasAttribute('data-rsvp-next')) {
      if (rsvp.step === LAST_STEP) sendRsvp();
      else { rsvp.step += (rsvp.step === 2 && !rsvp.coming) ? 3 : 1; renderRsvp('step-in'); }
    }
    else if (b.hasAttribute('data-share')) {
      const data = { title: raw(C.pageTitle), url: location.href };
      if (navigator.share) navigator.share(data).catch(() => {});
      else copy(location.href, raw(C.footer.copied));
    }
  });
  app.addEventListener('input', e => {
    if (e.target.id === 'rName') {
      rsvp.name = e.target.value;
      const next = $('[data-rsvp-next]');
      if (next) next.disabled = !rsvp.name.trim();
    }
    if (e.target.id === 'rNote') rsvp.note = e.target.value;
  });
  app.addEventListener('focusin', e => { if (e.target.matches('input, textarea')) dock.classList.add('typing'); });
  app.addEventListener('focusout', e => { if (e.target.matches('input, textarea')) dock.classList.remove('typing'); });
  controls.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.lang && b.dataset.lang !== lang) {
      lang = b.dataset.lang;
      try { localStorage.setItem('invite-lang', lang); } catch { /* private mode */ }
      const y = scrollY;
      render();
      root.style.scrollBehavior = 'auto';
      scrollTo(0, y);
      root.style.scrollBehavior = '';
    }
    if (b.hasAttribute('data-music')) music.toggle();
  });
  function renderControls() { controls.innerHTML = controlsHTML(); }

  /* ---------- put it all together ---------- */
  function render() {
    root.lang = lang;
    document.title = raw(C.pageTitle);
    const alreadySeen = app.childElementCount > 0;
    app.innerHTML = `${coverHTML()}
      <main class="paper">
        ${letterHTML()}${storyHTML()}${albumHTML()}${countdownHTML()}${eventsHTML()}${venueHTML()}${infoHTML()}${rsvpHTML()}
      </main>
      ${closingHTML()}`;
    dock.innerHTML = dockHTML();
    renderControls();
    renderRsvp();
    $$('img[data-photo]').forEach(img => photoWatch.observe(img));
    bindLeaves();
    bindAlbum();
    $$('.draw svg path, .draw svg circle').forEach(el => el.setAttribute('pathLength', '1'));
    dust.length = 0;
    $$('canvas.sparkle').forEach(c => { const d = startDust(c); if (d) dust.push(d); });
    if (alreadySeen) {
      app.classList.add('still');
      $$('.reveal').forEach(el => el.classList.add('seen'));
      requestAnimationFrame(() => requestAnimationFrame(() => app.classList.remove('still')));
    } else watchReveals();
    state.introPlayed = true;
    tick();
    drawRoute();
    onScroll();
  }

  render();
  if (isOpen()) root.classList.remove('locked');
  setInterval(tick, 1000);
  // The album turns its own pages while it is on screen, and waits after a guest touches it.
  if (!calm) setInterval(() => {
    const r = document.getElementById('albumStage').getBoundingClientRect();
    const onScreen = r.top < innerHeight * .8 && r.bottom > innerHeight * .2;
    if (onScreen && Date.now() - (state.albumTouched || 0) > 12000) showPhoto(state.photo + 1);
  }, 4500);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { drawRoute(); onScroll(); });
  document.fonts?.ready.then(drawRoute);
})();
