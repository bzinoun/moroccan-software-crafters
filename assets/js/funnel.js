/* Formulaire « Accueillir un meetup » en quatre étapes. Formules et réglages d'envoi : content/offers.json et content/site.json. */
(async function () {
  "use strict";
  const M = window.MSC;
  const { esc } = M;
  const DRAFT_KEY = "msc-host-draft-v1";
  const TOTAL = 4;
  const STEP_TITLES = ["Formule", "L'événement", "Votre entreprise", "Contact"];
  const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  M.initNav();
  const form = document.getElementById("host-form");
  if (!form) return;

  let site, OFFERS;
  try {
    const data = await M.load(["site", "offers", "events"]);
    site = data.site;
    OFFERS = data.offers.items;
    M.bind(data);
    const latest = data.events.find((e) => e.type === "meetup");
    const proof = document.getElementById("proof-text");
    if (proof && latest) proof.innerHTML = `<strong>Dernière édition :</strong> ${esc(latest.host)}, ${M.fmtDate(latest.date, { long: true })}${latest.registrations ? `, ${latest.registrations} inscrits` : ""}.`;
    const fn = document.getElementById("footer-nav");
    if (fn) fn.innerHTML = site.footer.links.map((l) => `<a href="${esc(l.href)}"${/^https?:/.test(l.href) ? ' target="_blank" rel="noopener"' : ""}>${esc(l.label)}</a>`).join("");
  } catch (err) {
    console.error("[MSC] Contenu indisponible :", err);
    return;
  }

  const steps = [...form.querySelectorAll(".step")];
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const alertBox = document.getElementById("form-alert");
  const bars = [...form.querySelectorAll(".progress span")];
  const progressLabel = document.getElementById("progress-label");
  let current = 1;

  // Le stockage local peut être indisponible (navigation privée) : le formulaire fonctionne sans.
  const storage = {
    get() { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(v)); } catch (e) { /* brouillon non conservé */ } },
    clear() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* rien à nettoyer */ } }
  };

  function renderOffers() {
    document.getElementById("offer-choices").innerHTML = OFFERS.map((o) => `
      <label class="choice-card">
        <input type="radio" name="formule" value="${esc(o.id)}" required>
        <span class="dot"></span>
        <span><strong>${esc(o.name)}</strong><small>${esc(o.tagline)}</small></span>
        <span class="price">${esc(o.price || "Sur devis")}</span>
      </label>`).join("");
  }

  const isoDate = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

  function setupDates() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    form.date.min = isoDate(tomorrow);
    form.date_alt.min = isoDate(tomorrow);
    form.date.addEventListener("change", updateDateHelp);
    form.addEventListener("change", (ev) => { if (ev.target.name === "formule") updateDateHelp(); });
  }

  function updateDateHelp() {
    const help = document.getElementById("date-help");
    const v = form.date.value;
    if (!v) { help.textContent = ""; return; }
    const day = new Date(v + "T12:00:00").getDay();
    if (day !== 6 && form.formule.value !== "prive") {
      help.textContent = `C'est un ${DAYS[day]}. Les meetups ouverts ont lieu le samedi matin ; on en discutera ensemble.`;
    } else {
      help.textContent = `${DAYS[day].charAt(0).toUpperCase() + DAYS[day].slice(1)}, c'est noté.`;
    }
  }

  const normalizePhone = (v) => v.replace(/[\s.\-()]/g, "");
  // Formats acceptés : 06/07/05 XXXXXXXX (Maroc) ou international +XXX / 00XXX.
  const validPhone = (v) => { const p = normalizePhone(v); return /^0[5-7]\d{8}$/.test(p) || /^(\+|00)\d{8,15}$/.test(p); };
  const fieldOf = (el) => el.closest(".field");

  // Message d'erreur adapté : « data-empty » si le champ est vide, texte d'origine si le format est faux.
  function setErrorText(el, empty) {
    const err = fieldOf(el).querySelector(".error[data-empty]");
    if (!err) return;
    if (!err.dataset.bad) err.dataset.bad = err.textContent;
    err.textContent = empty ? err.dataset.empty : err.dataset.bad;
  }

  function setInvalid(field, invalid) {
    if (!field) return;
    field.classList.toggle("invalid", invalid);
    field.querySelectorAll("input, select, textarea").forEach((i) => i.setAttribute("aria-invalid", String(invalid)));
  }

  function validateStep(n) {
    const step = steps[n - 1];
    let firstBad = null;
    const fail = (field, focusEl) => { setInvalid(field, true); if (!firstBad) firstBad = focusEl; };
    step.querySelectorAll(".field").forEach((f) => setInvalid(f, false));
    if (n === 1 && !form.formule.value) fail(step.querySelector('[data-name="formule"]'), step.querySelector('input[name="formule"]'));
    if (n === 2) {
      if (!form.date.value || form.date.value < form.date.min) fail(fieldOf(form.date), form.date);
      const part = form.querySelector('input[name="participants"]');
      if (!form.participants.value) fail(fieldOf(part), part);
      const cap = form.capacite.value;
      if (cap && (Number(cap) < 10 || Number(cap) > 1000)) fail(fieldOf(form.capacite), form.capacite);
    }
    if (n === 3) {
      if (!form.entreprise.value.trim()) fail(fieldOf(form.entreprise), form.entreprise);
      const s = form.site.value.trim();
      if (s && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(s)) fail(fieldOf(form.site), form.site);
    }
    if (n === 4) {
      if (!form.nom.value.trim()) fail(fieldOf(form.nom), form.nom);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim())) fail(fieldOf(form.email), form.email);
      if (!validPhone(form.telephone.value)) { setErrorText(form.telephone, !form.telephone.value.trim()); fail(fieldOf(form.telephone), form.telephone); }
      if (!form.consent.checked) fail(fieldOf(form.consent), form.consent);
    }
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function collect() {
    const offer = OFFERS.find((o) => o.id === form.formule.value);
    return {
      formule: offer ? offer.name : form.formule.value,
      date: form.date.value, date_alt: form.date_alt.value,
      participants: form.participants.value, ville: form.ville.value, capacite: form.capacite.value,
      equipements: [...form.querySelectorAll('input[name="equipements"]:checked')].map((i) => i.value).join(", "),
      sujets: form.sujets.value.trim(),
      entreprise: form.entreprise.value.trim(), secteur: form.secteur.value, taille: form.taille.value,
      site: form.site.value.trim(), adresse: form.adresse.value.trim(),
      nom: form.nom.value.trim(), fonction: form.fonction.value.trim(),
      email: form.email.value.trim(), telephone: normalizePhone(form.telephone.value),
      preference: form.preference.value, message: form.message.value.trim()
    };
  }

  const formatDay = (iso) => iso ? new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

  function renderRecap() {
    const d = collect();
    const rows = [
      ["Formule", d.formule],
      ["Date souhaitée", formatDay(d.date) + (d.date_alt ? ` (ou ${formatDay(d.date_alt)})` : "")],
      ["Crafters attendus", d.participants + (d.capacite ? ` · salle de ${d.capacite} places` : "")],
      ["Lieu", [d.adresse, d.ville].filter(Boolean).join(", ")],
      ["Sur place", d.equipements],
      ["Entreprise", [d.entreprise, d.secteur, d.taille && "équipe tech : " + d.taille].filter(Boolean).join(" · ")]
    ].filter(([, v]) => v);
    document.getElementById("recap").innerHTML = '<p class="recap-title">Votre demande</p><dl>' + rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("") + "</dl>";
  }

  function show(n) {
    current = n;
    steps.forEach((s, i) => { s.hidden = i !== n - 1; });
    bars.forEach((b, i) => b.classList.toggle("done", i < n));
    progressLabel.textContent = `Étape ${n} sur ${TOTAL} · ${STEP_TITLES[n - 1]}`;
    prevBtn.hidden = n === 1;
    nextBtn.textContent = n === TOTAL ? "Envoyer ma demande" : "Continuer";
    if (n === TOTAL) renderRecap();
    alertBox.classList.remove("show");
  }

  function focusStep() {
    const legend = steps[current - 1].querySelector("legend");
    legend.setAttribute("tabindex", "-1");
    legend.focus({ preventScroll: true });
    document.getElementById("funnel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showAlert(html) { alertBox.innerHTML = html; alertBox.classList.add("show"); }

  // Brouillon : tout sauf le consentement et le pot de miel.
  function saveDraft() {
    const data = {};
    new FormData(form).forEach((v, k) => {
      if (k === "consent" || k === "website_hp") return;
      if (k === "equipements") (data[k] = data[k] || []).push(v);
      else data[k] = v;
    });
    data._step = current;
    storage.set(data);
  }

  function restoreDraft() {
    const params = new URLSearchParams(location.search);
    const draft = storage.get() || {};
    if (params.get("formule")) draft.formule = params.get("formule");
    Object.entries(draft).forEach(([k, v]) => {
      if (k.startsWith("_")) return;
      form.querySelectorAll(`[name="${CSS.escape(k)}"]`).forEach((el) => {
        if (el.type === "radio") el.checked = el.value === v;
        else if (el.type === "checkbox") el.checked = Array.isArray(v) && v.includes(el.value);
        else el.value = v;
      });
    });
    if (form.date.value && form.date.value < form.date.min) form.date.value = "";
    if (form.date_alt.value && form.date_alt.value < form.date_alt.min) form.date_alt.value = "";
    updateDateHelp();
    // Arrivée depuis une carte d'offre : la formule est déjà choisie, on passe à l'étape 2.
    if (params.get("formule") && form.formule.value && !draft._step) return 2;
    return Math.min(Math.max(Number(draft._step) || 1, 1), TOTAL);
  }

  function emailBody(d) {
    return [
      `Formule : ${d.formule}`, `Date souhaitée : ${formatDay(d.date)}`, d.date_alt && `Date alternative : ${formatDay(d.date_alt)}`,
      `Crafters attendus : ${d.participants}`, d.capacite && `Capacité de la salle : ${d.capacite}`,
      `Ville : ${d.ville}${d.adresse ? " (" + d.adresse + ")" : ""}`, d.equipements && `Sur place : ${d.equipements}`, d.sujets && `Sujets : ${d.sujets}`, "",
      `Entreprise : ${d.entreprise}`, d.secteur && `Secteur : ${d.secteur}`, d.taille && `Équipe tech : ${d.taille}`, d.site && `Site : ${d.site}`, "",
      `Contact : ${d.nom}${d.fonction ? ", " + d.fonction : ""}`, `E-mail : ${d.email}`, `Téléphone : ${d.telephone}`, `Préférence : ${d.preference}`,
      d.message && `\n${d.message}`
    ].filter((l) => l !== "" && l !== undefined && l !== false).join("\n");
  }

  async function submit() {
    if (form.website_hp.value) { done(); return; } // robot : on ne transmet rien
    const d = collect();
    nextBtn.disabled = true;
    nextBtn.textContent = "Envoi…";
    try {
      const res = await M.sendLead(site, d, { type: "Hébergement meetup", subject: `Demande d'hébergement meetup · ${d.entreprise} · ${d.date}`, body: emailBody(d) });
      if (res.mode === "none") {
        console.error("[MSC] Aucun endpoint ni e-mail de contact configuré dans content/site.json");
        showAlert(`Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur <a href="${esc(site.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a> en attendant.`);
      } else if (res.mode === "mailto") {
        done("Votre messagerie s'est ouverte avec la demande pré-remplie : il ne reste qu'à l'envoyer. Nous revenons vers vous sous 48 heures.");
      } else {
        done();
      }
    } catch (err) {
      console.error("[MSC] Envoi du formulaire impossible :", err);
      const fallback = site.contact.email
        ? ` Vous pouvez aussi nous écrire à <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>.`
        : ` Vous pouvez aussi nous écrire sur <a href="${esc(site.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>.`;
      showAlert("L'envoi n'a pas abouti. Vos réponses sont conservées, réessayez dans un instant." + fallback);
    }
    nextBtn.disabled = false;
    nextBtn.textContent = "Envoyer ma demande";
  }

  function done(text) {
    storage.clear();
    form.hidden = true;
    const success = document.getElementById("success");
    if (text) document.getElementById("success-text").textContent = text;
    success.hidden = false;
    success.focus();
  }

  nextBtn.addEventListener("click", () => {
    if (!validateStep(current)) return;
    if (current < TOTAL) { show(current + 1); saveDraft(); focusStep(); } else { submit(); }
  });
  prevBtn.addEventListener("click", () => { if (current > 1) { show(current - 1); saveDraft(); focusStep(); } });
  // Entrée dans un champ = « Continuer », pas un envoi natif du formulaire.
  form.addEventListener("submit", (ev) => { ev.preventDefault(); nextBtn.click(); });
  form.addEventListener("input", (ev) => {
    const f = fieldOf(ev.target);
    if (f && f.classList.contains("invalid")) setInvalid(f, false);
    saveDraft();
  });
  form.addEventListener("change", (ev) => {
    if (ev.target.name === "formule") setInvalid(steps[0].querySelector('[data-name="formule"]'), false);
    if (ev.target.name === "participants") setInvalid(fieldOf(ev.target), false);
    saveDraft();
  });

  renderOffers();
  setupDates();
  show(restoreDraft());
})();
