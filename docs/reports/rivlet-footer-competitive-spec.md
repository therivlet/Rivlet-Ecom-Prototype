# Rivlet footer competitive specification

Research and implementation spec for a production-looking Rivlet ecommerce footer. Internal behavior remains prototype (no payment gateway); customer UI must read as a live store.

## 1. Guiding rule: visual vs prototype

| Layer | Behavior |
| --- | --- |
| Visual UI | Full ecommerce footer, payment logos, checkout method chooser; no “prototype / not charged” copy in chrome |
| Internal ops | No gateway, localStorage cart/Circle, stub content pages, simulated place-order |

Developer notes live only in `docs/`.

## 2. Competitor field matrix

| Field / pattern | Senses | BreatheWear | Lulu | Fanka | Thompson | TURMS | Knix | Gymshark | Blissclub | Puma | ALO | Rivlet (before) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shop / browse links | Partial | Yes | Indirect | Yes | Yes | Partial | Partial | Partial | Partial | SEO heavy | Yes | Yes (thin) |
| Help / FAQ / returns | Partial | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No |
| Size guide / tools | No | No | Yes | Yes | No | Wash care | Yes | Yes | No | Partial | Yes | No |
| About / story | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Thin |
| Blog / editorial | No | No | Media | Press | Blog | Blog | Blog | Blog | No | Articles | Blog | No |
| Policies (privacy/terms) | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No |
| Newsletter / community | Club | Yes | Yes | Yes | Yes | Yes | Yes | Email tile | No | Social only | Yes | Home Circle only |
| Social icons | Yes | IG | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No |
| WhatsApp / India contact | Yes | Email | WA+chat | Email | No | Chat/call | No | No | WA | Phone | No | Email text only |
| Payment trust icons | No | No | No | Yes | Yes | No | No | Yes | No | Yes | No | No |
| Legal bottom bar | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Weak (“Prototype experience”) |

## 3. Gap vs Rivlet before this work

Missing vs must-have: Help/Tools, FAQ, policies, size guide entry, track order, blog, social icons, payment trust strip, production legal bar.  
Over-thin: Shop/Situations/Brand only.  
Risk: Duplicating home **The Circle** signup in the footer (competitors do newsletter in footer; Rivlet already has a brand ritual on home).

## 4. Circle de-duplication rule

Home owns The Circle at `#community` (`final-cta` + `community-join`, `localStorage` key `rivlet-community-email`).

Footer must:
- Link **The Circle** → home `#community` (path-aware)
- Not render a second email capture form
- Optionally acknowledge joined state later without a form

## 5. Rivlet positioning (stand-out without link farm)

- Keep **ocean-band** navy (brand continuity with Circle / Stories standards)
- Motto + craft lede as hero of footer brand column
- Situation + platform language in Shop/About
- India-first WhatsApp + email
- Editorial restraint: 4 link columns, not 6-column SEO walls
- Payment logos as quiet trust, not a promo wall

## 6. Content inventory + link map

### Shop
- Collection → `/shop/`
- Looks → `/sets/`
- Tops / Bottoms → `/shop/?form=`
- Gym, Yoga, Office, Travel, Summer → `/shop/?situation=`

### Help & tools
- Size guide → opens size guide modal when shell can; else `/faq/#size`
- FAQs → `/faq/`
- Shipping → `/shipping/`
- Returns & exchanges → `/returns/`
- Track order → `/track/`
- Contact / WhatsApp → `/contact/` + `wa.me` link
- Account → `/account/`

### About Rivlet
- Our story → `/about/`
- Fabric platforms → `/stories/`
- The Circle → `/#community` (path-aware)
- Customer voices → `/#` reviews on home or `/about/#voices`
- Blog → `/blog/`
- Studio Madurai → `/about/#studio`

### Policies
- Privacy → `/privacy/`
- Terms → `/terms/`
- Shipping policy → `/shipping/`
- Returns policy → `/returns/`

### Social (external)
- Instagram, YouTube, LinkedIn, WhatsApp — real brand URLs where known; placeholders with `aria-label` if not

### Payment trust (decorative)
- UPI, Visa, Mastercard, RuPay, Netbanking — non-interactive

### Bottom
- © year Rivlet · Privacy · Terms · India → UK → UAE · therivlet.com

## 7. Layout / motion / a11y

**Desktop:** Brand column + 4 link columns; social row; payment strip; legal bar.  
**Mobile:** Brand stack; 2×2 link columns; social + payment wrap; legal wrap.  
**Motion:** Link color hover only; respect `prefers-reduced-motion`.  
**A11y:** Named social links, focus rings, contrast on ocean band, decorative payment marks `aria-hidden`.

## 8. Checkout visual policy

UI shows UPI / Cards / Netbanking / COD. Submit remains client-side simulate → confirmation. No gateway keys. Docs record the mock.

## 9. Validation matrix

1. IA completeness — must-haves present; no AOV/sales jargon  
2. Circle de-dupe — no second signup; Circle → `#community`  
3. Production chrome — no prototype leakage in footer/cart/checkout/confirmation primary copy  
4. Payment visual — logos + chooser; no real charge  
5. Link integrity — stub or real routes resolve  
6. Mobile — no overflow; readable grids  
7. Desktop — ocean composition intact  
8. A11y — labels and focus  
9. Cross-page — `renderFooter()` shared  
10. Regression — mega menu, sticky ATC, look grids unchanged  

## 10. Implementation checklist

- [x] Spec stored in repo  
- [ ] `renderFooter()` rebuild  
- [ ] Footer CSS + icons  
- [ ] Stub pages + Vite entries  
- [ ] Checkout/cart/confirmation visual polish  
- [ ] Validation pass
