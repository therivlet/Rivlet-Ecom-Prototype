/** Amazon / Flipkart-style hover zoom: lens on stage + opaque pane over checkout column. */

export type ImageZoomOptions = {
  stage: HTMLElement
  img: HTMLImageElement
  lens: HTMLElement
  pane: HTMLElement
  /** Panel the zoom result should cover (buy / checkout column). */
  cover: HTMLElement
  zoom?: number
  enabled?: () => boolean
}

function ensureZoomImg(pane: HTMLElement): HTMLImageElement {
  let zoomImg = pane.querySelector<HTMLImageElement>('[data-zoom-img]')
  if (!zoomImg) {
    zoomImg = document.createElement('img')
    zoomImg.setAttribute('data-zoom-img', '')
    zoomImg.alt = ''
    zoomImg.draggable = false
    pane.appendChild(zoomImg)
  }
  return zoomImg
}

/** Parse CSS object-position into 0-1 keywords / percentages. */
function parseObjectPosition(value: string): { x: number; y: number } {
  const map = (token: string | undefined, fallback: number): number => {
    if (!token) return fallback
    if (token === 'center') return 0.5
    if (token === 'left' || token === 'top') return 0
    if (token === 'right' || token === 'bottom') return 1
    if (token.endsWith('%')) {
      const n = Number.parseFloat(token)
      return Number.isFinite(n) ? n / 100 : fallback
    }
    return fallback
  }
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { x: 0.5, y: 0 }
  if (parts.length === 1) return { x: map(parts[0], 0.5), y: 0.5 }
  return { x: map(parts[0], 0.5), y: map(parts[1], 0) }
}

export function bindImageZoom(opts: ImageZoomOptions): () => void {
  const { stage, img, lens, pane, cover } = opts
  const ZOOM = opts.zoom ?? 2.4
  const enabled =
    opts.enabled ??
    (() => window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches)

  const zoomImg = ensureZoomImg(pane)
  const homeParent = pane.parentElement
  const homeNext = pane.nextSibling

  /** Escape transformed ancestors (.reveal) so position:fixed uses the viewport. */
  const mountPane = () => {
    if (pane.parentElement !== document.body) {
      document.body.appendChild(pane)
    }
  }

  const restorePane = () => {
    if (!homeParent || pane.parentElement === homeParent) return
    if (homeNext && homeNext.parentNode === homeParent) {
      homeParent.insertBefore(pane, homeNext)
    } else {
      homeParent.appendChild(pane)
    }
  }

  const hide = () => {
    stage.classList.remove('is-zooming')
    document.documentElement.classList.remove('is-image-zooming')
    lens.hidden = true
    pane.hidden = true
    pane.setAttribute('aria-hidden', 'true')
    // Clear inline display - it overrides the [hidden] attribute and left the pane stuck open.
    pane.style.display = 'none'
    restorePane()
  }

  const placePane = (stageRect: DOMRect) => {
    mountPane()
    const coverRect = cover.getBoundingClientRect()
    const gap = 8
    const top = Math.max(coverRect.top, gap)
    const left = coverRect.left
    const width = Math.max(coverRect.width, 1)
    const stageAspect = stageRect.width / Math.max(stageRect.height, 1)

    // Prefer stage aspect so the lens maps 1:1 into the result pane
    let height = width / stageAspect
    const maxH = Math.min(
      window.innerHeight - top - gap,
      Math.max(coverRect.bottom - top, coverRect.height),
    )
    if (height > maxH) height = maxH

    pane.hidden = false
    pane.setAttribute('aria-hidden', 'false')
    pane.style.cssText = [
      'position:fixed',
      `top:${top}px`,
      `left:${left}px`,
      `width:${width}px`,
      `height:${height}px`,
      'z-index:80',
      'overflow:hidden',
      'background-color:var(--color-canvas-deep)',
      'border:1px solid var(--color-line)',
      'pointer-events:none',
      'box-shadow:0 16px 48px rgba(14, 11, 7, 0.18)',
      'background-image:none',
      'margin:0',
      'display:block',
    ].join(';')
  }

  const onMove = (e: PointerEvent) => {
    if (!enabled() || e.pointerType !== 'mouse') return
    if (!stage.isConnected || !cover.isConnected) {
      hide()
      return
    }

    const rect = stage.getBoundingClientRect()
    if (rect.width < 8 || rect.height < 8) return

    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height)
    const lensW = rect.width / ZOOM
    const lensH = rect.height / ZOOM
    const lx = Math.min(Math.max(x - lensW / 2, 0), rect.width - lensW)
    const ly = Math.min(Math.max(y - lensH / 2, 0), rect.height - lensH)

    stage.classList.add('is-zooming')
    document.documentElement.classList.add('is-image-zooming')
    lens.hidden = false
    lens.style.width = `${lensW}px`
    lens.style.height = `${lensH}px`
    lens.style.transform = `translate(${lx}px, ${ly}px)`

    placePane(rect)

    const paneW = pane.clientWidth || rect.width
    const scale = paneW / lensW
    const src = img.currentSrc || img.src
    const objectPosition = getComputedStyle(img).objectPosition || 'center top'
    const { x: posX, y: posY } = parseObjectPosition(objectPosition)

    // Match object-fit:cover framing so the pane shows exactly what’s under the lens
    const nw = img.naturalWidth || rect.width
    const nh = img.naturalHeight || rect.height
    const coverScale = Math.max(rect.width / nw, rect.height / nh)
    const dw = nw * coverScale
    const dh = nh * coverScale
    const ox = (rect.width - dw) * posX
    const oy = (rect.height - dh) * posY

    zoomImg.src = src
    zoomImg.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      `width:${dw * scale}px`,
      `height:${dh * scale}px`,
      'max-width:none',
      'object-fit:fill',
      `transform:translate(${-(lx - ox) * scale}px, ${-(ly - oy) * scale}px)`,
      'pointer-events:none',
      'display:block',
      'user-select:none',
    ].join(';')
  }

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && enabled()) onMove(e)
  }

  stage.addEventListener('pointerenter', onEnter)
  stage.addEventListener('pointermove', onMove)
  stage.addEventListener('pointerleave', hide)
  window.addEventListener('scroll', hide, { passive: true })
  window.addEventListener('resize', hide)

  hide()

  return () => {
    stage.removeEventListener('pointerenter', onEnter)
    stage.removeEventListener('pointermove', onMove)
    stage.removeEventListener('pointerleave', hide)
    window.removeEventListener('scroll', hide)
    window.removeEventListener('resize', hide)
    hide()
    // If host was destroyed, drop a stray body-mounted pane
    if (pane.parentElement === document.body && !homeParent?.isConnected) {
      pane.remove()
    }
  }
}
