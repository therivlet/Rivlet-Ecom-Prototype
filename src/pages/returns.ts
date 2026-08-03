import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { defaultShopCta, renderContentPage } from '../ui/contentPage'

renderContentPage({
  title: 'Returns',
  eyebrow: 'Returns & exchanges',
  headline: 'Try it. Keep what moves with you.',
  lede: 'Unused pieces with tags can be returned or exchanged within the window below. We’ll make the swap feel as quiet as the fabric.',
  sections: [
    {
      heading: 'Window',
      body: '7 days from delivery for size exchanges and returns of unused items with original tags and packaging.',
    },
    {
      heading: 'How to start',
      body: 'Use Track order with your order ID, or email hello@therivlet.com. We’ll send a prepaid label where the lane supports it.',
    },
    {
      heading: 'What we can’t take back',
      body: 'Worn, washed, or altered pieces; intimate items without hygiene seals where applicable; final-sale marked drops.',
    },
  ],
  cta: defaultShopCta(),
})
