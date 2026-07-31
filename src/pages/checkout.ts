import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { COLORS, formatPrice, getProduct } from '../data/products'
import { cartSubtotal, clearCart, getCart } from '../cart'
import { mountShell, shopHref } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

function summaryHTML(): string {
  const lines = getCart()
  if (!lines.length) {
    return `<p style="color:var(--color-ink-muted)">Your bag is empty. <a href="${shopHref()}"><strong>Shop The Edit</strong></a></p>`
  }
  return `
    ${lines
      .map((line) => {
        const p = getProduct(line.productId)
        if (!p) return ''
        return `<div class="cart-line" style="grid-template-columns:3.5rem 1fr;border:none;padding:0.6rem 0">
          <div class="cart-line__swatch" style="--swatch:${COLORS[line.color].hex}"></div>
          <div>
            <div class="cart-line__title">${p.name}</div>
            <div class="cart-line__detail">${COLORS[line.color].name} · ${line.size} · ×${line.qty}</div>
            <div class="product-card__price">${formatPrice(p.mrp * line.qty)}</div>
          </div>
        </div>`
      })
      .join('')}
    <div class="cart-subtotal" style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--color-line)">
      <span>Subtotal</span><strong>${formatPrice(cartSubtotal())}</strong>
    </div>`
}

app.innerHTML = `<div data-page-content>
  <section class="container checkout fade-in">
    <div>
      <div class="section-head">
        <p class="eyebrow">Checkout</p>
        <h1 class="display">Almost there.</h1>
        <p class="lede">Prototype checkout — nothing is charged. Trust the flow; payments come later.</p>
      </div>
      <div class="notice" style="margin-bottom:1.5rem">Prototype mode · No payment gateway · Order will simulate confirmation only</div>
      <form data-checkout-form>
        <h2 style="font-size:var(--text-lg);margin-bottom:1rem">Contact</h2>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@email.com" autocomplete="email" />
        </div>
        <h2 style="font-size:var(--text-lg);margin:1.5rem 0 1rem">Shipping</h2>
        <div class="field-row">
          <div class="field">
            <label for="first">First name</label>
            <input id="first" name="first" required autocomplete="given-name" />
          </div>
          <div class="field">
            <label for="last">Last name</label>
            <input id="last" name="last" required autocomplete="family-name" />
          </div>
        </div>
        <div class="field">
          <label for="address">Address</label>
          <input id="address" name="address" required autocomplete="street-address" />
        </div>
        <div class="field-row">
          <div class="field">
            <label for="city">City</label>
            <input id="city" name="city" required autocomplete="address-level2" />
          </div>
          <div class="field">
            <label for="pin">PIN</label>
            <input id="pin" name="pin" required autocomplete="postal-code" />
          </div>
        </div>
        <h2 style="font-size:var(--text-lg);margin:1.5rem 0 1rem">Shipping method</h2>
        <div class="radio-stack" style="margin-bottom:1.5rem">
          <label class="radio-card">
            <input type="radio" name="shipping" value="standard" checked />
            <span><strong>Standard</strong><br /><span style="color:var(--color-ink-muted);font-size:0.875rem">4–6 days · Free over ₹2,999 (preview)</span></span>
          </label>
          <label class="radio-card">
            <input type="radio" name="shipping" value="express" />
            <span><strong>Express</strong><br /><span style="color:var(--color-ink-muted);font-size:0.875rem">2–3 days · ₹149 preview</span></span>
          </label>
        </div>
        <h2 style="font-size:var(--text-lg);margin:0 0 1rem">Payment</h2>
        <div class="field">
          <label for="card">Card number</label>
          <input id="card" name="card" inputmode="numeric" placeholder="•••• •••• •••• ••••" disabled />
        </div>
        <div class="field-row">
          <div class="field">
            <label for="exp">Expiry</label>
            <input id="exp" name="exp" placeholder="MM/YY" disabled />
          </div>
          <div class="field">
            <label for="cvc">CVC</label>
            <input id="cvc" name="cvc" placeholder="•••" disabled />
          </div>
        </div>
        <p class="notice" style="margin-bottom:1.5rem">Payment fields are disabled in this prototype.</p>
        <button class="btn btn--primary btn--block" type="submit" ${getCart().length ? '' : 'disabled'}>Place prototype order</button>
      </form>
    </div>
    <aside class="checkout-summary">
      <h2>Order summary</h2>
      <div data-summary>${summaryHTML()}</div>
    </aside>
  </section>
</div>`

mountShell(app)

document.querySelector('[data-checkout-form]')?.addEventListener('submit', (e) => {
  e.preventDefault()
  if (!getCart().length) return
  const form = e.target as HTMLFormElement
  const data = new FormData(form)
  const orderId = `RVL-${Date.now().toString().slice(-8)}`
  sessionStorage.setItem(
    'rivlet-last-order',
    JSON.stringify({
      orderId,
      email: data.get('email'),
      total: cartSubtotal(),
      lines: getCart(),
    }),
  )
  clearCart()
  window.location.href = '../confirmation/'
})

document.title = 'Checkout · Rivlet'
