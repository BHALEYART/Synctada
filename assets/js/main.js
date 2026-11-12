/* ==========================================================================
   SyncTada — site scripts
   Shared header/footer, navigation, scroll reveals, forms, scheduler embed.
   ========================================================================== */

/* ---- Site config: fill these in before launch ---- */
const SYNCTADA_CONFIG = {
  // Where demo/contact form submissions are POSTed as JSON (Formspree, Vercel function, etc.).
  // Leave empty to fall back to opening the visitor's email app addressed to contactEmail.
  formEndpoint: "",
  // Public contact address (confirm this mailbox exists before launch).
  contactEmail: "hello@synctada.com",
  // Scheduling page URL to embed on /book-demo/ (Calendly, GoHighLevel calendar, Cal.com...).
  // Leave empty to show the request form only.
  schedulerUrl: "",
};

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

function initScheduler() {
  const slot = document.querySelector("[data-scheduler]");
  if (!slot || !SYNCTADA_CONFIG.schedulerUrl) return;
  slot.innerHTML = `<iframe src="${SYNCTADA_CONFIG.schedulerUrl}" title="Book a SyncTada demo" style="width:100%;min-height:680px;border:0;border-radius:18px;background:#fff" loading="lazy"></iframe>`;
  slot.classList.remove("scheduler");
}

function initForms() {
  document.querySelectorAll("form[data-st-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    form.addEventListener("input", (e) => { if (e.target.checkValidity()) e.target.removeAttribute("aria-invalid"); });
    form.addEventListener("change", (e) => { if (e.target.checkValidity()) e.target.removeAttribute("aria-invalid"); });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      form.querySelectorAll("input, select, textarea").forEach((f) => f.setAttribute("aria-invalid", String(!f.checkValidity())));
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form).entries());
      data.form = form.dataset.stForm;
      data.page = location.pathname;
      const btn = form.querySelector('button[type="submit"]');

      if (SYNCTADA_CONFIG.formEndpoint) {
        btn.disabled = true;
        status.className = "form-status";
        status.textContent = "Sending…";
        try {
          const res = await fetch(SYNCTADA_CONFIG.formEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.textContent = form.dataset.success || "Thanks! We'll be in touch shortly.";
        } catch (err) {
          status.className = "form-status error";
          status.innerHTML = `Something went wrong. Please email us at <a href="mailto:${SYNCTADA_CONFIG.contactEmail}">${SYNCTADA_CONFIG.contactEmail}</a>.`;
        } finally {
          btn.disabled = false;
        }
        return;
      }

      // Fallback: compose an email with the submitted details
      const subject = form.dataset.stForm === "demo" ? `Demo request: ${data.company || data.name || ""}` : `Website inquiry from ${data.name || ""}`;
      const body = Object.entries(data)
        .filter(([k, v]) => v && !["form", "page", "consent"].includes(k))
        .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
        .join("\n");
      window.location.href = `mailto:${SYNCTADA_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.className = "form-status";
      status.textContent = "Opening your email app to send your request…";
    });
  });
}

function initContactLinks() {
  document.querySelectorAll("[data-contact-email]").forEach((a) => {
    a.href = `mailto:${SYNCTADA_CONFIG.contactEmail}`;
    a.textContent = SYNCTADA_CONFIG.contactEmail;
  });
}

initChrome();
initNav();
initContactLinks();
initReveal();
initDataTada();
initFunnels();
initScheduler();
initForms();
