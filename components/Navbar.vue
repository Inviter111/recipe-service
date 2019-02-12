<template>
    <b-navbar id="navbar" type="dark" toggleable="md" variant="dark" style="padding-left: 8px;">
      <nuxt-link to="/" tag="a" class="navbar-brand home" style="padding-left: 16px; padding-top: 2px;">Home</nuxt-link>
      <b-nav-item v-if="isAuthenticated" to="/recipes">Recipes</b-nav-item>
      <b-nav-item v-if="$store.state.user.admin && isAuthenticated" to="/activity">Activity</b-nav-item>
      <b-navbar-nav class="ml-auto">
        <b-navbar-nav v-if="isAuthenticated">
          <b-nav-item to="/user">{{ $store.state.user.username }}</b-nav-item>
          <b-nav-item to="/create" v-if="$store.$auth.$state.user.user.active">Create</b-nav-item>
          <b-nav-item @click="$auth.logout()">Logout</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav v-else>
          <b-nav-item to="/login">Login</b-nav-item>
          <b-nav-item to="/register">Register</b-nav-item>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  async created() {
    try {
      const token = localStorage.getItem('auth._token.local').split(' ')[1] // Token looks like 'Bearer *token*'
      if (token) {
        const res = await this.$axios.get('/api/auth/user')
        const user = {
          username: res.data.user.username,
          admin: res.data.user.admin
        }
        this.$store.commit('setUser', user)
        this.$store.commit('setToken', token)
      }
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
