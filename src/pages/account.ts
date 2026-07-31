import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import {
  getProfile,
  isLoggedIn,
  login,
  logout,
  updateProfile,
} from '../auth'
import { wishlistCount } from '../wishlist'
import { cartCount } from '../cart'
import { mountShell, shopHref, initPageMotion } from '../ui/shell'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

app.innerHTML = `<div data-page-content></div>`
mountShell(app)

const content = document.querySelector('[data-page-content]')
if (!content) throw new Error('content missing')

function paint() {
  const loggedIn = isLoggedIn()
  const profile = getProfile()

  if (!loggedIn) {
    content!.innerHTML = `
      <section class="section account">
        <div class="container account__shell">
          <div class="section-head">
            <p class="eyebrow">Account</p>
            <h1 class="display">Welcome back.</h1>
            <p class="lede">Sign in to keep your saved pieces and preferences with you. Guest wishlist stays on this device until you do.</p>
          </div>
          <form class="account-card" data-login-form id="signin">
            <div class="field">
              <label for="login-email">Email</label>
              <input id="login-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com" />
            </div>
            <div class="field">
              <label for="login-password">Password</label>
              <input id="login-password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••" minlength="4" />
            </div>
            <div class="field">
              <label for="login-name">Name <span class="field-hint">(optional)</span></label>
              <input id="login-name" name="name" type="text" autocomplete="name" placeholder="How should we address you?" />
            </div>
            <p class="account-note" data-login-error hidden></p>
            <button class="btn btn--primary btn--block" type="submit">Sign in</button>
            <p class="account-note">Prototype access — any valid email and a short password works.</p>
          </form>
        </div>
      </section>`

    content!.querySelector('[data-login-form]')?.addEventListener('submit', (e) => {
      e.preventDefault()
      const form = e.target as HTMLFormElement
      const fd = new FormData(form)
      const result = login(
        String(fd.get('email') || ''),
        String(fd.get('password') || ''),
        String(fd.get('name') || '') || undefined,
      )
      const err = content!.querySelector<HTMLElement>('[data-login-error]')
      if (!result.ok) {
        if (err) {
          err.hidden = false
          err.textContent = result.error
        }
        return
      }
      window.location.reload()
    })
  } else {
    content!.innerHTML = `
      <section class="section account">
        <div class="container account__shell">
          <div class="section-head">
            <p class="eyebrow">Account</p>
            <h1 class="display">Hello, ${profile.name.split(' ')[0] || 'there'}.</h1>
            <p class="lede">Your Rivlet profile — calm, minimal, and ready when you are.</p>
          </div>

          <div class="account-stats">
            <div class="account-stat">
              <span class="eyebrow">Saved</span>
              <strong>${wishlistCount()}</strong>
              <button type="button" class="text-link" data-open-wish>View saved</button>
            </div>
            <div class="account-stat">
              <span class="eyebrow">Bag</span>
              <strong>${cartCount()}</strong>
              <button type="button" class="text-link" data-open-bag>Open bag</button>
            </div>
            <div class="account-stat">
              <span class="eyebrow">Shop</span>
              <strong>Collection</strong>
              <a class="text-link" href="${shopHref()}">Browse</a>
            </div>
          </div>

          <form class="account-card" data-profile-form id="details">
            <h2>Details</h2>
            <div class="field">
              <label for="prof-name">Name</label>
              <input id="prof-name" name="name" type="text" value="${profile.name}" required />
            </div>
            <div class="field">
              <label for="prof-email">Email</label>
              <input id="prof-email" name="email" type="email" value="${profile.email}" required />
            </div>
            <div class="field-row">
              <div class="field">
                <label for="prof-phone">Phone</label>
                <input id="prof-phone" name="phone" type="tel" value="${profile.phone || ''}" placeholder="+91" />
              </div>
              <div class="field">
                <label for="prof-city">City</label>
                <input id="prof-city" name="city" type="text" value="${profile.city || ''}" placeholder="Bengaluru" />
              </div>
            </div>
            <p class="account-note" data-profile-msg hidden></p>
            <div class="account-actions">
              <button class="btn btn--primary" type="submit">Save details</button>
              <button class="btn btn--ghost" type="button" data-logout>Sign out</button>
            </div>
          </form>
        </div>
      </section>`

    content!.querySelector('[data-profile-form]')?.addEventListener('submit', (e) => {
      e.preventDefault()
      const form = e.target as HTMLFormElement
      const fd = new FormData(form)
      updateProfile({
        name: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        phone: String(fd.get('phone') || ''),
        city: String(fd.get('city') || ''),
      })
      const msg = content!.querySelector<HTMLElement>('[data-profile-msg]')
      if (msg) {
        msg.hidden = false
        msg.textContent = 'Details saved on this device.'
      }
    })

    content!.querySelector('[data-logout]')?.addEventListener('click', () => {
      logout()
      window.location.reload()
    })

    content!.querySelector('[data-open-wish]')?.addEventListener('click', () => {
      document.querySelector<HTMLButtonElement>('[data-wish-open]')?.click()
    })
    content!.querySelector('[data-open-bag]')?.addEventListener('click', () => {
      document.querySelector<HTMLButtonElement>('[data-cart-open]')?.click()
    })

    if (window.location.hash === '#details') {
      requestAnimationFrame(() => {
        document.getElementById('details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  initPageMotion(content!)
  document.title = `${loggedIn ? 'Account' : 'Sign in'} · Rivlet`
}

paint()
