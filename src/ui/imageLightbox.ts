/** Fullscreen PDP photo viewer — gesture zoom, close via X or browser Back. */

export type LightboxHotspot = {
  /** Horizontal position inside the frame, 0–100. */
  x: number
  /** Vertical position inside the frame, 0–100. */
  y: number
  pct: string
  label: string
  note?: string
}

export type OpenImageLightboxOptions = {
  images: string[]
  index?: number
  alt?: string
  fitLabel?: string
  hotspots?: LightboxHotspot[]
  onIndexChange?: (index: number) => void
  onClose?: (index: number) => void
}

const HISTORY_FLAG = 'rivletLightbox'
const MIN_SCALE = 1
const MAX_SCALE = 4
const WHEEL_FACTOR = 0.0018

let activeClose: (() => void) | null = null

/** Parse "78% Nylon / 22% Elastane" style strings into callout hotspots. */
export function parseMaterialHotspots(material: string): LightboxHotspot[] {
  const matches = [...material.matchAll(/(\d+)\s*%\s*([^/+]+)/g)]
  const slots = [
    { x: 46, y: 30 },
    { x: 50, y: 44 },
  ]
  return matches.slice(0, 2).map((m, i) => {
    const raw = m[2].replace(/\(.*?\)/g, '').replace(/\+\s*.*$/, '').trim()
    const label = raw.replace(/\s+/g, ' ')
    const stretch = /elastane|spandex|lycra/i.test(label)
    return {
      x: slots[i].x,
      y: slots[i].y,
      pct: `${m[1]}%`,
      label,
      note: stretch && i > 0 ? 'for stretch' : undefined,
    }
  })
}

/** Short fit label for the frame corner (e.g. "High-rise"). */
export function shortFitLabel(fit: string): string {
  const first = fit.split(/[·,]/)[0]?.trim() || fit
  return first.length > 28 ? `${first.slice(0, 26).trim()}…` : first
}

function iconClose(): string {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`
}

function iconChevron(dir: 'prev' | 'next'): string {
  const d = dir === 'prev' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5'
  return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>`
}

