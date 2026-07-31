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
  setWith?: string[]
  cupInclusive?: boolean
}

export const COLORS: Record<Colorway, ColorInfo> = {
  midnight: { id: 'midnight', name: 'Midnight', hex: '#1A1208' },
  cardamom: { id: 'cardamom', name: 'Cardamom', hex: '#7A5C3A' },
}

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', '2XL']

export const SITUATIONS: { id: Situation; label: string; blurb: string }[] = [
  { id: 'gym', label: 'Gym', blurb: 'Lift, run, stretch — stay dry and secure.' },
  { id: 'yoga', label: 'Yoga', blurb: 'Second-skin move without ride-up or dig.' },
  { id: 'office', label: 'Office', blurb: 'Boardroom-ready pieces that still perform.' },
  { id: 'travel', label: 'Travel', blurb: 'Fresh longer. Light on the body.' },
  { id: 'summer', label: 'Summer', blurb: 'Engineered for heat and humidity.' },
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
      { title: 'Inner-thigh chafe', solution: 'Flatlock inseam + bonded outer construction — zero rub in heat.' },
      { title: 'Damp waistband', solution: 'Wicking inner-waistband facing so the band never sits wet against skin.' },
      { title: 'No pocket that holds', solution: 'Bonded thigh phone pockets, bartacked for motion + interior key pocket.' },
    ],
    tech: [
      'AquaFlow™ tetra-channel wicking',
      'UPF knit for commute & outdoor work',
      'No-roll plush-back 5" waistband',
      'South-Asian high-rise block, XS–2XL',
    ],
    fitNotes: 'True high-rise second-skin fit. Sized for South-Asian proportions across XS–2XL.',
    situations: ['gym', 'yoga', 'summer', 'travel'],
    colors: [COLORS.midnight, COLORS.cardamom],
    sizes: SIZES,
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
    feeling: 'Medium support without the dig. The under-bust zone stays dry — the place longline bras usually leave wet.',
    problems: [
      { title: 'Under-bust sweat patch', solution: 'Zoned breathable sweat-barrier at the band — the un-engineered longline zone.' },
      { title: 'End-of-day odor', solution: 'Silver-ion (Ag⁺) in cup and under-bust knit.' },
      { title: 'Outline anxiety', solution: 'Molded removable pads + power-mesh liner for opacity.' },
    ],
    tech: [
      'SecondSkin™ seamless circular knit',
      'Zoned under-bust sweat-barrier (hero)',
      'Power-mesh cup liner + removable molded pads',
      'Cup-inclusive South-Asian grading',
    ],
    fitNotes: 'Medium-impact. Cup-inclusive grading (P1/P2/P3 pads). Distributed ribbed straps — nothing that digs by evening.',
    situations: ['gym', 'yoga', 'summer'],
    colors: [COLORS.midnight, COLORS.cardamom],
    sizes: SIZES,
    cupInclusive: true,
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
    feeling: 'Light support built in. Gym to life without a second layer — and without under-bust damp.',
    problems: [
      { title: 'Needing a bra under everything', solution: 'Internal power-mesh support shelf — light support, optional pads.' },
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
    feeling: 'The same engineered calm as the crop — full length for layering, commuting, and evenings that start at the gym.',
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
    gsm: '180–210 GSM',
    fit: 'True high-rise · 5" inseam',
    mrp: 1499,
    heroFeature: 'Silicone gripper at waist + both leg-bands',
    benefitChip: 'No chafe',
    feeling: 'A short that stays put. Seamless through the thighs. Matched to the crop for a true co-ord set.',
    problems: [
      { title: 'Inner-thigh chafe', solution: 'Seamless circular knit — no inseam rub zone.' },
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
      { title: 'Yellow underarm staining', solution: 'Barrier membrane + Ag⁺ chemistry — no oxidation ring.' },
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
    setWith: ['RVL-LEG-001', 'RVL-SHT-004'],
  },
]

export const COORD_SET = {
  id: 'SET-CROP-SHORT',
  name: 'Crop + Short Co-ord',
  topId: 'RVL-TNK-003-C',
  bottomId: 'RVL-SHT-004',
  blurb: 'One fabric. One colour. Graded together — so one design sells as a set.',
}

export function formatPrice(inr: number): string {
  return `₹${inr.toLocaleString('en-IN')}`
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export const FABRIC_PLATFORMS: {
  id: FabricPlatform
  label: string
  blurb: string
  outcome: string
}[] = [
  {
    id: 'AquaFlow™',
    label: 'AquaFlow™',
    blurb: 'Visibly dry. Chafe-free. Built for humidity.',
    outcome: 'Leggings that disappear on the body',
  },
  {
    id: 'SecondSkin™',
    label: 'SecondSkin™',
    blurb: 'Seamless support. Zoned barriers. All-day fresh.',
    outcome: 'Bra, tanks & short — one fabric language',
  },
  {
    id: 'NeutralCore™',
    label: 'NeutralCore™',
    blurb: 'No patch. No yellow stain. Commute-ready.',
    outcome: 'The tee that doesn’t announce your workout',
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
  { name: 'Divya S.', city: 'Hyderabad', text: 'Crop + short as a set feels intentional — same handfeel, same colour depth.', stars: 5 },
]
