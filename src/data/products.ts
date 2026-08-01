export type Colorway = 'midnight' | 'cardamom'
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL'
export type Category = 'leggings' | 'bra' | 'tops' | 'shorts' | 'tee'
export type Situation = 'gym' | 'yoga' | 'office' | 'travel' | 'summer'
export type FabricPlatform = 'AquaFlow™' | 'SecondSkin™' | 'NeutralCore™'

export interface ColorInfo {
  id: Colorway
  name: string
  hex: string
}

export interface Product {
  id: string
  name: string
  shortName: string
  role: string
  category: Category
  platform: FabricPlatform
  material: string
  gsm: string
  fit: string
  support?: string
  mrp: number
  heroFeature: string
  benefitChip: string
  feeling: string
  problems: { title: string; solution: string }[]
  tech: string[]
  fitNotes: string
  situations: Situation[]
  colors: ColorInfo[]
  sizes: Size[]
  /** Public paths relative to site root, keyed by colorway (e.g. media/products/…). */
  images?: Partial<Record<Colorway, string[]>>
  setWith?: string[]
  cupInclusive?: boolean
}

export const COLORS: Record<Colorway, ColorInfo> = {
  midnight: { id: 'midnight', name: 'Midnight', hex: '#1A1208' },
  cardamom: { id: 'cardamom', name: 'Cardamom', hex: '#7A5C3A' },
}

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', '2XL']

export const SITUATIONS: { id: Situation; label: string; blurb: string; image: string }[] = [
  { id: 'summer', label: 'Summer', blurb: 'Built for heat and humidity.', image: 'media/situations/summer.png' },
  { id: 'gym', label: 'Gym', blurb: 'Dry under load. Secure through every set.', image: 'media/situations/gym.png' },
  { id: 'yoga', label: 'Yoga', blurb: 'Second-skin hold. No ride-up. No dig.', image: 'media/situations/yoga.png' },
  { id: 'office', label: 'Office', blurb: 'Composed lines that still perform.', image: 'media/situations/office.png' },
  { id: 'travel', label: 'Travel', blurb: 'Light on the body. Fresh for longer.', image: 'media/situations/travel.png' },
]

