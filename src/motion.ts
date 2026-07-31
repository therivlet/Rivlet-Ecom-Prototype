/** Premium motion — scroll restore + quiet scroll reveals. */

const REVEAL_SELECTORS = [
  '.section-head',
  '.promise-item',
  '.situation-tile',
  '.split-shop__tile',
  '.product-card',
  '.platform-card',
  '.coord-band > *',
  '.trust-item',
  '.review-card',
  '.fabricology-cta',
  '.final-cta > *',
  '.fabric-card',
  '.plp-toolbar',
  '.plp-bar',
  '.faq',
  '.pdp-gallery',
  '.pdp-buy',
  '.split-hero > *',
  '.story-block',
  '.checkout .section-head',
  '.checkout-summary',
  '.confirm > *',
].join(', ')

let observer: IntersectionObserver | null = null

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Always land at top on load / refresh — never mid-page restore. */
export function lockScrollToTop(): void {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
  requestAnimationFrame(() => window.scrollTo(0, 0))
  window.addEventListener('load', () => window.scrollTo(0, 0), { once: true })
}

function ensureObserver(): IntersectionObserver | null {
  if (reducedMotion()) return null
  if (observer) return observer

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        el.classList.add('is-in')
        observer?.unobserve(el)
      }
    },
    {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12,
    },
  )
  return observer
}

/** Mark and observe reveal targets inside a root (safe after re-renders). */
export function initPageMotion(root: ParentNode = document): void {
  const main = (root as Document | Element).querySelector?.('.page__main') ?? root
  const scope = main instanceof Element ? main : document

  scope.querySelectorAll('.hero').forEach((hero) => {
    hero.classList.add('hero--enter')
  })

  const nodes = [...scope.querySelectorAll<HTMLElement>(REVEAL_SELECTORS)]

  if (reducedMotion()) {
    nodes.forEach((el) => {
      el.classList.add('reveal', 'is-in')
    })
    return
  }

  const obs = ensureObserver()
  if (!obs) return

  nodes.forEach((el) => el.classList.add('reveal'))

  // Stagger siblings that share a parent (grids, CTA groups)
  const parents = new Set(nodes.map((el) => el.parentElement).filter(Boolean) as HTMLElement[])
  parents.forEach((parent) => {
    const kids = [...parent.children].filter((c) => c.classList.contains('reveal')) as HTMLElement[]
    kids.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 70}ms`)
    })
  })

  nodes.forEach((el) => {
    if (el.classList.contains('is-in')) return
    const rect = el.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 40
    if (inView) {
      requestAnimationFrame(() => el.classList.add('is-in'))
    } else {
      obs.observe(el)
    }
  })
}

export function bootMotion(root: HTMLElement): void {
  lockScrollToTop()
  initPageMotion(root)
}
