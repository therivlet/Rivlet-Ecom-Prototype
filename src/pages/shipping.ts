import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { defaultShopCta, renderContentPage } from '../ui/contentPage'

renderContentPage({
  title: 'Shipping',
  eyebrow: 'Shipping policy',
  headline: 'Delivered with the same calm as the kit.',
  lede: 'We ship across India first, with clear timelines at checkout and tracking the moment your order leaves the studio.',
  sections: [
    {
      heading: 'Standard',
      body: '4–6 business days for most pin codes. Free over ₹2,999. You’ll receive tracking as soon as the parcel is handed to the courier.',
    },
    {
      heading: 'Express',
      body: '2–3 business days where available. Express fees appear at checkout before you place the order.',
    },
    {
      heading: 'International',
      body: 'UK and UAE lanes are part of the Rivlet route map. Cross-border shipping opens with launch partners - watch The Circle for dates.',
    },
  ],
  cta: defaultShopCta(),
})