function hotspotHTML(h: LightboxHotspot): string {
  const note = h.note ? ` <span class="img-lightbox__note">${h.note}</span>` : ''
  return `
    <div class="img-lightbox__hotspot" style="--hx:${h.x}%;--hy:${h.y}%">
      <span class="img-lightbox__dot"></span>
      <span class="img-lightbox__rail"></span>
      <p class="img-lightbox__callout"><strong>${h.pct}</strong> ${h.label}${note}</p>
    </div>`
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function touchDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function touchMid(a: { x: number; y: number }, b: { x: number; y: number }): { x: number; y: number } {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export function openImageLightbox(opts: OpenImageLightboxOptions): () => void {
  if (!opts.images.length) return () => undefined
  activeClose?.()

  let index = ((opts.index ?? 0) % opts.images.length + opts.images.length) % opts.images.length
  let scale = 1
  let panX = 0
  let panY = 0
  let open = true
  let pushedHistory = false
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const previousOverflow = document.body.style.overflow

  const root = document.createElement('div')
  root.className = 'img-lightbox'
  root.setAttribute('role', 'dialog')
  root.setAttribute('aria-modal', 'true')
  root.setAttribute('aria-label', 'Product photos')
  root.innerHTML = `
    <div class="img-lightbox__tools">
      <button type="button" class="img-lightbox__tool" data-lb-close aria-label="Close">${iconClose()}</button>
    </div>
    ${
      opts.images.length > 1
        ? `
      <button type="button" class="img-lightbox__nav img-lightbox__nav--prev" data-lb-prev aria-label="Previous image">${iconChevron('prev')}</button>
      <button type="button" class="img-lightbox__nav img-lightbox__nav--next" data-lb-next aria-label="Next image">${iconChevron('next')}</button>`
        : ''
    }
    <div class="img-lightbox__stage">
      <div class="img-lightbox__frame" data-lb-frame>
        <img class="img-lightbox__img" data-lb-img src="${opts.images[index]}" alt="${opts.alt ?? ''}" draggable="false" />
        ${
          opts.hotspots?.length
            ? `<div class="img-lightbox__annotations" data-lb-notes>${opts.hotspots.map(hotspotHTML).join('')}</div>`
            : ''
        }
        ${opts.fitLabel ? `<p class="img-lightbox__fit">${opts.fitLabel}</p>` : ''}
      </div>
    </div>`

  document.body.appendChild(root)
  document.body.style.overflow = 'hidden'
  document.documentElement.classList.add('is-img-lightbox-open')

  requestAnimationFrame(() => root.classList.add('is-open'))

  try {
    history.pushState({ [HISTORY_FLAG]: true }, '')
    pushedHistory = true
  } catch {
    pushedHistory = false
  }

  const img = root.querySelector<HTMLImageElement>('[data-lb-img]')!
  const frame = root.querySelector<HTMLElement>('[data-lb-frame]')!
  const notes = root.querySelector<HTMLElement>('[data-lb-notes]')
  const fit = root.querySelector<HTMLElement>('.img-lightbox__fit')
  const stage = root.querySelector<HTMLElement>('.img-lightbox__stage')!

  const applyTransform = () => {
    const zoomed = scale > 1.02
    root.classList.toggle('is-zoomed', zoomed)
    if (notes) notes.hidden = zoomed
    if (fit) fit.hidden = zoomed
    if (!zoomed) {
      panX = 0
      panY = 0
      scale = 1
    }
    img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`
  }

  /** Zoom keeping the point under (clientX, clientY) stable. */
  const zoomAt = (clientX: number, clientY: number, nextScale: number) => {
    const rect = frame.getBoundingClientRect()
    const cx = clientX - rect.left - rect.width / 2
    const cy = clientY - rect.top - rect.height / 2
    const prev = scale
    const next = clamp(nextScale, MIN_SCALE, MAX_SCALE)
    if (prev < 1.01 && next <= 1.01) {
      scale = 1
      panX = 0
      panY = 0
      applyTransform()
      return
    }
    const ox = (cx - panX) / prev
    const oy = (cy - panY) / prev
    scale = next
    panX = cx - ox * scale
    panY = cy - oy * scale
    applyTransform()
  }

  const resetZoom = () => {
    scale = 1
    panX = 0
    panY = 0
    applyTransform()
  }

  const setIndex = (next: number) => {
    if (opts.images.length < 2) return
    index = ((next % opts.images.length) + opts.images.length) % opts.images.length
    img.src = opts.images[index]
    opts.onIndexChange?.(index)
    resetZoom()
  }

  const close = (fromPopState = false) => {
    if (!open) return
    open = false
    if (activeClose === close) activeClose = null

    root.classList.remove('is-open')
    document.body.style.overflow = previousOverflow
    document.documentElement.classList.remove('is-img-lightbox-open')
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('popstate', onPopState)

    const finish = () => {
      root.remove()
      opts.onClose?.(index)
      previousFocus?.focus?.()
    }
    root.addEventListener('transitionend', finish, { once: true })
    window.setTimeout(finish, 280)

    /* X / Escape: pop the history entry we pushed so Back stays on the PDP. */
    if (pushedHistory && !fromPopState) {
      pushedHistory = false
      history.back()
    } else {
      pushedHistory = false
    }
  }

  activeClose = () => close(false)

  const onPopState = () => {
    /* Hardware / browser Back — close preview only, stay on PDP. */
    pushedHistory = false
    close(true)
  }
  window.addEventListener('popstate', onPopState)

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close(false)
    } else if (e.key === 'ArrowLeft' && scale <= 1.02) {
      e.preventDefault()
      setIndex(index - 1)
    } else if (e.key === 'ArrowRight' && scale <= 1.02) {
      e.preventDefault()
      setIndex(index + 1)
    }
  }
  window.addEventListener('keydown', onKey)

  root.querySelector('[data-lb-close]')?.addEventListener('click', () => close(false))
  root.querySelector('[data-lb-prev]')?.addEventListener('click', () => setIndex(index - 1))
  root.querySelector('[data-lb-next]')?.addEventListener('click', () => setIndex(index + 1))

  /* Desktop: mouse wheel zoom toward cursor */
  stage.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault()
      const factor = Math.exp(-e.deltaY * WHEEL_FACTOR)
      zoomAt(e.clientX, e.clientY, scale * factor)
    },
    { passive: false },
  )

  /* Pointer pan / swipe / pinch */
  const pointers = new Map<number, { x: number; y: number }>()
  let startX = 0
  let startY = 0
  let startPanX = 0
  let startPanY = 0
  let dragging = false
  let locked: 'h' | 'v' | null = null
  let pinching = false
  let pinchStartDist = 0
  let pinchStartScale = 1

  const syncPointers = (e: PointerEvent) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }

  const beginPinch = () => {
    const pts = [...pointers.values()]
    if (pts.length < 2) return
    pinching = true
    dragging = false
    locked = null
    pinchStartDist = touchDistance(pts[0], pts[1]) || 1
    pinchStartScale = scale
  }

  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    stage.setPointerCapture?.(e.pointerId)

    if (pointers.size === 2) {
      beginPinch()
      return
    }

    if (pointers.size === 1) {
      startX = e.clientX
      startY = e.clientY
      startPanX = panX
      startPanY = panY
      dragging = true
      locked = null
      pinching = false
    }
  })

  stage.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return
    syncPointers(e)

    if (pointers.size >= 2 || pinching) {
      const pts = [...pointers.values()]
      if (pts.length >= 2) {
        if (!pinching) beginPinch()
        const dist = touchDistance(pts[0], pts[1]) || 1
        const mid = touchMid(pts[0], pts[1])
        const next = pinchStartScale * (dist / pinchStartDist)
        zoomAt(mid.x, mid.y, next)
      }
      return
    }

    if (!dragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY

    if (scale > 1.02) {
      panX = startPanX + dx
      panY = startPanY + dy
      applyTransform()
      return
    }

    if (!locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      locked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
    }
  })

  const endPointer = (e: PointerEvent) => {
    const wasPinching = pinching
    pointers.delete(e.pointerId)

    if (pointers.size < 2) {
      pinching = false
      pinchStartDist = 0
    }

    if (pointers.size === 1) {
      /* Resume one-finger pan from remaining touch */
      const remaining = [...pointers.values()][0]
      startX = remaining.x
      startY = remaining.y
      startPanX = panX
      startPanY = panY
      dragging = true
      locked = null
      return
    }

    if (!dragging) return
    dragging = false

    if (wasPinching || scale > 1.02) {
      locked = null
      return
    }

    const dx = e.clientX - startX
    if (locked === 'h' && Math.abs(dx) > 48) setIndex(index + (dx < 0 ? 1 : -1))
    locked = null
  }

  stage.addEventListener('pointerup', endPointer)
  stage.addEventListener('pointercancel', endPointer)

  /* Double-click / double-tap toggles a comfort zoom */
  frame.addEventListener('dblclick', (e) => {
    e.preventDefault()
    if (scale > 1.05) resetZoom()
    else zoomAt(e.clientX, e.clientY, 2.4)
  })

  root.querySelector<HTMLButtonElement>('[data-lb-close]')?.focus()
  applyTransform()
  return () => close(false)
}

/** Open lightbox on a clean tap of the gallery stage (not a swipe / control click). */
export function bindGalleryLightbox(opts: {
  stage: HTMLElement
  getImages: () => string[]
  getIndex: () => number
  setIndex: (index: number) => void
  alt?: string
  fitLabel?: string
  hotspots?: LightboxHotspot[]
}): () => void {
  const { stage } = opts
  let startX = 0
  let startY = 0
  let moved = false

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if ((e.target as HTMLElement).closest('button, a, [data-gallery-prev], [data-gallery-next], [data-gallery-dot]')) {
      moved = true
      return
    }
    startX = e.clientX
    startY = e.clientY
    moved = false
  }

  const onMove = (e: PointerEvent) => {
    if (moved) return
    if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) moved = true
  }

  const onUp = (e: PointerEvent) => {
    if (moved) return
    if ((e.target as HTMLElement).closest('button, a')) return
    const images = opts.getImages()
    if (!images.length) return
    openImageLightbox({
      images,
      index: opts.getIndex(),
      alt: opts.alt,
      fitLabel: opts.fitLabel,
      hotspots: opts.hotspots,
      onIndexChange: opts.setIndex,
      onClose: opts.setIndex,
    })
  }

  stage.addEventListener('pointerdown', onDown)
  stage.addEventListener('pointermove', onMove)
  stage.addEventListener('pointerup', onUp)

  stage.classList.add('pdp-gallery__hero--expandable')

  return () => {
    stage.removeEventListener('pointerdown', onDown)
    stage.removeEventListener('pointermove', onMove)
    stage.removeEventListener('pointerup', onUp)
    stage.classList.remove('pdp-gallery__hero--expandable')
    activeClose?.()
  }
}
