// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  routeRules: { 
    '/': { prerender: true },
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});
