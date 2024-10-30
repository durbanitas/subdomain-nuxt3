// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  routeRules: { 
    '/**': { prerender: true },
  },

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});