export const products: Product[] = [
  {
    id: 'RVL-LEG-001',
    name: 'High-Waist Leggings',
    shortName: 'Leggings',
    role: 'Launch anchor',
    category: 'leggings',
    platform: 'AquaFlow™',
    material: '78% Nylon-66 / 22% Lycra® Elastane',
    gsm: '220 GSM',
    fit: 'High-rise, second-skin compression',
    mrp: 1799,
    heroFeature: 'No-roll 5" waistband + bonded thigh phone pockets',
    benefitChip: 'No ride-up',
    feeling: 'Compression that disappears. A waistband that stays put. Pockets that actually hold a phone while you move.',
    problems: [
      { title: 'Inner-thigh chafe', solution: 'Flatlock inseam + bonded outer construction - zero rub in heat.' },
      { title: 'Damp waistband', solution: 'Wicking inner-waistband facing so the band never sits wet against skin.' },
      { title: 'No pocket that holds', solution: 'Bonded thigh phone pockets, bartacked for motion + interior key pocket.' },
    ],
    tech: [
      'AquaFlow™ tetra-channel wicking',
      'UPF knit for commute & outdoor work',
      'No-roll plush-back 5" waistband',
      'South-Asian high-rise block, XS-2XL',
    ],
    fitNotes: 'True high-rise second-skin fit. Sized for South-Asian proportions across XS-2XL.',
    situations: ['gym', 'yoga', 'summer', 'travel'],
    colors: [COLORS.midnight, COLORS.cardamom],
    sizes: SIZES,
    images: {
      midnight: [
        'media/products/midnight-leggings-1.png',
        'media/products/midnight-leggings-4.png',
        'media/products/midnight-leggings-3.png',
        'media/products/midnight-leggings-2.png',
      ],
      cardamom: [
        'media/products/cardamom-leggings-1.png',
        'media/products/cardamom-leggings-2.png',
        'media/products/cardamom-leggings-3.png',
        'media/products/cardamom-leggings-4.png',
      ],
    },
    setWith: ['RVL-BRA-002', 'RVL-TEE-005'],
  },
  {
    id: 'RVL-BRA-002',
    name: 'Longline Sports Bra',
    shortName: 'Sports Bra',
    role: 'Hero pair',
    category: 'bra',
    platform: 'SecondSkin™',
    material: '92% Nylon / 8% Elastane (seamless)',
    gsm: '200 GSM',
    fit: 'Scoop neck · crossback',
    support: 'Medium-impact',
    mrp: 1299,
    heroFeature: 'Zoned under-bust sweat-barrier',
    benefitChip: 'No patch',
    feeling: 'Medium support without the dig. The under-bust zone stays dry - the place longline bras usually leave wet.',
    problems: [
      { title: 'Under-bust sweat patch', solution: 'Zoned breathable sweat-barrier at the band - the un-engineered longline zone.' },
      { title: 'End-of-day odor', solution: 'Silver-ion (Ag⁺) in cup and under-bust knit.' },
      { title: 'Outline anxiety', solution: 'Molded removable pads + power-mesh liner for opacity.' },
    ],
    tech: [
      'SecondSkin™ seamless circular knit',
      'Zoned under-bust sweat-barrier (hero)',
      'Power-mesh cup liner + removable molded pads',
      'Cup-inclusive South-Asian grading',
    ],
    fitNotes: 'Medium-impact. Cup-inclusive grading (P1/P2/P3 pads). Distributed ribbed straps - nothing that digs by evening.',
    situations: ['gym', 'yoga', 'summer'],
    colors: [COLORS.midnight, COLORS.cardamom],
    sizes: SIZES,
    cupInclusive: true,
    images: {
      midnight: [
        'media/products/midnight-bra-1.png',
        'media/products/midnight-bra-2.png',
        'media/products/midnight-bra-3.png',
        'media/products/midnight-bra-4.png',
      ],
      cardamom: [
        'media/products/cardamom-bra-1.png',
        'media/products/cardamom-bra-2.png',
      ],
    },
    setWith: ['RVL-LEG-001', 'RVL-SHT-004'],
  },
  {
    id: 'RVL-TNK-003-C',
    name: 'Built-in-Support Crop',
    shortName: 'Crop Tank',
    role: 'Differentiator · co-ord top',
    category: 'tops',
    platform: 'SecondSkin™',
    material: '92% Nylon / 8% Elastane (seamless)',
    gsm: '200 GSM',
    fit: 'Soft-square neck · U-back · crop',
    support: 'Light (gym strength, not cardio)',
    mrp: 1599,
    heroFeature: 'Built-in shelf + under-bust barrier + mid-back vent',
    benefitChip: 'No bra needed',
    feeling: 'Light support built in. Gym to life without a second layer - and without under-bust damp.',
    problems: [
      { title: 'Needing a bra under everything', solution: 'Internal power-mesh support shelf - light support, optional pads.' },
      { title: 'Under-bust sweat', solution: 'Zoned under-bust barrier + mid-back vent panel.' },
      { title: 'Gym → work → evening change', solution: 'Full-body Ag⁺ freshness with gym-to-life styling.' },
    ],
    tech: [
      'SecondSkin™ seamless knit',
      'Zoned under-bust barrier + mid-back vent',
      'Light power-mesh support shelf',
      'Anti-ride-up silicone gripper',
    ],
    fitNotes: 'Light support for strength days and everyday wear. Cup-inclusive with removable pads. Pair with Matching Short for the co-ord.',
    situations: ['gym', 'office', 'summer', 'travel'],
    colors: [COLORS.midnight, COLORS.cardamom],
    sizes: SIZES,
    cupInclusive: true,
    images: {
      midnight: [
        'media/products/midnight-crop-1.png',
        'media/products/midnight-crop-2.png',
      ],
      cardamom: [
        'media/products/cardamom-crop-1.png',
        'media/products/cardamom-crop-2.png',
        'media/products/cardamom-crop-3.png',
        'media/products/cardamom-crop-4.png',
      ],
    },
    setWith: ['RVL-SHT-004'],
  },
  {
    id: 'RVL-TNK-003-F',
    name: 'Built-in-Support Full Tank',
    shortName: 'Full Tank',
    role: 'Differentiator · standalone / layer',
    category: 'tops',
    platform: 'SecondSkin™',
    material: '92% Nylon / 8% Elastane (seamless)',
    gsm: '200 GSM',
    fit: 'Soft-square neck · U-back · full length',
    support: 'Light (gym strength, not cardio)',
    mrp: 1599,
    heroFeature: 'Built-in shelf + under-bust barrier + mid-back vent',
    benefitChip: 'All-day fresh',
    feeling: 'The same engineered calm as the crop - full length for layering, commuting, and evenings that start at the gym.',
    problems: [
      { title: 'Needing a bra under everything', solution: 'Internal power-mesh support shelf with optional pads.' },
      { title: 'Sweat-soaked back on seats', solution: 'Mid-back mesh/pointelle vent panel.' },
      { title: 'One piece for the whole day', solution: 'Ag⁺ full body + standalone/layerable cut.' },
    ],
    tech: [
      'SecondSkin™ seamless knit',
      'Zoned under-bust barrier + mid-back vent',
      'Light power-mesh support shelf',
      'Gripper tuned to grip base layers',
    ],
    fitNotes: 'Full length for standalone or layering. Light support, cup-inclusive. Ideal office-to-evening piece.',
    situations: ['office', 'travel', 'gym', 'summer'],
    colors: [COLORS.midnight, COLORS.cardamom],
    sizes: SIZES,
    images: {
      midnight: [
        'media/products/midnight-tank-1.png',
        'media/products/midnight-tank-2.png',
        'media/products/midnight-tank-3.png',
        'media/products/midnight-tank-6.png',
        'media/products/midnight-tank-4.png',
        'media/products/midnight-tank-5.png',
        'media/products/midnight-tank-7.png',
      ],
      cardamom: [
        'media/products/cardamom-tank-1.png',
        'media/products/cardamom-tank-2.png',
        'media/products/cardamom-tank-3.png',
        'media/products/cardamom-tank-4.png',
      ],
    },
    cupInclusive: true,
    setWith: ['RVL-LEG-001', 'RVL-SHT-004'],
  },
  {
    id: 'RVL-SHT-004',
    name: 'Seamless Matching Short',
    shortName: 'Matching Short',
    role: 'AOV lever · co-ord bottom',
    category: 'shorts',
    platform: 'SecondSkin™',
    material: '92% Nylon / 8% Elastane (seamless)',
    gsm: '180-210 GSM',
    fit: 'True high-rise · 5" inseam',
    mrp: 1499,
    heroFeature: 'Silicone gripper at waist + both leg-bands',
    benefitChip: 'No chafe',
    feeling: 'A short that stays put. Seamless through the thighs. Matched to the crop for a true co-ord set.',
    problems: [
      { title: 'Inner-thigh chafe', solution: 'Seamless circular knit - no inseam rub zone.' },
      { title: 'Ride-up & slip', solution: 'Dotted silicone gripper at waist and both leg-bands.' },
      { title: 'Damp waistband', solution: 'Wicking inner waist zone + Ag⁺ hygiene gusset.' },
    ],
    tech: [
      'SecondSkin™ seamless tube knit',
      '10" true high-rise · 5" inseam',
      'Silicone gripper waist + legs',
      'Ag⁺ hygiene gusset',
    ],
    fitNotes: 'True high-rise, constant 5" inseam. Graded with the Crop for a matching set.',
    situations: ['gym', 'yoga', 'summer', 'travel'],
    colors: [COLORS.midnight, COLORS.cardamom],
    sizes: SIZES,
    images: {
      midnight: [
        'media/products/midnight-shorts-1.png',
        'media/products/midnight-shorts-2.png',
      ],
      cardamom: [
        'media/products/cardamom-shorts-1.png',
        'media/products/cardamom-shorts-2.png',
      ],
    },
    setWith: ['RVL-TNK-003-C'],
  },
  {
    id: 'RVL-TEE-005',
    name: 'Training Tee',
    shortName: 'Training Tee',
    role: 'Trial + trust entry',
    category: 'tee',
    platform: 'NeutralCore™',
    material: '88% Polyester / 12% Spandex + Ag⁺',
    gsm: '170 GSM',
    fit: 'Semi-fitted · curved drop-tail hem',
    mrp: 1299,
    heroFeature: 'Bonded underarm sweat-barrier shield',
    benefitChip: 'No yellow stain',
    feeling: 'The tee that doesn’t announce your workout. Underarms stay clean. Freshness holds through the day.',
    problems: [
      { title: 'Visible sweat patches', solution: 'Bonded underarm barrier stops sweat reaching the outer face.' },
      { title: 'Yellow underarm staining', solution: 'Barrier membrane + Ag⁺ chemistry - no oxidation ring.' },
      { title: 'One wear, done', solution: 'Full-body silver-ion odor control, wash after wash.' },
    ],
    tech: [
      'NeutralCore™ tetra-channel wicking',
      'Bonded underarm sweat-barrier (hero)',
      'Mid-back breathable mesh panel',
      'UPF + Ag⁺ full body',
    ],
    fitNotes: 'Semi-fitted so the underarm barrier sits flush and works. Curved drop-tail for coverage in motion.',
    situations: ['gym', 'office', 'travel', 'summer'],
    colors: [COLORS.midnight, COLORS.cardamom],
    sizes: SIZES,
    images: {
      midnight: [
        'media/products/midnight-tee-1.png',
        'media/products/midnight-tee-2.png',
        'media/products/midnight-tee-3.png',
      ],
      cardamom: [
        'media/products/cardamom-tee-1.png',
        'media/products/cardamom-tee-2.png',
        'media/products/cardamom-tee-3.png',
        'media/products/cardamom-tee-4.png',
        'media/products/cardamom-tee-5.png',
      ],
    },
    setWith: ['RVL-LEG-001', 'RVL-SHT-004'],
  },
]

