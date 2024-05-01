<template>
  <div class="wrapper">
    <nav>
      <RouterLink to="/">Elevator (1st level)</RouterLink> |
      <RouterLink to="/hard">Elevator (2st level)</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style lang="scss">
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
