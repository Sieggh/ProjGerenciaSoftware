<template>
  <transition name="route-fade" mode="out-in">
    <router-view />
  </transition>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body, button {
  font-family: 'Poppins', sans-serif;
}
.route-fade-enter-active, .route-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.route-fade-enter, .route-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>