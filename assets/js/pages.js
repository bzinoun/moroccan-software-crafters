/* Pages intérieures : socrates, meetup, association, news. Le contenu vient de content/*.json. */
(async function () {
  "use strict";
  const M = window.MSC;
  const { esc, bind, md, fmtDate, img, lightbox, renderLogoWall, companyStats, setMeta } = M;
  const $ = (s) => document.querySelector(s);
  const page = document.body.dataset.page;

  M.initNav();

  const card = (c) => `<article class="card reveal"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p>${c.href ? `<a class="more" href="${esc(c.href)}"${/^https?:/.test(c.href) ? ' target="_blank" rel="noopener"' : ""}>${esc(c.label || "En savoir plus")} →</a>` : ""}</article>`;
  const faq = (items) => items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");
  const facts = (items) => items.map((f) => `<li><b>${esc(f.value)}</b><span>${esc(f.label)}</span></li>`).join("");
  const footer = (site) => { const el = $("#footer-nav"); if (el) el.innerHTML = site.footer.links.map((l) => `<a href="${esc(l.href)}"${/^https?:/.test(l.href) ? ' target="_blank" rel="noopener"' : ""}>${esc(l.label)}</a>`).join(""); };
  const logoImg = (c) => c.logo
    ? `<img src="assets/img/logos/${esc(c.logo)}" alt="${esc(c.display || c.name)}" title="${esc(c.display || c.name)}" loading="lazy">`
    : `<span class="monogram" title="${esc(c.display || c.name)}">${esc((c.display || c.name).slice(0, 2).toUpperCase())}</span>`;

  /* Formulaire simple (une étape) : validation, envoi, succès. */
  function simpleForm(form, site, opts) {
    const alertBox = form.querySelector(".form-alert");
    const submitBtn = form.querySelector('[type="submit"]');
    const fieldOf = (el) => el.closest(".field");
    const setInvalid = (f, v) => { if (f) { f.classList.toggle("invalid", v); f.querySelectorAll("input,select,textarea").forEach((i) => i.setAttribute("aria-invalid", String(v))); } };
    const validPhone = (v) => { const p = v.replace(/[\s.\-()]/g, ""); return /^0[5-7]\d{8}$/.test(p) || /^(\+|00)\d{8,15}$/.test(p); };
    form.addEventListener("input", (ev) => { const f = fieldOf(ev.target); if (f && f.classList.contains("invalid")) setInvalid(f, false); });
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      alertBox.classList.remove("show");
      let bad = null;
      const fail = (el) => { setInvalid(fieldOf(el), true); if (!bad) bad = el; };
      form.querySelectorAll(".field").forEach((f) => setInvalid(f, false));
      form.querySelectorAll("[required]").forEach((el) => {
        if (el.type === "checkbox" ? !el.checked : !el.value.trim()) fail(el);
      });
      if (form.email && form.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim())) fail(form.email);
      if (form.telephone && form.telephone.value && !validPhone(form.telephone.value)) fail(form.telephone);
      if (bad) { bad.focus(); return; }
      if (form.website_hp && form.website_hp.value) { opts.onDone("none"); return; }
      const data = opts.collect(form);
      submitBtn.disabled = true;
      const label = submitBtn.textContent;
      submitBtn.textContent = "Envoi…";
      try {
        const res = await M.sendLead(site, data, { subject: opts.subject(data), type: opts.type });
        if (res.mode === "none") {
          alertBox.innerHTML = `Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur <a href="${esc(site.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a> en attendant.`;
          alertBox.classList.add("show");
        } else {
          opts.onDone(res.mode);
        }
      } catch (err) {
        console.error("[MSC] Envoi impossible :", err);
        alertBox.innerHTML = `L'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez-nous sur <a href="${esc(site.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>.`;
        alertBox.classList.add("show");
      }
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    });
  }

  /* ---------- SoCraTes ---------- */
  async function socrates() {
    const data = await M.load(["site", "socrates", "sponsoring", "events", "companies"]);
    const { site, socrates: s, sponsoring: sp, events, companies } = data;
    setMeta(s.meta);
    bind(data);
    footer(site);
    if (s.hero.photo) $("#hero-bg").style.backgroundImage = `url('${img(s.hero.photo)}')`;
    $("#facts").innerHTML = facts(s.hero.facts);
    $("#pillars").innerHTML = s.about.pillars.map(card).join("");
    $("#laws").innerHTML = s.openspace.laws.map((l, i, arr) => `<li class="${i === arr.length - 1 ? "law-main" : ""}"><h3>${esc(l.title)}</h3><p>${esc(l.text)}</p></li>`).join("");
    $("#formats").innerHTML = s.openspace.formats.items.map(card).join("");
    $("#days").innerHTML = s.schedule.days.map((d) => `<li><span class="day">${esc(d.day)}</span><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p></li>`).join("");
    $("#editions-grid").innerHTML = s.editions.items.map((e) => `
      <article class="edition reveal">
        <div class="cover">${e.photo ? `<img src="${img(e.photo)}" alt="" loading="lazy">` : `<span class="yr">${esc(e.year)}</span>`}<span class="yr-badge">${esc(e.edition)}</span></div>
        <div class="body">
          <h3>${esc(e.year)} · ${esc(e.city)}</h3>
          <span class="where">${esc([e.venue, e.dates].filter(Boolean).join(" · "))}</span>
          <div class="nums"><div><b>${esc(e.participants)}</b><span>crafters</span></div><div><b>${esc(e.partners)}</b><span>partenaires</span></div></div>
          <p>${esc(e.text)}</p>
        </div>
      </article>`).join("");
    $("#family").innerHTML = s.family.items.map((f) => `<li><img src="assets/img/socrates/${esc(f.id)}.png" alt="" loading="lazy"><b>${esc(f.name)}</b><span>${esc(f.country)}</span></li>`).join("");
    $("#values").innerHTML = s.values.items.map(card).join("");

    /* Sponsoring */
    $("#arguments").innerHTML = sp.arguments.map(card).join("");
    const byId = Object.fromEntries(companies.items.map((c) => [c.id, c]));
    $("#trust-logos").innerHTML = sp.trust.ids.map((id) => byId[id]).filter(Boolean).map(logoImg).join("");
    $("#packages").innerHTML = sp.packages.map((p) => `
      <article class="offer${p.highlight ? " highlight" : ""} reveal">
        ${p.badge ? `<span class="flag">${esc(p.badge)}</span>` : ""}
        <h3>${esc(p.name)}</h3>
        <div class="price">${esc(p.price || "Sur devis")}</div>
        ${p.limit ? `<p class="limit">${esc(p.limit)}</p>` : ""}
        <p class="tagline">${esc(p.tagline)}</p>
        <h4>Ce qui est inclus</h4><ul>${p.includes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <a class="btn ${p.highlight ? "btn-primary" : "btn-ghost"}" href="#sponsor-form" data-level="${esc(p.id)}">Choisir ce niveau</a>
      </article>`).join("");
    $("#sponsor-faq").innerHTML = faq(sp.faq);
    const levels = sp.packages.map((p) => ({ v: p.name, l: `${p.name} · ${p.price}` })).concat([{ v: "En nature", l: "En nature" }, { v: "À discuter", l: "À discuter" }]);
    $("#s-niveaux").innerHTML = levels.map((l, i) => `<label class="pill"><input type="radio" name="niveau" value="${esc(l.v)}"${i === levels.length - 1 ? " checked" : ""}><span>${esc(l.l)}</span></label>`).join("");
    $("#packages").addEventListener("click", (ev) => {
      const a = ev.target.closest("[data-level]");
      if (!a) return;
      const p = sp.packages.find((x) => x.id === a.dataset.level);
      const radio = [...document.querySelectorAll('input[name="niveau"]')].find((r) => r.value === p.name);
      if (radio) radio.checked = true;
    });
    renderLogoWall($("#sponsors-wall"), companies.items, events, {
      filter: (c, st) => st.sponsored > 0,
      label: (c, st) => st.years.join(" · ")
    });
    simpleForm($("#sponsor-form"), site, {
      type: "Sponsoring SoCraTes",
      subject: (d) => `Partenariat SoCraTes · ${d.entreprise} · ${d.niveau}`,
      collect: (f) => ({ entreprise: f.entreprise.value.trim(), nom: f.nom.value.trim(), fonction: f.fonction.value.trim(), email: f.email.value.trim(), telephone: f.telephone.value.replace(/[\s.\-()]/g, ""), niveau: f.niveau.value, message: f.message.value.trim() }),
      onDone: (mode) => {
        $("#sponsor-form").hidden = true;
        const ok = $("#s-success");
        if (mode === "mailto") $("#s-success-text").textContent = "Votre messagerie s'est ouverte avec la demande pré-remplie : il ne reste qu'à l'envoyer.";
        ok.hidden = false; ok.focus();
      }
    });
  }

  /* ---------- Le meetup ---------- */
  async function meetup() {
    const data = await M.load(["site", "meetup", "events"]);
    const { site, meetup: m, events } = data;
    setMeta(m.meta);
    bind(data);
    footer(site);
    $("#hero-photo").src = img(m.hero.photo);
    $("#facts").innerHTML = facts(m.hero.facts);
    $("#who").innerHTML = m.who.items.map(card).join("");
    $("#steps").innerHTML = m.steps.items.map((s) => `
      <div class="step-row" id="${esc(s.id)}">
        <div class="step-media"><img src="${img(s.photo)}" alt="" loading="lazy"><span class="time-tag">${esc(s.time)}</span></div>
        <div class="step-body">
          <div class="kicker">${esc(s.kicker)}</div>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
          ${s.tips && s.tips.length ? `<ul class="tips">${s.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        </div>
      </div>`).join("");
    $("#zoom-photo").src = img(m.marketplace.photo);
    $("#zoom-steps").innerHTML = m.marketplace.steps.map((s) => `<li><div><strong>${esc(s.title)}</strong><span>${esc(s.text)}</span></div></li>`).join("");
    $("#propose-items").innerHTML = m.propose.items.map(card).join("");
    $("#rules").innerHTML = m.rules.items.map(card).join("");
    const colors = ["", "pink", "green", "blue", "orange"];
    const seen = new Set();
    const topics = [];
    events.forEach((e) => (e.topics || []).forEach((t) => { const k = t.toLowerCase(); if (!seen.has(k)) { seen.add(k); topics.push({ t, y: e.date.slice(0, 4), h: e.host || e.city }); } }));
    $("#topic-board").innerHTML = topics.map((x, i) => `<div class="postit ${colors[i % colors.length]}">${esc(x.t)}<small>${esc(x.y)} · ${esc(x.h)}</small></div>`).join("");
    $("#faq-list").innerHTML = faq(m.faq.items);
  }

  /* ---------- L'association ---------- */
  async function association() {
    const data = await M.load(["site", "association", "events", "companies"]);
    const { site, association: a, events, companies } = data;
    setMeta(a.meta);
    bind(data);
    footer(site);
    $("#hero-photo").src = img(a.hero.photo);
    const st = M.stats(site, events);
    $("#facts").innerHTML = facts([
      { value: st.events, label: `événements depuis ${st.since}` },
      { value: st.hosts, label: "entreprises hôtes" },
      { value: st.socrates, label: "éditions de SoCraTes Maroc" },
      { value: st.followers, label: "abonnés LinkedIn" }
    ]);
    $("#mission").innerHTML = a.mission.items.map(card).join("");
    $("#principles").innerHTML = a.principles.items.map(card).join("");
    $("#history").innerHTML = a.timeline.items.map((t) => `<li><span class="yr">${esc(t.year)}</span><div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></li>`).join("");
    $("#contribute").innerHTML = a.contribute.items.map(card).join("");
    renderLogoWall($("#logo-wall"), companies.items, events);
    const li = $("#contact-linkedin"); if (li) li.href = site.links.linkedin;
  }

  /* ---------- Actualités ---------- */
  async function news() {
    const data = await M.load(["site", "articles", "events"]);
    const { site, articles, events } = data;
    bind(data);
    footer(site);
    const slug = new URLSearchParams(location.search).get("a");
    const list = articles.items.slice().sort((x, y) => y.date.localeCompare(x.date));
    const article = slug && list.find((x) => x.slug === slug);
    const listEl = $("#article-list");
    const detailEl = $("#article");
    if (article) {
      const ev = article.event && events.find((e) => e.id === article.event);
      setMeta({ title: `${article.title} · ${site.name}`, description: article.excerpt });
      $("#news-head").hidden = true;
      listEl.hidden = true;
      detailEl.hidden = false;
      detailEl.innerHTML = `
        <a class="back" href="actualites.html">← Toutes les actualités</a>
        <p class="meta"><b>${esc(article.kind)}</b>${fmtDate(article.date, { long: true })}</p>
        <h1>${esc(article.title)}</h1>
        <p class="lead">${esc(article.excerpt)}</p>
        ${article.cover ? `<div class="cover"><img src="${img(article.cover)}" alt=""></div>` : ""}
        <div class="prose">${md(article.body)}</div>
        ${(article.tags || []).length ? `<ul class="tags">${article.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        ${ev && ev.links ? `<div class="links">${ev.links.linkedin ? `<a href="${esc(ev.links.linkedin)}" target="_blank" rel="noopener">Le post LinkedIn</a>` : ""}${ev.links.luma ? `<a href="${esc(ev.links.luma)}" target="_blank" rel="noopener">La page Luma</a>` : ""}${ev.photos && ev.photos.length ? `<a href="#" id="open-photos">Les ${ev.photos.length} photos</a>` : ""}</div>` : ""}`;
      const op = $("#open-photos");
      if (op) op.addEventListener("click", (e) => { e.preventDefault(); lightbox.open(M.photoItems(ev), 0); });
      document.title = `${article.title} · ${site.name}`;
    } else {
      setMeta(articles.meta);
      listEl.innerHTML = list.map((a, i) => `
        <a class="article-card${i === 0 ? " lead-card" : ""} reveal" href="actualites.html?a=${encodeURIComponent(a.slug)}">
          <div class="cover">${a.cover ? `<img src="${img(a.cover)}" alt="" loading="lazy">` : ""}</div>
          <div class="body">
            <p class="meta"><b>${esc(a.kind)}</b>${fmtDate(a.date, { long: true })}</p>
            <h3>${esc(a.title)}</h3>
            <p>${esc(a.excerpt)}</p>
            ${(a.tags || []).length ? `<ul class="tags">${a.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          </div>
        </a>`).join("");
    }
  }

  const handlers = { socrates, meetup, association, news };
  try {
    if (handlers[page]) await handlers[page]();
  } catch (err) {
    console.error("[MSC] Rendu de la page impossible :", err);
  }
  M.initReveal();
})();