export interface CoordSet {
  id: string
  slug: string
  name: string
  topId: string
  bottomId: string
  blurb: string
  /** Front + alt image paths per colourway (hover uses index 1). */
  images: Record<Colorway, [string, string]>
}

export const COORD_SETS: CoordSet[] = [
  {
    id: 'SET-BRA-SHORT',
    slug: 'bra-shorts',
    name: 'Sports Bra + Shorts',
    topId: 'RVL-BRA-002',
    bottomId: 'RVL-SHT-004',
    blurb: 'Support and hold, graded as one language.',
    images: {
      midnight: [
        'media/coords/bra-shorts-midnight-1.png',
        'media/coords/bra-shorts-midnight-2.png',
      ],
      cardamom: [
        'media/coords/bra-shorts-cardamom-1.png',
        'media/coords/bra-shorts-cardamom-2.png',
      ],
    },
  },
  {
    id: 'SET-BRA-LEG',
    slug: 'bra-leggings',
    name: 'Sports Bra + Leggings',
    topId: 'RVL-BRA-002',
    bottomId: 'RVL-LEG-001',
    blurb: 'Full-body hold for training days that run long.',
    images: {
      midnight: [
        'media/coords/bra-leggings-midnight-1.png',
        'media/coords/bra-leggings-midnight-2.png',
      ],
      cardamom: [
        'media/coords/bra-leggings-cardamom-1.png',
        'media/coords/bra-leggings-cardamom-2.png',
      ],
    },
  },
  {
    id: 'SET-TEE-SHORT',
    slug: 'tee-shorts',
    name: 'Training Tee + Shorts',
    topId: 'RVL-TEE-005',
    bottomId: 'RVL-SHT-004',
    blurb: 'Commute-ready top. Stay-put short underneath.',
    images: {
      midnight: [
        'media/coords/tee-shorts-midnight-1.png',
        'media/coords/tee-shorts-midnight-2.png',
      ],
      cardamom: [
        'media/coords/tee-shorts-cardamom-1.png',
        'media/coords/tee-shorts-cardamom-2.png',
      ],
    },
  },
  {
    id: 'SET-TEE-LEG',
    slug: 'tee-leggings',
    name: 'Training Tee + Leggings',
    topId: 'RVL-TEE-005',
    bottomId: 'RVL-LEG-001',
    blurb: 'The quiet uniform - from session to street.',
    images: {
      midnight: [
        'media/coords/tee-leggings-midnight-1.png',
        'media/coords/tee-leggings-midnight-2.png',
      ],
      cardamom: [
        'media/coords/tee-leggings-cardamom-1.png',
        'media/coords/tee-leggings-cardamom-2.png',
      ],
    },
  },
  {
    id: 'SET-TANK-LEG',
    slug: 'tank-leggings',
    name: 'Tank + Leggings',
    topId: 'RVL-TNK-003-F',
    bottomId: 'RVL-LEG-001',
    blurb: 'Full-length calm. Built-in support, all-day rise.',
    images: {
      midnight: [
        'media/coords/tank-leggings-midnight-1.png',
        'media/coords/tank-leggings-midnight-2.png',
      ],
      cardamom: [
        'media/coords/tank-leggings-cardamom-1.png',
        'media/coords/tank-leggings-cardamom-2.png',
      ],
    },
  },
  {
    id: 'SET-TANK-SHORT',
    slug: 'tank-shorts',
    name: 'Tank + Shorts',
    topId: 'RVL-TNK-003-F',
    bottomId: 'RVL-SHT-004',
    blurb: 'Layerable tank. Matched short. Heat-ready.',
    images: {
      midnight: [
        'media/coords/tank-shorts-midnight-1.png',
        'media/coords/tank-shorts-midnight-2.png',
      ],
      cardamom: [
        'media/coords/tank-shorts-cardamom-1.png',
        'media/coords/tank-shorts-cardamom-2.png',
      ],
    },
  },
  {
    id: 'SET-CROP-LEG',
    slug: 'crop-leggings',
    name: 'Crop + Leggings',
    topId: 'RVL-TNK-003-C',
    bottomId: 'RVL-LEG-001',
    blurb: 'Cropped support over leggings that disappear.',
    images: {
      midnight: [
        'media/coords/crop-leggings-midnight-1.png',
        'media/coords/crop-leggings-midnight-2.png',
      ],
      cardamom: [
        'media/coords/crop-leggings-cardamom-1.png',
        'media/coords/crop-leggings-cardamom-2.png',
      ],
    },
  },
  {
    id: 'SET-CROP-SHORT',
    slug: 'crop-shorts',
    name: 'Crop + Shorts',
    topId: 'RVL-TNK-003-C',
    bottomId: 'RVL-SHT-004',
    blurb: 'One fabric. One colour. Graded together.',
    images: {
      midnight: [
        'media/coords/crop-shorts-midnight-1.png',
        'media/coords/crop-shorts-midnight-2.png',
      ],
      cardamom: [
        'media/coords/crop-shorts-cardamom-1.png',
        'media/coords/crop-shorts-cardamom-2.png',
      ],
    },
  },
]

