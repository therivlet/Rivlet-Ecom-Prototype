import {
  SIZE_GUIDE_BRACUP,
  SIZE_GUIDE_BUST,
  SIZE_GUIDE_HEIGHT,
  SIZE_GUIDE_HIP,
  SIZE_GUIDE_INTRO,
  SIZE_GUIDE_LENGTH,
  SIZE_GUIDE_SIZES,
  SIZE_GUIDE_UNDERBUST,
  SIZE_GUIDE_US,
  SIZE_GUIDE_WAIST,
  SIZE_GUIDE_WEIGHT,
  type SizeGuideTab,
  type SizeGuideUnit,
} from '../data/sizeGuide'

let unit: SizeGuideUnit = 'in'
let tab: SizeGuideTab = 'tops'
let bound = false

function sizeCell(i: number): string {
  return `<span class="sg-size"><b>${SIZE_GUIDE_SIZES[i]}</b> <small>/ US ${SIZE_GUIDE_US[i]}</small></span>`
}

function buildMeasureTable(
  cols: { label: string; values: string[] }[],
): string {
  let head = `<thead><tr><th>Rivlet Size</th>`
  cols.forEach((c) => {
    head += `<th>${c.label}</th>`
  })
  head += `</tr></thead><tbody>`
  for (let i = 0; i < SIZE_GUIDE_SIZES.length; i++) {
    head += `<tr><td>${sizeCell(i)}</td>`
    cols.forEach((c) => {
      head += `<td>${c.values[i]}</td>`
    })
    head += `</tr>`
  }
  return `${head}</tbody>`
}

function renderTables(root: HTMLElement): void {
  const tops = root.querySelector('[data-sg-table="tops"]')
  const bottoms = root.querySelector('[data-sg-table="bottoms"]')
  const bra = root.querySelector('[data-sg-table="bra"]')
  const length = root.querySelector('[data-sg-table="length"]')
  const bracup = root.querySelector('[data-sg-table="bracup"]')

  if (tops) {
    tops.innerHTML = buildMeasureTable([
      { label: 'Bust', values: SIZE_GUIDE_BUST[unit] },
      { label: 'Waist', values: SIZE_GUIDE_WAIST[unit] },
      { label: 'Height', values: SIZE_GUIDE_HEIGHT[unit] },
      { label: 'Weight', values: SIZE_GUIDE_WEIGHT[unit] },
    ])
  }
  if (bottoms) {
    bottoms.innerHTML = buildMeasureTable([
      { label: 'Waist', values: SIZE_GUIDE_WAIST[unit] },
      { label: 'Hip', values: SIZE_GUIDE_HIP[unit] },
      { label: 'Height', values: SIZE_GUIDE_HEIGHT[unit] },
      { label: 'Weight', values: SIZE_GUIDE_WEIGHT[unit] },
    ])
  }
  if (bra) {
    bra.innerHTML = buildMeasureTable([
      { label: 'Bust', values: SIZE_GUIDE_BUST[unit] },
      { label: 'Under-bust', values: SIZE_GUIDE_UNDERBUST[unit] },
      { label: 'Height', values: SIZE_GUIDE_HEIGHT[unit] },
      { label: 'Weight', values: SIZE_GUIDE_WEIGHT[unit] },
    ])
  }
  if (length) {
    length.innerHTML = `
      <thead><tr><th>Length</th><th>Full</th><th>Long</th><th>Short</th></tr></thead>
      <tbody><tr><td>Inseam</td>${SIZE_GUIDE_LENGTH[unit].map((v) => `<td>${v}</td>`).join('')}</tr></tbody>`
  }
  if (bracup) {
    bracup.innerHTML = `
      <thead><tr><th>Band \\ Cup</th><th>A</th><th>B</th><th>C</th><th>D</th><th>DD</th></tr></thead>
      <tbody>
        ${SIZE_GUIDE_BRACUP.map(
          (row) => `<tr><td>${row[0]}</td>${row.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`,
        ).join('')}
      </tbody>`
  }

  root.querySelectorAll<HTMLElement>('[data-sg-unit]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.sgUnit === unit)
  })
  root.querySelectorAll<HTMLElement>('[data-sg-tab]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.sgTab === tab)
  })
  root.querySelectorAll<HTMLElement>('[data-sg-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.sgPanel !== tab
  })
}

