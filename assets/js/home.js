(async function () {
  "use strict";
  const { esc, bind, fmtDate, img, place, photoItems, stats, lightbox, initNav, initReveal, renderLogoWall, companyStats, setMeta, TYPE_LABEL } = window.MSC;
  const $ = (s) => document.querySelector(s);

  initNav();
  let data;
  try {
    data = await window.MSC.load(["site", "home", "events", "companies", "offers", "sponsoring"]);
  } catch (err) {
    console.error("[MSC] Contenu indisponible :", err);
    return;
  }
  const { site, home, events, companies, offers, sponsoring } = data;
  setMeta(home.meta);
  bind(data);

  /* Hero */
  const latest = events.find((e) => e.type === "meetup");
  $("#hero-note").textContent = home.hero.note || (latest
    ? `Dernière édition : ${fmtDate(latest.date, { long: true })} chez ${latest.host}${latest.registrations ? `, ${latest.registrations} inscrits` : ""}.`
    : "");
  $("#collage").innerHTML = home.hero.collage.map((c, i) =>
    `<figure class="polaroid p${i + 1}"><img src="${img(c.photo)}" alt=""><figcaption>${esc(c.caption)}</figcaption></figure>`
  ).join("") + `<div class="postit">${esc(home.hero.postit)}</div>`;

  /* Chiffres */
  const st = stats(site, events);
  $("#stats").innerHTML = home.stats.map((s) => `<li><b>${esc(s.value != null ? s.value : st[s.key])}</b><span>${esc(s.label)}</span></li>`).join("");

  /* Format */
  $("#agenda").innerHTML = home.format.steps.map((s) => `
    <li>
      ${s.photo ? `<div class="shot"><img src="${img(s.photo)}" alt="" loading="lazy"></div>` : ""}
      <div class="body"><span class="time">${esc(s.time)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
    </li>`).join("");

  /* Sujets : les plus récents, un post-it chacun */
  const colors = ["", "pink", "green", "blue", "orange"];
  const seen = new Set();
  const topics = [];
  events.forEach((e) => (e.topics || []).forEach((t) => {
    const k = t.toLowerCase();
    if (!seen.has(k)) { seen.add(k); topics.push({ t, y: e.date.slice(0, 4) }); }
  }));
  $("#topics").innerHTML = topics.slice(0, home.topics.limit || 10).map((x, i) =>
    `<div class="postit ${colors[i % colors.length]}">${esc(x.t)}<small>${esc(x.y)}</small></div>`).join("");

  /* Historique */
  const linksHtml = (e) => {
    const l = e.links || {};
    return [
      l.linkedin && `<a href="${esc(l.linkedin)}" target="_blank" rel="noopener">Récap LinkedIn</a>`,
      l.luma && `<a href="${esc(l.luma)}" target="_blank" rel="noopener">Page Luma</a>`,
      l.site && `<a href="${esc(l.site)}" target="_blank" rel="noopener">Site SoCraTes</a>`
    ].filter(Boolean).join("");
  };
  const tagsHtml = (topics, max) => topics && topics.length ? `<ul class="tags">${topics.slice(0, max).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "";

  const featured = events.filter((e) => e.type === "meetup" && e.photos && e.photos.length).slice(0, 3);
  $("#featured").innerHTML = featured.map((e) => `
    <article class="feature-card reveal">
      <button class="thumb" type="button" data-event="${esc(e.id)}" aria-label="Voir les ${e.photos.length} photos de ${esc(e.title)}">
        <img src="${img(e.photos[0])}" alt="" loading="lazy"><span class="count">${e.photos.length} photos</span>
      </button>
      <div class="body">
        <p class="meta">${fmtDate(e.date)} · ${esc(e.city)}${e.registrations ? ` · ${e.registrations} inscrits` : ""}</p>
        <h3>${esc(e.title)}</h3>
        ${e.summary ? `<p>${esc(e.summary)}</p>` : ""}
        ${tagsHtml(e.topics, 4)}
        <div class="links">${linksHtml(e)}</div>
      </div>
    </article>`).join("");
  $("#featured").addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-event]");
    if (btn) lightbox.open(photoItems(events.find((x) => x.id === btn.dataset.event)), 0);
  });

  function renderTimeline(filter) {
    const list = events.filter((e) => filter === "all" || e.type === filter);
    const byYear = new Map();
    list.forEach((e) => { const y = e.date.slice(0, 4); if (!byYear.has(y)) byYear.set(y, []); byYear.get(y).push(e); });
    $("#timeline").innerHTML = [...byYear.entries()].map(([year, items]) => `
      <section class="year-group"><h3>${year}</h3><ol>
        ${items.map((e) => {
          const extra = [e.registrations && `${e.registrations} inscrits`, e.participants && `${e.participants} participants`, e.sponsors && `${e.sponsors.length} partenaires`].filter(Boolean);
          return `<li class="tl-item">
            <time datetime="${esc(e.date)}">${fmtDate(e.date, { day: false })}</time>
            <div><h4>${esc(e.title)}</h4><div class="where">${esc(place(e))}${extra.length ? " · " + esc(extra.join(" · ")) : ""}</div>${tagsHtml(e.topics, 6)}</div>
            <span class="badge ${esc(e.type)}">${TYPE_LABEL[e.type] || e.type}</span>
          </li>`;
        }).join("")}
      </ol></section>`).join("");
  }
  $("#filters").innerHTML = home.history.filters.map((f, i) => `<button class="chip" data-filter="${esc(f.value)}" aria-pressed="${i === 0}">${esc(f.label)}</button>`).join("");
  const chips = document.querySelectorAll("#filters .chip");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    renderTimeline(chip.dataset.filter);
  }));
  renderTimeline(home.history.filters[0].value);

  /* Galerie */
  const items = events.flatMap(photoItems);
  $("#gallery").innerHTML = items.map((it, i) => `
    <button type="button" data-i="${i}" aria-label="Agrandir : ${esc(it.caption)}">
      <img src="${img(it.photo)}" alt="${esc(it.caption)}" loading="lazy"><span class="cap">${esc(it.caption)}</span>
    </button>`).join("");
  $("#gallery").addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-i]");
    if (btn) lightbox.open(items, Number(btn.dataset.i));
  });

  /* Entreprises */
  renderLogoWall($("#logo-wall"), companies.items, events);

  /* SoCraTes */
  $("#socrates-editions").innerHTML = events.filter((e) => e.type === "socrates").reverse().map((e, i) =>
    `<li><b>${e.date.slice(0, 4)} · ${esc(e.city)}</b><span>${["1re", "2e", "3e", "4e", "5e", "6e"][i]} édition${e.participants ? ` · ${e.participants} crafters` : ""}</span></li>`).join("");
  if (home.socrates.photo) $("#socrates-photo").src = img(home.socrates.photo);
  const byId = Object.fromEntries(companies.items.map((c) => [c.id, c]));
  $("#trust-logos").innerHTML = (sponsoring.trust.ids || []).map((id) => byId[id]).filter(Boolean).map((c) =>
    c.logo ? `<img src="assets/img/logos/${esc(c.logo)}" alt="${esc(c.display || c.name)}" title="${esc(c.display || c.name)}" loading="lazy">`
           : `<span class="monogram" title="${esc(c.display || c.name)}">${esc((c.display || c.name).slice(0, 2).toUpperCase())}</span>`).join("");

  /* Offres */
  $("#offers").innerHTML = offers.items.map((o) => `
    <article class="offer${o.highlight ? " highlight" : ""} reveal">
      ${o.badge ? `<span class="flag">${esc(o.badge)}</span>` : ""}
      <h3>${esc(o.name)}</h3>
      <div class="price">${esc(o.price || "Sur devis")}</div>
      <p class="tagline">${esc(o.tagline)}</p>
      <h4>Vous apportez</h4><ul class="give">${o.youProvide.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h4>Nous apportons</h4><ul>${o.weProvide.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <a class="btn ${o.highlight ? "btn-green" : "btn-ghost"}" href="accueillir.html?formule=${encodeURIComponent(o.id)}">Choisir cette formule</a>
    </article>`).join("");

  /* FAQ */
  $("#faq-list").innerHTML = home.faq.items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");

  /* Pied de page */
  $("#footer-nav").innerHTML = site.footer.links.map((l) => `<a href="${esc(l.href)}"${/^https?:/.test(l.href) ? ' target="_blank" rel="noopener"' : ""}>${esc(l.label)}</a>`).join("");

  initReveal();
})();
