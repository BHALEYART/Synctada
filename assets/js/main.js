/* ==========================================================================
   SyncTada — site scripts
   Shared header/footer, navigation, scroll reveals, forms, scheduler embed.
   ========================================================================== */

/* ---- Site config: fill these in before launch ---- */
const SYNCTADA_CONFIG = {
  // Where demo/contact form submissions are POSTed as JSON (Formspree, a Vercel function, a GoHighLevel webhook...).
  // Leave empty to fall back to opening the visitor's email app addressed to contactEmail.
  formEndpoint: "",
  // Public contact address (confirm this mailbox exists before launch).
  contactEmail: "hello@synctada.com",
  // Booking page to embed for direct scheduling (Calendly, GoHighLevel calendar, Cal.com...).
  // When set, visitors pick a time right after entering their details. Leave empty for the request flow.
  schedulerUrl: "",
  // Confirmed demo length in minutes, e.g. 30. Leave null until the team confirms it; no length is shown.
  demoDurationMinutes: null,
  // Confirmed response window for manual scheduling, e.g. "one business day". Leave empty until confirmed.
  responseWindow: "",
};

const AUDIENCES = {
  agency: { chip: "For agencies", line: "We'll show how you'd present results to a client under your own brand." },
  marketer: { chip: "For marketing professionals", line: "We'll show how you'd prove impact to leadership or clients." },
  owner: { chip: "For business owners", line: "You're welcome to bring your agency or marketer to the demo." },
};

/* ---- Analytics: pushes to dataLayer (GTM/GA4), gtag, and Plausible when present ---- */
function track(event, props = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
    if (typeof window.gtag === "function") window.gtag("event", event, props);
    if (typeof window.plausible === "function") window.plausible(event, { props });
  } catch (e) { /* analytics must never break the page */ }
}

function store(key, val) {
  try { if (val === undefined) return sessionStorage.getItem(key); sessionStorage.setItem(key, val); } catch (e) { return null; }
  return null;
}

document.documentElement.classList.remove("no-js");

const ARROW = '<span class="arrow" aria-hidden="true">&rarr;</span>';

function initChrome() {
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Mobile sticky CTA (skipped on the booking page itself)
  if (document.body.dataset.page !== "book-demo") {
    const m = document.createElement("aside");
    m.className = "mobile-cta";
    m.setAttribute("aria-label", "Book a demo shortcut");
    m.innerHTML = `<a class="btn btn-primary" href="/book-demo/">Book a Demo ${ARROW}</a>`;
    document.body.appendChild(m);
    const onScroll = () => m.classList.toggle("show", window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

function initNav() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const toggle = header.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  header.querySelectorAll(".has-dropdown > button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const li = btn.parentElement;
      const wasOpen = li.classList.contains("open");
      header.querySelectorAll(".has-dropdown.open").forEach((o) => {
        o.classList.remove("open");
        o.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) { li.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    });
  });
  const closeAll = () => header.querySelectorAll(".has-dropdown.open").forEach((o) => {
    o.classList.remove("open");
    o.querySelector("button").setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const openDd = header.querySelector(".has-dropdown.open");
    if (openDd) { closeAll(); openDd.querySelector("button").focus(); return; }
    if (header.classList.contains("menu-open")) {
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) closeAll();
  });
  // Close a desktop dropdown when keyboard focus leaves it
  header.querySelectorAll(".has-dropdown").forEach((li) => {
    li.addEventListener("focusout", (e) => {
      if (!li.contains(e.relatedTarget)) {
        li.classList.remove("open");
        li.querySelector("button").setAttribute("aria-expanded", "false");
      }
    });
  });
  // Close mobile menu after following an in-page link
  header.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach((el) => io.observe(el));
}

/* DATA -> TADA: the same four letters, rearranged. Plays once when visible. */
function initDataTada() {
  document.querySelectorAll(".datatada").forEach((wrap) => {
    const tiles = [...wrap.querySelectorAll(".tile")]; // D A T A
    if (tiles.length !== 4) return;
    const finish = () => { wrap.classList.add("is-tada"); };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      tiles[0].textContent = "T"; tiles[2].textContent = "D";
      finish();
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      setTimeout(() => {
        const w = tiles[0].getBoundingClientRect().width + 3;
        tiles[0].style.transform = `translateX(${w * 2}px)`;
        tiles[2].style.transform = `translateX(${-w * 2}px)`;
        finish();
      }, 700);
    }, { threshold: 0.6 });
    io.observe(wrap);
  });
}

