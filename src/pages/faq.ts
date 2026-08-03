import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { defaultShopCta, renderContentPage } from '../ui/contentPage'

renderContentPage({
  title: 'FAQs',
  eyebrow: 'Help',
  headline: 'Answers before you add to bag.',
  lede: 'Sizing, care, shipping, and how Rivlet pieces behave in heat and humidity.',
  sections: [
    {
      heading: 'Do I need a bra with Rivlet tops?',
      body: 'Most Rivlet tops are designed with built-in support so you can skip a separate bra for gym, yoga, and everyday wear. Use the size guide for cup-aware fit notes.',
    },
    {
      heading: 'How should I wash Rivlet?',
      body: 'Cold wash, mild detergent, hang dry when you can. Fabrics are colourfast for hard-water cycles - avoid fabric softener so wicking stays honest.',
    },
    {
      heading: 'When will my order ship?',
      body: 'Standard delivery is typically 4–6 days across India. Express options appear at checkout when available. Track anytime from Track order.',
    },
    {
      heading: 'Can I exchange sizes?',
      body: 'Yes - unused pieces with tags within the returns window. See Returns & exchanges for timelines and how to start a swap.',
    },
  ],
  cta: defaultShopCta(),
})
