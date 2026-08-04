# Rivlet Add-to-Bag Session - CRO Decision Report

**Purpose:** Compare the provided reference PDPs, apply conversion-rate and trust research, and document what Rivlet’s Add-to-Bag (ATC) session should include, what it should leave out, and why - so the approach can be verified before build.

**Scope:** Product PDP buy panel (primary) and Look PDP buy panel (same pattern, set-specific deltas).  
**Brand context:** Rivlet - lifestyle activewear that clears everyday friction (Midnight / Cardamom), feeling-first, climate-engineered platforms (AquaFlow™, SecondSkin™, NeutralCore™). Prototype ecommerce experience.

**Date:** 2 August 2026

---

## 1. Executive recommendation

Rivlet’s ATC session should follow a **tight decision funnel**, not a feature dump:

1. **Identity + proof** (what it is + why it’s credible)  
2. **Price clarity** (what it costs, tax honesty for India)  
3. **Configure** (colour → size, with fit help)  
4. **Commit** (one primary CTA; wishlist secondary)  
5. **Risk reversal** (shipping + returns next to the button)  
6. **Optional deepeners** below CTA (look / delivery accordion) - not inside the critical path

This matches what high-converting apparel PDPs share, while staying true to Rivlet’s calm, elite visual language (no screaming sale badges, no BNPL logos we don’t support, no cluttered multi-variant matrices).

---

## 2. What the references have in common

| Pattern | Seen in references | Why it converts |
|---|---|---|
| Title → social proof → price near top of buy column | Fabletics-style, Tommie Copper, Knix, Nike, Alo | Shopper confirms “right product, others bought it, I can afford it” before configuring |
| Colour before size | Nearly all | Colour changes imagery; size is the final gate |
| Size guide **adjacent** to size grid | Nike, Alo, Fabletics, PUMA | Fit anxiety is the #1 apparel hesitation after price |
| Full-width primary CTA | All | Thumb reach + visual weight = commitment |
| Trust line **immediately under CTA** | Shipping + returns on almost every reference | Answers “what if I’m wrong?” at the decision point |
| Secondary action after primary | Wishlist / Save | Captures intent without competing with ATC |
| Dynamic CTA label when size missing | Knix (“SELECT SIZE”) | Prevents dead clicks and teaches the next step |

### Pattern that differs by brand maturity

| Pattern | Mass / promo DTC | Editorial / Nike-like | Rivlet fit |
|---|---|---|---|
| Installments (Shop Pay / Afterpay) | Common | Sometimes | **Defer** - no live BNPL partner in prototype |
| Length / pocket / band-cup matrices | Category-specific | Rare for basics | **Only if SKU needs it** (e.g. bra later) |
| Sale colour groups + % OFF badges | High | Low | **Out** for Drop 1 brand tone |
| Rewards / XP / points | Loyalty brands | Optional | **Light copy only** if Circle exists; no fake XP |
| Pincode checker | India marketplaces | Rare on global DTC | **Optional later** for India ops realism |
| Sticky mobile ATC | Strong CRO practice | Strong | **Yes - include** |

---

## 3. CRO research distilled (external)

Sources informing this plan (placement > decoration): - **Baymard / PDP UX:** Many sites still fail basic PDP clarity; size help and shipping/returns near purchase matter. ~60% of users look for return policy on the PDP. - **Trust placement frameworks (2024–2026):** Reviews under title; returns/guarantee **beside ATC**; payment security badges belong in **checkout**, not littering the PDP. - **Sticky mobile CTA + photo reviews:** Practitioners commonly report meaningful ATC lifts when the buy action stays reachable and proof is visible without leaving the page. - **Caution on magic numbers:** Single trust-badge A/B lifts are often small; large vendor-reported lifts are context-specific. Prefer a **coherent package** over badge stacking.

**Implication for Rivlet:** Prefer fewer, true, product-specific signals over a wall of logos.

---

## 4. Reference-by-reference scorecard

### A. High-volume activewear (length/pocket/colour matrix)

**Strengths** - Star rating + review count above fold - Benefit highlight strip (“Fit, Compression, Support”) - Size measurements under selected size (waist/hips) - Dominant ATC - Free shipping / free returns under CTA  

**Weaknesses for Rivlet** - Variant overload (length × pocket × many colour tiers) increases cognitive load - Promo floater (“20% OFF”) fights a calm lifestyle position - BNPL line requires a real partner  

**Take for Rivlet:** Review row, benefit chips, size-adjacent guidance, post-CTA logistics.  
**Leave:** Multi-axis variant matrix, floating discount badge, Shop Pay.

