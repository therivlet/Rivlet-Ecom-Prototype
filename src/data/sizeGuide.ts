import type { Category } from './products'

export type SizeGuideTab = 'tops' | 'bottoms' | 'bra'
export type SizeGuideUnit = 'in' | 'cm'

export const SIZE_GUIDE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const
export const SIZE_GUIDE_US = ['0–2', '2–4', '6–8', '10–12', '14', '16'] as const

export const SIZE_GUIDE_INTRO =
  'Rivlet fits are engineered for South Asian proportions with a body-skimming, second-skin feel. If you’re between sizes, size down for compression pieces (leggings, bra, short) and up for a relaxed layer (tee). Measurements are body measurements - measure yourself, don’t measure a garment.'

type Dual = Record<SizeGuideUnit, string[]>

export const SIZE_GUIDE_BUST: Dual = {
  in: ['32–34', '34–36', '36–38', '38–40', '40–42.5', '42.5–45'],
  cm: ['81–86', '86–91', '91–96', '96–101', '101–108', '108–114'],
}

export const SIZE_GUIDE_WAIST: Dual = {
  in: ['26–28', '28–30', '30–32', '32–34.5', '34.5–37', '37–40'],
  cm: ['66–71', '71–76', '76–81', '81–88', '88–94', '94–101'],
}

export const SIZE_GUIDE_HIP: Dual = {
  in: ['35–37', '37–39', '39–41', '41–43.5', '43.5–46', '46–49'],
  cm: ['89–94', '94–99', '99–104', '104–110', '110–117', '117–124'],
}

export const SIZE_GUIDE_UNDERBUST: Dual = {
  in: ['25–27', '27–29', '29–31', '31–33', '33–36', '36–39'],
  cm: ['63–68', '68–73', '73–78', '78–84', '84–91', '91–99'],
}

export const SIZE_GUIDE_HEIGHT: Dual = {
  in: ['5\'0"–5\'4"', '5\'2"–5\'6"', '5\'3"–5\'7"', '5\'4"–5\'8"', '5\'5"–5\'9"', '5\'5"–5\'10"'],
  cm: ['152–163', '157–168', '160–170', '163–173', '165–175', '165–178'],
}

export const SIZE_GUIDE_WEIGHT: Dual = {
  in: ['99–115 lb', '115–130 lb', '130–146 lb', '146–163 lb', '163–183 lb', '183–205 lb'],
  cm: ['45–52 kg', '52–59 kg', '59–66 kg', '66–74 kg', '74–83 kg', '83–93 kg'],
}

export const SIZE_GUIDE_LENGTH: Dual = {
  in: ['25"', '27"', '5"'],
  cm: ['63.5', '68.5', '12.7'],
}

/** Band → A B C D DD Rivlet alpha sizes */
export const SIZE_GUIDE_BRACUP: string[][] = [
  ['30', 'XS', 'XS', 'S', 'S', 'M'],
  ['32', 'XS', 'S', 'S', 'M', 'M'],
  ['34', 'S', 'S', 'M', 'M', 'L'],
  ['36', 'M', 'M', 'L', 'L', 'XL'],
  ['38', 'L', 'L', 'XL', 'XL', '2XL'],
  ['40', 'XL', 'XL', '2XL', '2XL', '2XL'],
]

export function sizeGuideTabForCategory(category: Category): SizeGuideTab {
  if (category === 'bra') return 'bra'
  if (category === 'leggings' || category === 'shorts') return 'bottoms'
  return 'tops'
}
