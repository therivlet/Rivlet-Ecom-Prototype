/** Premium motion — scroll restore + quiet scroll reveals. */

const REVEAL_SELECTORS = [
  '.section-head',
  '.promise-film',
  '.situation-panel',
  '.split-shop__tile',
  '.product-card',
  '.platform-card',
  '.coord-band > *',
  '.coord-card',
  '.coords-hero__copy',
  '.coords-hero__details',
  '.pdp-story--rail .story-block',
  '.pdp-story--full .story-block',
  '.trust-item',
  '.review-card',
  '.fabricology-cta',
  '.final-cta > *',
  '.fabric-card',
  '.plp-toolbar',
  '.plp-bar',
  '.faq',
  /* Gallery / buy stay transform-free so hover-zoom fixed panes stay viewport-aligned. */
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

/** Autoplay promise films only while in view; pause when off-screen. */
export function initPromiseFilms(root: ParentNode = document): void {
  const videos = [...root.querySelectorAll<HTMLVideoElement>('[data-promise-video]')]
  if (!videos.length) return

  const attachSrc = (video: HTMLVideoElement) => {
    const src = video.dataset.src
    if (!src || video.querySelector('source') || video.src) return
    const source = document.createElement('source')
    source.src = src
    source.type = 'video/mp4'
    video.appendChild(source)
    video.load()
  }

  if (reducedMotion()) {
    videos.forEach((video) => {
      attachSrc(video)
      video.pause()
      video.removeAttribute('autoplay')
    })
    return
  }

  const playSafe = (video: HTMLVideoElement) => {
    attachSrc(video)
    video.muted = true
    video.playsInline = true
    void video.play().catch(() => {
      /* muted autoplay usually allowed; ignore blocks */
    })
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          playSafe(video)
        } else {
          video.pause()
        }
      }
    },
    { root: null, threshold: [0, 0.35, 0.6] },
  )

  videos.forEach((video) => {
    attachSrc(video)
    io.observe(video)
  })
}

export function bootMotion(root: HTMLElement): void {
  lockScrollToTop()
  initPageMotion(root)
  initPromiseFilms(root)
}
