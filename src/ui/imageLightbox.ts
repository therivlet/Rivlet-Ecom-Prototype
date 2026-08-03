/** Fullscreen PDP photo viewer - black stage, white frame, zoom / fullscreen / close. */

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

function iconZoom(): string {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.25" stroke="currentColor" stroke-width="1.4"/><path d="M15.5 15.5 20 20" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`
}

function iconExpand(): string {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
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

export function openImageLightbox(opts: OpenImageLightboxOptions): () => void {
  if (!opts.images.length) return () => undefined
  activeClose?.()

  let index = ((opts.index ?? 0) % opts.images.length + opts.images.length) % opts.images.length
  let zoomed = false
  let panX = 0
  let panY = 0
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const previousOverflow = document.body.style.overflow

  const root = document.createElement('div')
  root.className = 'img-lightbox'
  root.setAttribute('role', 'dialog')
  root.setAttribute('aria-modal', 'true')
  root.setAttribute('aria-label', 'Product photos')
  root.innerHTML = `
    <div class="img-lightbox__tools">
      <button type="button" class="img-lightbox__tool" data-lb-zoom aria-label="Zoom image" aria-pressed="false">${iconZoom()}</button>
      <button type="button" class="img-lightbox__tool" data-lb-fs aria-label="Enter full screen">${iconExpand()}</button>
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

  const img = root.querySelector<HTMLImageElement>('[data-lb-img]')!
  const frame = root.querySelector<HTMLElement>('[data-lb-frame]')!
  const zoomBtn = root.querySelector<HTMLButtonElement>('[data-lb-zoom]')!
  const fsBtn = root.querySelector<HTMLButtonElement>('[data-lb-fs]')!
  const notes = root.querySelector<HTMLElement>('[data-lb-notes]')

  const setIndex = (next: number) => {
    if (opts.images.length < 2) return
    index = ((next % opts.images.length) + opts.images.length) % opts.images.length
    img.src = opts.images[index]
    opts.onIndexChange?.(index)
    if (zoomed) setZoomed(false)
  }

  const setZoomed = (on: boolean) => {
    zoomed = on
    panX = 0
    panY = 0
    root.classList.toggle('is-zoomed', on)
    zoomBtn.setAttribute('aria-pressed', String(on))
    zoomBtn.setAttribute('aria-label', on ? 'Exit zoom' : 'Zoom image')
    if (notes) notes.hidden = on
    img.style.transform = on ? `translate(${panX}px, ${panY}px) scale(2)` : ''
  }

  const close = () => {
    if (activeClose !== close) return
    activeClose = null
    root.classList.remove('is-open')
    document.body.style.overflow = previousOverflow
    document.documentElement.classList.remove('is-img-lightbox-open')
    if (document.fullscreenElement === root) {
      void document.exitFullscreen?.()
    }
    const finish = () => {
      root.remove()
      opts.onClose?.(index)
      previousFocus?.focus?.()
    }
    root.addEventListener('transitionend', finish, { once: true })
    window.setTimeout(finish, 280)
    window.removeEventListener('keydown', onKey)
  }

  activeClose = close

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setIndex(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setIndex(index + 1)
    }
  }
  window.addEventListener('keydown', onKey)

  root.querySelector('[data-lb-close]')?.addEventListener('click', close)
  root.querySelector('[data-lb-prev]')?.addEventListener('click', () => setIndex(index - 1))
  root.querySelector('[data-lb-next]')?.addEventListener('click', () => setIndex(index + 1))

  zoomBtn.addEventListener('click', () => setZoomed(!zoomed))

  fsBtn.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === root) {
        await document.exitFullscreen()
        fsBtn.setAttribute('aria-label', 'Enter full screen')
      } else if (root.requestFullscreen) {
        await root.requestFullscreen()
        fsBtn.setAttribute('aria-label', 'Exit full screen')
      }
    } catch {
      /* Fullscreen can be blocked by the browser; ignore. */
    }
  })

  document.addEventListener('fullscreenchange', () => {
    if (!root.isConnected) return
    fsBtn.setAttribute(
      'aria-label',
      document.fullscreenElement === root ? 'Exit full screen' : 'Enter full screen',
    )
  })

  /* Stage swipe / pan */
  let startX = 0
  let startY = 0
  let startPanX = 0
  let startPanY = 0
  let dragging = false
  let locked: 'h' | 'v' | null = null

  const stage = root.querySelector<HTMLElement>('.img-lightbox__stage')!

  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return
    startX = e.clientX
    startY = e.clientY
    startPanX = panX
    startPanY = panY
    dragging = true
    locked = null
    stage.setPointerCapture?.(e.pointerId)
  })

  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (zoomed) {
      panX = startPanX + dx
      panY = startPanY + dy
      img.style.transform = `translate(${panX}px, ${panY}px) scale(2)`
      return
    }
    if (!locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      locked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
    }
  })

  const endDrag = (e: PointerEvent) => {
    if (!dragging) return
    dragging = false
    if (zoomed) return
    const dx = e.clientX - startX
    if (locked === 'h' && Math.abs(dx) > 48) setIndex(index + (dx < 0 ? 1 : -1))
    locked = null
  }

  stage.addEventListener('pointerup', endDrag)
  stage.addEventListener('pointercancel', endDrag)

  /* Double-click frame toggles zoom */
  frame.addEventListener('dblclick', (e) => {
    e.preventDefault()
    setZoomed(!zoomed)
  })

  zoomBtn.focus()
  return close
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
