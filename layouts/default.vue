<template>
  <div>
    <Navbar id="navbar" />
    <nuxt />
  </div>
</template>

<script>
import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>

<style scoped>
#navbar {
  list-style: none;
  padding-left: 0;
  margin-bottom: 16px;
}
</style>
