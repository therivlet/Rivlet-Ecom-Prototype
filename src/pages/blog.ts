import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { defaultShopCta, renderContentPage } from '../ui/contentPage'

renderContentPage({
  title: 'Blog',
  eyebrow: 'Journal',
  headline: 'Fabric notes, heat tips, quiet launches.',
  lede: 'Short reads from the studio - how platforms behave, what early Circle members ask, and what we’re shipping next.',
  sections: [
    {
      heading: 'Why SecondSkin™ feels different after hour three',
      body: 'A field note on friction, seams, and why “no patch” matters more than a marketing claim once the day gets long.',
    },
    {
      heading: 'Hard water, soft colour',
      body: 'How we pressure-test dye lots for mineral-heavy laundry - and what that means for Midnight and Cardamom after twenty washes.',
    },
    {
      heading: 'Building Looks, not just SKUs',
      body: 'Eight walk-out pairings, two colourways, one idea: finish the outfit without a second tab open.',
    },
  ],
  cta: defaultShopCta(),
})
