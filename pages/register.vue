<template>
  <div id="container">
    <b-container class="bv-example-row">
      <b-form @submit.prevent="onSubmit">
        <b-form-group label="Имя пользователя">
          <b-form-input v-model="user.username" type="text" placeholder="Введите желаемое имя пользователя" required/>
        </b-form-group>
        <b-form-group label="Пароль">
          <b-form-input v-model="user.password" :state="checkPass" type="password" placeholder="Введите пароль" required/>
        </b-form-group>
        <b-form-group label="Подтверждение пароля">
          <b-form-input v-model="confirmPass" :state="checkPass" type="password" placeholder="Введите корректный адрес электронной почты" required/>
        </b-form-group>
        <b-button type="submit" variant="primary">Добавить</b-button>
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
        password: '',
      },
      confirmPass: ''
    }
  },
  computed: {
    checkPass() {
      return this.user.password === this.confirmPass && this.user.password !== '' ? true : false
    }
  },
  methods: {
    async onSubmit(evt) {
      await this.$axios.post('/api/auth/register', this.user)
      await this.$router.push('/')
    }
  }
}
</script>
