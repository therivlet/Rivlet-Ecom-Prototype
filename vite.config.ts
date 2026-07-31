import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        shop: 'shop/index.html',
        product: 'product/index.html',
        sets: 'sets/index.html',
        stories: 'stories/index.html',
        checkout: 'checkout/index.html',
        confirmation: 'confirmation/index.html',
        account: 'account/index.html',
      },
    },
  },
})
