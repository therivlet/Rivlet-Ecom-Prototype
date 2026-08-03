/** Premium motion - scroll restore + quiet scroll reveals. */

const REVEAL_SELECTORS = [
  '.section-head',
  '.promise-film',
  /* Situation panels stay transform-free so the mobile infinity ribbon can measure reliably. */
  '.split-shop__tile',
  '.product-card',
  '.platform-card',
  '.platforms-foot',
  '.coord-band > *',
  '.coord-card',
  '.coords-hero__copy',
  '.coords-hero__details',
  '.pdp-story--rail .story-block',
  '.pdp-story--full .story-block',
  '.trust-item',
  /* Review cards stay transform-free so the ribbon loop can measure positions reliably. */
  '.fabricology-cta',
  '.final-cta__inner > *',
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
  '.about-hero__inner > *',
  '.about-hero__mark',
  '.about-principle__inner > *',
  '.about-split__copy > *',
  '.about-split__media',
  '.about-studio__inner > *',
  '.about-role',
  '.about-fabric__copy > *',
  '.about-fabric__media',
  '.about-standards__list > li',
  '.contact-hero__inner > *',
  '.contact-page__intro > *',
  '.contact-form',
  '.contact-channel',
  '.content-page .section-head > *',
  '.content-block',
].join(', ')

let observer: IntersectionObserver | null = null

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Always land at top on load / refresh - never mid-page restore. */
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

  initReviewRails(scope)
  initSituationRails(scope)
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

/** Horizontal review rails: ribbon loop; auto-advance while idle. */
export function initReviewRails(root: ParentNode = document): void {
  const rails = [...((root as Document | Element).querySelectorAll?.('.reviews') ?? [])] as HTMLElement[]
  rails.forEach(bindReviewRail)
}

function bindReviewRail(rail: HTMLElement): void {
  if (rail.dataset.reviewRail === '1') return
  rail.dataset.reviewRail = '1'

  // One full copy after the originals so the first card sits beside the last.
  if (rail.dataset.reviewLoop !== '1') {
    const source = [...rail.querySelectorAll<HTMLElement>('.review-card')]
    source.forEach((node) => {
      const clone = node.cloneNode(true) as HTMLElement
      clone.setAttribute('aria-hidden', 'true')
      clone.setAttribute('data-review-clone', '')
      rail.appendChild(clone)
    })
    rail.dataset.reviewLoop = '1'
  }

  if (reducedMotion()) return

  let paused = false
  let inView = false
  let index = 0
  let timer: number | undefined
  let resumeTimer: number | undefined
  let animTimer: number | undefined

  const originals = () =>
    [...rail.querySelectorAll<HTMLElement>('.review-card:not([data-review-clone])')]
  const allCards = () => [...rail.querySelectorAll<HTMLElement>('.review-card')]

  /** Scroll offset that left-aligns a card with the rail’s content start. */
  const offsetFor = (card: HTMLElement) => {
    const first = originals()[0]
    if (!first) return 0
    return card.offsetLeft - first.offsetLeft
  }

  const goTo = (i: number, behavior: ScrollBehavior) => {
    const cards = allCards()
    const n = originals().length
    if (n < 1 || !cards.length) return
    const target = cards[((i % cards.length) + cards.length) % cards.length]
    if (!target) return
    rail.scrollTo({ left: offsetFor(target), behavior })
  }

  /** After landing on a clone, jump back to the matching original with no animation. */
  const wrapIfNeeded = () => {
    const n = originals().length
    if (n < 1) return
    if (index >= n) {
      index = index % n
      goTo(index, 'auto')
    } else if (index < 0) {
      index = ((index % n) + n) % n
      goTo(index, 'auto')
    }
  }

  const stop = () => {
    if (timer !== undefined) {
      window.clearInterval(timer)
      timer = undefined
    }
  }

  const step = () => {
    if (paused || !inView || !rail.isConnected) return
    const n = originals().length
    if (n < 2) return

    index += 1
    goTo(index, 'smooth')
    if (animTimer !== undefined) window.clearTimeout(animTimer)
    animTimer = window.setTimeout(wrapIfNeeded, 750)
  }

  const start = () => {
    stop()
    if (!inView || paused) return
    timer = window.setInterval(step, 2000)
  }

  const syncIndexFromScroll = () => {
    const cards = originals()
    const n = cards.length
    if (n < 1) return
    const x = rail.scrollLeft
    let best = 0
    let bestDist = Infinity
    cards.forEach((card, i) => {
      const d = Math.abs(offsetFor(card) - x)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    // If user scrolled into the clone set, map back
    const clone0 = rail.querySelector<HTMLElement>('[data-review-clone]')
    if (clone0 && x >= offsetFor(clone0) - 8) {
      const all = allCards()
      let nearest = n
      let nearestDist = Infinity
      all.forEach((card, i) => {
        const d = Math.abs(offsetFor(card) - x)
        if (d < nearestDist) {
          nearestDist = d
          nearest = i
        }
      })
      index = nearest
      wrapIfNeeded()
      return
    }
    index = best
  }

  const pauseForUser = () => {
    paused = true
    stop()
    if (resumeTimer !== undefined) window.clearTimeout(resumeTimer)
  }

  const resumeLater = () => {
    syncIndexFromScroll()
    if (resumeTimer !== undefined) window.clearTimeout(resumeTimer)
    resumeTimer = window.setTimeout(() => {
      paused = false
      start()
    }, 3000)
  }

  rail.addEventListener('scrollend', () => {
    if (paused) syncIndexFromScroll()
    else wrapIfNeeded()
  })
  rail.addEventListener('pointerdown', pauseForUser)
  rail.addEventListener('touchstart', pauseForUser, { passive: true })
  rail.addEventListener('wheel', pauseForUser, { passive: true })
  rail.addEventListener('pointerup', resumeLater)
  rail.addEventListener('touchend', resumeLater, { passive: true })
  rail.addEventListener('mouseenter', pauseForUser)
  rail.addEventListener('mouseleave', resumeLater)

  // Start aligned to the first card
  goTo(0, 'auto')

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.25
        if (inView) start()
        else stop()
      }
    },
    { threshold: [0, 0.25, 0.5] },
  )
  io.observe(rail)
}