---

### B. Performance undershirt (guarantee + coral CTA)

**Strengths** - Reviews + **product-specific guarantee** next to rating - Clear colour label (“COLOR: BLACK”) - Size OOS shown with strikethrough (honest inventory) - Shipping + risk-free returns under CTA  

**Weaknesses for Rivlet** - Loud coral CTA fights Rivlet navy/canvas system - Guarantee must be real; inventing “sweat proof guarantee” without policy is worse than silence  

**Take:** Product-specific trust line (platform outcome), honest size states later, logistics under CTA.  
**Leave:** Off-brand CTA colour; unverifiable guarantee claims.

---

### C. Knix-like intimates (benefit checklist + gated CTA)

**Strengths** - Rating above title - Benefit checklist with checks under price - “True to size” + Size Guide - CTA disabled until size → label becomes instructional - Shipping / returns under CTA - Soft upsell (sets / rewards) below  

**Weaknesses for Rivlet** - Band/cup sizing UI only when we sell that complexity - Soft peach promo chips feel retail-promo, not Rivlet editorial  

**Take:** Benefit bullets (from `benefitChip` / problems), gated ATC copy, size guide link, logistics.  
**Leave:** Bra size machine until SKU requires it; promo peach boxes.

---

### D. Editorial street / athletic (NEW tag, square colour thumbs, rewards box)

**Strengths** - Colour as product thumbnails (better than dots when imagery differs) - Size guide with icon next to “Select a size” - Huge black ATC - Post-CTA box: rewards + delivery + express  

**Weaknesses for Rivlet** - Fake XP/rewards without a live program erodes trust - Share button is low priority for MVP  

**Take:** Thumbnail colour swatches (Midnight / Cardamom product crops), size-guide placement, post-CTA info box.  
**Leave:** XP gamification; share icon in v1.

---

### E. “Get the Look” cross-sell block

**Strengths** - After ATC decision, offer the pairing with thumbs - Clear “2 products” framing  

**Take for Rivlet:** Strong - we already have Looks / `setWith`. Place **Get the look** *below* ATC trust strip, not above the button.  
**Leave:** Making look upsell a second primary CTA that competes with Add to bag.

---

### F. Marketplace / India (PUMA / Nike India / Nykaa-style)

**Strengths** - Strike price + GST / tax honesty - Model wearing size line - Heart + ATC row - Free shipping / returns under CTA - Pincode, vendor, returns accordion for India trust  

**Weaknesses for Rivlet** - Aggressive red sale treatment conflicts with Drop 1 brand - Vendor/manufacturer accordion is marketplace DNA; Rivlet is D2C brand storytelling - Pincode is ops-heavy for a prototype  

**Take:** “Inclusive of taxes” (or clear GST note), model/fit note, wishlist beside or under ATC, returns clarity.  
**Leave:** Sale-red price theatre; marketplace vendor blocks in the ATC column; pincode until logistics are real.

---

### G. Editorial legging (Alo-like)

**Strengths** - Fit sentence + size guide above grid - Dual CTAs: Add to bag / Add to wishlist - Complimentary shipping & free returns under buttons - Shop the Look section below  

**Take:** Closest editorial pattern to Rivlet. Mirror hierarchy and calm density.  
**Leave:** Very high price framing that doesn’t match INR reality; tax-excluded language if we sell India-first (prefer inclusive).

---

## 5. Rivlet ATC session - planned structure

### 5.1 Recommended order (buy column)

```
[1] Platform · Role (eyebrow)
[2] Product name (H1)
[3] ★ rating · N reviews  →  jumps to #reviews
[4] Price (INR) + “Inclusive of taxes”
[5] 3 benefit bullets (feeling outcomes - not fabric jargon first)
[6] Colour: label + 2 thumbnail swatches (Midnight / Cardamom)
[7] Size: “Select size” + Size guide link
    Size grid (XS–2XL)
    Fit note (true-to-size · South-Asian block · optional model line)
[8] PRIMARY: Add to bag   (disabled → “Select a size”)
[9] SECONDARY: Save for later (wishlist)
[10] Trust row under CTA:
     · Easy exchanges (prototype-accurate policy)
     · Free / threshold shipping line (honest for prototype)
     · Platform engineered micro-line
[11] Optional: Get the look (1–2 pieces) - only if setWith / look exists
[12] Optional accordion below column or in story rail:
     Delivery & returns · Care · Size & fit detail
```

