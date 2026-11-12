# SyncTada — synctada.com

**From Data to Tada!** Marketing site for SyncTada, the attribution, optimization and white-label reporting platform (SaaS side of Gr8 Hook).

Plain static HTML/CSS/JS, no build step. Each page is its own folder with an `index.html`.

```
/                            Homepage
/platform/                   Attribution, tracking & sync, optimization, reporting
/services/                   Hands-on service + responsibilities table
/solutions/agencies/         Lead-gen agency positioning
/solutions/marketers/        In-house & independent marketers
/solutions/business-owners/
/how-it-works/               Demo -> free audit -> playbook -> implementation
/book-demo/                  Demo request form (+ optional scheduler embed)
/contact/ /privacy/ /terms/  404.html
assets/css/styles.css        Design system (navy #2B3856, mint #3DED97)
assets/js/main.js            Shared header/footer, nav, forms, animations
```

Header and footer are injected by `assets/js/main.js`, so nav changes happen in one place.

## Before launch

Edit `SYNCTADA_CONFIG` at the top of `assets/js/main.js`:

- `formEndpoint`: URL that receives form submissions as JSON (Formspree, a Vercel function, a GoHighLevel webhook). Until set, forms open the visitor's email app addressed to `contactEmail`.
- `contactEmail`: confirm the mailbox exists (currently `hello@synctada.com`).
- `schedulerUrl`: a booking page (GHL calendar, Calendly, Cal.com) to embed above the demo form.

Also confirm integration availability (GoHighLevel/HubSpot, Meta/Google), demo duration and white-label scope, and have Privacy/Terms reviewed. Dashboard mockups are labeled **Illustrative**; swap in real screenshots when available.

## Local preview

    python3 -m http.server 8080
