import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        shop: 'shop/index.html',
        product: 'product/index.html',
        look: 'look/index.html',
        sets: 'sets/index.html',
        stories: 'stories/index.html',
        checkout: 'checkout/index.html',
        confirmation: 'confirmation/index.html',
        account: 'account/index.html',
        about: 'about/index.html',
        faq: 'faq/index.html',
        blog: 'blog/index.html',
        contact: 'contact/index.html',
        shipping: 'shipping/index.html',
        returns: 'returns/index.html',
        privacy: 'privacy/index.html',
        terms: 'terms/index.html',
        track: 'track/index.html',
      },
    },
  },
})
