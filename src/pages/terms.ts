import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { defaultShopCta, renderContentPage } from '../ui/contentPage'

renderContentPage({
  title: 'Terms',
  eyebrow: 'Terms',
  headline: 'Clear terms. No fine-print theatre.',
  lede: 'Buying from Rivlet means you agree to the policies below covering orders, pricing, and site use.',
  sections: [
    {
      heading: 'Orders & pricing',
      body: 'Prices are shown in INR on therivlet.com. We confirm availability at checkout. We may cancel orders with pricing or stock errors and notify you promptly.',
    },
    {
      heading: 'Use of the site',
      body: 'Content, product imagery, and fabric names are Rivlet property. Don’t scrape, resell, or misrepresent the brand.',
    },
    {
      heading: 'Liability',
      body: 'We’re responsible for delivering what you ordered as described. We’re not liable for delays outside our control once a parcel is with the courier.',
    },
  ],
  cta: defaultShopCta(),
})
