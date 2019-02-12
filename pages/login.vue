<template>
  <div id="container">
    <b-container class="bv-example-row">
      <b-form method="post" @submit.prevent="onSubmit">
        <b-form-group label="Имя пользователя">
          <b-form-input v-model="user.username" type="text" placeholder="Введите имя пользователя" required/>
        </b-form-group>
        <b-form-group label="Пароль">
          <b-form-input v-model="user.password" type="password" placeholder="Введите пароль" required/>
        </b-form-group>
        <b-button type="submit" variant="primary">Логин</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async onSubmit(evt) {
      try {
        await this.$auth.loginWith('local', {
          data: {
            username: this.user.username,
            password: this.user.password
          }
        })
        const res = await this.$axios.get('/api/auth/user')
        const user = {
          username: res.data.username
        }
        this.$store.commit('setUser', user)
        this.$router.push('/')
        window.location.reload(true)
      }
      catch (e) {
        console.log(e)
      }
    }
  }
}
</script>