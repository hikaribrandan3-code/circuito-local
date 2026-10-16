# R&E Urban Style demo assets

- `/public/re-logo.svg`: clean vector wordmark recreated from the supplied shop sign; verify against the original brand artwork before final launch.
- `/public/re-icon.svg`: small browser mark.
- `/public/images/re-social.jpg`: 1200 × 630 white share card with R&E Urban Style, the collection categories, “Ventas minoristas y mayoristas” and “Ver tienda”.
- Storefront hero: existing folded-clothing composition with a taller mobile frame. The lookbook uses the supplied Instagram photographs; generated model options are not used in that carousel.
- Demo catalog: real supplied photos, sample product names/prices; no demo inventory is written to the backend. Demo cart confirmation never submits orders or opens WhatsApp.
- Metadata uses the public demo origin `https://circuito-local.vercel.app/`; update the origin if hosting elsewhere. The storefront uses the local sample catalog until `VITE_RE_STORE_OWNER_ID` is configured for the R&E backend owner. Verify R&E contact details before enabling real orders.

## Review checks

- Mobile and desktop layout reviewed in the browser.
- Category filtering, product details, add to cart, quantity totals, delivery selection and simulated checkout confirmation reviewed.
- Production Vite build passes. Edited files pass ESLint with two existing React Fast Refresh export warnings in the cart module.
- Whole-repository TypeScript checking still reports pre-existing generated-schema errors in admin tabs and unused legacy media components; the focused storefront TypeScript check passes. No backend migration was run.

## Share card art direction

Pure white 1200 × 630 card, centered black R&E Urban Style wordmark, categories, “Ventas minoristas y mayoristas”, and “Ver tienda →”. The entire social preview links to the storefront.

## Pitch polish verification — October 16, 2026

- Production build reviewed in Chrome at 360px, 393px and 1440px widths; no horizontal page overflow or browser exceptions.
- Footer lock opens the sample admin, including photo upload and saving a sample listing. No auth credentials are required for the demo.
- Category filtering, price sorting, size selection, separate cart size variants, cart refresh persistence, size merging and simulated checkout work.
- Page changes reset scroll. Reduced motion settings are respected.
- Admin and Supabase bundles are deferred from the initial demo homepage. Hero loads eagerly; below-fold photos load lazily.
- Demo prices, sizes and stock are illustrative. Demo checkout does not charge, submit orders or open WhatsApp.
