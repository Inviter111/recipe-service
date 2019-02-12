<template>
  <div id="container">
    <b-container class="bv-example-row edit-container">
      <b-row align-h="start">
        <b-form @submit.prevent="Submit" id="recipeForm">
          <b-form-group label="Username">
            <b-form-input v-model="user.username" required />
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input v-model="user.password" />
          </b-form-group>
          <b-form-group>
            <b-form-checkbox v-model="user.active">Active</b-form-checkbox>
            <b-form-checkbox v-model="user.admin">Admin</b-form-checkbox>
          </b-form-group>
          <b-button type="submit" variant="primary">Save</b-button>
        </b-form>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    const fetchedUser = await app.$axios.get(`api/auth/user/${app.context.params.id}`)
    return { 
      user: {
        username: fetchedUser.data.username,
        password: '',
        active: fetchedUser.data.active,
        admin: fetchedUser.data.admin
      }
    }
  },
  methods: {
    async Submit() {
      await this.$axios.put(`/api/auth/user/${this.$route.params.id}`, this.user)
    }
  }
}
</script>


<style scoped>
.edit-container {
  box-shadow: 0 4px 15px 0 rgba(0,0,0,.08);
}
#recipeForm {
  margin: 1rem;
}
</style>
