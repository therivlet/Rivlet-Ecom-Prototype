import {
  FABRIC_PLATFORMS,
  SITUATIONS,
  products,
  type Product,
} from './data/products'

export interface SearchSuggestion {
  type: 'product' | 'situation' | 'platform' | 'collection'
  label: string
  blurb?: string
  href: string
  productId?: string
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/™/g, '').trim()
}

function tokens(q: string): string[] {
  return normalize(q).split(/\s+/).filter(Boolean)
}

function productHaystack(p: Product): string {
  return normalize(
    [
      p.name,
      p.shortName,
      p.role,
      p.category,
      p.platform,
      p.feeling,
      p.heroFeature,
      p.benefitChip,
      ...p.situations,
      ...p.tech,
    ].join(' '),
  )
}

export function searchProducts(query: string, limit = 8): Product[] {
  const t = tokens(query)
  if (!t.length) return []
  const scored = products
    .map((p) => {
      const hay = productHaystack(p)
      let score = 0
      for (const tok of t) {
        if (normalize(p.name).includes(tok)) score += 8
        else if (normalize(p.shortName).includes(tok)) score += 6
        else if (normalize(p.platform).includes(tok)) score += 4
        else if (hay.includes(tok)) score += 2
        else return { p, score: -1 }
      }
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((x) => x.p)
}

/** Opening the search: curated starters before typing. */
export function defaultSuggestions(shopHref: (p?: Record<string, string>) => string, brand: string): SearchSuggestion[] {
  const topProducts = products.slice(0, 4).map((p) => ({
    type: 'product' as const,
    label: p.name,
    blurb: `${p.platform} · ${p.role}`,
    href: `${brand}product/?id=${encodeURIComponent(p.id)}`,
    productId: p.id,
  }))

  const situations = SITUATIONS.slice(0, 3).map((s) => ({
    type: 'situation' as const,
    label: s.label,
    blurb: s.blurb,
    href: shopHref({ situation: s.id }),
  }))

  const platforms = FABRIC_PLATFORMS.map((f) => ({
    type: 'platform' as const,
    label: f.label,
    blurb: f.outcome,
    href: shopHref({ platform: f.id }),
  }))

  return [
    {
      type: 'collection',
      label: 'Collection',
      blurb: 'Six engineered pieces · Midnight & Cardamom',
      href: shopHref(),
    },
    ...situations,
    ...platforms.slice(0, 2),
    ...topProducts,
  ]
}

export function liveSuggestions(
  query: string,
  shopHref: (p?: Record<string, string>) => string,
  brand: string,
): SearchSuggestion[] {
  const q = query.trim()
  if (!q) return defaultSuggestions(shopHref, brand)

  const t = tokens(q)
  const out: SearchSuggestion[] = []

  for (const s of SITUATIONS) {
    if (t.some((tok) => normalize(s.label).includes(tok) || normalize(s.blurb).includes(tok))) {
      out.push({
        type: 'situation',
        label: s.label,
        blurb: s.blurb,
        href: shopHref({ situation: s.id }),
      })
    }
  }

  for (const f of FABRIC_PLATFORMS) {
    const hay = normalize(`${f.label} ${f.outcome} ${f.blurb}`)
    if (t.some((tok) => hay.includes(tok))) {
      out.push({
        type: 'platform',
        label: f.label,
        blurb: f.outcome,
        href: shopHref({ platform: f.id }),
      })
    }
  }

  if (t.some((tok) => ['edit', 'collection', 'women', 'shop'].some((w) => w.startsWith(tok) || tok.startsWith(w)))) {
    out.unshift({
      type: 'collection',
      label: 'Collection',
      blurb: 'View the full collection',
      href: shopHref({ q }),
    })
  }

  for (const p of searchProducts(q, 6)) {
    out.push({
      type: 'product',
      label: p.name,
      blurb: `${p.platform} · ${formatBlurbPrice(p.mrp)}`,
      href: `${brand}product/?id=${encodeURIComponent(p.id)}`,
      productId: p.id,
    })
  }

  if (!out.length) {
    out.push({
      type: 'collection',
      label: `Search “${q}” in The Edit`,
      blurb: 'Browse all pieces',
      href: shopHref({ q }),
    })
  }

  return out.slice(0, 10)
}

function formatBlurbPrice(mrp: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(mrp)
}