/**
 * Shop-by-situation ribbon: continuous circular auto-scroll on mobile only.
 * Seamless infinity loop (Summer → Gym → … → Travel → Summer…); pauses on interact.
 */
export function initSituationRails(root: ParentNode = document): void {
  const mobileMq = window.matchMedia('(max-width: 899px)')
  const rails = [
    ...((root as Document | Element).querySelectorAll?.('[data-situation-rail]') ?? []),
  ] as HTMLElement[]
  rails.forEach((rail) => bindSituationRail(rail, mobileMq))
}

function bindSituationRail(rail: HTMLElement, mobileMq: MediaQueryList): void {
  if (rail.dataset.situationRailBound === '1') return
  rail.dataset.situationRailBound = '1'

  if (rail.dataset.situationLoop !== '1') {
    const source = [...rail.querySelectorAll<HTMLElement>('.situation-panel')]
    // Two full copies so fast flicks never hit a hard end
    for (let pass = 0; pass < 2; pass++) {
      source.forEach((node) => {
        const clone = node.cloneNode(true) as HTMLElement
        clone.setAttribute('aria-hidden', 'true')
        clone.setAttribute('data-situation-clone', '')
        clone.tabIndex = -1
        clone.removeAttribute('data-reveal')
        clone.classList.remove('reveal', 'is-in')
        rail.appendChild(clone)
      })
    }
    rail.dataset.situationLoop = '1'
  }

  let paused = false
  let inView = false
  let raf = 0
  let resumeTimer: number | undefined
  let cachedLoop = 0
  const SPEED = 0.65 // px per frame - continuous marquee

  const originals = () =>
    [...rail.querySelectorAll<HTMLElement>('.situation-panel:not([data-situation-clone])')]

  const measureLoop = () => {
    const first = originals()[0]
    const firstClone = rail.querySelector<HTMLElement>('[data-situation-clone]')
    if (!first || !firstClone) {
      cachedLoop = 0
      return 0
    }
    cachedLoop = firstClone.offsetLeft - first.offsetLeft
    return cachedLoop
  }

  const normalize = () => {
    if (!mobileMq.matches) return
    const width = cachedLoop || measureLoop()
    if (width <= 1) return
    // Keep scroll inside the first set so the track never ends
    while (rail.scrollLeft >= width) rail.scrollLeft -= width
    while (rail.scrollLeft < 0) rail.scrollLeft += width
  }

  const tick = () => {
    if (
      !reducedMotion() &&
      mobileMq.matches &&
      inView &&
      !paused &&
      rail.isConnected
    ) {
      rail.scrollLeft += SPEED
      normalize()
    }
    raf = requestAnimationFrame(tick)
  }

  const pauseForUser = () => {
    paused = true
    if (resumeTimer !== undefined) window.clearTimeout(resumeTimer)
  }

  const resumeLater = () => {
    if (resumeTimer !== undefined) window.clearTimeout(resumeTimer)
    resumeTimer = window.setTimeout(() => {
      paused = false
    }, 1800)
  }

  rail.addEventListener('pointerdown', pauseForUser)
  rail.addEventListener('touchstart', pauseForUser, { passive: true })
  rail.addEventListener('wheel', pauseForUser, { passive: true })
  rail.addEventListener('pointerup', resumeLater)
  rail.addEventListener('touchend', resumeLater, { passive: true })
  rail.addEventListener('scroll', normalize, { passive: true })

  const ro = new ResizeObserver(() => {
    measureLoop()
    normalize()
  })
  ro.observe(rail)
  originals().forEach((el) => ro.observe(el))

  // Remeasure after images settle so loop width stays accurate
  rail.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', () => measureLoop(), { once: true })
  })
  measureLoop()

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.15
        if (inView) measureLoop()
      }
    },
    { threshold: [0, 0.15, 0.4] },
  )
  io.observe(rail)

  mobileMq.addEventListener('change', () => {
    if (!mobileMq.matches) {
      rail.scrollLeft = 0
      return
    }
    measureLoop()
    normalize()
  })

  raf = requestAnimationFrame(tick)
  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    },
    { once: true },
  )
}

export function bootMotion(root: HTMLElement): void {
  lockScrollToTop()
  initPageMotion(root)
  initPromiseFilms(root)
  initReviewRails(root)
  initSituationRails(root)
}
