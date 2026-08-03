import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { formatPrice } from '../data/products'
import { mountShell, shopHref } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

interface LastOrder {
  orderId: string
  email: string
  total: number
}

let order: LastOrder | null = null
try {
  order = JSON.parse(sessionStorage.getItem('rivlet-last-order') || 'null') as LastOrder | null
} catch {
  order = null
}

app.innerHTML = `<div data-page-content>
  <section class="container confirm fade-in">
    <p class="eyebrow">Order confirmed</p>
    <h1>You’re in the river.</h1>
    <p class="lede" style="text-align:center">Thank you - your Rivlet is on its way. A confirmation email is on its way too.</p>
    ${
      order
        ? `<div class="order-pill">${order.orderId}</div>
           <p style="color:var(--color-ink-muted)">Confirmation sent to <strong>${order.email}</strong> · ${formatPrice(order.total)}</p>`
        : `<p style="color:var(--color-ink-muted)">No recent order found. Continue shopping when you’re ready.</p>`
    }
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center">
      <a class="btn btn--primary" href="${shopHref()}">Continue shopping</a>
      <a class="btn btn--ghost" href="../">Back home</a>
    </div>
  </section>
</div>`

mountShell(app)
document.title = 'Confirmation · Rivlet'