### 5.2 Mobile-specific

| Element | Decision | Why |
|---|---|---|
| Sticky ATC bar when buy panel leaves viewport | **Include** | Keeps commit action reachable (strong mobile CRO pattern) |
| Sticky % OFF floater | **Exclude** | Off-brand; trains discount hunting |
| Quantity stepper on PDP | **Exclude for Drop 1** | Apparel default qty=1; qty lives in bag (reduces clutter) |
| Buy Now second primary | **Exclude** | Two equal blacks dilute ATC; checkout is one step after bag |

### 5.3 Look PDP deltas

Same skeleton, with: - Title = look name; meta = Top + Bottom - Price = combined look total - “Size · both pieces” - CTA = **Add look to bag** - Get the look replaced by **In this look** piece links (already on look PDP) - Trust: “Both pieces · one bag add”

---

## 6. Include / exclude matrix (verification table)

### INCLUDE - required for Rivlet ATC

| Element | Why include | Source of truth in Rivlet |
|---|---|---|
| Platform + role eyebrow | Differentiates tech without screaming features | `product.platform`, `product.role` |
| Clear product title | Instant identification | `product.name` |
| Star rating + review count under title | Highest-leverage PDP trust signal when reviews exist | Aggregate from `REVIEWS` (prototype); link to `#reviews` |
| Price in INR, large | Decision fuel | `product.mrp` + `formatPrice` |
| Tax honesty line | India shopper expectation; reduces checkout shock | Static: “Inclusive of taxes” |
| 3 short benefit bullets | Outcome-first selling (Rivlet brand) | `benefitChip`, top `problems[].title`, `heroFeature` |
| Colour swatches with selected name | Variant clarity; prefer small product thumbs over bare dots | `COLORS`, product images |
| Size grid + Size guide link | Fit anxiety reduction | `product.sizes`; guide modal/page to add |
| Fit note under sizes | South-Asian block is a brand moat | `fitNotes` / cup-inclusive flag |
| Primary Add to bag | Conversion action | Existing ATC |
| CTA gated until size + label change | Prevents failed adds; teaches next step | Knix pattern |
| Wishlist secondary | Intent capture | Existing wishlist |
| Shipping + returns under CTA | Risk reversal at decision point | Prototype-honest copy |
| Get the look / complete the set (below trust) | AOV without blocking ATC | `setWith`, Looks |
| Sticky mobile ATC | Mobile conversion hygiene | New behaviour |

### EXCLUDE - intentionally left out of Rivlet ATC

| Element | Why leave out | When to reconsider |
|---|---|---|
| Shop Pay / Afterpay / EMI lines | No integrated BNPL; fake trust is anti-trust | When a real partner ships |
| Floating “20% OFF” badge | Trains discount behaviour; fights calm lifestyle tone | Flash sale campaigns only |
| Length × pocket × print/sale colour groups | Drop 1 SKUs are simple 2-colour / one silhouette | New SKU architecture |
| Band / cup dual dropdowns | Not needed for current bra UX in prototype | True multi-dim bra sizing |
| Coral/red loud CTA | Breaks Rivlet navy system | Never for brand UI; sale landing pages only |
| Rewards XP / “320 points” without program | Fabricated loyalty destroys credibility | When The Circle has real points |
| Share button in ATC | Low conversion impact | Social campaign moments |
| Quantity on PDP | Extra control before need | Multi-pack SKUs |
| Buy Now + payment icon stack | Competes with Add to bag; checkout owns payments | Express checkout experiments |
| Marketplace vendor / manufacturer accordion in buy column | Wrong mental model for D2C brand | Compliance footer / separate policy page |
| Pincode delivery checker | Ops not wired; empty promise | When warehouse SLA exists |
| Sale strike-through as default | Drop 1 is full-price brand story | Genuine markdown events |
| Security badge cluster on PDP | Belongs at payment step | Checkout page |
| Multiple equal CTAs (Add set + Add bag + Buy now) | Decision paralysis | One contextual secondary max |

### KEEP BELOW THE FOLD (not inside ATC critical path)

| Element | Placement | Why not in ATC stack |
|---|---|---|
| Long fabric story / tech lists | Story rail | Proof after intent; don’t delay configure |
| Full review wall | `#reviews` section | Summary in ATC; depth below |
| Care & maintenance | Accordion | Post-decision detail |
| Press / brand manifesto | Stories / home | Brand, not SKU conversion |

---

## 7. Copy system (prototype-honest)

Rivlet must not invent policies. Use **true prototype language**:

