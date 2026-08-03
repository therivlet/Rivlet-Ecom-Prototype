# Rivlet footer + production-looking ecommerce shell

Plan snapshot stored in-repo for reference. Source of truth for execution was the Cursor plan `rivlet_footer_redesign`.

## Guiding rule

| Layer | Behavior |
| --- | --- |
| Visual UI | Live ecommerce chrome (footer completeness, payment logos, checkout methods) |
| Internal ops | No gateway, simulated place-order, stub pages, localStorage |

## Circle

Home owns The Circle at `#community`. Footer links to it; no second email form.

## Footer IA

Shop · Help & tools · About Rivlet · Policies · Social icons · Payment trust (visual) · Legal bottom bar.

## Checkout

UPI / Cards / Netbanking / COD UI; submit still simulated.

## Docs

See [rivlet-footer-competitive-spec.md](../reports/rivlet-footer-competitive-spec.md).