/** Featured / default co-ord (legacy alias). */
export const COORD_SET = COORD_SETS.find((s) => s.id === 'SET-CROP-SHORT')!

export function getCoordSet(id: string): CoordSet | undefined {
  return COORD_SETS.find((s) => s.id === id || s.slug === id)
}

export function getCoordImages(set: CoordSet, color: Colorway): [string, string] {
  return set.images[color]
}

export function coordSetPrice(set: CoordSet): number {
  const top = getProduct(set.topId)
  const bottom = getProduct(set.bottomId)
  return (top?.mrp ?? 0) + (bottom?.mrp ?? 0)
}

export function formatPrice(inr: number): string {
  return `₹${inr.toLocaleString('en-IN')}`
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductImages(product: Product, color: Colorway): string[] {
  return product.images?.[color] ?? []
}

export function getProductImage(product: Product, color: Colorway, index = 0): string | undefined {
  return getProductImages(product, color)[index]
}

export const FABRIC_PLATFORMS: {
  id: FabricPlatform
  label: string
  blurb: string
  outcome: string
  image: string
}[] = [
  {
    id: 'AquaFlow™',
    label: 'AquaFlow™',
    blurb: 'Visibly dry. Chafe-free. Built for humidity.',
    outcome: 'Leggings that disappear on the body',
    image: 'media/platforms/aquaflow.png',
  },
  {
    id: 'SecondSkin™',
    label: 'SecondSkin™',
    blurb: 'Seamless support. Zoned barriers. All-day fresh.',
    outcome: 'Bra, tanks & short - one fabric language',
    image: 'media/platforms/secondskin.png',
  },
  {
    id: 'NeutralCore™',
    label: 'NeutralCore™',
    blurb: 'No patch. No yellow stain. Commute-ready.',
    outcome: 'The tee that doesn’t announce your workout',
    image: 'media/platforms/neutralcore.png',
  },
]

export function filterProducts(opts: {
  situation?: Situation | null
  color?: Colorway | null
  category?: Category | null
  platform?: FabricPlatform | null
  form?: 'tops' | 'bottoms' | null
  q?: string | null
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'name'
}): Product[] {
  let list = [...products]
  if (opts.situation) list = list.filter((p) => p.situations.includes(opts.situation!))
  if (opts.category) list = list.filter((p) => p.category === opts.category)
  if (opts.color) list = list.filter((p) => p.colors.some((c) => c.id === opts.color))
  if (opts.platform) list = list.filter((p) => p.platform === opts.platform)
  if (opts.form === 'tops') list = list.filter((p) => ['bra', 'tops', 'tee'].includes(p.category))
  if (opts.form === 'bottoms') list = list.filter((p) => ['leggings', 'shorts'].includes(p.category))
  if (opts.q?.trim()) {
    const toks = opts.q
      .toLowerCase()
      .replace(/™/g, '')
      .split(/\s+/)
      .filter(Boolean)
    list = list.filter((p) => {
      const hay = [
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
      ]
        .join(' ')
        .toLowerCase()
        .replace(/™/g, '')
      return toks.every((t) => hay.includes(t))
    })
  }
  if (opts.sort === 'price-asc') list.sort((a, b) => a.mrp - b.mrp)
  if (opts.sort === 'price-desc') list.sort((a, b) => b.mrp - a.mrp)
  if (opts.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
  return list
}

export const REVIEWS = [
  { name: 'Ananya R.', city: 'Chennai', text: 'Finally a waistband that doesn’t roll in humidity. I forgot I was wearing them.', stars: 5 },
  { name: 'Meera K.', city: 'Bengaluru', text: 'The underarm claim on the tee is real. No patch after a packed commute.', stars: 5 },
  { name: 'Divya S.', city: 'Hyderabad', text: 'Crop + short as a set feels intentional - same handfeel, same colour depth.', stars: 5 },
  { name: 'Priya M.', city: 'Mumbai', text: 'Built-in support that stays calm through a full day. No second layer. No dig.', stars: 5 },
  { name: 'Kavya N.', city: 'Pune', text: 'After yoga and an auto ride home, still fresh. That silver-ion claim earns its keep.', stars: 5 },
]