/* Animate funnel bars when visible */
function initFunnels() {
  const fills = document.querySelectorAll(".f-fill[data-w]");
  fills.forEach((f) => { f.style.width = "0%"; f.style.transition = "width 1.1s cubic-bezier(.2,.7,.2,1)"; });
  const run = (f) => { f.style.width = f.dataset.w + "%"; };
  if (!("IntersectionObserver" in window)) { fills.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.3 });
  fills.forEach((f) => io.observe(f));
}

/* Carry audience context (agency / marketer / owner) into every Book a Demo link */
function initAudience() {
  const aud = document.body.dataset.audience;
  if (aud && AUDIENCES[aud]) store("st_audience", aud);
  const current = aud || store("st_audience");
  if (!current || !AUDIENCES[current]) return;
  document.querySelectorAll('a[href="/book-demo/"]').forEach((a) => { a.href = `/book-demo/?for=${current}`; });
}

/* Distinguish CTA clicks from form starts and completed requests/bookings */
function initCtaTracking() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="/book-demo/"]');
    if (!a) return;
    const where = a.dataset.cta || (a.closest(".site-header") ? "header" : a.closest(".site-footer") ? "footer" : a.closest(".mobile-cta") ? "mobile-sticky" : "body");
    track("cta_click", { cta_location: where, page_path: location.pathname, audience: new URL(a.href, location.href).searchParams.get("for") || "" });
  });
  document.querySelectorAll("form[data-st-form]").forEach((form) => {
    let started = false;
    form.addEventListener("input", () => {
      if (started) return;
      started = true;
      track(`${form.dataset.stForm.replace(/-/g, "_")}_form_start`, { page_path: location.pathname });
    });
  });
}

