<template>
  <b-container class="bv-exaple-row edit-container">
    <b-row align-h="start">
      <b-form class="w-100" id="recipeForm">
        <b-form-group id="nameGroup" label="Название:" label-for="nameInput">
          <b-form-input id="nameInput" type="text" v-model="recipeData.data.recipe.title"/>
        </b-form-group>
        <b-form-group id="descriptionGroup" label="Описание:" label-for="descriptionInput">
          <b-form-textarea id="descriptionInput" rows="3" v-model="recipeData.data.recipe.description"/>
        </b-form-group>
        <b-form-group label="Выберите тип рецепта" label-for="recipeType">
          <b-form-select id="recipeType" :options="recipeTypes" required v-model="recipeData.data.recipe.recipeType"/>
        </b-form-group>
        <b-form-group label="Введите шаги приготовления рецепта">
          <b-form-textarea v-model="recipeData.data.recipe.steps" type="text" placeholder="Введите шаги приготовления рецепта" rows="6" required/>
        </b-form-group>
        <b-form-group label="Хэштеги">
          <b-form-input v-model="recipeData.data.recipe.hashtags" type="text" placeholder="Введите хэштеги (по желанию)" />
        </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="recipeData.data.recipe.editable">Изменяемый рецепт</b-form-checkbox>
          <b-form-checkbox v-model="recipeData.data.recipe.private">Приватный рецепт</b-form-checkbox>
          <b-form-checkbox v-if="$store.state.user.admin" v-model="recipeData.data.recipe.active">Активный рецепт</b-form-checkbox>
        </b-form-group>
        <b-form-group label="Конечное фото">
          <b-form-file v-model="image.data" @change="ImageChange" placeholder="Выберите фотографию..." accept="image/jpeg, image/png"></b-form-file>
        </b-form-group>
        <b-button type="submit" variant="primary" @click.prevent="Submit">Save</b-button>
        <b-button variant="danger" @click.prevent="DeletePost" class="float-right">Delete</b-button>
      </b-form>
    </b-row>
  </b-container>    
</template>

<style scoped>
.edit-container {
  box-shadow: 0 4px 15px 0 rgba(0,0,0,.08);
}
#recipeForm {
  margin: 1rem;
}
</style>

<script>
export default {
  async asyncData({ app }) {
    const recipeData = await app.$axios.get(`/api/recipes/recipe/${app.context.params.id}`)
    try {
      recipeData.data.recipe.hashtags = recipeData.data.recipe.hashtags.join(' ')
    } catch (e) {}
    return { recipeData }
  },
  data() {
    return {
      recipeTypes: ['Салат', 'Первое', 'Второе', 'Суп', 'Десерт', 'Напиток'],
      image : {
        data: null,
        contentType: null
      }
    }
  },
  middleware: ['auth', 'editPermission'],
  methods: {
    async Submit() {
      this.recipeData.data.recipe.completePhoto = this.image
      await this.$axios.put(`/api/recipes/recipe/${this.$route.params.id}`, this.recipeData.data.recipe)
    },

    async DeletePost() {
      await this.$axios.delete(`/api/recipes/recipe/${this.$route.params.id}`)
      this.$router.go(-1)
    },

    ImageChange(event) {
      const f = event.target.files[0]
      this.image.contentType = event.target.files[0].type
      const reader = new FileReader()
      reader.onload = ((file) => {
        return (e) => {
          let binaryData = e.target.result
          let base64String = window.btoa(binaryData)
          this.image.data = base64String
        }
      })(f)
      reader.readAsBinaryString(f)
      this.recipeData.data.recipe.completePhoto = this.image
    }
  }
}
</script>