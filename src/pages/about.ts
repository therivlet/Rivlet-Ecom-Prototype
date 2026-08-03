import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/components.css'
import '../styles/pages.css'
import { defaultShopCta, renderContentPage } from '../ui/contentPage'

renderContentPage({
  title: 'About',
  eyebrow: 'Our story',
  headline: 'Engineered for Indian heat. Finished like a second skin.',
  lede: 'Rivlet began in Madurai with a simple brief: activewear that stays calm through humidity, hard water, and long days - without asking you to choose between support and ease.',
  sections: [
    {
      heading: 'Why we exist',
      body: 'Most performance kits were graded for cooler climates and different proportions. We design for South-Asian bodies, mineral-heavy laundry, and the commute-to-class rhythm of real weeks.',
    },
    {
      heading: 'Studio Madurai',
      body: 'Fit sessions, fabric trials, and colour work happen close to the climate we serve. Studio Madurai is where AquaFlow™, SecondSkin™, and NeutralCore™ earn their keep before they reach a hangtag.',
    },
    {
      heading: 'India → UK → UAE',
      body: 'We start where the heat is honest, then expand along the routes our customers already live - with the same platforms, the same block, the same quiet confidence.',
    },
  ],
  cta: defaultShopCta(),
})

document.querySelectorAll('.content-block')[1]?.setAttribute('id', 'studio')

if (location.hash === '#studio') {
  requestAnimationFrame(() => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })
  })
}