async function sendForm(kind, data) {
  data.form = kind;
  data.page = location.pathname;
  if (SYNCTADA_CONFIG.formEndpoint) {
    const res = await fetch(SYNCTADA_CONFIG.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(String(res.status));
    return "sent";
  }
  // Fallback: compose an email with the submitted details
  const subject = {
    demo: `Demo request: ${data.company || data.name || ""}`,
    "demo-prep": `Demo prep details: ${data.email || ""}`,
    contact: `Website inquiry from ${data.name || ""}`,
  }[kind] || "Website form";
  const body = Object.entries(data)
    .filter(([k, v]) => v && !["form", "page", "consent"].includes(k))
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join("\n");
  window.location.href = `mailto:${SYNCTADA_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return "mailto";
}

function validate(form) {
  form.querySelectorAll("input, select, textarea").forEach((f) => {
    if (f.type !== "hidden") f.setAttribute("aria-invalid", String(!f.checkValidity()));
  });
  return form.reportValidity();
}

function formData(form) {
  const fd = new FormData(form);
  const out = {};
  for (const [k, v] of fd.entries()) out[k] = out[k] ? `${out[k]}, ${v}` : v;
  return out;
}

function clearInvalidOnFix(form) {
  const fix = (e) => { if (e.target.checkValidity && e.target.checkValidity()) e.target.removeAttribute("aria-invalid"); };
  form.addEventListener("input", fix);
  form.addEventListener("change", fix);
}

/* ---- Book a Demo: details -> (pick a time) -> help us prepare -> done ---- */
function initBooking() {
  const root = document.getElementById("booking");
  if (!root) return;
  const cfg = SYNCTADA_CONFIG;
  const scheduler = Boolean(cfg.schedulerUrl);
  const params = new URLSearchParams(location.search);
  const aud = AUDIENCES[params.get("for")] ? params.get("for") : (AUDIENCES[store("st_audience")] ? store("st_audience") : "");
  const lead = {};

  const panels = Object.fromEntries([...root.querySelectorAll("[data-panel]")].map((p) => [p.dataset.panel, p]));
  const steps = [...root.querySelectorAll("[data-book-steps] li")];
  const stepIndex = { details: 0, time: 1, prep: 2, done: 2 };

  const show = (name) => {
    Object.entries(panels).forEach(([k, p]) => { p.hidden = k !== name; });
    const idx = stepIndex[name];
    steps.forEach((li, i) => {
      if (i === idx && name !== "done") li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      li.classList.toggle("done", i < idx || name === "done");
    });
    const h = panels[name].querySelector("h2");
    if (h) h.focus();
    root.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  // Audience context
  if (aud) {
    const chip = document.querySelector("[data-audience-chip]");
    const line = document.querySelector("[data-audience-line]");
    if (chip) { chip.textContent = AUDIENCES[aud].chip; chip.hidden = false; }
    if (line) { line.textContent = AUDIENCES[aud].line; line.hidden = false; }
  }
  root.querySelector("[data-audience-input]").value = aud;
  root.querySelector("[data-source-input]").value = document.referrer && new URL(document.referrer).origin === location.origin ? new URL(document.referrer).pathname : "";

  // Copy that depends on confirmed details
  const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " "); } catch (e) { return "your local time zone"; } })();
  if (cfg.demoDurationMinutes) {
    document.querySelectorAll("[data-duration-text]").forEach((el) => { el.textContent = `About ${cfg.demoDurationMinutes} minutes, live over video.`; });
    root.querySelector("[data-duration-short]").textContent = `${cfg.demoDurationMinutes} minutes`;
  }
  root.querySelector("[data-tz]").textContent = tz;
  const manualNext = cfg.responseWindow
    ? `we'll email you within ${cfg.responseWindow} to arrange your demo time.`
    : "we'll email you to arrange your demo time.";
  if (scheduler) {
    document.querySelectorAll("[data-howto-text]").forEach((el) => { el.textContent = "Enter your name, email, and company, then choose an open time from the calendar. Times are shown in your time zone."; });
    root.querySelector("[data-next-step]").innerHTML = "<strong>What happens next:</strong> you'll choose a time from our calendar and get a confirmation by email.";
    root.querySelector("[data-submit-label]").innerHTML = 'Continue to pick a time <span class="arrow" aria-hidden="true">&rarr;</span>';
    root.querySelector("[data-step-time]").hidden = false;
    root.querySelector("[data-prep-num]").textContent = "3";
  } else {
    document.querySelectorAll("[data-howto-text]").forEach((el) => { el.textContent = `Send the short form, and ${manualNext}`; });
    root.querySelector("[data-next-step]").innerHTML = `<strong>What happens next:</strong> ${manualNext}`;
  }

  // Step 1: details
  const detailsForm = panels.details.querySelector("form");
  clearInvalidOnFix(detailsForm);
  detailsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate(detailsForm)) return;
    Object.assign(lead, formData(detailsForm));
    const status = detailsForm.querySelector(".form-status");
    const btn = detailsForm.querySelector('button[type="submit"]');

    if (scheduler) {
      // Save the lead if an endpoint exists, but never block booking on it
      if (cfg.formEndpoint) sendForm("demo", { ...lead, stage: "details" }).catch(() => {});
      track("demo_details_submitted", { audience: aud, mode: "scheduler" });
      mountScheduler();
      show("time");
      return;
    }

    btn.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending…";
    try {
      const how = await sendForm("demo", lead);
      track("demo_request_submitted", { audience: aud, mode: how });
      status.textContent = "";
      if (how === "mailto") {
        panels.prep.querySelector("[data-prep-title]").textContent = "Almost done: send the email.";
        panels.prep.querySelector("[data-prep-intro]").textContent = "Your email app should have opened with your request. Send it to finish, then we'll reply to arrange a time. Two optional questions help us tailor the demo:";
      } else {
        panels.prep.querySelector("[data-prep-intro]").textContent = `Next, ${manualNext} Two optional questions help us tailor it:`;
      }
      show("prep");
    } catch (err) {
      status.className = "form-status error";
      status.innerHTML = `Something went wrong. Please email us at <a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a>.`;
    } finally {
      btn.disabled = false;
    }
  });

  // Step 2 (scheduler)
  let booked = false;
  const onBooked = (how) => {
    if (booked) return;
    booked = true;
    track("demo_time_booked", { audience: aud, confirmed_by: how });
    panels.prep.querySelector("[data-prep-title]").textContent = "Your demo is booked.";
    panels.prep.querySelector("[data-prep-intro]").textContent = "Check your email for the confirmation and calendar invite. Two optional questions help us tailor the demo:";
    show("prep");
  };
  function mountScheduler() {
    const slot = root.querySelector("[data-scheduler-slot]");
    if (slot.firstChild) return;
    const url = new URL(cfg.schedulerUrl);
    if (lead.name) url.searchParams.set("name", lead.name);
    if (lead.email) url.searchParams.set("email", lead.email);
    url.searchParams.set("utm_source", "synctada.com");
    if (aud) url.searchParams.set("utm_content", aud);
    if (/calendly\.com$/.test(url.hostname)) {
      url.searchParams.set("embed_domain", location.hostname);
      url.searchParams.set("embed_type", "Inline");
    }
    const frame = document.createElement("iframe");
    frame.className = "sched-frame";
    frame.title = "Choose a demo time";
    frame.src = url.toString();
    slot.appendChild(frame);
  }
  window.addEventListener("message", (e) => {
    // Calendly reports a completed booking; other schedulers use the Continue button
    if (e.data && e.data.event === "calendly.event_scheduled") onBooked("scheduler");
  });
  root.querySelector("[data-booked-continue]").addEventListener("click", () => onBooked("visitor"));

  // Help us prepare (optional)
  const prepForm = panels.prep.querySelector("form");
  const finish = () => {
    panels.done.querySelector("[data-done-intro]").textContent = booked
      ? "Your confirmation and calendar invite are in your email."
      : `Next, ${manualNext}`;
    show("done");
  };
  prepForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const extra = formData(prepForm);
    if (!extra.crm && !extra.ad_platforms) { finish(); return; }
    try {
      await sendForm("demo-prep", { email: lead.email, name: lead.name, company: lead.company, audience: aud, ...extra });
      track("demo_prep_submitted", { audience: aud });
    } catch (err) { /* optional step: never block */ }
    finish();
  });
  panels.prep.querySelector("[data-skip-prep]").addEventListener("click", finish);
}

/* ---- Contact form ---- */
function initContactForm() {
  const form = document.querySelector('form[data-st-form="contact"]');
  if (!form) return;
  const status = form.querySelector(".form-status");
  clearInvalidOnFix(form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending…";
    try {
      const how = await sendForm("contact", formData(form));
      track("contact_submitted", { mode: how });
      if (how === "sent") form.reset();
      status.textContent = how === "sent" ? "Thanks! Your message is on its way to our team." : "Opening your email app to send your message…";
    } catch (err) {
      status.className = "form-status error";
      status.innerHTML = `Something went wrong. Please email us at <a href="mailto:${SYNCTADA_CONFIG.contactEmail}">${SYNCTADA_CONFIG.contactEmail}</a>.`;
    } finally {
      btn.disabled = false;
    }
  });
}

function initContactLinks() {
  document.querySelectorAll("[data-contact-email]").forEach((a) => {
    a.href = `mailto:${SYNCTADA_CONFIG.contactEmail}`;
    a.textContent = SYNCTADA_CONFIG.contactEmail;
  });
}

initChrome();
initAudience();
initNav();
initContactLinks();
initReveal();
initDataTada();
initFunnels();
initCtaTracking();
initBooking();
initContactForm();
