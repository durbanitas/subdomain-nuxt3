<script setup>
</script>

<template>
  <div>
    <h4>Home</h4>
    <nuxt-link target="_blank" to="http://demo.localhost:3000/ ">demo</nuxt-link>

    <ClientOnly>
      <h4>ClientOnly</h4>
    </ClientOnly>
  </div>
</template>