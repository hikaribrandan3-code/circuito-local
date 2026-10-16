# R&E Urban Style demo assets

- `/public/re-logo.svg`: clean vector wordmark recreated from the supplied shop sign; verify against the original brand artwork before final launch.
- `/public/re-icon.svg`: small browser mark.
- `/public/images/re-social.jpg`: 1200 × 630 social image generated with the built-in imagegen tool, using the supplied sign and blue T-shirt photo as references.
- Prompt: wide minimal urban fashion social cover; exact text R&E / URBAN STYLE; black typography with warm gold edge, pale frosted glass layers and a real blue graphic T-shirt from the shop. No slogans, prices or mock interface.
- Demo catalog: real supplied photos, sample product names/prices; no demo inventory is written to the backend. Demo cart confirmation never submits orders or opens WhatsApp.
- Public publishing is still required to share beyond the local Wi-Fi. Metadata is prepared for the repository demo domain `https://circuito-local.vercel.app/`; update the origin if hosting elsewhere. The storefront uses the local sample catalog until `VITE_RE_STORE_OWNER_ID` is configured for the R&E backend owner. Verify R&E contact details before enabling real orders.

## Review checks

- Mobile and desktop layout reviewed in the browser.
- Category filtering, product details, add to cart, quantity totals, delivery selection and simulated checkout confirmation reviewed.
- ESLint passes for the edited storefront files.
- Whole-repository TypeScript checking still reports pre-existing generated-schema errors in admin tabs and unused legacy media components; the focused storefront TypeScript check passes. No backend migration was run.

## Image generation prompt

Create a refined wide landscape social sharing cover for the real clothing store R&E Urban Style. Use the first reference as the brand sign: accurately render the exact text 'R&E' very large in bold geometric sans serif, a small 'URBAN STYLE' beneath, no wall, no wires. Use the second reference as supporting actual clothing imagery, preserve the blue graphic T-shirt and in-store authenticity. Editorial modern urban fashion commerce branding. Warm off-white and pale grey background with subtle frosted glass panel layering, black type, restrained warm champagne gold accent inspired by the shop sign. Composition: spacious left half for the R&E URBAN STYLE wordmark, right half a tasteful cropped photographic panel of the real clothing reference. High-end minimal, tactile paper and glass, plenty of breathing room. Only text: 'R&E' and 'URBAN STYLE'. No slogans, prices, phones, fake interface, browser chrome or invented products. Landscape 1.91:1 format suitable for Open Graph sharing, legible as a small WhatsApp preview.
