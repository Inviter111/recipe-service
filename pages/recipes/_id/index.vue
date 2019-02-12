<template>
  <b-container class="bv-example-row">
    <b-row align-h="center">
      <b-col cols="12">
        <div>
          <b-card no-body>
            <b-card-body>
              <b-row>
                <b-col>
                  <h4 class="card-title">{{ recipeData.recipe.title }}</h4>
                  <h6>Автор</h6><p>{{ recipeData.author }}</p>
                  <p>{{ recipeData.recipe.recipeType }}</p>
                  <img :src="`data:${recipeData.recipe.completePhoto.contentType};base64,${(recipeData.recipe.completePhoto.data).toString('base64')}`" alt="recipe" style="width: 70%; max-height: 200px;">
                </b-col>
                <b-col cols="8" lg="5" md="auto">
                  <div>
                    <h4 class="card-title">Описание</h4>
                    <p>{{ recipeData.recipe.description }}</p>
                  </div>
                </b-col>
              </b-row>
              <div style="text-align: center; margin-top: 8px;">
                <h4>Шаги приготовления</h4>
                <p>{{ recipeData.recipe.steps }}</p>
              </div>
              <p>{{ recipeData.recipe.hashtags.join(' ') }}</p>
            </b-card-body>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  async asyncData({ app }) {
    const recipeData = await app.$axios.$get(`/api/recipes/recipe/${app.context.params.id}`)
    recipeData.recipe.completePhoto.data = Buffer.from(recipeData.recipe.completePhoto.data.data).toString('base64')
    return { recipeData }
  },
}
</script>