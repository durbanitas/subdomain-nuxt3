// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true, 
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});
