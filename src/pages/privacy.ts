import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { defaultShopCta, renderContentPage } from '../ui/contentPage'

renderContentPage({
  title: 'Privacy',
  eyebrow: 'Privacy',
  headline: 'Your data stays as calm as the kit.',
  lede: 'We collect only what we need to fulfil orders, improve fit, and - if you join - keep The Circle useful.',
  sections: [
    {
      heading: 'What we collect',
      body: 'Account email, shipping details, order history, and optional Circle signup. Device wishlist and bag may stay local until you sign in.',
    },
    {
      heading: 'How we use it',
      body: 'Fulfilment, customer care, product improvement, and Circle notes you opted into. We do not sell personal data.',
    },
    {
      heading: 'Your choices',
      body: 'Update preferences in Account, leave The Circle anytime, or write hello@therivlet.com for access and deletion requests.',
    },
  ],
  cta: defaultShopCta(),
})
