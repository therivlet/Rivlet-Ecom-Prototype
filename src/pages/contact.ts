import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { renderContentPage } from '../ui/contentPage'

renderContentPage({
  title: 'Contact',
  eyebrow: 'Contact',
  headline: 'We’re here when you need a human.',
  lede: 'Orders, fit questions, wholesale curiosity - write or WhatsApp. We reply within one business day.',
  sections: [
    {
      heading: 'Email',
      body: 'hello@therivlet.com - for orders, returns, and product questions. Include your order ID when you have one.',
    },
    {
      heading: 'WhatsApp',
      body: 'Message Rivlet on WhatsApp for quick sizing help or shipping updates. Link from the footer anytime.',
    },
    {
      heading: 'Studio',
      body: 'Studio Madurai - visits by appointment. Press and partnership notes welcome at the same inbox.',
    },
  ],
  cta: {
    label: 'WhatsApp Rivlet',
    href: 'https://wa.me/916383491536?text=' + encodeURIComponent('Hi Rivlet - I need help with an order.'),
  },
})
