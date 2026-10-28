/* Noyau du site : chargement du contenu JSON (dossier content/), liaison aux
   attributs data-cms, helpers de rendu, lightbox, envoi des formulaires. */
window.MSC = (function () {
  "use strict";

  const cache = {};

  // Charge content/<nom>.json pour chaque nom et renvoie { nom: données }.
  async function load(names) {
    const out = {};
    await Promise.all(names.map(async (n) => {
      if (!cache[n]) {
        cache[n] = fetch(`content/${n}.json`, { cache: "no-cache" }).then((r) => {
          if (!r.ok) throw new Error(`content/${n}.json : HTTP ${r.status}`);
          return r.json();
        });
      }
      out[n] = await cache[n];
    }));
    return out;
  }

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function get(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }

  // data-cms="home.hero.title"           → textContent
  // data-cms="home.hero.title" data-cms-html → innerHTML (texte de confiance : nos propres JSON)
  // data-cms-attr="href:site.links.linkedin;title:site.name" → attributs
  function bind(data, root) {
    root = root || document;
    root.querySelectorAll("[data-cms]").forEach((el) => {
      const v = get(data, el.dataset.cms);
      if (v == null) return;
      if (el.hasAttribute("data-cms-html")) el.innerHTML = v;
      else el.textContent = v;
    });
    root.querySelectorAll("[data-cms-attr]").forEach((el) => {
      el.dataset.cmsAttr.split(";").forEach((pair) => {
        const i = pair.indexOf(":");
        if (i < 0) return;
        const attr = pair.slice(0, i).trim();
        const v = get(data, pair.slice(i + 1).trim());
        if (v != null && v !== "") el.setAttribute(attr, v);
      });
    });
  }

  // Markdown minimal : titres, paragraphes, listes, citations, gras, italique, code, liens.
  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|[\w./#?=-]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }
  function md(text) {
    const blocks = String(text || "").replace(/\r/g, "").trim().split(/\n{2,}/);
    return blocks.map((b) => {
      const lines = b.split("\n");
      const h = /^(#{1,3})\s+(.*)$/.exec(lines[0]);
      if (h && lines.length === 1) return `<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`;
      if (lines.every((l) => /^[-*]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      if (lines.every((l) => /^\d+[.)]\s+/.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
      if (lines.every((l) => /^>\s?/.test(l))) return `<blockquote>${inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "))}</blockquote>`;
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    }).join("\n");
  }

  const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const MONTHS_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  function fmtDate(iso, opts) {
    opts = opts || {};
    const [y, m, d] = String(iso).split("-").map(Number);
    const months = opts.long ? MONTHS_LONG : MONTHS;
    return (opts.day !== false && d ? d + " " : "") + months[m - 1] + " " + y;
  }

  const img = (name) => `assets/img/meetups/${name}.jpg`;
  const TYPE_LABEL = { meetup: "Meetup", socrates: "SoCraTes", codesnack: "Code Snack", online: "En ligne" };

  function place(e) {
    return [e.venue, e.city].filter(Boolean).join(", ");
  }

  function photoItems(e) {
    return (e.photos || []).map((p) => ({ photo: p, caption: `${e.title} · ${fmtDate(e.date)}` }));
  }

  // Chiffres calculés depuis les événements, pour éviter de les maintenir à la main.
  function stats(site, events) {
    const meetups = events.filter((e) => e.type === "meetup");
    const withReg = meetups.filter((e) => e.registrations).slice(0, 5);
    const avg = withReg.length ? Math.round(withReg.reduce((a, e) => a + e.registrations, 0) / withReg.length) : 0;
    return {
      events: events.length,
      meetups: meetups.length,
      hosts: new Set(meetups.map((e) => e.host).filter(Boolean)).size,
      avgRegistrations: avg ? "~" + avg : "",
      followers: (site.linkedinFollowers || 0).toLocaleString("fr-FR"),
      socrates: events.filter((e) => e.type === "socrates").length,
      since: site.since
    };
  }

  // Pour chaque entreprise : événements accueillis, éditions sponsorisées, années.
  function companyStats(companies, events) {
    const out = {};
    companies.forEach((c) => {
      const hosted = events.filter((e) => e.host === c.name);
      const sponsored = events.filter((e) => (e.sponsors || []).includes(c.name));
      const years = [...new Set([...hosted, ...sponsored].map((e) => e.date.slice(0, 4)))].sort();
      out[c.id] = { hosted: hosted.length, sponsored: sponsored.length, years, roles: [hosted.length && "host", sponsored.length && "sponsor"].filter(Boolean) };
    });
    return out;
  }

  function roleLabel(s) {
    const parts = [];
    if (s.hosted) parts.push(s.hosted > 1 ? `Hôte de ${s.hosted} meetups` : "Hôte d'un meetup");
    if (s.sponsored) parts.push(s.sponsored > 1 ? `Partenaire de ${s.sponsored} éditions SoCraTes` : "Partenaire SoCraTes");
    return parts.join(" · ");
  }

  function monogram(name) {
    const words = name.replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/);
    return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
  }

  // Post-it « Votre logo ici ? » en fin de mur (opts.sticker : { title, text, label, href }).
  function stickerTile(s, id) {
    if (!s) return "";
    return `<a class="logo-tile sticker" href="${esc(s.href)}" aria-labelledby="${id}-t ${id}-l" aria-describedby="${id}-d">
        <span class="sticker-title" id="${id}-t">${esc(s.title)}</span>
        <span class="sticker-text" id="${id}-d">${esc(s.text)}</span>
        <span class="sticker-cta"><span id="${id}-l">${esc(s.label)}</span>&nbsp;<span aria-hidden="true">→</span></span>
      </a>`;
  }

  // Mur de logos. Si l'image manque, on affiche un monogramme à la place.
  function renderLogoWall(el, companies, events, opts) {
    opts = opts || {};
    const st = companyStats(companies, events);
    let list = companies.filter((c) => !opts.filter || opts.filter(c, st[c.id]));
    if (opts.sort !== false) list = list.slice().sort((a, b) => (st[b.id].hosted + st[b.id].sponsored) - (st[a.id].hosted + st[a.id].sponsored));
    el.innerHTML = list.map((c) => {
      const s = st[c.id];
      const label = opts.label ? opts.label(c, s) : roleLabel(s);
      const tag = c.linkedin ? "a" : "div";
      const href = c.linkedin ? ` href="${esc(c.linkedin)}" target="_blank" rel="noopener"` : "";
      return `<${tag} class="logo-tile"${href} title="${esc(c.display || c.name)}${label ? " · " + esc(label) : ""}">
        <span class="logo-box${c.logo ? "" : " missing"}">${c.logo ? `<img src="assets/img/logos/${esc(c.logo)}" alt="${esc(c.display || c.name)}" loading="lazy" width="120" height="120">` : ""}<span class="monogram" aria-hidden="true">${esc(monogram(c.display || c.name))}</span></span>
        <span class="logo-name">${esc(c.display || c.name)}</span>
        ${label ? `<span class="logo-role">${esc(label)}</span>` : ""}
      </${tag}>`;
    }).join("") + stickerTile(opts.sticker, `${el.id}-sticker`);
    el.querySelectorAll("img").forEach((im) => {
      im.addEventListener("error", () => im.closest(".logo-box").classList.add("missing"));
      if (im.complete && im.naturalWidth === 0) im.closest(".logo-box").classList.add("missing");
    });
  }

  /* Lightbox partagée (élément #lightbox facultatif dans la page). */
  const lightbox = (function () {
    let box, imgEl, cap, list = [], index = 0, lastFocus = null;
    function ensure() {
      box = document.getElementById("lightbox");
      if (!box) {
        box = document.createElement("div");
        box.id = "lightbox";
        box.className = "lightbox";
        box.setAttribute("role", "dialog");
        box.setAttribute("aria-modal", "true");
        box.setAttribute("aria-label", "Photo agrandie");
        box.innerHTML = '<button class="lb-close" aria-label="Fermer">×</button><button class="lb-prev" aria-label="Photo précédente">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-next" aria-label="Photo suivante">›</button>';
        document.body.appendChild(box);
      }
      imgEl = box.querySelector("img");
      cap = box.querySelector("figcaption");
      box.querySelector(".lb-close").addEventListener("click", close);
      box.querySelector(".lb-prev").addEventListener("click", () => step(-1));
      box.querySelector(".lb-next").addEventListener("click", () => step(1));
      box.addEventListener("click", (ev) => { if (ev.target === box) close(); });
      document.addEventListener("keydown", (ev) => {
        if (!box.classList.contains("open")) return;
        if (ev.key === "Escape") close();
        if (ev.key === "ArrowLeft") step(-1);
        if (ev.key === "ArrowRight") step(1);
      });
      ensure = function () {};
    }
    function show() {
      const it = list[index];
      imgEl.src = it.src || img(it.photo);
      imgEl.alt = it.caption || "";
      cap.textContent = (it.caption || "") + (list.length > 1 ? `  ·  ${index + 1} / ${list.length}` : "");
      box.querySelector(".lb-prev").hidden = list.length < 2;
      box.querySelector(".lb-next").hidden = list.length < 2;
    }
    function open(items, start) {
      ensure();
      list = items; index = start || 0; lastFocus = document.activeElement;
      show();
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      box.querySelector(".lb-close").focus();
    }
    function close() {
      box.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    function step(d) { index = (index + d + list.length) % list.length; show(); }
    return { open };
  })();

  /* En-tête : menu mobile et lien actif. */
  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", (ev) => {
        if (ev.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
      });
    }
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach((a) => {
      const target = (a.getAttribute("href") || "").split("#")[0] || "index.html";
      if (target === here && !a.getAttribute("href").includes("#")) a.setAttribute("aria-current", "page");
    });
  }

  function initReveal(root) {
    const els = (root || document).querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -60px 0px" });
    els.forEach((e) => io.observe(e));
  }

  function tracking() {
    const params = new URLSearchParams(location.search);
    const t = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((k) => { if (params.get(k)) t[k] = params.get(k); });
    if (document.referrer) t.referrer = document.referrer;
    return t;
  }

  /* Envoi d'une demande (hébergement, sponsoring…).
     - site.form.endpoint renseigné : POST JSON (Formspree, Web3Forms, Apps Script…)
     - sinon site.contact.email : ouvre un e-mail pré-rempli
     - sinon : { mode: "none" }, la page affiche un lien LinkedIn. */
  async function sendLead(site, data, opts) {
    const endpoint = (site.form && site.form.endpoint) || "";
    const subject = opts.subject;
    if (endpoint) {
      const payload = Object.assign({}, (site.form && site.form.extraFields) || {}, data, {
        type: opts.type, _subject: subject, subject, _replyto: data.email,
        source: location.href.split("?")[0], envoye_le: new Date().toISOString()
      }, tracking());
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return { mode: "endpoint" };
    }
    if (site.contact && site.contact.email) {
      const body = opts.body || Object.entries(data).filter(([, v]) => v !== "" && v != null).map(([k, v]) => `${k} : ${Array.isArray(v) ? v.join(", ") : v}`).join("\n");
      window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return { mode: "mailto" };
    }
    return { mode: "none" };
  }

  function setMeta(meta) {
    if (!meta) return;
    if (meta.title) document.title = meta.title;
    const d = document.querySelector('meta[name="description"]');
    if (d && meta.description) d.setAttribute("content", meta.description);
  }

  /* Typographie française : l'espace devant ? ! : ; devient une espace fine insécable
     (U+202F), pour que la ponctuation ne passe jamais seule à la ligne. On ne touche
     qu'aux nœuds texte (jamais aux attributs ni aux URL), et seulement là où une espace
     existe déjà. Un observateur traite aussi le texte rendu plus tard par les scripts. */
  function frenchSpacing(node) {
    if (node.nodeType === 3) {
      const p = node.parentElement;
      if (!p || p.closest("script, style, code, pre, textarea")) return;
      const v = node.data.replace(/[  ]([?!:;])/g, " $1");
      if (v !== node.data) node.data = v;
    } else if (node.nodeType === 1) {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      for (let t = walker.nextNode(); t; t = walker.nextNode()) frenchSpacing(t);
    }
  }
  if (document.body && "MutationObserver" in window) {
    frenchSpacing(document.body);
    new MutationObserver((records) => records.forEach((r) => r.addedNodes.forEach(frenchSpacing)))
      .observe(document.body, { childList: true, subtree: true });
  }

  return { load, esc, get, bind, md, fmtDate, img, place, photoItems, stats, companyStats, roleLabel, renderLogoWall, lightbox, initNav, initReveal, sendLead, setMeta, TYPE_LABEL };
})();
