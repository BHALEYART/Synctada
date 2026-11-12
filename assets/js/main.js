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

const ICON_CARET = '<svg class="caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
const ARROW = '<span class="arrow" aria-hidden="true">&rarr;</span>';

const LOGO_MARK = `
<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
  <rect x="0.5" y="0.5" width="31" height="31" rx="9" fill="#2B3856" stroke="rgba(255,255,255,0.22)"/>
  <path d="M9 13.2a7.2 7.2 0 0 1 12.6-3.4" fill="none" stroke="#3DED97" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M21.9 6.6l-.1 3.6-3.5-.5" fill="none" stroke="#3DED97" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M23 18.8a7.2 7.2 0 0 1-12.6 3.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>
  <path d="M10.1 25.4l.1-3.6 3.5.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
  <path d="M16 12.6l.9 2.5 2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9z" fill="#3DED97"/>
</svg>`;

const BRAND = `<a class="brand" href="/" aria-label="SyncTada home">${LOGO_MARK}<span class="brand-word">Sync<span>Tada</span></span></a>`;

function headerHTML() {
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="container nav">
    ${BRAND}
    <ul class="nav-links" id="nav-links">
      <li class="has-dropdown" data-section="platform">
        <button type="button" aria-expanded="false">Platform ${ICON_CARET}</button>
        <div class="dropdown">
          <a href="/platform/"><strong>Platform overview</strong><span>How the software fits together</span></a>
          <a href="/platform/#attribution"><strong>Attribution &amp; measurement</strong><span>Connect campaigns to customers and revenue</span></a>
          <a href="/platform/#tracking"><strong>Tracking &amp; data sync</strong><span>CRM, ad platforms, server-side events</span></a>
          <a href="/platform/#optimization"><strong>Optimization &amp; insights</strong><span>Better signals, smarter recommendations</span></a>
          <a href="/platform/#reporting"><strong>Dashboards &amp; reporting</strong><span>White-label, client-ready results</span></a>
        </div>
      </li>
      <li><a href="/services/" data-section="services">Services</a></li>
      <li class="has-dropdown" data-section="solutions">
        <button type="button" aria-expanded="false">Solutions ${ICON_CARET}</button>
        <div class="dropdown">
          <a href="/solutions/agencies/"><strong>Agencies</strong><span>Prove it. Improve it. Retain them.</span></a>
          <a href="/solutions/marketers/"><strong>Marketing professionals</strong><span>In-house and independent marketers</span></a>
          <a href="/solutions/business-owners/"><strong>Business owners</strong><span>See what your marketing produces</span></a>
        </div>
      </li>
      <li><a href="/how-it-works/" data-section="how-it-works">How It Works</a></li>
      <li><a href="/contact/" data-section="contact">Contact</a></li>
    </ul>
    <div class="nav-cta">
      <a class="btn btn-primary btn-sm" href="/book-demo/">Book a Demo</a>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>`;
}

function footerHTML() {
  const year = new Date().getFullYear();
  return `
  <div class="container">
    <div class="footer-grid">
      <div>
        ${BRAND}
        <p class="footer-tag"><strong>From Data to Tada!</strong><br>Marketing attribution, optimization and white-label reporting, backed by a hands-on team.</p>
        <a class="btn btn-primary btn-sm" href="/book-demo/">Book a Demo ${ARROW}</a>
      </div>
      <div>
        <h4>Platform</h4>
        <ul>
          <li><a href="/platform/#attribution">Attribution</a></li>
          <li><a href="/platform/#tracking">Tracking &amp; data sync</a></li>
          <li><a href="/platform/#optimization">Optimization</a></li>
          <li><a href="/platform/#reporting">White-label reporting</a></li>
          <li><a href="/services/">Hands-on services</a></li>
        </ul>
      </div>
      <div>
        <h4>Solutions</h4>
        <ul>
          <li><a href="/solutions/agencies/">Agencies</a></li>
          <li><a href="/solutions/marketers/">Marketing professionals</a></li>
          <li><a href="/solutions/business-owners/">Business owners</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/how-it-works/">How it works</a></li>
          <li><a href="/book-demo/">Book a demo</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/privacy/">Privacy</a></li>
          <li><a href="/terms/">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${year} SyncTada. All rights reserved.</span>
      <span>Powerful software. Hands-on experts. An extension of your team.</span>
    </div>
  </div>`;
}

function mountChrome() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) { header.className = "site-header"; header.innerHTML = headerHTML(); }
  if (footer) { footer.className = "site-footer"; footer.innerHTML = footerHTML(); }

  // Mobile sticky CTA (skipped on the booking page itself)
  if (!document.body.dataset.page || document.body.dataset.page !== "book-demo") {
    const m = document.createElement("div");
    m.className = "mobile-cta";
    m.innerHTML = `<a class="btn btn-primary" href="/book-demo/">Book a Demo ${ARROW}</a>`;
    document.body.appendChild(m);
    const onScroll = () => m.classList.toggle("show", window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Active nav state
  const page = document.body.dataset.section;
  if (page && header) {
    header.querySelectorAll("[data-section]").forEach((el) => {
      if (el.dataset.section !== page) return;
      if (el.tagName === "A") el.setAttribute("aria-current", "page");
      else el.classList.add("is-active");
    });
  }
}

function initNav() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const toggle = header.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
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
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      header.querySelectorAll(".has-dropdown.open").forEach((o) => o.classList.remove("open"));
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      header.classList.remove("menu-open");
      header.querySelectorAll(".has-dropdown.open").forEach((o) => o.classList.remove("open"));
    }
  });
  // Close mobile menu after following an in-page link
  header.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => header.classList.remove("menu-open")));
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

/* DATA -> TADA: the same four letters, rearranged. */
function initDataTada() {
  document.querySelectorAll(".datatada").forEach((wrap) => {
    const tiles = [...wrap.querySelectorAll(".tile")]; // D A T A
    if (tiles.length !== 4) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.classList.add("is-tada");
      tiles[0].textContent = "T"; tiles[2].textContent = "D";
      return;
    }
    const swap = () => {
      // Swap positions of D (0) and T (2)
      const w = tiles[0].getBoundingClientRect().width + 3;
      const tada = wrap.classList.contains("is-tada");
      tiles[0].style.transform = tada ? "" : `translateX(${w * 2}px)`;
      tiles[2].style.transform = tada ? "" : `translateX(${-w * 2}px)`;
      wrap.classList.toggle("is-tada");
    };
    setTimeout(swap, 1200);
    setInterval(swap, 4200);
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
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
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

mountChrome();
initNav();
initContactLinks();
initReveal();
initDataTada();
initFunnels();
initScheduler();
initForms();