function ensureModal(): HTMLElement {
  let root = document.querySelector<HTMLElement>('[data-size-guide]')
  if (root) return root

  root = document.createElement('div')
  root.className = 'size-guide'
  root.setAttribute('data-size-guide', '')
  root.setAttribute('aria-hidden', 'true')
  root.innerHTML = `
    <div class="size-guide__overlay" data-sg-close tabindex="-1"></div>
    <div class="size-guide__dialog" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
      <header class="size-guide__head">
        <div>
          <p class="eyebrow">Fit</p>
          <h2 id="size-guide-title">Size Guide</h2>
        </div>
        <button type="button" class="icon-btn" data-sg-close aria-label="Close size guide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>
      <div class="size-guide__body">
        <p class="size-guide__intro">${SIZE_GUIDE_INTRO}</p>
        <div class="size-guide__controls">
          <div class="size-guide__tabs" role="tablist" aria-label="Garment type">
            <button type="button" class="size-guide__tab is-active" data-sg-tab="tops" role="tab">Tops</button>
            <button type="button" class="size-guide__tab" data-sg-tab="bottoms" role="tab">Bottoms</button>
            <button type="button" class="size-guide__tab" data-sg-tab="bra" role="tab">Bra</button>
          </div>
          <div class="size-guide__units" role="group" aria-label="Units">
            <button type="button" data-sg-unit="in" class="is-active">in</button>
            <button type="button" data-sg-unit="cm">cm</button>
          </div>
        </div>

        <div class="size-guide__panel" data-sg-panel="tops">
          <p class="size-guide__caption">Applies to: Built-In Support Tank (Crop &amp; Full) · Training Tee</p>
          <div class="size-guide__scroll"><table data-sg-table="tops"></table></div>
          <h3 class="size-guide__h3">Fit &amp; length</h3>
          <p class="size-guide__note">Crop Tank - hits at the high hip, above the navel. · Full Tank - hits at the hip, fully layerable. · Training Tee - semi-fitted, hip-length with a curved drop-tail back hem. The tee skims (it does not compress); size up if you want it looser.</p>
        </div>

        <div class="size-guide__panel" data-sg-panel="bottoms" hidden>
          <p class="size-guide__caption">Applies to: High-Waist Leggings · Seamless Matching Short</p>
          <div class="size-guide__scroll"><table data-sg-table="bottoms"></table></div>
          <h3 class="size-guide__h3">Length options</h3>
          <div class="size-guide__scroll"><table data-sg-table="length"></table></div>
          <p class="size-guide__note">Full - hits at the ankle. · Long - adds length for taller frames (5'7"+). · Short - mid-thigh, matches the co-ord set. Rise is held constant across all sizes for true high-rise coverage.</p>
        </div>

        <div class="size-guide__panel" data-sg-panel="bra" hidden>
          <p class="size-guide__caption">Applies to: Longline Sports Bra - medium impact, pull-on, cup-inclusive (no separate band/cup)</p>
          <div class="size-guide__scroll"><table data-sg-table="bra"></table></div>
          <h3 class="size-guide__h3">Know your bra size? Find your Rivlet size</h3>
          <p class="size-guide__caption">Match your usual band + cup to your Rivlet alpha size.</p>
          <div class="size-guide__scroll"><table data-sg-table="bracup"></table></div>
          <p class="size-guide__note">The Longline Bra is medium-impact - built for lifting, yoga, pilates and functional training, not high-impact running. Ships with a removable molded pad shaped for a wider, softer apex.</p>
        </div>

        <div class="size-guide__measure">
          <h3 class="size-guide__h3">How to measure</h3>
          <dl>
            <dt>Bust</dt><dd>Measure around the fullest part of your chest, keeping the tape firm and level under your armpits and across your shoulder blades.</dd>
            <dt>Under-bust</dt><dd>Measure snugly around your ribcage, directly under your bust where a bra band sits.</dd>
            <dt>Waist</dt><dd>Measure around the narrowest part of your natural waist. Slip a finger between the tape and your body for ease.</dd>
            <dt>Hip</dt><dd>Measure around the fullest part of your hips and seat, keeping the tape level.</dd>
            <dt>Inseam</dt><dd>Measure a pair of leggings that fit you well - along the inner seam, from crotch to hem.</dd>
          </dl>
          <p class="size-guide__hint">For the most accurate fit, measure in your underwear with the tape snug but not tight.</p>
        </div>

        <div class="size-guide__contact">
          <strong>Still unsure on size?</strong>
          <p>Message our team and we’ll help you find your fit - <a href="mailto:hello@therivlet.com">hello@therivlet.com</a></p>
        </div>
      </div>
    </div>`

  document.body.appendChild(root)

  if (!bound) {
    bound = true
    root.addEventListener('click', (e) => {
      const t = e.target as HTMLElement
      if (t.closest('[data-sg-close]')) {
        closeSizeGuide()
        return
      }
      const tabBtn = t.closest<HTMLElement>('[data-sg-tab]')
      if (tabBtn?.dataset.sgTab) {
        tab = tabBtn.dataset.sgTab as SizeGuideTab
        renderTables(root!)
        return
      }
      const unitBtn = t.closest<HTMLElement>('[data-sg-unit]')
      if (unitBtn?.dataset.sgUnit) {
        unit = unitBtn.dataset.sgUnit as SizeGuideUnit
        renderTables(root!)
      }
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root?.classList.contains('is-open')) closeSizeGuide()
    })
  }

  return root
}

export function openSizeGuide(initialTab: SizeGuideTab = 'tops'): void {
  const root = ensureModal()
  tab = initialTab
  renderTables(root)
  root.classList.add('is-open')
  root.setAttribute('aria-hidden', 'false')
  document.body.classList.add('size-guide-open')
  root.querySelector<HTMLElement>('[data-sg-close].icon-btn')?.focus()
}

export function closeSizeGuide(): void {
  const root = document.querySelector<HTMLElement>('[data-size-guide]')
  if (!root) return
  root.classList.remove('is-open')
  root.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('size-guide-open')
}