| Slot | Recommended copy |
|---|---|
| Reviews | `★★★★★ · {n} reviews` → scroll to reviews (use real `REVIEWS.length` or a stated prototype average) |
| Tax | `Inclusive of taxes` |
| Fit | `Fits true to size · South-Asian block · XS–2XL` |
| CTA empty | `Select a size` |
| CTA ready | `Add to bag` / Look: `Add look to bag` |
| Trust 1 | `Easy exchanges · prototype preview` (until live policy) |
| Trust 2 | `Ships when Drop 1 fulfils` **or** omit free-shipping claim until true |
| Trust 3 | `{platform} engineered` / `No patch · no smell · no rub` style outcome |
| Wishlist | `Save for later` / `Saved` |

**Rule:** If a shipping threshold or free-return window is not operationally true, **do not** copy Nike/Alo’s “Complimentary Shipping Over ₹X” verbatim. Prefer a softer, accurate line or a single “Delivery & returns” link.

---

## 8. Visual / UX rules for the ATC session

1. **One primary button** - navy/black fill, full width, high contrast.  
2. **Secondary** - ghost/outline wishlist; never equal weight.  
3. **No cards inside the hero/gallery**; buy column may use a light bordered trust box *under* CTA (interaction container), not decorative card clutter.  
4. **Colour = image thumbs** when assets exist; dots only as fallback.  
5. **Size cells** large enough for touch (≥44px).  
6. **Desktop:** sticky buy column (already patterned). **Mobile:** sticky ATC bar after scroll.  
7. **Motion:** subtle CTA enable transition; avoid glow/pill spam.

---

## 9. Look PDP alignment

| Product PDP | Look PDP |
|---|---|
| Add to bag | Add look to bag |
| Colour for one SKU | Colour for both pieces |
| Size for one SKU | Size · both pieces |
| Get the look | In this look (piece PDPs) |
| Complete the set grid | More looks grid |

Same trust placement rules apply so shoppers learn one mental model.

---

## 10. Current Rivlet gap (as of this report)

Existing `pdp-buy` already has: platform eyebrow, title, price, feeling line, colour dots, size grid, fit note, Add to bag (disabled without size), wishlist, trust strip, optional add co-ord.

**Missing vs this plan** - Review summary under title - Explicit tax line - Structured 3 benefit bullets (vs long feeling paragraph only) - Size Guide link - Dynamic CTA label (“Select a size”) - Colour thumbnail swatches - Clean post-CTA logistics pair (shipping / returns) instead of mixed trust list only - Get the look block under ATC - Sticky mobile ATC - Honest shipping copy audit  

This report is the checklist for the upcoming ATC redesign.

---

## 11. Success criteria (how we’ll know it worked)

**Qualitative (prototype)** - Shopper can configure and add without scrolling hunting for size help or returns - No false BNPL / fake discount / fake XP - Brand still reads as Rivlet if nav is removed (calm, navy, feeling-first)

**Quantitative (when analytics exist)** - ATC rate on PDP - Size-selector interaction rate before ATC - Wishlist rate - Look attach rate from Get the look - Mobile sticky ATC click share  

Test packages, not single badges: e.g. “ATC package v1” vs current buy column.

---

## 12. Final decision summary

| Approach | Decision |
|---|---|
| Follow Knix/Alo hierarchy (proof → price → configure → CTA → risk reverse) | **Yes** |
| Follow Fabletics variant depth and promo floaters | **No** |
| Follow marketplace pincode/vendor density | **No** (policy page later) |
| Follow BNPL lines without partner | **No** |
| Follow Get the look under CTA | **Yes** |
| Sticky mobile ATC | **Yes** |
| Calm editorial UI (Rivlet tokens) | **Yes** |

**One-line strategy:**  
*Make the Rivlet ATC session answer identity, proof, price, fit, commit, and risk - in that order - and refuse every reference pattern that adds friction, fake trust, or discount theatre.*

---

## 13. Approval checklist (for you) - [ ] Agree INCLUDE list for Product PDP - [ ] Agree INCLUDE list for Look PDP deltas - [ ] Confirm shipping/returns copy that is operationally honest for the prototype - [ ] Confirm whether Size Guide is modal vs `/stories/#fit` link for v1 - [ ] Confirm review summary uses real `REVIEWS` aggregate vs static prototype stars - [ ] Greenlight sticky mobile ATC - [ ] Explicitly reject BNPL / %OFF floater / XP for Drop 1  

Once checked, implementation can follow this report as the single source of truth.
