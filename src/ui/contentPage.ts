import { mountShell, shopHref, initPageMotion } from './shell'

/** Shared thin content pages used by footer trust links. */
export interface ContentPageSpec {
  title: string
  eyebrow: string
  headline: string
  lede: string
  sections: { heading: string; body: string }[]
  cta?: { label: string; href: string }
}

export function renderContentPage(spec: ContentPageSpec): void {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) throw new Error('#app missing')

  const sections = spec.sections
    .map(
      (s) => `
      <article class="content-block">
        <h2>${s.heading}</h2>
        <p>${s.body}</p>
      </article>`,
    )
    .join('')

  const cta = spec.cta
    ? `<p class="content-page__cta"><a class="btn btn--primary" href="${spec.cta.href}">${spec.cta.label}</a></p>`
    : ''

  app.innerHTML = `<div data-page-content>
    <section class="section content-page fade-in">
      <div class="container content-page__shell">
        <div class="section-head">
          <p class="eyebrow">${spec.eyebrow}</p>
          <h1 class="display">${spec.headline}</h1>
          <p class="lede">${spec.lede}</p>
        </div>
        <div class="content-page__body">
          ${sections}
        </div>
        ${cta}
      </div>
    </section>
  </div>`

  mountShell(app)
  initPageMotion(app)
  document.title = `${spec.title} · Rivlet`
}

export function defaultShopCta(): { label: string; href: string } {
  return { label: 'Explore Collection', href: shopHref() }
}
