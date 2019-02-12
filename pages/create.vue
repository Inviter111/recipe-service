<template>
  <div id="container">
    <b-container class="bv-example-row">
      <b-form @submit.prevent="onSubmit">
        <b-form-group label="Название рецепта">
          <b-form-input v-model="form.title" type="text" placeholder="Введите название рецепта" required/>
        </b-form-group>
        <b-form-group label="Введите описание рецепта">
          <b-form-textarea v-model="form.description" type="text" placeholder="Введите описание рецепта" rows="3" required/>
        </b-form-group>
        <b-form-group label="Выберите тип рецепта" label-for="recipeType">
          <b-form-select id="recipeType" :options="recipeTypes" required v-model="form.recipeType"/>
        </b-form-group>
        <b-form-group label="Введите шаги приготовления рецепта">
          <b-form-textarea v-model="form.steps" type="text" placeholder="Введите шаги приготовления рецепта" rows="6" required/>
        </b-form-group>
        <b-form-group label="Хэштеги">
          <b-form-input v-model="form.hashtags" type="text" placeholder="Введите хэштеги (по желанию)" />
        </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="form.editable">Изменяемый рецепт</b-form-checkbox>
          <b-form-checkbox v-model="form.private">Приватный рецепт</b-form-checkbox>
        </b-form-group>
        <b-form-group label="Конечное фото">
          <b-form-file v-model="form.image.data" @change="ImageChange" :state="Boolean(form.image.data)" placeholder="Выберите фотографию..." accept="image/jpeg, image/png" required></b-form-file>
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
      form: {
        title: '',
        description: '',
        steps: '',
        recipeType: null,
        hashtags: '',
        editable: true,
        private: false,
        image: {
          data: null,
          contentType: null
        }
      },
      recipeTypes: [
        { text: 'Выберите одно', value: null },
        'Салат', 'Первое', 'Второе', 'Суп', 'Десерт', 'Напиток'
      ]
    }
  },
  middleware: ['auth', 'banned'],
  methods: {
    async onSubmit() {
      await this.$axios.post('/api/recipes/create', this.form)
      await this.$router.push('/')
    },
    ImageChange(event) {
      const f = event.target.files[0]
      this.form.image.contentType = event.target.files[0].type
      const reader = new FileReader()
      reader.onload = ((file) => {
        return (e) => {
          let binaryData = e.target.result
          let base64String = window.btoa(binaryData)
          this.form.image.data = base64String
        }
      })(f)
      reader.readAsBinaryString(f)
    }
  }
}
</script>
